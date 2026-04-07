# Setup Guide

## Overview

This guide provides step-by-step instructions for setting up the Gourmet2Go development environment on your local machine. Follow these instructions to get the application running locally for development or testing purposes.

**Tech Stack:**
- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Supabase (BaaS) + Flask (Serverless API)
- **Image Processing:** Rust + WebAssembly (WASM)
- **Styling:** Tailwind CSS
- **State Management:** Zustand + TanStack Query

---

## Prerequisites

### Required Software

Before you begin, ensure you have the following installed on your system:

#### 1. Node.js (v18 or higher)

**Download:** https://nodejs.org/

**Verify installation:**
```bash
node --version
npm --version
```

**Recommended:** Use Node.js v20 LTS for best compatibility.

#### 2. Python (v3.10 or higher)

**Download:** https://www.python.org/downloads/

**Verify installation:**
```bash
python --version
# or
python3 --version
```

**Note:** Make sure to check "Add Python to PATH" during installation on Windows.

#### 3. Rust

**Download:** https://www.rust-lang.org/tools/install

**Installation command:**
```bash
# Windows, macOS, Linux
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

**Verify installation:**
```bash
rustc --version
cargo --version
```

#### 4. wasm-pack

**Installation:**
```bash
# Install wasm-pack for WebAssembly compilation
cargo install wasm-pack
```

**Verify installation:**
```bash
wasm-pack --version
```

#### 5. Git

**Download:** https://git-scm.com/downloads

**Verify installation:**
```bash
git --version
```

---

## Installation Steps

### 1. Clone the Repository

```bash
# Clone the repository
git clone https://github.com/iraana/Capstone-Project.git

# Navigate to the project directory
cd Capstone-Project
```

### 2. Install Frontend Dependencies

```bash
# Install Node.js dependencies
npm install
```

This will install all required packages listed in `package.json`, including:
- React, React DOM
- TypeScript
- Vite (build tool)
- Tailwind CSS
- Supabase client
- TanStack Query (React Query)
- Zustand (state management)
- Recharts (analytics charts)
- And all other dependencies

**Expected output:** A `node_modules/` folder will be created with all dependencies.

### 3. Install Backend Dependencies

```bash
# Install Python dependencies
pip install -r requirements.txt

# On some systems, you may need to use pip3
pip3 install -r requirements.txt
```

This installs the Flask serverless API dependencies required for administrative operations.

**Note:** If you encounter permission errors, you may need to use:
```bash
pip install -r requirements.txt --user
```

### 4. Compile Rust/WASM Image Processor

The application uses a Rust-based image processor compiled to WebAssembly for client-side image optimization.

```bash
# Navigate to the Rust directory (if separate)
# Or run from project root if wasm is in the root

# Build the WASM package
wasm-pack build --target web
```

**What this does:**
- Compiles Rust code to WebAssembly
- Generates JavaScript bindings
- Creates a `pkg/` directory with the compiled WASM module
- Optimizes the image processor for web use

**Output:** You should see a `pkg/` folder containing:
- `.wasm` files (compiled WebAssembly)
- `.js` files (JavaScript bindings)
- TypeScript definitions

### 5. Environment Configuration

The project uses a `.env` file in the **project root** directory for environment variables. **You need to configure this file with your own Supabase credentials** before running the app.

**Update the `.env` file with the following:**
```env
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Flask API Configuration (Optional - for deployment)
FLASK_ENV=development
FLASK_SECRET_KEY=your_secret_key_here

# Application Configuration
VITE_APP_URL=http://localhost:5173  # For local development

# Production URL (already deployed):
# VITE_APP_URL=https://gourmet2go.vercel.app
```

#### Getting Supabase Credentials:

1. Go to your Supabase project dashboard: https://supabase.com/dashboard/project/vnnlrooakzcseeiqskxw
2. Navigate to **Settings** → **API**
3. Copy the following:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon/public key** → `VITE_SUPABASE_ANON_KEY`
   - **service_role key** → `VITE_SUPABASE_SERVICE_ROLE_KEY` (keep this secret!)

**Security Note:** Never commit the `.env` file to Git. It's already included in `.gitignore`.

---

## Running the Application

### Development Mode

#### Start the React Frontend

```bash
# Start the Vite development server
npm run dev
```

**Expected output:**
```
VITE v5.x.x  ready in XXX ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
➜  press h + enter to show help
```

**Open your browser:** Navigate to `http://localhost:5173/`

**Features in dev mode:**
- Hot Module Replacement (HMR) - instant updates on code changes
- Fast refresh for React components
- TypeScript type checking
- Vite dev server with optimized bundling

#### Start the Flask API (if needed)

The Flask API is deployed as serverless functions on Vercel, but for local testing:

```bash
# Navigate to the API directory (if separate)
cd api

# Run Flask in development mode
python app.py

# Or use Flask CLI
flask run
```

**Expected output:**
```
* Running on http://127.0.0.1:5000
```

**Note:** Most development can be done without running the Flask API locally, as the main backend is Supabase.

---

## Build for Production

### Build the Frontend

```bash
# Create optimized production build
npm run build
```

**Output:** Creates a `dist/` folder with:
- Minified JavaScript bundles
- Optimized CSS
- Compiled WASM modules
- Static assets (images, fonts, etc.)

### Preview Production Build

```bash
# Preview the production build locally
npm run preview
```

This serves the `dist/` folder to verify the production build works correctly.

---

## Project Structure

```
Capstone-Project/
├── api/                        # Flask serverless API
│   ├── app.py                  # Main Flask application
│   └── requirements.txt        # Python dependencies
├── docs/                       # Documentation
│   ├── SETUP.md               # This file
│   ├── TESTING.md             # Testing documentation
│   └── images/                # Documentation images
├── public/                     # Static assets
│   ├── logo.svg               # App logo
│   └── favicon.ico            # Favicon
├── src/                        # Source code
│   ├── components/            # React components
│   ├── pages/                 # Page components
│   ├── hooks/                 # Custom React hooks
│   ├── context/               # React context providers
│   ├── store/                 # Zustand stores
│   ├── tests/                 # Test files
│   ├── types/                 # TypeScript type definitions
│   ├── App.tsx                # Main App component
│   └── main.tsx               # Application entry point
├── pkg/                        # Compiled WASM (generated)
├── node_modules/              # Node dependencies (generated)
├── .env                        # Environment variables
├── .gitignore                 # Git ignore rules
├── package.json               # Node.js dependencies
├── requirements.txt           # Python dependencies
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.js         # Tailwind CSS configuration
├── vite.config.ts             # Vite configuration
└── README.md                  # Project overview
```

---

## Development Workflow

### Typical Development Session

1. **Pull latest changes:**
   ```bash
   git pull origin main
   ```

2. **Install any new dependencies:**
   ```bash
   npm install
   pip install -r requirements.txt
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Make your changes** in the `src/` directory

5. **Test your changes:**
   ```bash
   npm test
   ```

6. **Commit and push:**
   ```bash
   git add .
   git commit -m "Description of changes"
   git push origin your-branch-name
   ```

### Updating WASM Module

If you make changes to the Rust image processor:

1. **Edit Rust source files** (usually in `wasm/` or similar directory)

2. **Rebuild WASM:**
   ```bash
   wasm-pack build --target web
   ```

3. **Restart dev server** to use the new WASM module:
   ```bash
   npm run dev
   ```

---

## Common Commands

### Development

```bash
# Start development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm run coverage

# Run tests in watch mode
npm run test:watch

# Type check TypeScript
npx tsc --noEmit

# Lint code
npm run lint
```

### Building

```bash
# Create production build
npm run build

# Preview production build
npm run preview

# Build WASM module
wasm-pack build --target web
```

### Database (Supabase)

```bash
# The project uses Supabase BaaS - no local database setup needed
# Database operations are handled through the Supabase client
```

---

## Troubleshooting

### Common Issues and Solutions

#### Issue: `npm install` fails with permission errors

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Try installing with --legacy-peer-deps
npm install --legacy-peer-deps
```

#### Issue: Python dependencies fail to install

**Solution:**
```bash
# Use pip with --user flag
pip install -r requirements.txt --user

# Or create a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

#### Issue: WASM build fails

**Solution:**
```bash
# Update wasm-pack
cargo install wasm-pack --force

# Make sure you're in the correct directory
cd wasm/  # or wherever the Rust code is located

# Try building with verbose output
wasm-pack build --target web --verbose
```

#### Issue: Port 5173 is already in use

**Solution:**
```bash
# Kill the process using port 5173
# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# On macOS/Linux:
lsof -ti:5173 | xargs kill -9

# Or specify a different port
npm run dev -- --port 3000
```

#### Issue: Environment variables not loading

**Solution:**
1. Verify `.env` file is in the project root (same level as `package.json`)
2. Restart the dev server after changing `.env`
3. Ensure variable names start with `VITE_` for frontend variables
4. Check for typos in variable names

#### Issue: Supabase connection errors

**Solution:**
1. Verify your Supabase credentials in `.env`
2. Check if your Supabase project is active
3. Ensure RLS (Row Level Security) policies are properly configured
4. Verify network connection (Supabase is cloud-hosted)

#### Issue: TypeScript errors after pulling new code

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install

# Clear TypeScript cache
rm -rf node_modules/.cache
```

#### Issue: Build fails with "out of memory" error

**Solution:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# On Windows (PowerShell):
$env:NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

#### Issue: Hot reload not working

**Solution:**
1. Check if you're editing files outside `src/`
2. Restart the dev server
3. Clear browser cache
4. Check if file watchers limit is reached (Linux):
   ```bash
   echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
   sudo sysctl -p
   ```

---

## Testing the Installation

### Verify Everything Works

After setup, verify your installation by running through this checklist:

1. **Frontend starts:**
   ```bash
   npm run dev
   ```
   Should open at `http://localhost:5173/`

2. **Tests run:**
   ```bash
   npm test
   ```
   Should show 340+ tests passing

3. **Build succeeds:**
   ```bash
   npm run build
   ```
   Should create `dist/` folder without errors

4. **Database connection works:**
   - Open the app in browser
   - Try to sign in or sign up
   - Should connect to Supabase successfully

5. **WASM module loads:**
   - Navigate to Gallery (if admin)
   - Try uploading an image
   - Should process image using WASM

---

## System Requirements

### Minimum Requirements

- **OS:** Windows 10, macOS 10.15+, or Linux (Ubuntu 20.04+)
- **RAM:** 4 GB (8 GB recommended)
- **Storage:** 500 MB for dependencies
- **Node.js:** v18+
- **Python:** v3.10+
- **Internet:** Required for Supabase connection

### Recommended Setup

- **OS:** Windows 11, macOS 13+, or Ubuntu 22.04+
- **RAM:** 16 GB
- **Storage:** 2 GB free space
- **Node.js:** v20 LTS
- **Python:** v3.11+
- **Browser:** Chrome, Firefox, or Edge (latest version)

---

## Additional Resources

### Documentation

- **Project README:** `README.md` - Project overview and features
- **Testing Guide:** `docs/TESTING.md` - How to run and write tests
- **Database Schema:** `docs/DATABASE_SCHEMA.md` - Database structure
- **Contributing:** `docs/CONTRIBUTING.md` - How to contribute code

### External Documentation

- **React:** https://react.dev/
- **TypeScript:** https://www.typescriptlang.org/docs/
- **Vite:** https://vitejs.dev/guide/
- **Supabase:** https://supabase.com/docs
- **Tailwind CSS:** https://tailwindcss.com/docs
- **Rust/WASM:** https://rustwasm.github.io/docs/book/

### Getting Help

If you encounter issues not covered in this guide:

1. Check existing GitHub Issues: https://github.com/iraana/Capstone-Project/issues
2. Review the documentation in the `docs/` folder
3. Contact the development team via Microsoft Teams
4. Create a new GitHub issue with detailed error information

---

## Quick Start Summary

**For the impatient developer:**

```bash
# 1. Clone
git clone https://github.com/iraana/Capstone-Project.git
cd Capstone-Project

# 2. Install dependencies
npm install
pip install -r requirements.txt

# 3. Build WASM
wasm-pack build --target web

# 4. Create .env file with your Supabase credentials
cp .env.example .env  # If example exists, otherwise create manually

# 5. Start development
npm run dev

# 6. Open http://localhost:5173/
```

**Done!** You should now have a working development environment! 

---

## Next Steps

After setting up the development environment:

1. **Read the README** - Understand the project structure and features
2. **Review TESTING.md** - Learn how to run and write tests
3. **Check CONTRIBUTING.md** - Understand the development workflow
4. **Explore the codebase** - Familiarize yourself with the code organization
5. **Run the test suite** - Ensure everything is working: `npm test`
6. **Make a small change** - Try modifying something to test your setup
7. **Create a branch** - Start working on your first task!

---

**Last Updated:** April 2026  
**Maintainer:** Team DevDynamics  
**Questions?** Contact the team via Microsoft Teams or GitHub Issues

---

**Welcome to the Gourmet2Go development team!**