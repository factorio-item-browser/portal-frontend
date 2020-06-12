.PHONY: help build fix install start test update

help: ## Show this help.
	@fgrep -h "##" $(MAKEFILE_LIST) | fgrep -v fgrep | sed -e 's/\\$$//' | sed -e 's/##//'

build: ## Installs the dependencies of the project.
	npm run --silent build

check: ## Checks the source for eslint or code style violations.
	npm run --silent check

fix: ## Tries to fix code style issues.
	npm run --silent fix

install: ## Installs the dependencies of the project.
	npm install

start: ## Starts the development server with hot reloading.
	npm start

test: ## Runs the tests of the project.
	npm run --silent test

update: ## Installs the dependencies of the project.
	npm update
