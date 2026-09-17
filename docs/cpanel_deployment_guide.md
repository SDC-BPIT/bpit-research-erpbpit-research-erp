# Complete cPanel Deployment Guide for `researcherp.bpitindia.ac.in`

This guide explains step-by-step how to deploy **`bpit-research-erp`** onto cPanel for the subdomain **`researcherp.bpitindia.ac.in`**.

---

## 1. Prerequisites on Local Machine

Before uploading to cPanel, run the production build on your local machine:

```bash
# 1. Validate Prisma schema
npm run db:validate

# 2. Generate production build
npm run build
```

This generates the `.next` production build directory required by Next.js.

---

## 2. Setup MySQL Database in cPanel

1. Log into your **cPanel**.
2. Go to **MySQL Databases**:
   - Create a new database, e.g., `cpaneluser_bpit_research`.
   - Create a new database user, e.g., `cpaneluser_erpuser`, with a strong password.
   - Add user to database and grant **ALL PRIVILEGES**.
3. Go to cPanel **phpMyAdmin**:
   - Select your database (`cpaneluser_bpit_research`).
   - Click **Import** tab.
   - Upload [`database/bpit_research.sql`](file:///e:/ERP%20Work/bpit-research-erp%20v2/database/bpit_research.sql) from your local project.
   - Click **Go** to import tables and data.

---

## 3. Create Node.js App in cPanel

1. In cPanel, search and click **Setup Node.js App**.
2. Click **Create Application**:
   - **Node.js version**: Choose `18.x`, `20.x` or latest available.
   - **Application mode**: `Production`
   - **Application root**: `researcherp` (or directory path for your subdomain)
   - **Application URL**: `researcherp.bpitindia.ac.in`
   - **Application startup file**: `server.js`
3. Click **Create**.
4. Click **Stop Application** (temporary while uploading files).

---

## 4. File Structure & What to Upload to cPanel

Upload all project files to your cPanel Application Root directory (`researcherp`).

### Folders to Upload:
- `pages/`
- `backend/`
- `frontend/`
- `prisma/`
- `public/`
- `styles/`
- `.next/` *(Critical: includes compiled bundle)*

### Files to Upload:
- `server.js` *(cPanel Phusion Passenger entry point)*
- `package.json` & `package-lock.json`
- `next.config.mjs`
- `jsconfig.json`
- `.env` *(Production secrets configuration)*

> **Note**: Do **NOT** upload local `node_modules`. Node modules will be installed directly on cPanel to match the server environment.

---

## 5. Configure Environment Variables (`.env`)

Create or edit `.env` in the root of your cPanel application folder (`researcherp/.env`):

```env
# Database Connection (cPanel MySQL)
DATABASE_URL="mysql://cpaneluser_erpuser:YourStrongPassword@localhost:3306/cpaneluser_bpit_research"

# JWT Secret Key
JWT_SECRET="bpit_erp_production_jwt_secret_2026"

# Base URL (Subdomain)
NEXT_PUBLIC_BASE_URL="https://researcherp.bpitindia.ac.in"
NEXT_PUBLIC_API_URL=""

# SMTP Email Settings
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="amandureja@gmail.com"
SMTP_PASS="fesm snpk htwb uyqk"
EMAIL_FROM="BPIT ERP <no-reply@bpitindia.ac.in>"
```

---

## 6. Install Dependencies & Generate Prisma Client in cPanel

1. Open cPanel **Terminal** (or click the Virtual Environment command link in "Setup Node.js App").
2. Navigate to your app root:
   ```bash
   cd ~/researcherp
   ```
3. Install production dependencies:
   ```bash
   npm install --production
   ```
   *(Or click the **Run JS script / Run NPM Install** button inside cPanel Setup Node.js App UI).*
4. Generate Prisma Client for the server:
   ```bash
   npx prisma generate
   ```

---

## 7. Enable SSL & Start Application

1. In cPanel, search for **SSL/TLS Status** or **Let's Encrypt SSL**.
2. Run AutoSSL / Issue SSL for `researcherp.bpitindia.ac.in`.
3. Return to **Setup Node.js App** in cPanel.
4. Click **Restart Application**.

Your ERP application is now live at **[https://researcherp.bpitindia.ac.in](https://researcherp.bpitindia.ac.in)**!
