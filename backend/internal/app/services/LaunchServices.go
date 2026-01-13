package services

import (
	"context"
	"spacex_analytics/internal/app/ports"
	"spacex_analytics/internal/infra/entities"
	"spacex_analytics/internal/infra/models"
)

type LaunchService struct {
	rep ports.LaunchRepository
}

func NewLaunchService(rep ports.LaunchRepository) *LaunchService {
	return &LaunchService{
		rep: rep,
	}
}

func (svc *LaunchService) GetLaunchList(ctx context.Context, input *models.ListAllParams) ([]entities.LaunchEntity, *string, error) {
	return svc.rep.FetchAll(ctx, *input)
}
