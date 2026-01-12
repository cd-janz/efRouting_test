package ports

import (
	"context"
	"spacex_analytics/internal/infra/entities"
)

type LaunchRepository interface {
	FetchAll(ctx context.Context, cursor *string, limit *int32) ([]entities.LaunchEntity, *string, error)
}
