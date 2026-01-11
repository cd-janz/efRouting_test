DYNAMODB_URL := $(shell grep 'DYNAMODB_URL' pyproject.toml | cut -d '"' -f 2)
TABLE_NAME   := $(shell grep 'TABLE_NAME' pyproject.toml | cut -d '"' -f 2)

.PHONY: dev run

dev:
	@echo "🚀 Iniciando en modo LOCAL con:"
	@echo "   - URL: $(DYNAMODB_URL)"
	@echo "   - Table: $(TABLE_NAME)"
	@DYNAMODB_URL="$(DYNAMODB_URL)" TABLE_NAME="$(TABLE_NAME)" poetry run dev