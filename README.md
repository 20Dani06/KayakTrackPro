# KayakTrackPro

## Database Setup and Development Server

1. **Configure `DATABASE_URL`**
   - Create a `.env` file in the project root.
   - Set `DATABASE_URL` to the connection string for your database. You can use
     a local PostgreSQL instance or a Neon database URL.

2. **Run migrations**
   - Install dependencies with `npm install` if needed.
   - Run `npm run db:push` to create tables and apply migrations.

3. **Start the server**
   - Use `npm run dev` to start the Express server with Vite in development mode.
   - The app will connect using `DATABASE_URL` and serve on port `5000`.

