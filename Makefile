all: test build

test:
	deno test --unstable --allow-read test.js