#!/bin/bash
aws dynamodb create-table \
    --table-name SpaceXLaunches \
    --attribute-definitions AttributeName=launch_id,AttributeType=S \
    --key-schema AttributeName=launch_id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST \
    --endpoint-url http://dynamodb-local:8000 \
    --region us-east-1 2>/dev/null || echo "La tabla ya existe o hubo un error de conexión."