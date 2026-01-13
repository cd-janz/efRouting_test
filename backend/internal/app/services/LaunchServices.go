package services

import (
	"context"
	"spacex_analytics/internal/app/cases"
	"spacex_analytics/internal/app/ports"
	"spacex_analytics/internal/infra/dto"
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

func (svc *LaunchService) GetBooleanRate(ctx context.Context, name string, value bool) (*dto.RateDTO, error) {
	total, filtered, err := svc.rep.FetchBooleanRate(ctx, name, value)
	if err != nil {
		return nil, err
	}
	return &dto.RateDTO{
		Valid:   *filtered,
		Invalid: *total - *filtered,
	}, nil
}
func (svc *LaunchService) GetRateByYear(ctx context.Context) ([]dto.YearRateDTO, error) {
	res, err := svc.rep.FetchAllYears(ctx)
	if err != nil {
		return nil, err
	}
	matriz := cases.GroupByYear(res)
	records := cases.TransformToYearCount(matriz)
	return records, nil
}

func (svc *LaunchService) GetWholeStatsByYear(ctx context.Context) ([]dto.YearFullRateDTO, error) {
	res, err := svc.rep.FetchAllYears(ctx)
	if err != nil {
		return nil, err
	}
	matriz := cases.GroupByYear(res)
	records := cases.TransformToYearFullStats(matriz)
	return records, err
}
