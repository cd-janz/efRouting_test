import pytest

@pytest.mark.asyncio
@pytest.mark.e2e
async def test_sync(client):
    response = await client.get("/fetch-launches")
    assert response.status_code == 200
    assert "message" in response.json()

@pytest.mark.asyncio
@pytest.mark.e2e
async def test_optimized(client):
    response = await client.get("/optimized-fetch-launches")
    assert response.status_code == 200
    assert "message" in response.json()

@pytest.mark.asyncio
@pytest.mark.e2e
async def test_health_check(client):
    response = await client.get("/health-check")
    assert response.status_code == 200