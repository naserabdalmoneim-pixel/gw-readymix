# Form Relay Worker

This Worker receives lead requests from the static site, injects the private Apps Script secret on the server side, and forwards the request to Google Apps Script.

## Why it exists

- Keeps `APPS_SCRIPT_SHARED_SECRET` out of frontend JavaScript
- Returns a real JSON success/error response to the website
- Restricts requests by allowed origin
- Keeps the existing Google Sheet + Gmail notification flow

## Files

- `src/index.mjs`: Worker code
- `wrangler.jsonc`: Worker config
- `.dev.vars.example`: local secret example

## Required secrets

Set these with Wrangler before deploy:

```bash
wrangler secret put APPS_SCRIPT_URL
wrangler secret put APPS_SCRIPT_SHARED_SECRET
wrangler secret put NOTIFICATION_EMAIL
```

## Local development

Create `.dev.vars` from `.dev.vars.example`, then run:

```bash
wrangler dev
```

## Deploy

```bash
wrangler deploy
```

After deploy, copy the Worker URL and put it into:

`assets/js/site-config.js`

Use:

```js
leadForms: {
  provider: "google-apps-script",
  relayEndpoint: "https://your-worker.workers.dev",
  endpoint: "https://script.google.com/macros/s/...",
  sharedSecret: "",
  recipientEmail: "naserabdalmoneim@gmail.com",
  fallbackToMailto: true,
}
```

## Recommended final route

Later, after the main domain move is complete, route the Worker through Cloudflare on a dedicated host such as:

- `https://api.golden-western.sa/lead`

At that point, update `relayEndpoint` to the final route and leave `sharedSecret` empty in the frontend.
