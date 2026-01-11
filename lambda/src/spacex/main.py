from fastapi import FastAPI
from mangum import Mangum
import uvicorn
from datetime import datetime
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
handler = Mangum(app)
_REPO = LaunchRepositoryImpl()
_DYNAMO = DynamoRepositoryImpl()
_SVC = ETLServices(repository=_REPO, dynamo=_DYNAMO)

@app.get("/health_check")
def health_check():
    return {"status": "ok", "message": "SpaceX ETL is running"}

@app.get("/fetch-launches")
async def trigger_fetch():
    res = await _SVC.sync_launches()
    return {"message": res}

@app.get("/optimized-fetch-launches")
async def trigger_optimized_fetch():
    res = await _SVC.sync_launches(optimized=True)
    return {"message": res}

async def scheduled_handler(event, context):
    print("Starting scheduled sync...")
    try:
        res = await _SVC.sync_launches(optimized=True)
        return {"status": "success"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

def run_server():
    uvicorn.run(app, host="0.0.0.0", port=8080)

if __name__ == "__main__":
    run_server()