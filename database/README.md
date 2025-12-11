# Database Setup Guide

## PostgreSQL Setup

### Option 1: Local PostgreSQL
1. Install PostgreSQL: https://www.postgresql.org/download/
2. Create database:
   ```sql
   CREATE DATABASE cybercrime_db;
   ```
3. Run schema:
   ```bash
   psql -U postgres -d cybercrime_db -f schema.sql
   ```

### Option 2: Supabase (Recommended)
1. Go to https://supabase.com/
2. Create new project
3. Go to SQL Editor
4. Copy and paste contents of `schema.sql`
5. Run the SQL
6. Get connection string from Settings → Database

## MongoDB Setup

### Option 1: Local MongoDB
1. Install MongoDB: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Connection string: `mongodb://localhost:27017/cybercrime_db`

### Option 2: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free cluster
3. Create database user
4. Whitelist IP (0.0.0.0/0 for development)
5. Get connection string

## Environment Variables

Update your `.env` file:

```env
DATABASE_URL=postgresql://user:password@host:5432/cybercrime_db
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cybercrime_db
```

## Test Connections

Run backend server - it will test connections on startup.

