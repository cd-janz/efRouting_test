package config

import (
	"context"
	"encoding/base64"
	"encoding/json"
	"os"

	"github.com/aws/aws-sdk-go-v2/aws"
	"github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/attributevalue"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb"
	"github.com/aws/aws-sdk-go-v2/service/dynamodb/types"
	"github.com/labstack/gommon/log"
)

type DynamoDB[T any] struct {
	client   *dynamodb.Client
	table    string
	limit    int32
	startKey map[string]types.AttributeValue
}

func newDynamoClient() *dynamodb.Client {
	cfg, err := config.LoadDefaultConfig(context.TODO(),
		config.WithRegion("us-west-1"),
	)
	if err != nil {
		log.Fatalf("System's not able to load config: %v", err)
	}
	env := os.Getenv("APP_ENV")
	log.Infof("env %v", env)
	if env == "dev" {
		return dynamodb.NewFromConfig(cfg, func(o *dynamodb.Options) {
			o.BaseEndpoint = aws.String("http://localhost:8000")
			o.Credentials = aws.NewCredentialsCache(
				credentials.NewStaticCredentialsProvider("DUMMYIDEXAMPLE", "DUMMYIDEXAMPLE", ""),
			)
		})
	}
	return dynamodb.NewFromConfig(cfg)
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

func (d *DynamoDB[T]) GetAll(ctx context.Context) ([]T, *string, error) {
	input := &dynamodb.ScanInput{
		TableName: &d.table,
	}
	if d.limit > 0 {
		input.Limit = &d.limit
	}
	if d.startKey != nil {
		input.ExclusiveStartKey = d.startKey
	}
	out, err := d.client.Scan(ctx, input)
	if err != nil {
		return nil, nil, err
	}
	var results []T
	err = attributevalue.UnmarshalListOfMaps(out.Items, &results)
	if err != nil {
		return nil, nil, err
	}
	if out.LastEvaluatedKey != nil {
		nextCursor := d.encodeCursor(out.LastEvaluatedKey)
		return results, &nextCursor, nil
	}
	return results, nil, nil
}

func (d *DynamoDB[T]) Get(ctx context.Context, id *string) (*T, error) {
	return nil, nil
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
