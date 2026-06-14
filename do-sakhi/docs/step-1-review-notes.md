# Step 1 Review Notes

## What was created
- Monorepo folder structure (`apps/web`, `apps/api`, `database`, `docs`).
- PostgreSQL raw schema script (`schema.sql`) defining 16 tables, 6 enums, and the `pgcrypto` extension.
- Seed script (`seed.sql`) populating realistic boutique data with relationships correctly linked.
- Reset script (`reset.sql`) to drop all tables and types safely.
- Basic monorepo files (`package.json`, `.env.example`, `docker-compose.yml`, `README.md`).

## How to run schema
Since we are using a remote Supabase DB, you can execute the Node.js runner to reset, apply the schema, and seed:
```bash
node database/apply.js
```
Or you can use `psql`:
```bash
psql "$DATABASE_URL" -f database/reset.sql
psql "$DATABASE_URL" -f database/schema.sql
psql "$DATABASE_URL" -f database/seed.sql
```

## How to validate DB
To run the automated validation queries and view the results in table format:
```bash
node database/validate.js
```

## Assumptions Made
- Used hardcoded lookups (subqueries and CTE-like `DO` blocks) in `seed.sql` to avoid complex UUID management in raw SQL.
- Since Homebrew compiling dependencies (`icu4c` and `openssl`) from source was taking a long time during step 1.5, we implemented and ran a clean Node-based runner (`database/apply.js`) using the `pg` driver to connect to Supabase, run the queries, and execute the SQL files safely.

## Errors Encountered & Resolved
- **Missing CLI tools**: Local PostgreSQL client `psql` was initially missing, and Homebrew compiler was slow. Resolved by installing `pg` and `dotenv` npm packages and writing an automated Node.js database execution runner (`database/apply.js`) to apply all changes.
- **SQL Special Characters in Password**: The password contained `!` and `()` characters. Enclosing connection string variables in quotes in `.env` and handling it through the Node.js client resolved potential connection string parsing issues.
- **Incomplete Product Media Seed**: In Step 1.6, product media was expanded from 10 initial records to 42 records, ensuring every seeded product has all 7 luxury media roles (front, side, back, fabric closeup, pocket/embroidery detail, drape video, lifestyle) to support the future PDP API.

## 🛑 STOP 🛑
Please review the database foundation (schema, seed, and summary) before proceeding to Step 2.

