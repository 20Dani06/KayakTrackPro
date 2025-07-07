# PaddleTracker

This project tracks kayaking sessions and related performance metrics.

## Database Migrations

Before running the application, create the required tables using Drizzle.
Make sure `DATABASE_URL` is set in your `.env` file and then run:

```bash
npm run db:push
```

This command applies the migrations in the `migrations/` directory to your database.
