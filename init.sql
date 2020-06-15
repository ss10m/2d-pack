CREATE TABLE "orders" (
    "id" serial PRIMARY KEY, 
    "data" json NOT NULL, 
    "created_at" TIMESTAMP NOT NULL
);