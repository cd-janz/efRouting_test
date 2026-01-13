package config

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"os"
	"spacex_analytics/internal/infra/dto"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/labstack/gommon/log"
)

type DynamoDB[T any] struct {
	client   *dynamodb.Client
	table    string
	limit    int32
	startKey map[string]types.AttributeValue
	expr     expression.Expression
	hasExpr  bool
}

func newDynamoClient() *dynamodb.Client {
    cfg, err := config.LoadDefaultConfig(context.TODO(),
       config.WithRegion("us-east-1"),
    )
    if err != nil {
       log.Fatalf("System's not able to load config: %v", err)
    }

    env := os.Getenv("APP_ENV")
    dbUrl := os.Getenv("DYNAMODB_URL")

    log.Infof("env: %v, url: %v", env, dbUrl)

    if env == "dev" || dbUrl != "" {
       return dynamodb.NewFromConfig(cfg, func(o *dynamodb.Options) {
          if dbUrl != "" {
              o.BaseEndpoint = aws.String(dbUrl)
          } else {
              o.BaseEndpoint = aws.String("http://localhost:8000")
          }

          o.Credentials = aws.NewCredentialsCache(
             credentials.NewStaticCredentialsProvider("local", "local", ""),
          )
       })
    }

    return dynamodb.NewFromConfig(cfg)
}
func (d *DynamoDB[T]) Filter(expr expression.Expression) *DynamoDB[T] {
	d.expr = expr
	d.hasExpr = true
	return d
}

func NewDynamoDB[T any](table string) *DynamoDB[T] {
	client := newDynamoClient()
	return &DynamoDB[T]{
		client: client,
		table:  table,
	}
}

func (d *DynamoDB[T]) NewRequest() *DynamoDB[T] {
	return &DynamoDB[T]{
		client: d.client,
		table:  d.table,
	}
}

func (d *DynamoDB[T]) From(cursor *string) *DynamoDB[T] {
	if cursor != nil && *cursor != "" {
		d.startKey = d.decodeCursor(*cursor)
	}
	return d
}

func (d *DynamoDB[T]) Limit(limit *int32) *DynamoDB[T] {
	if limit == nil || *limit <= 0 {
		return d
	}
	d.limit = *limit
	return d
}

// return: items, cursor, total, filtered, error
func (d *DynamoDB[T]) scanAll(ctx context.Context) ([]T, *string, *uint32, *uint32, error) {
	input := &dynamodb.ScanInput{
		TableName: &d.table,
	}
	if d.limit > 0 {
		input.Limit = &d.limit
	}
	if d.startKey != nil {
		input.ExclusiveStartKey = d.startKey
	}
	if d.hasExpr {
		input.FilterExpression = d.expr.Filter()
		input.ExpressionAttributeNames = d.expr.Names()
		input.ExpressionAttributeValues = d.expr.Values()
	}
	out, err := d.client.Scan(ctx, input)
	if err != nil {
		return nil, nil, nil, nil, err
	}
	var results []T
	err = attributevalue.UnmarshalListOfMaps(out.Items, &results)
	if err != nil {
		return nil, nil, nil, nil, err
	}
	total := uint32(out.ScannedCount)
	filtered := uint32(out.Count)
	if out.LastEvaluatedKey != nil {
		nextCursor := d.encodeCursor(out.LastEvaluatedKey)
		return results, &nextCursor, &total, &filtered, nil
	}
	return results, nil, &total, &filtered, nil
}

func (d *DynamoDB[T]) ScanAllYears(ctx context.Context) ([]dto.SimplyLaunchDTO, error) {
	input := &dynamodb.ScanInput{
		TableName:            &d.table,
		ProjectionExpression: aws.String("launch_id, launch_date_utc, success, upcoming"),
	}
	out, err := d.client.Scan(ctx, input)
	if err != nil {
		return nil, err
	}
	var results []dto.SimplyLaunchDTO
	err = attributevalue.UnmarshalListOfMaps(out.Items, &results)
	if err != nil {
		return nil, err
	}
	return results, nil
}

func (d *DynamoDB[T]) GetAll(ctx context.Context) ([]T, *string, error) {
	res, cursor, _, _, err := d.scanAll(ctx)
	return res, cursor, err
}

// GetRate could be optimized getting less fields with scan
func (d *DynamoDB[T]) GetRate(ctx context.Context) (*uint32, *uint32, error) {
	_, _, total, filtered, err := d.scanAll(ctx)
	return total, filtered, err
}

func (d *DynamoDB[T]) encodeCursor(lastEvaluatedKey map[string]types.AttributeValue) string {
	if lastEvaluatedKey == nil {
		return ""
	}

	var outMap map[string]interface{}
	err := attributevalue.UnmarshalMap(lastEvaluatedKey, &outMap)
	if err != nil {
		return ""
	}

	jsonBytes, err := json.Marshal(outMap)
	if err != nil {
		return ""
	}

	return base64.StdEncoding.EncodeToString(jsonBytes)
}

func (d *DynamoDB[T]) decodeCursor(cursor string) map[string]types.AttributeValue {
	if cursor == "" {
		return nil
	}

	jsonBytes, err := base64.StdEncoding.DecodeString(cursor)
	if err != nil {
		return nil
	}

	var tempMap map[string]interface{}
	err = json.Unmarshal(jsonBytes, &tempMap)
	if err != nil {
		return nil
	}

	avMap, err := attributevalue.MarshalMap(tempMap)
	if err != nil {
		return nil
	}

	return avMap
}
