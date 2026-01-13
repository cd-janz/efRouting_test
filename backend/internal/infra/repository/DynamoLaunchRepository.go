package repository

import (
	"context"
	"spacex_analytics/internal/infra/config"
	"spacex_analytics/internal/infra/dto"
	"spacex_analytics/internal/infra/entities"
	"spacex_analytics/internal/infra/models"
	"time"

	"github.com/aws/aws-sdk-go-v2/feature/dynamodb/expression"
)

type DynamoLaunchRepository struct {
	db *config.DynamoDB[entities.LaunchEntity]
}

func NewDynamoLaunchRepository(db *config.DynamoDB[entities.LaunchEntity]) *DynamoLaunchRepository {
	return &DynamoLaunchRepository{
		db: db,
	}
}

func (r *DynamoLaunchRepository) buildFilterExpression(params models.ListAllParams) (expression.Expression, error) {
	var filter expression.ConditionBuilder
	var isFilterSet bool

	addCondition := func(cond expression.ConditionBuilder) {
		if !isFilterSet {
			filter = cond
			isFilterSet = true
		} else {
			filter = filter.And(cond)
		}
	}

	if params.Mission != "" {
		addCondition(expression.Name("mission_name").BeginsWith(params.Mission))
	}
	if params.Year != "" {
		addCondition(expression.Name("launch_date_utc").BeginsWith(params.Year))
	}
	builder := expression.NewBuilder()
	if isFilterSet {
		builder = builder.WithFilter(filter)
	}
	return builder.Build()
}
func (r *DynamoLaunchRepository) buildBooleanFilter(name string, value bool) (expression.Expression, error) {
	builder := expression.NewBuilder()
	if len(name) < 1 {
		return builder.Build()
	}
	filter := expression.Name(name).Equal(expression.Value(value))
	return builder.WithFilter(filter).Build()
}

func (r *DynamoLaunchRepository) FetchBooleanRate(ctx context.Context, name string, value bool) (*uint32, *uint32, error) {
	req := r.db.NewRequest()
	expr, err := r.buildBooleanFilter(name, value)
	if err != nil {
		return nil, nil, err
	}
	req.Filter(expr)
	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()
	total, filtered, err := req.GetRate(ctx)
	if err != nil {
		return nil, nil, err
	}
	return total, filtered, err
}

func (r *DynamoLaunchRepository) FetchAll(ctx context.Context, params models.ListAllParams) ([]entities.LaunchEntity, *string, error) {
	req := r.db.NewRequest()

	if params.HasFilters() {
		expr, err := r.buildFilterExpression(params)
		if err != nil {
			return nil, nil, err
		}
		req.Filter(expr)
	}

	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()

	limit := params.Limit
	cursor := params.Cursor

	res, nextCursor, err := req.From(&cursor).Limit(&limit).GetAll(ctx)

	if err != nil {
		return nil, nil, err
	}
	return res, nextCursor, nil
}

func (r *DynamoLaunchRepository) FetchAllYears(ctx context.Context) ([]dto.SimplyLaunchDTO, error) {
	req := r.db.NewRequest()
	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()
	return req.ScanAllYears(ctx)
}
