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

### 6. Turn on spam protection (hCaptcha, free)
Today the form has two layers of spam protection. Web3Forms runs its own spam filter on its servers,
and the form has a hidden "honeypot" trap that only works inside the browser. hCaptcha adds a check
that a person filled in the form. According to the Web3Forms documentation, its servers verify that check
once it is enabled in the dashboard. Tests 4 and 5 below confirm this. The website code for it is ready but
switched off (`hcaptcha: false` in `assets/js/form-config.js`).

Follow the stages in this order. **Real submissions** are marked: each one sends a request to
Web3Forms. Put "TEST" in the name so you can recognise them in info@brokorea.com.

**Stage A: publish the security changes (hCaptcha stays off)**
1. Merge the security changes. GitHub Pages publishes them in about 2 minutes.
2. Open https://brokorea.com and https://brokorea.com/ar/ and check that the site looks and works as before.
3. **Real submission 1:** send the English form with the name "TEST 1". Expect the thank-you page and an
   email at info@brokorea.com.

**Stage B: switch hCaptcha on in the website (the Web3Forms dashboard is still off)**
4. In `assets/js/form-config.js`, change `hcaptcha: false` to `hcaptcha: true` and commit. Wait about 2 minutes.
5. Open the English and Arabic quote pages in a private window. An "I am human" check should appear above the
   send button.
6. Missing-check test (nothing is sent): fill in the form and press send without ticking the check. Expect
   "Please complete the security check before sending." (in Arabic on the Arabic page).
7. Expired-check test (nothing is sent): tick the check, wait 3 minutes without sending, and expect
   "The security check expired. Please complete it again." Then press send: it is blocked.
8. **Real submission 2:** tick the check and send the English form with the name "TEST 2". Expect the
   thank-you page and an email. This shows the form still delivers when it includes the check.

**Stage C: enforce hCaptcha in Web3Forms (at least 10 minutes after step 4)**
Browsers can keep the old form for up to 10 minutes, so wait before this stage.
9. Log in at https://app.web3forms.com and open the form for info@brokorea.com. Choose **hCaptcha** as the
   spam protection (the "Block spam" / captcha setting), then save.
10. **Real submission 3:** on the Arabic form, tick the check and send with the name "TEST 3". Expect the
    thank-you page and an email: a valid check is accepted.
11. **Server test 4, missing check (should be rejected):** on https://brokorea.com/quote.html open the browser
    console (Chrome: right-click → Inspect → Console; you may have to type `allow pasting` first). Paste this
    and press Enter:
    ```js
    fetch("https://api.web3forms.com/submit", {method: "POST", headers: {"Content-Type": "application/json", "Accept": "application/json"}, body: JSON.stringify(Object.assign({access_key: BROKOREA_FORM.web3formsAccessKey, name: "Security test", email: "info@brokorea.com", "Form language": "English", "Parts list": "Server-side CAPTCHA test. This message should NOT arrive."}, {subject: "TEST - missing captcha token - please ignore"}))}).then(function (r) { return r.json(); }).then(function (j) { console.log("RESULT: success = " + j.success + " | " + j.message); }).catch(function (e) { console.log("RESULT: request failed: " + e); });
    ```
    Expect `RESULT: success = false` and **no** email. If you see `success = true`, or an email arrives,
    enforcement is not working. Check the setting from step 9, and contact Web3Forms support if it still fails.
12. **Server test 5, expired check (should be rejected):** reload the page, tick the check, then paste:
    ```js
    window.bkTestToken = document.querySelector('[name="h-captcha-response"]').value; console.log(window.bkTestToken ? "Token saved. Wait at least 3 minutes, then run step 2." : "Complete the I am human check first.");
    ```
    Wait at least 3 minutes, then paste:
    ```js
    fetch("https://api.web3forms.com/submit", {method: "POST", headers: {"Content-Type": "application/json", "Accept": "application/json"}, body: JSON.stringify(Object.assign({access_key: BROKOREA_FORM.web3formsAccessKey, name: "Security test", email: "info@brokorea.com", "Form language": "English", "Parts list": "Server-side CAPTCHA test. This message should NOT arrive."}, {subject: "TEST - expired captcha token - please ignore", "h-captcha-response": window.bkTestToken}))}).then(function (r) { return r.json(); }).then(function (j) { console.log("RESULT: success = " + j.success + " | " + j.message); }).catch(function (e) { console.log("RESULT: request failed: " + e); });
    ```
    Expect `RESULT: success = false` and **no** email.

Real submissions 1–3 should each deliver one email. Tests 4 and 5 should deliver nothing.

**Turning it off or rolling back**
- If real enquiries fail after step 9: first switch hCaptcha **off in the Web3Forms dashboard**. This takes
  effect immediately. Then set `hcaptcha: false` and commit. Never do it the other way round, or the live form
  rejects every request until both are off.
- If the check does not appear in step 5: set `hcaptcha: false` again. The dashboard is still off, so nothing
  else is affected.
- If the site misbehaves after stage A: on GitHub, open the merged pull request, click **Revert** and merge
  the revert pull request. The site returns to the previous version in about 2 minutes. If hCaptcha is on in the
  Web3Forms dashboard at that point, switch it off there first.

## Editing text later
The pages are generated from the files in `generator/`: the text is in `generator/content.py` and the
page layouts are in `generator/build.py`. Change the text there and run `python3 generator/build.py`,
then commit the generator change together with the updated pages. See
[`generator/README.md`](generator/README.md). If you edit an `.html` file directly on GitHub, make the
same change in `generator/content.py`, or the next run of the generator will undo it. Remember to update
both languages (English in the main folder, Arabic in `ar/`).
