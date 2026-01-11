from typing import Any, List, Dict
from httpx import AsyncClient
from src.spacex.app.driven_ports.launch_repo import LaunchRepository
from src.spacex.infra.models.LaunchRecord import LaunchRecord


class LaunchRepositoryImpl(LaunchRepository):
    def __init__(self, client: AsyncClient) -> None:
        self.client = client
    async def get_all(self) -> List[LaunchRecord]:
        response = await self.client.get("https://api.spacexdata.com/v4/launches")
        response.raise_for_status()
        data = response.json()
        return [record for item in data if (record := LaunchRecord.safe_parse(item)[0]) is not None]