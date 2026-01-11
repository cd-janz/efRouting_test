from typing import List
from os import getenv
import boto3
from src.spacex.app.driven_ports.dynamo_repo import DynamoRepository
from src.spacex.infra.models.LaunchRecord import LaunchRecord


class DynamoRepositoryImpl(DynamoRepository):

    def __init__(self):
        self.endpoint_url = getenv("DYNAMODB_URL")
        self.table_name = getenv("TABLE_NAME", "SpaceXLaunches")
        if not self.endpoint_url:
            self.dynamodb = boto3.resource(
                'dynamodb',
                endpoint_url="http://localhost:8000",
                region_name='us-east-1',
                aws_access_key_id='local',
                aws_secret_access_key='local'
            )
        else:
            self.dynamodb = boto3.resource('dynamodb')
        self.table = self.dynamodb.Table(self.table_name)

    async def upsert_many_optimized(self, launches: List[LaunchRecord]) -> None:
        with self.table.batch_writer() as batch:
            for launch in launches:
                batch.put_item(Item=launch.model_dump())

    async def upsert_many(self, launches: List[LaunchRecord]) -> str:
        created = 0
        updated = 0

        for launch in launches:
            response = self.table.put_item(
                Item=launch.model_dump(),
                ReturnValues='ALL_OLD'
            )
            if 'Attributes' in response:
                updated += 1
            else:
                created += 1
        return f"Updated {updated} and created {created} table records"

    async def upsert_single(self, launch: LaunchRecord) -> bool:
        response = self.table.put_item(Item=launch.model_dump(),ReturnValues='')
        return 'Attributes' in response