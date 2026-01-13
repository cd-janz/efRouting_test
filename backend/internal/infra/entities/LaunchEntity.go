package entities

type LaunchEntity struct {
	ID       string  `dynamodbav:"launch_id" json:"launch_id"`
	Mission  string  `dynamodbav:"mission_name" json:"mission_name"`
	RocketID string  `dynamodbav:"rocket_id" json:"rocket_id"`
	Date     *string `dynamodbav:"launch_date_utc" json:"launch_date,omitempty"`
	Success  bool    `dynamodbav:"success" json:"success"`
	Upcoming bool    `dynamodbav:"upcoming" json:"upcoming"`
	Details  *string `dynamodbav:"details" json:"details,omitempty"`
	FlightNo string  `dynamodbav:"flight_number" json:"flight_number"`
}
