package dto

type SimplyLaunchDTO struct {
	ID       string `dynamodbav:"launch_id" json:"id"`
	Date     string `dynamodbav:"launch_date_utc" json:"date,omitempty"`
	Success  bool   `dynamodbav:"success" json:"success"`
	Upcoming bool   `dynamodbav:"upcoming" json:"upcoming"`
}
