from fastapi import FastAPI, Depends
from mangum import Mangum
import uvicorn
from httpx import AsyncClient
from src.spacex.app.services.ETLServices import ETLServices
from src.spacex.infra.driven_adapters.dynamo_repo_impl import DynamoRepositoryImpl
from src.spacex.infra.driven_adapters.launch_repository_impl import LaunchRepositoryImpl

app = FastAPI(
    title="SpaceX ETL API",
    description="API for the SpaceX Launch API ETL process",
    version="0.1.0",
    openapi_url=None,
    docs_url=None,
    redoc_url=None,
    swagger_ui_parameters={
        "syntaxHighlight": False
    }
)

async def get_http_client():
    async with AsyncClient() as client:
        yield client

def get_dynamo_repo():
    return DynamoRepositoryImpl()

async def get_launch_repo(client: AsyncClient = Depends(get_http_client)):
    return LaunchRepositoryImpl(client)

@app.get("/health-check")
def health_check():
    return {"status": "ok", "message": "SpaceX ETL is running"}

@app.get("/fetch-launches")
async def trigger_fetch(
    repo = Depends(get_launch_repo),
    dynamo_repo = Depends(get_dynamo_repo)
):
    svc = ETLServices(repo, dynamo_repo)
    res = await svc.sync_launches()
    return {"message": res}

@app.get("/optimized-fetch-launches")
async def trigger_optimized_fetch(
    repo = Depends(get_launch_repo),
    dynamo_repo = Depends(get_dynamo_repo)
):
    svc = ETLServices(repo, dynamo_repo)
    res = await svc.sync_launches(optimized=True)
    return {"message": res}

handler = Mangum(app)
async def scheduled_handler(event, context):
    async with AsyncClient() as client:
        repo = LaunchRepositoryImpl(client)
        svc = ETLServices(repo, get_dynamo_repo())
        try:
            await svc.sync_launches(optimized=True)
            return {"status": "success"}
        except Exception as e:
            return {"status": "error", "message": str(e)}

def run_server():
    uvicorn.run(app, host="0.0.0.0", port=8080)

if __name__ == "__main__":
    run_server()