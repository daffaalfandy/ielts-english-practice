HOST ?= 0.0.0.0
PORT ?= 3000
CERT ?= certificates/localhost.pem
KEY  ?= certificates/localhost-key.pem

.PHONY: dev dev-http build start lint install lan-ip help

help:
	@echo "Targets:"
	@echo "  make dev        Run HTTPS dev server on $(HOST):$(PORT) (default)"
	@echo "  make dev-http   Run plain HTTP dev server on $(HOST):$(PORT)"
	@echo "  make build      Production build"
	@echo "  make start      Run production server"
	@echo "  make lint       Run eslint"
	@echo "  make install    Install dependencies"
	@echo "  make lan-ip     Print this machine's LAN IP"
	@echo ""
	@echo "Override host/port: make dev HOST=192.168.1.42 PORT=4000"

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

lint:
	npm run lint

install:
	npm install

lan-ip:
	@ipconfig getifaddr en0 2>/dev/null || ipconfig getifaddr en1 2>/dev/null || echo "no LAN IP found"
