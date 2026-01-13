import * as cdk from 'aws-cdk-lib';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecs_patterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as events from 'aws-cdk-lib/aws-events';
import * as targets from 'aws-cdk-lib/aws-events-targets';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';
import * as path from 'path';
import { Construct } from 'constructs';

interface ComputeStackProps extends cdk.StackProps {
    table: dynamodb.Table;
}

export class ComputeStack extends cdk.Stack {
    constructor(scope: Construct, id: string, props: ComputeStackProps) {
        super(scope, id, props);

        const vpc = new ec2.Vpc(this, 'SpaceXVpc', { maxAzs: 2 });

        const cluster = new ecs.Cluster(this, 'SpaceXCluster', { vpc });

        const apiLambda = new lambda.Function(this, 'SpaceXApiFunction', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
            handler: 'src.spacex.main.handler',
            environment: {
                TABLE_NAME: props.table.tableName,
            },
            timeout: cdk.Duration.seconds(30),
        });

        const cronLambda = new lambda.Function(this, 'SpaceXCronFunction', {
            runtime: lambda.Runtime.PYTHON_3_12,
            code: lambda.Code.fromAsset(path.join(__dirname, '../../lambda')),
            handler: 'src.spacex.main.scheduled_handler',
            environment: {
                TABLE_NAME: props.table.tableName,
            },
            timeout: cdk.Duration.seconds(30),
        });

        props.table.grantReadWriteData(apiLambda);
        props.table.grantReadWriteData(cronLambda);

        const apiDataUrl = apiLambda.addFunctionUrl({
            authType: lambda.FunctionUrlAuthType.NONE,
        });

        const scheduleRule = new events.Rule(this, 'SpaceXScheduledSync', {
            schedule: events.Schedule.rate(cdk.Duration.hours(6)),
        });
        scheduleRule.addTarget(new targets.LambdaFunction(cronLambda));

        const backendService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'BackendGoService', {
            cluster,
            memoryLimitMiB: 512,
            cpu: 256,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../backend')),
                containerPort: 8081,
                environment: {
                    DYNAMODB_TABLE_NAME: props.table.tableName,
                    AWS_REGION: this.region,
                    APP_ENV: 'prod'
                },
            },
            publicLoadBalancer: true,
        });
        backendService.targetGroup.configureHealthCheck({
            path: '/docs',
            healthyHttpCodes: '200-404',
            interval: cdk.Duration.seconds(30),
            timeout: cdk.Duration.seconds(5),
            healthyThresholdCount: 2,
            unhealthyThresholdCount: 5,
        });

        props.table.grantReadWriteData(backendService.taskDefinition.taskRole);

        const frontendService = new ecs_patterns.ApplicationLoadBalancedFargateService(this, 'FrontendNextService', {
            cluster,
            memoryLimitMiB: 1024,
            cpu: 512,
            taskImageOptions: {
                image: ecs.ContainerImage.fromAsset(path.join(__dirname, '../../frontend')),
                containerPort: 3000,
                environment: {
                    INTERNAL_API_URL: `http://${backendService.loadBalancer.loadBalancerDnsName}`,
                    NEXT_PUBLIC_API_URL: ''
                }
            },
            publicLoadBalancer: true,
        });
        frontendService.targetGroup.configureHealthCheck({
            path: "/launches/list",
            healthyHttpCodes: '200-404',
            interval: cdk.Duration.seconds(30),
            timeout: cdk.Duration.seconds(5),
            healthyThresholdCount: 2,
            unhealthyThresholdCount: 5,
        })

        new cdk.CfnOutput(this, 'LambdaManualEndpoint', { value: apiDataUrl.url });
        new cdk.CfnOutput(this, 'BackendURL', { value: backendService.loadBalancer.loadBalancerDnsName });
        new cdk.CfnOutput(this, 'FrontendURL', { value: frontendService.loadBalancer.loadBalancerDnsName });
    }
}