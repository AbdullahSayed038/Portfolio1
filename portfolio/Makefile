NPM := npm

.PHONY: all install dev build preview clean re

# Default: install dependencies (if needed) and start the dev server
all: install dev

install:
	$(NPM) install

dev:
	$(NPM) run dev

build: install
	$(NPM) run build

preview: build
	$(NPM) run preview

clean:
	rm -rf dist node_modules

re: clean all
