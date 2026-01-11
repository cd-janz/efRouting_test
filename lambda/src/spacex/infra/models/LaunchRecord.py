from pydantic import BaseModel, Field, field_validator, field_serializer, computed_field
from datetime import datetime
from typing import Optional, List, Any

class LaunchRecord(BaseModel):
    launch_id: str = Field(..., alias="id")
    mission_name: str = Field(..., alias="name")
    rocket_id: str = Field(..., alias="rocket")
    launch_date_utc: datetime = Field(..., alias="date_utc")
    success: Optional[bool] = None
    upcoming: bool
    details: Optional[str] = None
    flight_number: int

    @field_serializer('launch_date_utc')
    def serialize_dt(self, dt: datetime, _info):
        return dt.isoformat()

    @computed_field
    @property
    def status(self) -> str:
        if self.upcoming:
            return "upcoming"
        return "success" if self.success else "failed"

    class Config:
        populate_by_name = True
        extra = "ignore"