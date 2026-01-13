package ports

import (
	"context"
	"spacex_analytics/internal/infra/dto"
	"spacex_analytics/internal/infra/entities"
	"spacex_analytics/internal/infra/models"
)

type LaunchRepository interface {
	FetchAll(ctx context.Context, input models.ListAllParams) ([]entities.LaunchEntity, *string, error)
	FetchBooleanRate(ctx context.Context, name string, value bool) (*uint32, *uint32, error)
	FetchAllYears(ctx context.Context) ([]dto.SimplyLaunchDTO, error)
}
