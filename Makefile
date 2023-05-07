all: test build

test:
	deno test --unstable --allow-read test.js

install:
	deno cache test.js

fmt:
	deno fmt *.js