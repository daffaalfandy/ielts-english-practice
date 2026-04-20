HOST ?= 0.0.0.0
PORT ?= 3000
CERT ?= certificates/localhost.pem
KEY  ?= certificates/localhost-key.pem

.PHONY: dev dev-http build start prod prod-build prod-start prod-http lint install lan-ip help

help:
	@echo "Targets:"
	@echo "  make dev          Run HTTPS dev server on $(HOST):$(PORT)"
	@echo "  make dev-http     Run plain HTTP dev server"
	@echo ""
	@echo "  make prod         Build, then run HTTPS production server (recommended)"
	@echo "  make prod-build   Build only"
	@echo "  make prod-start   Start HTTPS production server (requires build)"
	@echo "  make prod-http    Start plain HTTP production server (requires build)"
	@echo ""
	@echo "  make lint         Run eslint"
	@echo "  make install      Install dependencies"
	@echo "  make lan-ip       Print this machine's LAN IP"
	@echo ""
	@echo "Override host/port/cert:"
	@echo "  make prod HOST=192.168.1.42 PORT=4000 CERT=./cert.pem KEY=./key.pem"

dev:
	npx next dev --experimental-https \
		--experimental-https-cert $(CERT) \
		--experimental-https-key $(KEY) \
		-H $(HOST) -p $(PORT)

dev-http:
	npx next dev -H $(HOST) -p $(PORT)

build:
	npm run build

start:
	npm run start

prod: prod-build prod-start

prod-build:
	npm run build

prod-start:
	HOST=$(HOST) PORT=$(PORT) HTTPS_CERT=$(CERT) HTTPS_KEY=$(KEY) node server.mjs

prod-http:
	HOST=$(HOST) PORT=$(PORT) HTTPS=0 node server.mjs

lint:
	npm run lint

install:
	npm install

lan-ip:
	@ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "no LAN IP found"
