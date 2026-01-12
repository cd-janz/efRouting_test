package services

import (
	"context"
	"spacex_analytics/internal/app/ports"
	"spacex_analytics/internal/infra/entities"
)

type LaunchService struct {
	rep ports.LaunchRepository
}

func NewLaunchService(rep ports.LaunchRepository) *LaunchService {
	return &LaunchService{
		rep: rep,
	}
}

func (svc *LaunchService) GetLaunchList(ctx context.Context, cursor *string, limit *int32) ([]entities.LaunchEntity, *string, error) {
	return svc.rep.FetchAll(ctx, cursor, limit)
}
