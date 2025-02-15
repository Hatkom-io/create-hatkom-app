docker run --name db_name -e POSTGRES_PASSWORD=db_password -d -p 5432:5432 postgres:16.1 && 
sleep 1 && 
DATABASE_URL="postgresql://postgres:db_password@localhost:5432/postgres?schema=public" bun prisma db push &&
DATABASE_URL="postgresql://postgres:db_password@localhost:5432/postgres?schema=public" bun prisma db seed
