.PHONY: help build check fix install start update

help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

build: ## Installs the dependencies of the project.
	npm run build

check: ## Checks the source for eslint or code style violations.
	npm run check

fix: ## Tries to fix code style issues.
	npm run fix

install: ## Installs the dependencies of the project.
	npm install

start: ## Starts the development server with hot reloading.
	npm start

update: ## Installs the dependencies of the project.
	npm update
