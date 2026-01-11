import pytest
from httpx import AsyncClient, ASGITransport
from src.spacex.infra.driven_adapters.dynamo_repo_impl import DynamoRepositoryImpl
from src.spacex.main import app, get_dynamo_repo


@pytest.fixture(scope="function")
def test_dynamo_repo():
    repo = DynamoRepositoryImpl()
    # must add a delete of all table records
    return repo

@pytest.fixture
async def client(test_dynamo_repo):
    app.dependency_overrides[get_dynamo_repo] = lambda: test_dynamo_repo
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()