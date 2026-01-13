package ports

import (
	"context"
	"spacex_analytics/internal/infra/entities"
	"spacex_analytics/internal/infra/models"
)

type LaunchRepository interface {
	FetchAll(ctx context.Context, input models.ListAllParams) ([]entities.LaunchEntity, *string, error)
}
