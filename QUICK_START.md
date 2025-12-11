# ⚡ Quick Start Guide

## Minimum Setup (To Get Started):

### 1. API Keys (15 minutes)

**Pinata:**
1. https://pinata.cloud/ → Sign up
2. API Keys → Create Key
3. Copy API Key & Secret

**Gemini:**
1. https://aistudio.google.com/ → Sign up
2. Get API Key → Copy

**Polygon RPC:**
1. https://www.alchemy.com/ → Sign up
2. Create App → Polygon Mumbai
3. Copy RPC URL

### 2. Database (10 minutes)

**Supabase (PostgreSQL):**
1. https://supabase.com/ → New Project
2. SQL Editor → Paste `database/schema.sql` → Run
3. Settings → Database → Copy connection string

**MongoDB Atlas:**
1. https://www.mongodb.com/cloud/atlas → Free Cluster
2. Create User → Whitelist IP (0.0.0.0/0)
3. Copy connection string

### 3. Environment Files (5 minutes)

**Backend:**
```bash
cd backend
# Create .env file
# Copy from env.example.txt
# Fill all values
```

**Frontend:**
```bash
cd frontend
# Create .env.local file
# Copy from env.example.txt
# Fill all values
```

### 4. Install & Run (5 minutes)

```bash
# Backend
cd backend
npm install
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev
```

### 5. Test (2 minutes)

- Backend: http://localhost:3001/health
- Frontend: http://localhost:3000

## Total Time: ~40 minutes

---

**After this, you can:**
- Register users
- Submit complaints
- Use AI chatbot
- Manage complaints (police)
- Generate FIRs

**Blockchain deployment can be done later!**

