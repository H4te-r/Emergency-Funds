# 📧 Google Apps Script — Email Reminder Setup Guide

> **Time needed:** ~5 minutes  
> **Cost:** Free forever  
> **What it does:** Automatically emails each sibling on the 25th of every month reminding them to pay ₱500 by the 30th.

---

## Step 1 — Open Google Apps Script

1. Go to **[script.google.com](https://script.google.com)** and sign in with your sister's Gmail.

---

## Step 2 — Paste the Script

1. Click **"New project"**
2. Delete the default code that appears (`function myFunction() { }`)
3. Open the file `google-apps-script/family-fund-reminder.gs` from this project
4. **Copy the entire contents** and paste it into the Apps Script editor

---

## Step 3 — Fill in the Emails

At the top of the script, you'll see this section:

```javascript
const SIBLINGS = [
  { name: "Mercy",  email: "mercy@gmail.com" },
  { name: "Cecile", email: "cecile@gmail.com" },
  { name: "Meann",  email: "meann@gmail.com" },
  { name: "Macky",  email: "macky@gmail.com" },
  { name: "Melany", email: "melany@gmail.com" },
  { name: "Karen",  email: "karen@gmail.com" },
  { name: "Mich",   email: "mich@gmail.com" },
  { name: "Jesh",   email: "jesh@gmail.com" },
  { name: "France", email: "france@gmail.com" },
];
```

**Replace each `@gmail.com`** with the real email of each sibling.

---

## Step 4 — Run Setup (One Time Only)

1. In the **function dropdown** at the top of the editor, select **`setupMonthlyTrigger`**
2. Click the **▶ Play** button
3. A dialog will ask for permissions — click **"Review Permissions"**
4. Choose the Gmail account
5. If you see "Google hasn't verified this app", click **"Advanced"** → **"Go to Untitled project (unsafe)"**
6. Click **"Allow"**

✅ **That's it!** The trigger is now set forever.

---

## Step 5 — Test It First

1. In the function dropdown, select **`testSendNow`**
2. Click **▶ Play** to send a test batch right away
3. Check your siblings' inboxes (and spam folders) to see how the emails look

---

## What Happens Automatically After Setup

| Detail | Value |
|--------|-------|
| **When** | Every **25th** of the month at **9:00 AM** (Philippine time) |
| **Who** | Each sibling gets a personalized email with their name |
| **Amount** | ₱500 per sibling |
| **Deadline** | The 30th of that month (e.g., "January 30, 2026") |
| **Cost** | Free — uses your Gmail quota (~100 emails/day) |
| **Maintenance** | None needed |

---

## Checking Logs

You can check if emails were sent anytime:

1. Go to [script.google.com](https://script.google.com)
2. Open your project
3. Click **"Executions"** in the left sidebar
4. You'll see a log of every time the script ran and whether it succeeded

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Emails going to spam | Ask siblings to mark the first email as "Not Spam" |
| Script not running | Check Triggers (clock icon in the sidebar) — make sure the trigger exists |
| Permission errors | Run `setupMonthlyTrigger` again and re-accept permissions |
| Want to change the send date | Edit `.onMonthDay(25)` to another day (e.g., `.onMonthDay(20)`) |
| Want to change the time | Edit `.atHour(9)` to another hour (e.g., `.atHour(8)` for 8 AM) |
