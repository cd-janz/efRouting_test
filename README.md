<img width="1419" height="613" alt="image" src="https://github.com/user-attachments/assets/ddd3c0b8-264a-4813-bf77-269244aea6f4" />efRouting: SpaceX Launch Tracking System

Una solución Full Stack moderna para visualizar lanzamientos de SpaceX, construida bajo los principios de eficiencia ("Go efficient"), infraestructura como código y arquitectura serverless/microservicios.
Enlaces del Despliegue (Live Demo)

    Nota: La infraestructura completa ha sido desplegada automáticamente mediante AWS CDK.

    Aplicación Web (Frontend): http://efrout-front-n79f1xtyz0sb-575995812.us-west-1.elb.amazonaws.com/launches/list

    GO API Documentation (Swagger): http://efrout-backe-czuqb9d7cny5-1782135104.us-west-1.elb.amazonaws.com/docs

    Lambda Manual Trigger: https://ep5jexrobiq4aqukbzu3rufroe0zksay.lambda-url.us-west-1.on.aws/
    
![Frontend Image](https://raw.githubusercontent.com/cd-janz/projects_resourses/refs/heads/main/efRouting/ss1.png)

🏛️ Arquitectura de la Solución

El sistema sigue una arquitectura orientada a servicios, desacoplada y escalable, desplegada 100% en AWS.
Fragmento de código

graph TD
User((Usuario)) --> ALB_Front[Application Load Balancer]
ALB_Front --> ECS_Front[ECS Fargate: Next.js Frontend]
ECS_Front --> ALB_Back[Application Load Balancer]
ALB_Back --> ECS_Back[ECS Fargate: Go Backend API]
ECS_Back --> DDB[(DynamoDB: SpaceXLaunches)]

    SpaceX_API[SpaceX Public API] --> Lambda_ETL[Lambda Python ETL]
    EventBridge((Cron 6h)) --> Lambda_ETL
    Lambda_ETL --> DDB

Tecnologías Clave

    Frontend: Next.js 16 (Standalone mode+Rewrites) + Bun/Node.js.

    Backend API: Go (Golang) + Echo + Huma (OpenAPI/Swagger auto-gen).

    Ingestión de Datos: Python 3.12 + FastAPI + AWS Lambda Cron + AWS Lambda + Mangum.

    Base de Datos: Amazon DynamoDB (On-Demand Capacity).

    Infraestructura: AWS CDK (TypeScript) para el aprovisionamiento de VPC, ECS Cluster, Roles y Servicios.

    CI/CD: GitHub Actions.

    ADICIONAL: Template SAM para lambda (eliminado por falta de relevancia en el proyecto)

🛠️ Decisiones Técnicas y Patrones
1. Backend: Hexagonal Architecture (Go)

Se implementó una arquitectura limpia en el servicio de Go para desacoplar la lógica de negocio de la infraestructura.

    Repository Pattern: Abstracción del acceso a DynamoDB, permitiendo facilitar pruebas y cambios futuros de base de datos.

    Performance: Uso de Go para una API de baja latencia y alto rendimiento ("Go efficient").

2. Frontend: Docker Optimization

Para cumplir con el despliegue en ECS Fargate, se optimizó la imagen de Next.js utilizando Multi-stage builds y el modo output: standalone. Esto redujo drásticamente el tamaño de la imagen final y mejoró los tiempos de despliegue y escalado horizontal.
3. Infraestructura como Código (CDK)

En lugar de configuraciones manuales, toda la infraestructura (desde la VPC hasta las tablas de DynamoDB) se define en TypeScript. Esto permite:

    Despliegues atómicos (cdk deploy --all).

    Replicación de entornos inmediata.

    Mayor seguridad al gestionar roles de IAM con el principio de privilegio mínimo (grantReadWriteData).

Instalación y Ejecución Local

El proyecto incluye un entorno local completo basado en Docker Compose para facilitar el desarrollo sin depender de AWS.
Prerrequisitos

    Docker & Docker Compose

    Node.js 22+ (para CDK)

    AWS CLI configurado (para despliegue)

Pasos

    Clonar el repositorio:
    Bash

git clone https://github.com/cd-janz/efRouting_test.git
cd efRouting_test

Levantar el entorno local: Este comando levanta DynamoDB Local, DynamoDB Admin, Backend (Go) y Frontend (Next.js).
Bash

docker-compose up --build

    Frontend: http://localhost:3000

    Backend API: http://localhost:8081

    DynamoDB Admin: http://localhost:8001

    Python Lambda API: http://localhost:8080

Ejecutar Pruebas (Backend/Lambda):
Bash

    # Pruebas de la Lambda (Ingestión)
    cd lambda
    pip install -r requirements.txt
    pytest

Guía de Despliegue (AWS)

El despliegue está automatizado mediante GitHub Actions, pero puede realizarse manualmente con CDK.

    Instalar dependencias de infraestructura:
    Bash

cd infra
npm install

Bootstrap (Solo la primera vez): Prepara la cuenta de AWS para usar CDK.
Bash

npx cdk bootstrap

Desplegar: Construye las imágenes Docker, sube los assets y provisiona los recursos.
Bash

    npx cdk deploy --all

🔄 CI/CD Pipeline

El flujo de integración continua está definido en .github/workflows/deploy.yml y consta de dos etapas principales:

    Validación y Pruebas:

        Se ejecuta en cada Push a main.

        Instala dependencias de Python y ejecuta pytest para validar la lógica de ingestión de datos (Requisito obligatorio).

    Despliegue de Infraestructura:

        Se ejecuta solo si las pruebas pasan.

        Utiliza aws-actions para configurar credenciales seguras.

        Ejecuta cdk deploy para actualizar Lambda, ECS y DynamoDB en una sola transacción.

💡 Retos y Soluciones (Dev Experience)

Durante el desarrollo de la prueba técnica, se superaron varios desafíos interesantes:

    Desconocimiento:
        
        Debido a el prolongado periodo de tiempo sin usar python mas que para scripts de automatizacion, aquello que mas me costo fue adaptarme nuevamente a su sintaxis y logica, ha cambiado mucho desde la 3.9

📸 Evidencias del Proceso

![Deployed Resources](https://raw.githubusercontent.com/cd-janz/projects_resourses/refs/heads/main/efRouting/ss2.png)

![Services Routes](https://raw.githubusercontent.com/cd-janz/projects_resourses/refs/heads/main/efRouting/ss3.png)

![Go API Swagger](https://raw.githubusercontent.com/cd-janz/projects_resourses/refs/heads/main/efRouting/ss5.png)

Go efficient, happy, and green. 🌿
