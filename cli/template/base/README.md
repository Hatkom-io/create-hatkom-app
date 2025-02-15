# Monorepo Template

This monorepo template is designed to streamline the development of full-stack applications using modern technologies. The stack includes NestJS for the API, NextJS for the client side, Apollo and GraphQL for efficient data fetching, Docker for database management, and Prisma as the ORM.

## Requirements

- NodeJS (the version is specified in the root package.json)
- bun (package manager, latest version)
- Docker

## Getting Started

1. Install dependencies

```
bun i
```

2. Set your db name and password in `apps/api/bin/db-start-docker.sh` files instead of `db_name` and `db_password`

3. Change `databaseUrl` to corresponding in `apps/api/jest.config.ts`

4. Create .env files in `apps/web` and `apps/api` folders based on `env.example` files

5. Start Docker

6. Start the database:

```
bun turbo db:start:docker
```

## Development

Once "Getting Started" is done, you can start the development environment with:

```
bun turbo start:dev
```

from the root folder. This will start the the `API` and the `web` app locally.

To open the frontend client, go to http://localhost:3000

## GraphQL

The GraphQL API is available at http://localhost:8080/graphql

For an example query, see `app/web/src/graphql`. If you copy any query inside `graphql()` to the GraphQL Playground, you can run it with the "play" button.
