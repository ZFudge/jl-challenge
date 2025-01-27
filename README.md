# JL Challenge

## Prerequisites
- Make
- Docker
- pnpm
- curl

## Setup

1. Create a `.env` file in the root directory using the template provided in `.env-example`.
   > Feel free to replace the example settings with your own.

2. Generate a secret for authentication (will be stored in your `.env` file):
   ```bash
   make secret
   ```

3. Install dependencies:
   ```bash
   make install
   ```

4. Start PostgreSQL container:
   ```bash
   make db
   ```

5. Run development server:
   ```bash
   make dev
   ```

6. Seed the database:
   ```bash
   make seed
   ```

## Usage

Navigate to http://localhost:3000/ and log in with either of these credentials:

| Email | Password |
|-------|----------|
| testuser@test.com | pw12345 |
| joe@business1.com | pw12345 |
| rtimey@business2.com | pw12345 |


## Testing with playwright

Start the server with fresh database:
```bash
make all
```
seed the database:
```bash
make seed
```
lastly, run the tests with:
```bash
pnpm pw
```
