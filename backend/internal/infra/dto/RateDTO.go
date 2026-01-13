package dto

type RateDTO struct {
	Valid   uint32
	Invalid uint32
}

type YearRateDTO struct {
	Year  string
	Total uint16
}
type YearFullRateDTO struct {
	Year     string `json:"year"`
	Total    uint16 `json:"total"`
	Upcoming uint16 `json:"upcoming"`
	Done     uint16 `json:"done"`
	Success  uint16 `json:"success"`
	Failed   uint16 `json:"failed"`
}
