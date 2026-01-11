FROM python:3.13-slim as builder

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

RUN apt-get update && \
    apt-get install -y --no-install-recommends gcc && \
    rm -rf /var/lib/apt/lists/*

RUN python -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

COPY requirements.txt .

RUN pip install --no-cache-dir --upgrade pip
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir boto3 botocore

RUN uvicorn --version

FROM builder as tester

COPY . .
RUN pytest -v

FROM python:3.13-slim as runtime

WORKDIR /app

RUN groupadd -r appuser && useradd -r -g appuser appuser

COPY --from=builder --chown=appuser:appuser /opt/venv /opt/venv

ENV PATH="/opt/venv/bin:$PATH"
ENV PYTHONPATH=/app

COPY --chown=appuser:appuser src ./src

USER appuser

CMD ["uvicorn", "src.spacex.main:app", "--host", "0.0.0.0", "--port", "8000"]