# Security Report — Women for the Future Website

**Date:** September 23, 2026
**Scope:** Frontend (React/Vite), backend (FastAPI), stored data, published images, dependencies and repository history.

---

## 1. Summary

The website collects personal data from visitors: names, email addresses, student status and free-text messages. It collects this through three forms (newsletter, event registration and contact).

**Before this review, the site was not safe to publish.** Its code had no signs of careless or harmful intent, but the backend accepted anything from anyone without limits. That opened the door to spam and to filling up the server. It also allowed attacks on the person who opens the collected data in Excel. Users also got a success message even when their data was never saved.

All the serious problems are now fixed in code. None of the fixes needed a major redesign: the site still works the same way and still stores data in CSV files. A few remaining points depend on how and where you publish the site. They are listed in Section 4.

**Good news found during the review:**
- No passwords, API keys or secrets were found in the code or in the git history.
- Personal data files were already excluded from git (`.gitignore`).
- None of the dependencies (Python or JavaScript) have known vulnerabilities.
- The React frontend never inserts raw HTML, which prevents the most common type of web attack (script injection).

---

## 2. Problems found and why they matter

Ordered from most to least serious.

### 🔴 Critical

**1. Excel "formula injection" in the stored data**
Anything typed into the forms was saved to the CSV files exactly as written. If someone typed a name like `=HYPERLINK("http://malicious-site", "Click here")` or `=cmd|...`, Excel or Google Sheets treats it as a formula when the team opens the file. This can lead team members to malicious sites, leak other rows of the spreadsheet to an outsider, or in some Excel setups run commands on the team member's computer.
*Why it's real:* the attack targets you and your team, the people who open these files, and it only takes one form submission.

**2. No limit on submissions (spam and service outage)**
Anyone could send an unlimited number of submissions, of any size, using a simple script. This could:
- fill the server disk until the site stops working,
- bury real registrations under thousands of fake ones,
- make the newsletter and event lists useless.

**3. Any website could send data to your API**
The backend accepted requests from any website on the internet (`allow_origins=["*"]`), combined with a setting meant for logged-in sessions. Any other site could silently submit forms on behalf of its visitors, or abuse your API as its own.

### 🟠 High

**4. No real validation on the server**
Checks like "must be a valid email" and "Tec students must use @tec.mx" were done only in the browser. Anyone can skip browser checks, so the server accepted any text of any length in every field, including invented values for fields like "Where did you hear about us?".

**5. Users were told "success" even when their data was lost**
All three forms showed a success message (with confetti) **even if the server was down or rejected the data**. The RSVP code even did this on purpose. A student could believe they had a spot at an event that has no record of them, and you would never find out.

**6. Hard-coded `http://localhost:8000` address**
The frontend always sent data to `http://localhost:8000`. In production this means one of two things. The forms don't work at all for visitors. Or, if it is changed by hand to a plain `http://` address, personal data travels over the internet unencrypted, where anyone on the same Wi‑Fi (for example, campus Wi‑Fi) can read it.

**7. Internal error details were shown to visitors**
When something failed, the server sent the full internal error back to the browser, including file paths on the server. That tells an attacker how the server is organized.

### 🟡 Medium

**8. Data files stored inside the code folder, with open permissions**
The CSV files with personal data were created inside the application folder with default permissions. That makes them easy to copy by accident with the code, include in a backup, or expose through a badly configured server.

**9. Data could get corrupted by simultaneous submissions**
Two people submitting at the same moment could write to the same file at once and corrupt rows.

**10. Public API documentation**
FastAPI publishes an interactive page (`/docs`) listing every endpoint and field by default. That's useful during development, but in production it hands attackers a map of your API.

**11. Hidden camera data in the gallery photos**
The 8 gallery photos contained hidden metadata: the **camera's serial number**, the lens, and the **exact date and time** each photo was taken. There was no GPS location, but this information can be used to connect the photos to a specific person or device.

**12. Unchecked links from the content files**
Links in `infoPOSTS.csv` and `infoCALENDARIO.csv` were used directly as clickable buttons. If one of those files were ever edited by mistake or maliciously to contain a `javascript:` link, clicking the button would run code in the visitor's browser.

### 🔵 Low

**13. Missing browser security protections**
The site did not tell browsers to restrict where scripts can come from or where data can be sent (a "Content Security Policy"). The API did not send standard protective headers either.

**14. Duplicate newsletter subscriptions** were possible, which makes the list less reliable.

---

## 3. Changes made

### Backend (`backend/app/main.py`)

| Problem | What was done |
|---|---|
| Formula injection (#1) | Any value starting with `=`, `+`, `-` or `@` is saved with a leading `'` so spreadsheets show it as plain text and never run it. Verified: `=cmd\|calc` is stored as `'=cmd\|calc`. |
| No submission limit (#2) | Each visitor (by IP address) can submit at most **10 times per minute**, adjustable. Submissions larger than 10 KB are rejected. |
| Bots | A hidden "honeypot" field was added to every form. Real people never see it, but automated bots fill it in. Those submissions are silently thrown away. |
| Any site could use the API (#3) | Only the domains you list in `ALLOWED_ORIGINS` are accepted. Only JSON requests are accepted, which blocks hidden form submissions from other sites. |
| No server validation (#4) | Every field now has a maximum length. Emails must be real email addresses. "Yes/No" and "Where did you hear about us?" only accept the real options. **Tec students must use an @tec.mx / @itesm.mx email, checked on the server.** Unexpected fields are rejected. Invisible control characters are removed. |
| Error details leaked (#7) | Visitors now see a generic message. Full details are written only to the server log. |
| Data file location and permissions (#8) | The storage folder can now be set with `DATA_DIR`, so it can live outside the code. Files are created so that **only the server's own user can read them**. |
| Data corruption (#9) | Files are locked while being written, so simultaneous submissions can't mix up rows. |
| Public docs (#10) | `/docs` and `/openapi.json` are off by default. Set `ENABLE_DOCS=true` to use them locally. |
| Security headers (#13) | Every API response now tells browsers not to cache personal data, not to embed the API in other pages, and not to guess file types. |
| Duplicates (#14) | The same email can't be subscribed to the newsletter twice. |

New dependency: `email-validator` (needed for email checks), pinned in `requirements.txt`.
New file: `backend/.env.example`, which documents every setting.

### Frontend

| Problem | What was done |
|---|---|
| False success messages (#5) | Success is shown **only when the server confirms the data was saved**. Otherwise the user sees a clear message (connection problem, invalid data, or "too many attempts, wait a minute") and their form is kept so they can try again. |
| Hard-coded address (#6) | The backend address now comes from `VITE_API_URL` (see `frontend/.env.example`). A warning is logged if a production build does not use `https://`. All network logic is now in one place: `src/lib/api.js`. |
| Unchecked links (#12) | Links from the CSV files are only used if they start with `http://` or `https://`. Anything else is dropped. |
| Browser protections (#13) | Production builds now include a Content Security Policy. The browser will only run the site's own scripts, and will only send data to your own backend. Source maps (a readable copy of your source code) are not published. |
| Field lengths | Form inputs now have the same length limits as the server. |

### Images

| Problem | What was done |
|---|---|
| Hidden camera data (#11) | Removed the metadata (serial number, dates, camera info) from all 8 gallery photos. Only the hidden data block was removed; **the images themselves were not re-compressed and look exactly the same.** |

### How the changes were verified
- Automated tests against the backend: valid submissions, invalid emails, oversized messages, formula payloads, non-Tec emails marked as Tec, bot submissions, submission flooding, requests from other websites, and hidden docs pages all behaved as expected.
- A full production build was opened in a real browser, and the newsletter and contact forms were submitted. Data was saved correctly, dangerous input was neutralized, no images were broken, and the security policy did not block anything the site needs.
- Dependency scans (`npm audit`, `pip-audit`): no known vulnerabilities.

---

## 4. Actions needed from you

These can't be done from the code alone.

1. **Fix the missing team file (the site currently cannot be built from the repository).**
   `TeamSection.jsx` loads `src/data/team.json`, but the rule `**/data/` in `.gitignore` also hides that folder. The file was never uploaded, so anyone who clones the project gets a build error. Either move the file to a folder with a different name (for example `src/content/team.json`) or add an exception to `.gitignore`. Before uploading it, make sure it only contains information the team members agreed to make public.

2. **Configure production settings.**
   - Backend: copy `backend/.env.example` to `.env` and set `ALLOWED_ORIGINS` to your real domain. Set `DATA_DIR` to a folder outside the code, such as `/var/lib/wftf`. Start the server with `uvicorn app.main:app --env-file .env`.
   - Frontend: create `frontend/.env.production` with `VITE_API_URL=https://...` (your backend's address, **with https**).
   - If the backend runs behind a proxy or hosting platform (Render, Railway, Nginx…), start it with `--proxy-headers --forwarded-allow-ips="<proxy IP>"`. Otherwise every visitor looks like the same person and they will share one submission limit.

3. **Use HTTPS everywhere.** Both the website and the API must be served over `https://`. Most hosting platforms do this for free.

4. **Add a privacy notice (Aviso de Privacidad).** The site collects names and emails. Mexican law (LFPDPPP) requires telling users what you collect, why, who can see it, how long you keep it, and how they can ask for it to be deleted. The footer's "Términos y condiciones" link currently points to a section that doesn't exist. I did not add this text because it needs to reflect your organization's real practices. I recommend a short notice page and a line under each form linking to it.

5. **Photos in git history.** The old versions of the gallery photos (with the camera serial number) are still in the repository's history. The risk is low. If the repository is or will be public and you want them fully gone, the history would need to be rewritten. That is a disruptive operation for anyone else working on the repo, so I didn't do it without asking.

---

## 5. Recommendations to keep the site safe

**Handling the collected data**
- Treat the CSV files as confidential. Download them only to trusted devices, never share them in public chats or groups, and delete local copies when you're done.
- **Keep data only as long as you need it.** Delete RSVP lists after each event and remove newsletter subscribers who ask to leave.
- Back up the data folder regularly to a private, access-controlled location.
- Limit who has access to the server to the people who really need it.

**As the project grows (design changes worth considering later)**
- **Move from CSV files to a managed database** (for example PostgreSQL on your hosting provider, or Supabase). You get automatic backups, encryption, access control and easier deletion requests. CSV files are fine for a small club site, but they don't scale well and can't be encrypted easily.
- If the site starts sending emails (reminders, newsletters), use an established email service. Keep its API key only in the server's `.env`, never in the frontend or in git.
- If spam becomes a problem despite the current protections, add a CAPTCHA (for example Cloudflare Turnstile, which is free and privacy-friendly).
- Add the security headers `Strict-Transport-Security` and `X-Frame-Options: DENY` in your hosting provider's settings. They can't be set from inside the React app.

**Development habits**
- **Never commit `.env` files, passwords or API keys.** The `.gitignore` already protects `.env`. Keep it that way.
- Run `npm audit` and `pip-audit -r requirements.txt` every few months, and update dependencies when problems are reported.
- Only people you trust should be able to edit the content CSVs (`infoPOSTS.csv`, `infoCALENDARIO.csv`), because they control what appears on the site.
- Before uploading new photos, remove their hidden data (on Windows: *Properties → Details → Remove Properties and Personal Information*; on Mac, export from Preview without location info) or export them from an editor like Canva.
- Enable two-factor authentication on GitHub and on your hosting account. A stolen password there bypasses every protection in the code.
- The `next-app/` folder is an unused starter template. If you won't use it, delete it to keep the project smaller and easier to maintain.
