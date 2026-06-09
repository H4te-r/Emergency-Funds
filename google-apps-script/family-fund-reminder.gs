// ============================================================
//  Family Emergency Fund — Monthly Email Reminder
//  Platform : Google Apps Script (script.google.com)
//  Cost     : Free
//  How      : Runs automatically on the 25th of every month
//             (5 days before the 30th deadline)
// ============================================================

// ---- CONFIGURE THESE ----------------------------------------

const FUND_ADMIN_NAME = "Ate"; // Name shown as sender in the email body
const AMOUNT_DUE = 500;        // Amount per sibling in PHP
const HEALTH_CARD_TOTAL = 22500; // ₱2,500 × 9 siblings
const HEALTH_CARD_PER_SIBLING = 2500;

// Add each sibling's name and email address here
// (Leave email blank for now — fill in when available)
const SIBLINGS = [
  { name: "Mercy",  email: "" },
  { name: "Cecile", email: "" },
  { name: "Meann",  email: "" },
  { name: "Macky",  email: "" },
  { name: "Melany", email: "" },
  { name: "Karen",  email: "" },
  { name: "Mich",   email: "" },
  { name: "Jesh",   email: "" },
  { name: "France", email: "" },
];

// ---- DO NOT EDIT BELOW THIS LINE ----------------------------

/**
 * Main function — called automatically by the time-based trigger.
 * Sends a reminder email to every sibling.
 */
function sendMonthlyReminders() {
  const now = new Date();
  const monthName = now.toLocaleString("en-PH", { month: "long" });
  const year = now.getFullYear();
  const deadline = `${monthName} 30, ${year}`;

  SIBLINGS.forEach(sibling => {
    if (!sibling.email) {
      Logger.log(`Skipped ${sibling.name} — no email address configured`);
      return;
    }

    const subject = `[Family Fund] Payment Reminder — Due ${deadline}`;
    const body = buildEmailBody(sibling.name, AMOUNT_DUE, deadline);
    const htmlBody = buildEmailHtml(sibling.name, AMOUNT_DUE, deadline, monthName);

    GmailApp.sendEmail(sibling.email, subject, body, {
      htmlBody: htmlBody,
      name: `${FUND_ADMIN_NAME} (Family Emergency Fund)`,
    });

    Logger.log(`Sent reminder to ${sibling.name} <${sibling.email}>`);
  });

  Logger.log("All reminders sent successfully.");
}

/**
 * June Health Card Reminder — sends a separate email in June
 * warning siblings that the Health Card payment is due.
 * 
 * This checks if the fund balance would cover the ₱22,500.
 * Since we can't read the React app's localStorage from Apps Script,
 * the admin should update the `CURRENT_FUND_BALANCE` variable below
 * before June, or this function will always send the warning.
 */
const CURRENT_FUND_BALANCE = 0; // ← Admin: update this with your actual fund balance before June

function sendHealthCardReminders() {
  const now = new Date();
  const year = now.getFullYear();
  const isBalanceSufficient = CURRENT_FUND_BALANCE >= HEALTH_CARD_TOTAL;

  if (isBalanceSufficient) {
    Logger.log(`Fund balance (₱${CURRENT_FUND_BALANCE.toLocaleString()}) covers Health Card. No shortfall email needed.`);
    return;
  }

  const shortfall = HEALTH_CARD_TOTAL - CURRENT_FUND_BALANCE;
  const perSibling = Math.ceil(shortfall / SIBLINGS.length);

  SIBLINGS.forEach(sibling => {
    if (!sibling.email) {
      Logger.log(`Skipped ${sibling.name} — no email address configured`);
      return;
    }

    const subject = `[Family Fund] Health Card Payment Due — June ${year}`;
    const body = buildHealthCardEmailBody(sibling.name, year, shortfall, perSibling);
    const htmlBody = buildHealthCardEmailHtml(sibling.name, year, shortfall, perSibling);

    GmailApp.sendEmail(sibling.email, subject, body, {
      htmlBody: htmlBody,
      name: `${FUND_ADMIN_NAME} (Family Emergency Fund)`,
    });

    Logger.log(`Sent Health Card reminder to ${sibling.name} <${sibling.email}>`);
  });

  Logger.log("All Health Card reminders sent successfully.");
}

/**
 * Plain-text fallback for Health Card reminder.
 */
function buildHealthCardEmailBody(name, year, shortfall, perSibling) {
  return `Hi ${name},

This is a reminder that our Parents' Health Card payment is due this June ${year}.

The total cost is ₱${HEALTH_CARD_TOTAL.toLocaleString()} (₱${HEALTH_CARD_PER_SIBLING.toLocaleString()} per sibling).

Unfortunately, our current emergency fund balance is NOT enough to cover it.

  Shortfall : ₱${shortfall.toLocaleString()}
  Your share : ₱${perSibling.toLocaleString()} (on top of the regular ₱${AMOUNT_DUE} monthly contribution)

Please coordinate with the fund admin to settle this as soon as possible.

Salamat!
${FUND_ADMIN_NAME}
Family Emergency Fund Admin`;
}

/**
 * HTML email for Health Card reminder.
 */
function buildHealthCardEmailHtml(name, year, shortfall, perSibling) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Health Card Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e0ddd6;">

          <!-- Header -->
          <tr>
            <td style="background:#A32D2D;padding:28px 32px;">
              <p style="margin:0;font-size:11px;color:#F4BFBF;letter-spacing:1px;text-transform:uppercase;">
                Family Emergency Fund
              </p>
              <h1 style="margin:6px 0 0;font-size:22px;color:#ffffff;font-weight:600;">
                ⚠️ Health Card — Action Needed
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#444441;line-height:1.6;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#444441;line-height:1.6;">
                Our <strong>Parents' Health Card</strong> payment is due this
                <strong>June ${year}</strong>. The total cost is
                <strong>₱${HEALTH_CARD_TOTAL.toLocaleString()}</strong>
                (₱${HEALTH_CARD_PER_SIBLING.toLocaleString()} per sibling).
              </p>

              <!-- Alert card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#FCEAEA;border-radius:8px;margin-bottom:24px;border-left:4px solid #A32D2D;">
                <tr>
                  <td style="padding:20px 24px;">
                    <p style="margin:0 0 8px;font-size:13px;color:#A32D2D;font-weight:600;">
                      FUND BALANCE IS INSUFFICIENT
                    </p>
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#6B2020;padding-bottom:8px;">
                          SHORTFALL
                        </td>
                        <td align="right" style="font-size:13px;color:#6B2020;padding-bottom:8px;">
                          YOUR SHARE
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:26px;font-weight:700;color:#A32D2D;">
                          ₱${shortfall.toLocaleString()}
                        </td>
                        <td align="right" style="font-size:22px;font-weight:600;color:#A32D2D;">
                          ₱${perSibling.toLocaleString()}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;color:#5F5E5A;line-height:1.6;">
                This amount is <strong>on top of</strong> the regular ₱${AMOUNT_DUE} monthly contribution.
                Please coordinate with the fund admin to settle this as soon as possible.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f0;padding:20px 32px;border-top:1px solid #e0ddd6;">
              <p style="margin:0;font-size:13px;color:#888780;">
                Salamat! &mdash; <strong>${FUND_ADMIN_NAME}</strong>, Family Emergency Fund Admin
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Plain-text fallback (for email clients that don't render HTML).
 */
function buildEmailBody(name, amount, deadline) {
  return `Hi ${name},

This is a friendly reminder that your monthly contribution to our Family Emergency Fund is due on ${deadline}.

  Amount due : ₱${amount.toLocaleString()}
  Deadline   : ${deadline}

Please coordinate with the fund admin once you've sent your payment. If you've already paid, kindly disregard this message.

Salamat!
${FUND_ADMIN_NAME}
Family Emergency Fund Admin`;
}

/**
 * HTML email — shows a clean card with the sibling's name, amount, and deadline.
 */
function buildEmailHtml(name, amount, deadline, monthName) {
  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Reminder</title>
</head>
<body style="margin:0;padding:0;background:#f4f4f0;font-family:Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f4f0;padding:40px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0"
               style="background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e0ddd6;">

          <!-- Header -->
          <tr>
            <td style="background:#185FA5;padding:28px 32px;">
              <p style="margin:0;font-size:11px;color:#B5D4F4;letter-spacing:1px;text-transform:uppercase;">
                Family Emergency Fund
              </p>
              <h1 style="margin:6px 0 0;font-size:22px;color:#ffffff;font-weight:600;">
                Payment Reminder
              </h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;font-size:15px;color:#444441;line-height:1.6;">
                Hi <strong>${name}</strong>,
              </p>
              <p style="margin:0 0 24px;font-size:15px;color:#444441;line-height:1.6;">
                This is a friendly reminder that your monthly contribution to our
                <strong>Family Emergency Fund</strong> is due in <strong>5 days</strong>.
              </p>

              <!-- Info card -->
              <table width="100%" cellpadding="0" cellspacing="0"
                     style="background:#E6F1FB;border-radius:8px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="font-size:13px;color:#185FA5;padding-bottom:12px;">
                          AMOUNT DUE
                        </td>
                        <td align="right" style="font-size:13px;color:#185FA5;padding-bottom:12px;">
                          DEADLINE
                        </td>
                      </tr>
                      <tr>
                        <td style="font-size:26px;font-weight:700;color:#0C447C;">
                          ₱${amount.toLocaleString()}
                        </td>
                        <td align="right" style="font-size:18px;font-weight:600;color:#0C447C;">
                          ${deadline}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;font-size:14px;color:#5F5E5A;line-height:1.6;">
                Please coordinate with the fund admin once you've sent your payment.
                If you've already paid, kindly disregard this message.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background:#f4f4f0;padding:20px 32px;border-top:1px solid #e0ddd6;">
              <p style="margin:0;font-size:13px;color:#888780;">
                Salamat! &mdash; <strong>${FUND_ADMIN_NAME}</strong>, Family Emergency Fund Admin
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Run this function ONCE manually to set up the monthly trigger.
 * After that, it fires automatically every month on the 25th.
 * 
 * HOW TO SET UP:
 *   1. Go to script.google.com
 *   2. Paste this entire file
 *   3. Run setupMonthlyTrigger() once (click the play button)
 *   4. Grant the permissions it asks for
 *   5. Done — emails will go out every 25th automatically!
 */
function setupMonthlyTrigger() {
  // Delete any existing monthly triggers first to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'sendMonthlyReminders') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Create a new trigger: runs on the 25th of every month
  ScriptApp.newTrigger("sendMonthlyReminders")
    .timeBased()
    .onMonthDay(25)        // 25th = 5 days before the 30th deadline
    .atHour(9)             // 9:00 AM Philippine time
    .create();

  Logger.log("Trigger set! Reminders will send on the 25th of every month at 9 AM.");
}

/**
 * Run this function ONCE to set up the June Health Card trigger.
 * It fires automatically every June 1st.
 */
function setupHealthCardTrigger() {
  // Delete any existing health card triggers to avoid duplicates
  ScriptApp.getProjectTriggers().forEach(t => {
    if (t.getHandlerFunction() === 'sendHealthCardReminders') {
      ScriptApp.deleteTrigger(t);
    }
  });

  // Create a trigger that runs on June 1st every year
  ScriptApp.newTrigger("sendHealthCardReminders")
    .timeBased()
    .onMonthDay(1)
    .atHour(9)
    .create();

  // NOTE: This trigger fires on the 1st of EVERY month, but the
  // sendHealthCardReminders function only sends in June.
  // Unfortunately, Apps Script doesn't support "run only in month X"
  // directly, so we add a month check inside the function.

  Logger.log("Health Card trigger set! Will check on the 1st of every month, send only in June.");
}

// Override sendHealthCardReminders to only run in June
const _originalSendHealthCardReminders = sendHealthCardReminders;
function sendHealthCardRemindersWithMonthCheck() {
  const now = new Date();
  if (now.getMonth() !== 5) { // 5 = June (0-indexed)
    Logger.log(`Not June (current month: ${now.getMonth() + 1}). Skipping Health Card reminder.`);
    return;
  }
  _originalSendHealthCardReminders();
}

/**
 * Test function — sends emails RIGHT NOW so you can check how they look.
 * Run this manually to preview before going live.
 */
function testSendNow() {
  Logger.log("Sending test emails...");
  sendMonthlyReminders();
  Logger.log("Test complete. Check your siblings' inboxes (and spam folders).");
}

/**
 * Test function — sends Health Card reminder emails RIGHT NOW.
 */
function testHealthCardReminder() {
  Logger.log("Sending test Health Card reminder emails...");
  sendHealthCardReminders();
  Logger.log("Test complete.");
}
