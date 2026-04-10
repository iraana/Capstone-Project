# Gourmet2Go Operations

## Quick Troubleshooting

### API not working

- Check Vercel → Logs
- Look for 300/400/500 errors
- Review error message from `index.py`

### Frontend not loading / broken UI

- Open browser dev tools → Console
- Check for runtime errors
- Check Network tab for failed requests

### Build failed on deployment

- Go to Vercel → Deployments → Build Logs
- Look for Vite errors

### Database issues

- Check if data exists in tables
- Ensure environment variables are set up correctly in the .env or Vercel

## Vercel Serverless Function Logs

- Go to **Vercel**
- Click your deployed **Gourmet2Go** project
- Simply click logs on the sidebar

Here you will see all the API requests whether they are in the 200 series, 300 series, 400 series, or 500 series.  The custom 
error messages from `index.py` will show up here too.  This is a nice tool if you are getting errors with your Vercel Severless
API and you don't know why.

## How to see client-side errors

- In development you will see them in the console after running `npm run dev`
- In production you will see them in the deployment build logs (for Vite build errors)
  - Go to your deployed **Gourmet2Go** project on Vercel
  - Go to deployments in the sidebar
  - Click a deployment (newest one is at the top)
  - Open build logs
  - That is your build output logs
- You can also find errors in the browser dev tools, console
- Additionally, in the dev tools, the network tab
- This captures network activity 
- Refresh the page and the client-side error will show here

## Supabase Backups

Backing up your data is highly important, especially for a production app.  Luckily, **Supabase** does this automatically for all
`Free`, `Pro`, `Team`, and `Enterprise` Plan projects.

- Pro plan can access the last 7 days of daily backups
- Team plan can access the last 14 days of daily backups
- Entreprise plan can access the last 30 days of daily backups
- Free plan **cannot** access any of their daily backups directly
  - Instead they must use the **Supabase CLI** directly 
  - Use the `db dump` command regularly to maintain off-site backups
- Pro, Team, and Entreprise plans can also use PITR (Point-in-Time Recovery)
  - This gives you the option to restore to any chosen point with up to seconds of granularity
  - With PITR, you can backup to the point of disaster 

#### Nice external documentation for this (directly from Supabase)

<a href="https://supabase.com/docs/guides/platform/backups">Supabase Backups</a>

<a href="https://supabase.com/docs/guides/local-development/cli/getting-started">Supabase CLI</a>

## Restoring Supabase Backup

### Here is a step by step guide:

1. Prepare Your Backup File

- Unzip it: If your backup file ends in .gz, right-click and unzip/extract it. You need the file to end in .sql or .backup.
- Find the path: Know exactly where that file is.
- Windows tip: Hold Shift and right-click the file, then select "Copy as path."

2. Get Your Connection String

- You need to tell the computer where to send the data.
- Go to your New Supabase Project dashboard.
- Click the Connect button at the top.
- Look for the Session Pooler string. It looks like a long URL: 
`postgresql://postgres.[PROJECT-REF]:[YOUR-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres`
  - Copy this string and paste it into a notepad
  - Important: Replace [YOUR-PASSWORD] inside that string with your actual database password.

3. Run the "Restore" Command

- Open your computer's Terminal (Mac/Linux) or Command Prompt (Windows). You will type one single command.
- The Template: `psql -d "YOUR_CONNECTION_STRING" -f "YOUR_FILE_PATH"`
  - What it looks like filled out: `psql -d "postgresql://postgres.abcde@pooler.supabase.com:5432/postgres" -f "C:\Users\Downloads\my_backup.sql"`
- Press Enter. It will ask for your password—type it in (you won’t see the characters moving, that’s normal) and hit Enter again.

#### Important things to know

- Ignore the "Errors": You will see a lot of scary text saying already exists or error. This is normal. The backup tries to create folders (schemas) that Supabase already has ready for you. It will skip those and move on to your actual data.
- Storage (Images/Files): This process only restores your data/tables. If you had images or PDFs in Supabase Storage, you have to move those separately using the Supabase "Storage Migrator" tool.
- Settings: You will need to manually re-enable any specific Auth settings (like Google Login) or API keys in your new project dashboard.

#### Supabase documentation for this:

<a href="https://supabase.com/docs/guides/platform/migrating-within-supabase/dashboard-restore">Supabase Dashboard Restore</a>

## Codebase Backup

GitHub **does not** provide backups to your any of your projects.  However, you can create your own backup with Git/GitHub.  You
achieve this by doing a mirror clone.  A mirror clone is different from a standard clone, it is a total reference copy.  It 
includes:

- All local and remote tracking branches
- All tags
- Notes
- Hidden or custom references

This is the superior backup method because it captures the entire history and all branch states, ensuring no metadata or 
secondary branches are lost.  This is also the typical protocal when moving from one service to another *(e.g. GitHub to GitLab)*.

#### So, here is how to do it

`git clone --mirror https://github.com/iraana/Capstone-Project.git`

Basically, a regular git clone but using `--mirror`.

## Restoring with a Mirror Clone

- Create a new GitHub repo
- Navigate to your mirror clone directory in your terminal
- Push the mirror onto the new repository
  - `git push --mirror https://github.com/iraana/New-Capstone-Project.git`

## Recommended Backup Strategy

- Run Supabase CLI backup weekly (Free plan)
- Before major deployments:
  - Create database dump
  - Create Git mirror backup

- Store backups:
  - Local machine or cloud storage

## Before Restoring a Backup

- Restoring will overwrite existing data
- Always restore into a NEW project first
- Verify backup integrity before using in production

## Post-Restore / Post-Deploy Checklist

- API endpoints return 200 responses
- Frontend loads without console errors
- Database tables contain expected data
- Authentication works
- File storage is accessible