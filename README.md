# BRO KOREA website — brokorea.com

Static website (plain HTML/CSS/JS) in English and Arabic, hosted on GitHub Pages.

- English pages are in the main folder. Arabic pages (right-to-left) are in `ar/`.
- The quote form sends requests to **info@brokorea.com** through Web3Forms (free plan).
- Photos: see [`images/README.md`](images/README.md) for the exact file names to upload.

## Going live: step by step

### 1. Put the website on the `main` branch
The website was built on the branch `claude/dreamy-cerf-vm6ox4`.
1. Open https://github.com/mohamedzaynalabedyn-source/brokorea-website
2. If you see a yellow bar saying *"claude/dreamy-cerf-vm6ox4 had recent pushes"*, click
   **Compare & pull request**. If you don't see it, click **Pull requests** → **New pull request**,
   choose `base: main` and `compare: claude/dreamy-cerf-vm6ox4`.
3. Click **Create pull request**, then **Merge pull request** → **Confirm merge**.

### 2. Turn on GitHub Pages
1. In the repository, click **Settings** (top menu) → **Pages** (left menu).
2. Under **Build and deployment** → **Source**, choose **Deploy from a branch**.
3. Under **Branch**, choose **main** and **/ (root)**, then click **Save**.
4. Under **Custom domain**, type `brokorea.com` and click **Save**. (It may already be filled in,
   because the `CNAME` file in this repository sets it.)

### 3. Connect brokorea.com in your domain's DNS (keep email working)
Log in where you bought the domain (for example GoDaddy, Namecheap, Gabia or Cafe24) and open
**DNS settings / DNS management** for brokorea.com.

**Do NOT change or delete these records. They make info@brokorea.com work:**
- all **MX** records
- any **TXT** records containing `v=spf1`, `google-site-verification`, `DKIM`/`domainkey`, or `_dmarc`
- any records with names like `mail`, `autodiscover`, `smtp`, `imap`, `pop`

**Add or change only these:**

| Type | Name / Host | Value / Points to |
|---|---|---|
| A | `@` | `185.199.108.153` |
| A | `@` | `185.199.109.153` |
| A | `@` | `185.199.110.153` |
| A | `@` | `185.199.111.153` |
| AAAA | `@` | `2606:50c0:8000::153` |
| AAAA | `@` | `2606:50c0:8001::153` |
| AAAA | `@` | `2606:50c0:8002::153` |
| AAAA | `@` | `2606:50c0:8003::153` |
| CNAME | `www` | `mohamedzaynalabedyn-source.github.io` |

- If there are already **A** records for `@` pointing somewhere else (an old website or a
  "parking" page), delete **only those A records**, then add the four above.
- If there is already a `www` record, edit it so it becomes the CNAME above.
- If your registrar has "Domain forwarding" or "Parked page" switched on, switch it off.
- The AAAA records are recommended. If your provider doesn't support them, you can skip them.
- DNS changes usually take 10 minutes to a few hours, and sometimes up to 24 hours.

### 4. Turn on HTTPS
1. Go back to **Settings → Pages**. Wait until it shows *"DNS check successful"*.
2. Tick **Enforce HTTPS**. If the box is greyed out, GitHub is still creating the
   certificate. Wait up to 24 hours and try again.
3. Open https://brokorea.com and https://www.brokorea.com. Both should show the site with a padlock.

Optional (recommended): verify the domain so nobody else can claim it on GitHub.
Click your profile photo → **Settings** → **Pages** → **Add a domain** → `brokorea.com`.
GitHub shows a **TXT** record. Add it in your DNS (this does not affect email), then click **Verify**.

### 5. Set up the quote form (Web3Forms, free)
1. Go to https://web3forms.com and click **Create your Access Key**.
2. Enter `info@brokorea.com` and submit. The access key (a long code like
   `a1b2c3d4-...`) is emailed to info@brokorea.com.
3. In this repository, open `assets/js/form-config.js` and click the pencil icon (**Edit**).
4. Replace `PASTE_YOUR_WEB3FORMS_ACCESS_KEY_HERE` with your key. Keep the quote marks:
   ```js
   web3formsAccessKey: "a1b2c3d4-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
   ```
5. Click **Commit changes**. Wait about 2 minutes, then send a test request from
   https://brokorea.com/quote.html. Check info@brokorea.com, including the spam folder the
   first time, and mark it "Not spam".

Free plan facts: 250 submissions per month, and **no file attachments**. That's why the
form has an **"Email my Excel / PDF list"** button, which opens the buyer's email app with the
subject line already filled in. Until the key is added, the form tells visitors to email or
WhatsApp you instead, so no request is lost.

## Editing text later
Each page is a normal `.html` file (English in the main folder, Arabic in `ar/`). Open the file
on GitHub, click the pencil icon, change the text and commit. Remember to update both languages.
