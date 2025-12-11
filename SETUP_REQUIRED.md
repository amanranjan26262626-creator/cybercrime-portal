# 🚀 Setup Required - Next Steps

## Ab Aapko Ye Karna Hai:

### 1. 🔑 API Keys & Accounts (CRITICAL)

#### A. Pinata (IPFS Storage)
- [ ] Go to: https://pinata.cloud/
- [ ] Sign up / Login
- [ ] Go to API Keys section
- [ ] Create new API key
- [ ] Copy `API Key` and `Secret API Key`
- [ ] Add to `backend/.env`:
  ```
  IPFS_API_KEY=your_pinata_api_key
  IPFS_API_SECRET=your_pinata_secret_key
  ```

#### B. Google Gemini API
- [ ] Go to: https://aistudio.google.com/
- [ ] Sign up / Login
- [ ] Create new API key
- [ ] Copy API key
- [ ] Add to `backend/.env`:
  ```
  GEMINI_API_KEY=your_gemini_api_key
  ```

#### C. Polygon Mumbai RPC
- [ ] Go to: https://www.alchemy.com/ (or https://infura.io/)
- [ ] Sign up / Login
- [ ] Create new app
- [ ] Select "Polygon Mumbai" network
- [ ] Copy HTTPS RPC URL
- [ ] Add to `backend/.env` and `frontend/.env.local`:
  ```
  POLYGON_RPC=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
  NEXT_PUBLIC_POLYGON_RPC=https://polygon-mumbai.g.alchemy.com/v2/YOUR_KEY
  ```

#### D. Firebase (Optional but Recommended)
- [ ] Go to: https://console.firebase.google.com/
- [ ] Create new project
- [ ] Enable Storage
- [ ] Go to Project Settings > Service Accounts
- [ ] Generate new private key (download JSON)
- [ ] Save JSON file as `backend/firebase-credentials.json`
- [ ] Add to `backend/.env`:
  ```
  FIREBASE_STORAGE_BUCKET=your-project.appspot.com
  FIREBASE_CREDENTIALS_PATH=./firebase-credentials.json
  ```

### 2. 💾 Database Setup

#### A. PostgreSQL (Choose One)

**Option 1: Supabase (Recommended - Free)**
- [ ] Go to: https://supabase.com/
- [ ] Sign up / Login
- [ ] Create new project
- [ ] Go to Settings > Database
- [ ] Copy connection string
- [ ] Run `database/schema.sql` in SQL Editor
- [ ] Add to `backend/.env`:
  ```
  DATABASE_URL=postgresql://user:password@host:5432/database
  ```

**Option 2: Local PostgreSQL**
- [ ] Install PostgreSQL: https://www.postgresql.org/download/
- [ ] Create database: `CREATE DATABASE cybercrime_db;`
- [ ] Run: `psql -U postgres -d cybercrime_db -f database/schema.sql`
- [ ] Add to `backend/.env`:
  ```
  DATABASE_URL=postgresql://postgres:password@localhost:5432/cybercrime_db
  ```

#### B. MongoDB (Choose One)

**Option 1: MongoDB Atlas (Recommended - Free)**
- [ ] Go to: https://www.mongodb.com/cloud/atlas
- [ ] Sign up / Login
- [ ] Create free cluster
- [ ] Create database user
- [ ] Whitelist IP: 0.0.0.0/0 (for development)
- [ ] Copy connection string
- [ ] Add to `backend/.env`:
  ```
  MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/cybercrime_db
  ```

**Option 2: Local MongoDB**
- [ ] Install MongoDB: https://www.mongodb.com/try/download/community
- [ ] Start MongoDB service
- [ ] Add to `backend/.env`:
  ```
  MONGODB_URI=mongodb://localhost:27017/cybercrime_db
  ```

### 3. 🔐 Wallet Setup (For Blockchain)

- [ ] Install MetaMask: https://metamask.io/
- [ ] Create new wallet or import existing
- [ ] Switch to Polygon Mumbai network
- [ ] Get testnet MATIC from: https://faucet.polygon.technology/
- [ ] For backend, create a separate wallet
- [ ] Export private key (BE CAREFUL!)
- [ ] Add to `backend/.env`:
  ```
  PRIVATE_KEY=your_wallet_private_key
  ```

### 4. 📝 Environment Files Setup

#### Backend `.env` file:
```bash
cd backend
cp ../env.example.txt .env
# Then edit .env and fill all values
```

#### Frontend `.env.local` file:
```bash
cd frontend
cp ../env.example.txt .env.local
# Then edit .env.local and fill all values
```

### 5. 🚀 Start Services

#### A. Start Backend (Node.js)
```bash
cd backend
npm install
npm run dev
```

#### B. Start Python Backend (Optional)
```bash
cd python-backend
pip install -r requirements.txt
python app.py
```

#### C. Start Frontend
```bash
cd frontend
npm install
npm run dev
```

### 6. 🔗 Deploy Smart Contract (After setup)

```bash
cd blockchain
# Fill .env with POLYGON_RPC and PRIVATE_KEY
npx hardhat compile
npx hardhat run scripts/deploy.js --network polygonMumbai
# Copy contract address to .env files
```

### 7. 🧪 Test Everything

1. **Test Backend:**
   - Visit: http://localhost:3001/health
   - Should return: `{"status":"ok"}`

2. **Test Frontend:**
   - Visit: http://localhost:3000
   - Should show landing page

3. **Test Database:**
   - Backend should connect on startup
   - Check logs for connection messages

## 📋 Quick Checklist:

- [ ] Pinata API keys
- [ ] Gemini API key
- [ ] Polygon Mumbai RPC URL
- [ ] Firebase setup (optional)
- [ ] PostgreSQL database (Supabase/local)
- [ ] MongoDB database (Atlas/local)
- [ ] MetaMask wallet with testnet MATIC
- [ ] Backend `.env` file filled
- [ ] Frontend `.env.local` file filled
- [ ] All services running
- [ ] Smart contract deployed

## ⚠️ Important Notes:

1. **Never commit `.env` files** - They're in `.gitignore`
2. **Keep private keys secure** - Don't share them
3. **Use testnet for development** - Don't use mainnet
4. **Start with free tiers** - All services have free tiers

## 🆘 If You Get Stuck:

1. Check error logs in terminal
2. Verify all API keys are correct
3. Check database connections
4. Ensure all services are running
5. Check network connectivity

---

**Once all setup is done, the system will be fully functional!** 🎉

