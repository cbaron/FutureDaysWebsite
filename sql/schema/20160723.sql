CREATE TABLE person (
    id                  SERIAL PRIMARY KEY,
    name                VARCHAR(100),
    email               VARCHAR(200),
    password            TEXT,
    "hasEmailValidated" BOOLEAN
);
