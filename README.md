efRouting: SpaceX Launch Tracking System 🚀

Una solución Full Stack moderna para visualizar lanzamientos de SpaceX, construida bajo los principios de eficiencia ("Go efficient"), infraestructura como código y arquitectura serverless/microservicios.
🔗 Enlaces del Despliegue (Live Demo)

    Nota: La infraestructura completa ha sido desplegada automáticamente mediante AWS CDK.

    Aplicación Web (Frontend): [ PONER TU URL DEL FRONTEND AQUI - LA QUE SALE DE CDK ]

    API Documentation (Swagger): [ PONER TU URL DE LA LAMBDA AQUI ]/docs (o la del Backend de Go si habilitaste Swagger ahí)

    Lambda Manual Trigger: [ PONER TU URL DE LA LAMBDA AQUI ]

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

    Frontend: Next.js 14 (Standalone mode) + Bun/Node.js.

    Backend API: Go (Golang) + Echo + Huma (OpenAPI/Swagger auto-gen).

    Ingestión de Datos: Python 3.12 + AWS Lambda + Mangum.

    Base de Datos: Amazon DynamoDB (On-Demand Capacity).

    Infraestructura: AWS CDK (TypeScript) para el aprovisionamiento de VPC, ECS Cluster, Roles y Servicios.

    CI/CD: GitHub Actions.

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

🚀 Instalación y Ejecución Local

El proyecto incluye un entorno local completo basado en Docker Compose para facilitar el desarrollo sin depender de AWS.
Prerrequisitos

    Docker & Docker Compose

    Node.js 20+ (para CDK)

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

Ejecutar Pruebas (Backend/Lambda):
Bash

    # Pruebas de la Lambda (Ingestión)
    cd lambda
    pip install -r requirements.txt
    pytest

☁️ Guía de Despliegue (AWS)

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

    Docker Networking & CORS:

        Reto: La comunicación entre el Frontend (Next.js) y el Backend (Go) fallaba en local debido a la diferencia entre localhost (para el navegador) y los nombres de servicio DNS internos de Docker.

        Solución: Se implementó una configuración híbrida en el Backend que detecta el entorno (APP_ENV). En local usa nombres de servicio Docker para hablar con DynamoDB, pero permite CORS para el navegador.

    Next.js Environment Variables en Build Time:

        Reto: Las variables NEXT_PUBLIC_ se "queman" (hardcode) en el bundle estático de JS al momento de compilar la imagen Docker, haciendo difícil inyectar la URL del Load Balancer dinámicamente.

        Solución: Se utilizaron buildArgs en CDK y en el Dockerfile para inyectar la URL del Load Balancer generada por AWS durante la fase de construcción de la imagen.

    Optimización de Imágenes:

        Reto: Las imágenes iniciales de Go y Node eran demasiado pesadas para un despliegue rápido.

        Solución: Se migró a imágenes alpine y se usaron Multi-stage builds, reduciendo significativamente el tamaño final y la superficie de ataque.

📸 Evidencias del Proceso
Pipeline de GitHub Actions (Exitoso)

[ PON UNA CAPTURA DE PANTALLA DE TU GITHUB ACTIONS EN VERDE AQUÍ ]
DynamoDB con Datos Reales (SpaceX)

[ PON UNA CAPTURA DE PANTALLA DE TU DYNAMODB O DYNAMODB-ADMIN AQUÍ ]
Swagger Documentation

[ PON UNA CAPTURA DE PANTALLA DE TU SWAGGER UI AQUÍ ]

Go efficient, happy, and green. 🌿