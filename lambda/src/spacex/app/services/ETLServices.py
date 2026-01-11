from typing import Any, List

from src.spacex.app.driven_ports.dynamo_repo import DynamoRepository
from src.spacex.app.driven_ports.launch_repo import LaunchRepository
from src.spacex.infra.models.LaunchRecord import LaunchRecord


class ETLServices:
    def __init__(self, repository: LaunchRepository, dynamo: DynamoRepository):
        self.repository = repository
        self.dynamo = dynamo
    async def sync_launches(self, optimized: bool = False) -> str:
        data: List[LaunchRecord] = await self.repository.get_all()
        # Optimized improves performance and significantly reduces requests but,
        # Doesn't provide data about which record is updated or created
        if optimized:
            await self.dynamo.upsert_many_optimized(data)
            return f"with batch writer I can't know how much records have been updated"
        return await self.dynamo.upsert_many(data)