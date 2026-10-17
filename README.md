This repository is a sample Node.js application for Docker's documentation.  It is based on the application provided by Docker here https://github.com/docker/docker-nodejs-sample

## Liveness Check

The liveness probe endpoint is available at `/healthz/liveness` (and redirected from `/healthz`). It returns a JSON response `{ "status": "ok" }` with HTTP status 200. It includes a 10% probability of returning HTTP status 500 `{ "status": "fail" }` to simulate occasional liveness check failures.

## Readiness Check

The readiness probe endpoint is available at `/healthz/readiness`. It checks whether the persistence database layer is healthy. It returns `{ "status": "ok" }` with HTTP status 200 when healthy, or HTTP status 500 `{ "status": "fail" }` when the database is not ready or unhealthy.

## /headers Endpoint

The `/headers` endpoint inspects the incoming request headers and returns them formatted as plain text (`text/plain`).

## /hello Endpoint

The `/hello` endpoint simulates a memory leak. Each HTTP GET request to `/hello` increments a call counter and doubles the size of an in-memory byte array (`memoryArray`), rapidly increasing memory usage. The endpoint returns a JSON payload with the call count, timestamp, hostname, and memory array size.
