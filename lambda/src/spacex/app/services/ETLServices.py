from typing import Any, List

from botocore.exceptions import ClientError, ConnectTimeoutError

from src.spacex.app.driven_ports.dynamo_repo import DynamoRepository
from src.spacex.app.driven_ports.launch_repo import LaunchRepository
from src.spacex.infra.models.LaunchRecord import LaunchRecord


class ETLServices:
    def __init__(self, repository: LaunchRepository, dynamo: DynamoRepository):
        self.repository = repository
        self.dynamo = dynamo
    async def sync_launches(self, optimized: bool = False) -> str:
        data: List[LaunchRecord] = await self.repository.get_all()
        if len(data) == 0:
            return "ain't data to process"
        # Optimized improves performance and significantly reduces requests but,
        # Doesn't provide data about which record is updated or created, it means this method isn't auditable
        try:
            if optimized:
                await self.dynamo.upsert_many_optimized(data)
                return f"with batch writer I can't know how much records have been updated"
            return await self.dynamo.upsert_many(data)
        except ClientError as e:
            error_code = e.response['Error']['Code']
            if error_code == 'ResourceNotFoundException':
                return f"Error: the table does not exist or env variable is not set"
            return f"AWS Error: {e.response['Error']['Message']}"
        except ConnectTimeoutError:
            return "Error: Waiting time exceeded"
        except Exception as e:
            return f"uncached error: {str(e)}"