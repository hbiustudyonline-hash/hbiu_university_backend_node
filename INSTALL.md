# Node.js Installation Guide for macOS

## The Problem
Your backend is crashing because Node.js and npm are not installed on your system. The error "zsh: command not found: npm" indicates this.

## Solution: Install Node.js

### Method 1: Official Installer (Recommended)
1. **Download Node.js**
   - Go to https://nodejs.org/
   - Download the **LTS version** (Long Term Support)
   - Choose the macOS Installer (.pkg file)

2. **Install Node.js**
   - Double-click the downloaded .pkg file
   - Follow the installation wizard
   - Accept the license agreement
   - Use default installation location

3. **Verify Installation**
   - Open Terminal (or restart your current terminal)
   - Run: `node --version`
   - Run: `npm --version`
   - Both should show version numbers

### Method 2: Using Homebrew (Alternative)
If you have Homebrew installed:
```bash
brew install node
```

If you don't have Homebrew:
```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
brew install node
```

## After Installing Node.js

1. **Navigate to Backend Directory**
   ```bash
   cd "/Users/gregorygrant/Desktop/hbiu lms/hbiu-online-studies/backend"
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Seed Database (Optional but Recommended)**
   ```bash
   npm run seed
   ```

4. **Start Development Server**
   ```bash
   npm run dev
   ```

5. **Verify Server is Running**
   - You should see: "Server running on port 5000"
   - Visit: http://localhost:5000/health
   - Should show: "HBIU LMS Backend is running"

## Sample Login Credentials
After seeding the database, you can test with:

- **Admin**: admin@hbiu.edu / Admin123!
- **Lecturer**: john.smith@hbiu.edu / Lecturer123!
- **Student**: alice.johnson@student.hbiu.edu / Student123!

## Troubleshooting

### If npm install fails:
```bash
# Clear npm cache
npm cache clean --force

# Try installing again
npm install
```

### If server won't start:
1. Check if port 5000 is free:
   ```bash
   lsof -i :5000
   ```

2. Kill any process using port 5000:
   ```bash
   kill -9 [PID]
   ```

3. Or change the port in `.env`:
   ```
   PORT=5001
   ```

### If database errors occur:
```bash
# Delete database and let it recreate
rm -f database/hbiu_lms.sqlite
npm run dev
```

## Next Steps
Once the backend is running successfully:
1. Test API endpoints with Postman or similar
2. Connect your React frontend
3. Test authentication and CRUD operations

Your backend is fully implemented and ready - it just needs Node.js to run!