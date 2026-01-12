package repository

import (
	"context"
	"spacex_analytics/internal/infra/config"
	"spacex_analytics/internal/infra/entities"
	"time"
)

type DynamoLaunchRepository struct {
	db *config.DynamoDB[entities.LaunchEntity]
}

func NewDynamoLaunchRepository(db *config.DynamoDB[entities.LaunchEntity]) *DynamoLaunchRepository {
	return &DynamoLaunchRepository{
		db: db,
	}
}

func (r *DynamoLaunchRepository) FetchAll(ctx context.Context, cursor *string, limit *int32) ([]entities.LaunchEntity, *string, error) {
	client := r.db.NewRequest()
	ctx, cancel := context.WithTimeout(ctx, time.Second*10)
	defer cancel()
	res, cursor, err := client.From(cursor).Limit(limit).GetAll(ctx)
	if err != nil {
		return nil, nil, err
	}
	return res, cursor, nil
}
