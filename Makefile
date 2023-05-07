all: test build

test:
	deno test --unstable --allow-read utils/test.js

build:
	deno run --unstable --allow-read --allow-write utils/build.js

install:
	deno cache utils/*.js

fmt:
	deno fmt utils/*.js