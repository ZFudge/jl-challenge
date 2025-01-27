include $(shell pwd)/.env

DB_NAME := jamloop-postgres-db

.PHONY: help

help:
	@echo "Usage: make [target]"
	@echo ""
	@echo "Targets:"
	@echo "  secret             Generate a secret for the application"
	@echo "  install            Install the dependencies"
	@echo "  db                 Run the postgres database"
	@echo "  db-stop            Stop the postgres database"
	@echo "  db-rm              Remove the postgres database"
	@echo "  dba                Stop, remove, and rerun the postgres database"
	@echo "  dev                Run the development server"
	@echo "  seed               Seed the database with placeholder data"
	@echo "  build              Build the application"
	@echo "  run                Run the application"
	@echo "  all                Install, generate a secret, run the database, and run the development server"
	@echo "  test               Run the tests"

secret:
	@echo "AUTH_SECRET=$(shell openssl rand -base64 32)" >> .env

install:
	@pnpm install

db:
	@docker run -d \
        --name ${DB_NAME} \
        -p 5432:5432 \
        -e POSTGRES_PASSWORD=${PGPASSWORD} \
        -e POSTGRES_USER=${PGUSER} \
        -e POSTGRES_DB=${PGDATABASE} \
        postgres:12.18-bullseye

db-stop:
	@docker stop ${DB_NAME} || true

db-rm:
	@docker rm ${DB_NAME} || true

dba: db-stop db-rm db

dev:
	@pnpm dev

build:
	@pnpm build

seed:
	@curl http://localhost:3000/seed

test:
	@pnpm test

run:
	@pnpm start

all: install dba dev
