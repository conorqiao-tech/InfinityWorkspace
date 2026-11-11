# Infinity Workspace

A small Vercel-ready workspace assistant. Ask questions about an explicitly selected UTF-8 text file, or request an edit and review the full proposed content before downloading a copy. No repository or Minecraft server access is connected. This is a model-powered application, not a model trained on the example file.

## Run and deploy

Import this repository into Vercel with its default settings; the `api/agent.js` serverless function handles requests. Run locally with the Vercel CLI (`vercel dev`) or deploy from the Vercel dashboard. Node 20 or later is required. Optionally set `OPENAI_MODEL` on Vercel to an accessible text model; the default is `gpt-4.1-mini`.

Enter an OpenAI API key in the page each session. Requests transmit that key and the selected file contents through the Vercel function to OpenAI. The app does not save the key, files, conversation, or requests; OpenAI and hosting infrastructure have their own processing and retention policies. Use a restricted key with a spending limit and avoid sharing secrets in files. Model usage can incur charges. The function sets `store: false`; see [OpenAI data controls](https://platform.openai.com/docs/guides/your-data). Deploy only over HTTPS and avoid untrusted deployments because their server receives your key.

Files are limited to 80 KB and total prompt plus file to 100 KB. The app makes no claim that operations fit in one byte: requests and provider infrastructure consume variable space. The application uses no database or persistent operation log. It does not automatically overwrite local files, and generated content should be reviewed before use. The assistant has no browsing or autonomous file tools.

## Verification

Run `npm test`. Model integration requires a real API key and an accessible model to test end to end. The training examples are illustrative behavior examples, not a training set or evidence of fine-tuning.
