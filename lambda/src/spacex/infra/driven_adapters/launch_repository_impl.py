from typing import Any, List
from httpx import AsyncClient
from src.spacex.app.driven_ports.launch_repo import LaunchRepository
from src.spacex.infra.models.LaunchRecord import LaunchRecord


class LaunchRepositoryImpl(LaunchRepository):
    def __init__(self):
        pass
    async def get(self, launch_id: str) -> Any:
        pass
    async def get_all(self) -> List[LaunchRecord]:
        async with AsyncClient() as client:
            response = await client.get("https://api.spacexdata.com/v4/launches")
            response.raise_for_status()
            data = response.json()
            return [LaunchRecord(**item) for item in data]
