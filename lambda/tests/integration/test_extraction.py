from typing import List
import pytest
from httpx import AsyncClient
from src.spacex.infra.driven_adapters.launch_repository_impl import LaunchRepositoryImpl
from src.spacex.infra.models.LaunchRecord import LaunchRecord


@pytest.mark.integration
@pytest.mark.asyncio
async def test_extraction():
    async with AsyncClient() as client:
        repo = LaunchRepositoryImpl(client)
        res: List[LaunchRecord] = await repo.get_all()
        assert len(res) >= 0
        assert len(res) > 0
        assert isinstance(res[0], LaunchRecord)
