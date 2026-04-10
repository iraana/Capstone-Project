# How do I deploy Gourmet2Go?

If you have push access to the main repository, deploying your changes is as simple as pushing your code, making a PR, merging,
and then the CI/CD pipeline will take care of the rest.  If you are working off of a fork or something similar, here is how to set
up for deployment.

## Prerequisites

- Vercel account
- GitHub account (connected to Vercel)
- Supabase project

## Vercel Dashboard

Once you have an account on Vercel go to your dashboard and click **add new**.  Click **project** and then you should see your 
*GitHub* repositories (if your GitHub is linked).  Click **import** and then you'll be on the new project page.  Name your project
whatever you want and make the **Application Preset** Vite as it is the build tool for this project.  Root directory is ./ and
next step is to add your environment variables.  If you have your own version of **Gourmet2Go** you are deploying, then you'll
need your own **Supabase** set up.  In Supabase, go to your project, then settings on the sidebar, then API keys, then 
`Legacy anon, service_role API keys`.  From here you need the anon key which allows you to use the Supabase APIs from the web app.
This API key gets exposed to the browser which is safe because of RLS.  Name this key `VITE_SUPABASE_ANON_KEY`.  The other key
you need is the service_role key.  This key is dangerous to be exposed because it bypasses RLS.  We use it in the Flask API only 
after checking if the user is authenticated and an admin.  You will save this key as `SUPABASE_SERVICE_ROLE_KEY`.  This key never
gets exposed to the browser so do not put `VITE_SERVICE_ROLE_KEY`.  But once all this is set up, your project will deploy and it
should build, no problem.  If it doesn't build, just check the logs, find the error, and fix it.  If it builds successfully, 
future pushes to main on GitHub will trigger the Vercel CI/CD pipeline.  The new code will be deployed automatically and will role
back if there is an error while building.

## But how does the Flask API get deployed?

The Flask API gets deployed on Vercel as well, using something called **Vercel Serverless**.  This takes advantage of an AWS 
compute service called **AWS Lambda**.  With **AWS Lambda**, you don't provision or manage servers and you only pay for the time 
you consume.  With Vercel, you are given 1 million serverless function invocations per month on the hobby plan.  That is more than
enough for an app of this size.  So to answer the question, how does the Flask code actually get deployed?  Here is a quick look
at a config file:

#### vercel.json:

```json
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/index.py"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

This JSON file tells Vercel that everything inside the api directory is a serverless endpoint.  So then, index.py becomes a live
endpoint at `https://gourmet2go.vercel.app/api`.

## API Key Rotation

Earlier I mentioned how crucial it is to never expose the service_role key.  But let's say you accidently commit the `.env` or
use the vite suffix in your environment variable.  You should not do these things, use the `.gitignore` and use environment 
variables on Vercel properly.  But, this stuff does happen, here is how to fix it.  Go back to **Supabase** and get back to the 
`Legacy anon, service_role API keys`.  Then, from there you will generate a new secret and then use the new one properly in your
Vercel environment variables and do not commit it to GitHub.  Committing private keys to GitHub is akin to leaving your keys
on the roof of the car.

## TL;DR

### Quick Deploy

#### Have push access to main repository

1. Push new code
2. Make a PR
3. Merge code 
4. Deploys automatically
5. Done

#### Working off your own fork

1. New project in Vercel
2. Use your own **Gourmet2Go** GitHub repo
3. Vite for the build tool and add the `VITE_SUPABASE_ANON_KEY` and `SUPABASE_SERVICE_ROLE_KEY` to the environemnt variables
4. Build 
5. It is now deployed you are done.  Future pushes will automatically make Vercel redeploy.