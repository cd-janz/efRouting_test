package cases

import (
	"sort"
	"spacex_analytics/internal/infra/dto"
)

func GroupByYear(items []dto.SimplyLaunchDTO) [][]dto.SimplyLaunchDTO {
	groups := make(map[string][]dto.SimplyLaunchDTO)

	for _, item := range items {
		if len(item.Date) >= 4 {
			year := item.Date[:4]
			item.Date = year
			groups[year] = append(groups[year], item)
		}
	}

	years := make([]string, 0, len(groups))
	for year := range groups {
		years = append(years, year)
	}
	sort.Strings(years)

	result := make([][]dto.SimplyLaunchDTO, 0, len(years))

	for _, year := range years {
		result = append(result, groups[year])
	}

	return result
}

func TransformToYearFullStats(items [][]dto.SimplyLaunchDTO) []dto.YearFullRateDTO {
	result := make([]dto.YearFullRateDTO, 0, len(items))
	for _, item := range items {
		if len(item) == 0 {
			continue
		}
		var success uint16
		var failed uint16
		var upcoming uint16
		var done uint16
		for _, subItem := range item {
			if subItem.Upcoming {
				upcoming++
			} else {
				done++
				if subItem.Success {
					success++
				} else {
					failed++
				}
			}
		}
		result = append(result, dto.YearFullRateDTO{
			Year:     item[0].Date,
			Total:    uint16(len(item)),
			Upcoming: upcoming,
			Done:     done,
			Success:  success,
			Failed:   failed,
		})
	}
	return result
}

func TransformToYearCount(items [][]dto.SimplyLaunchDTO) []dto.YearRateDTO {
	result := make([]dto.YearRateDTO, 0, len(items))
	for _, row := range items {
		if len(row) == 0 {
			continue
		}
		record := dto.YearRateDTO{
			Year:  row[0].Date,
			Total: uint16(len(row)),
		}
		result = append(result, record)
	}
	return result
}
