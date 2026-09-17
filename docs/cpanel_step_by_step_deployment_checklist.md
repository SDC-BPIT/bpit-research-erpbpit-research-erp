# Step-by-Step cPanel Deployment Guide for `researcherp.bpitindia.ac.in`

Follow this exact step-by-step checklist to deploy **BPIT Research ERP** to your cPanel server.

---

## 📋 PRE-DEPLOYMENT CHECKLIST (On your local PC)

- [ ] **Step 1.1**: Open terminal in `E:\ERP Work\bpit-research-erp v2`
- [ ] **Step 1.2**: Run production build command:
  ```bash
  npm run build
  ```
  *(Verify it outputs `✓ Compiled successfully` and creates the `.next` folder)*.

---

## 🗄️ STEP 2: MySQL Database Setup on cPanel

1. Log into your **cPanel Account**.
2. Click on **MySQL Databases** under the *Databases* section.
3. **Create Database**:
   - In "New Database", type: `bpit_research`
   - Click **Create Database**.
   - Note down full database name (e.g. `cpaneluser_bpit_research`).
4. **Create Database User**:
   - Scroll down to "MySQL Users -> Add New User".
   - Username: `erpuser`
   - Password: Click **Password Generator** (copy password securely).
   - Click **Create User**.
5. **Link User to Database**:
   - Scroll down to "Add User To Database".
   - Select User: `cpaneluser_erpuser`
   - Select Database: `cpaneluser_bpit_research`
   - Click **Add**.
   - Check **ALL PRIVILEGES** and click **Make Changes**.
6. **Import SQL Dump**:
   - Go back to cPanel main menu and click **phpMyAdmin**.
   - Click on your new database `cpaneluser_bpit_research` on the left sidebar.
   - Click **Import** tab at top menu.
   - Click **Choose File** and select `database/bpit_research.sql` from your computer.
   - Click **Import** button at bottom.

---

## 🌐 STEP 3: Setup Node.js App in cPanel

1. In cPanel, search for **Setup Node.js App** (under *Software* section).
2. Click **Create Application**.
3. Fill in the form:
   - **Node.js version**: Choose `18.x`, `20.x` or highest version available.
   - **Application mode**: Select `Production`.
   - **Application root**: Type `researcherp`
   - **Application URL**: Select `researcherp.bpitindia.ac.in`
   - **Application startup file**: Type `server.js`
4. Click **Create** at top right.
5. Click **Stop Application** (temporary while uploading files).

---

## 📦 STEP 4: Upload Project Files to cPanel

Open cPanel **File Manager** and navigate to `researcherp` directory.

### 4.1 Folders to Upload:
Upload the following folders into `researcherp`:
- `pages/`
- `backend/`
- `frontend/`
- `prisma/`
- `public/`
- `styles/`
- `.next/` *(This is the compiled build folder created in Step 1)*

### 4.2 Files to Upload:
Upload the following files into `researcherp`:
- `server.js`
- `package.json`
- `package-lock.json`
- `next.config.mjs`
- `jsconfig.json`

> ⚠️ **IMPORTANT**: Do NOT upload `node_modules` from local PC. They will be installed cleanly on the cPanel server in Step 6.

---

## ⚙️ STEP 5: Create Production `.env` File on cPanel

In cPanel File Manager inside `researcherp/` folder:
1. Click **+ File** at top left.
2. Name it `.env`
3. Edit `.env` and paste the following content (replace DB user/pass with yours):

```env
# Database Credentials (cPanel MySQL)
DATABASE_URL="mysql://cpaneluser_erpuser:YOUR_SAVED_DB_PASSWORD@localhost:3306/cpaneluser_bpit_research"

# Secret Key
JWT_SECRET="bpit_erp_prod_jwt_secret_2026"

# URLs
NEXT_PUBLIC_BASE_URL="https://researcherp.bpitindia.ac.in"
NEXT_PUBLIC_API_URL=""

# Email SMTP Settings
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="amandureja@gmail.com"
SMTP_PASS="fesm snpk htwb uyqk"
EMAIL_FROM="BPIT ERP <no-reply@bpitindia.ac.in>"
```

---

## 💻 STEP 6: Install Node Dependencies & Generate Prisma Client

1. In cPanel, go back to **Setup Node.js App**.
2. Click on your `researcherp.bpitindia.ac.in` application to edit it.
3. Copy the **Command for entering virtual environment** shown at top (e.g. `source /home/cpaneluser/nodevenv/researcherp/18/bin/activate && cd /home/cpaneluser/researcherp`).
4. Open cPanel **Terminal** (under *Advanced* section).
5. Paste that command and press Enter.
6. Run:
   ```bash
   npm install --production
   ```
7. Run Prisma generator for server:
   ```bash
   npx prisma generate
   ```

---

## 🔒 STEP 7: Enable SSL & Start App

1. In cPanel, search for **SSL/TLS Status** or **Let's Encrypt SSL**.
2. Click **Run AutoSSL** for `researcherp.bpitindia.ac.in`.
3. Go back to **Setup Node.js App**.
4. Click **Start Application** (or **Restart Application**).

---

## 🎉 STEP 8: Verify Deployment

Open browser and visit: **[https://researcherp.bpitindia.ac.in](https://researcherp.bpitindia.ac.in)**

- [ ] Page loads cleanly
- [ ] Login screen responds
- [ ] Database queries work
