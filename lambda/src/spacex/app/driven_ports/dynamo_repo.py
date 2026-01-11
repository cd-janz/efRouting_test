from typing import Protocol, List

from src.spacex.infra.models.LaunchRecord import LaunchRecord


class DynamoRepository(Protocol):
    async def upsert_many_optimized(self, launches: List[LaunchRecord]) -> None:
        ...
    async def upsert_many(self, launches: List[LaunchRecord]) -> str:
        ...
    async def upsert_single(self, launch: LaunchRecord) -> bool:
        ...