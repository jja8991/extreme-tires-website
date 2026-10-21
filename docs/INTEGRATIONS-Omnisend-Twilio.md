# Omnisend + Twilio wiring guide (for Justin)

Nothing in this system sends anything until you add the keys below. With no keys, the endpoints answer "not configured" and the site keeps working the old way.

This is a technical how-to, not legal advice. Have a lawyer review the consent wording and your texting practices before you go live.

## What each piece does

| Endpoint | What it does |
|---|---|
| `POST /api/subscribe` | Footer / offers signup. Adds the person to **Omnisend** as email-subscribed and/or SMS-subscribed, **only** for the channels they ticked. Stores the exact consent sentence, the time, and where they signed up. Never sends a text itself. |
| `POST /api/booking` | Appointment **request** (wizard, schedule, quote). Does up to three separate things, and one failing never blocks the others: (a) saves the contact in Omnisend with tag `booking-request` and the job details, (b) sends an immediate Twilio text saying "we got your request, we'll text to confirm" (only if they ticked the SMS box), (c) schedules a Twilio reminder text about 2 hours before the appointment window (only if SMS box ticked, and only within quiet hours). It never says the booking is confirmed. |
| `GET /api/health` | Shows which integrations are switched on, as true/false only. No secrets. |

Who owns what: **Omnisend = marketing** (offers, newsletters, marketing SMS). **Twilio = transactional** (the request-received text and the reminder). Don't send the same kind of message from both.

## Step 1: Add the keys in Vercel

1. Vercel dashboard -> the project -> **Settings -> Environment Variables**.
2. Add each variable below. Tick **Production** and **Preview**.
3. **Redeploy** (Deployments -> latest -> Redeploy). New variables only apply to new deployments.

| Variable | Where to get it | Required for |
|---|---|---|
| `OMNISEND_API_KEY` | Omnisend: Store settings -> Integrations & API -> API keys | Signup + booking contact saving |
| `TWILIO_ACCOUNT_SID` | Twilio Console dashboard (starts with `AC`) | Any Twilio text |
| `TWILIO_AUTH_TOKEN` | Twilio Console dashboard (secret) | Any Twilio text |
| `TWILIO_MESSAGING_SERVICE_SID` | Twilio: Messaging -> Services (starts with `MG`) | Reminders (required) and confirmation texts (preferred) |
| `TWILIO_FROM` | Your Twilio number, like `+19545550123` | Optional fallback for the immediate text only. Reminders cannot use it. |
| `ALLOWED_ORIGIN` | Your site address(es), comma-separated, e.g. `https://www.yoursite.com` | Optional. Blocks other websites from calling the API. Include any preview domain you test on. |

Never paste these keys into chat, email, or the code. `.env.example` in the repo lists the names only. Note: `.gitignore` did not list `.env` when this was written, so never create a real `.env` file inside the repo folder.

## Step 2: Twilio setup

1. Buy or port a local number (954 area code is fine) in Twilio.
2. **Messaging -> Services -> Create Messaging Service.** Name it "Extreme Tires".
3. In the service: **Sender Pool -> Add Senders -> Phone Number** and attach your number.
4. Copy the service SID (`MG...`) into `TWILIO_MESSAGING_SERVICE_SID`.
5. **A2P 10DLC registration (required for US business texting):** Twilio Console -> Messaging -> Regulatory Compliance (or Trust Hub) -> register your Brand, then a Campaign (use case such as "Customer care / account notifications" for the confirmation and reminder texts). Attach the campaign to the Messaging Service. **Wait for approval before sending real texts.** Unregistered traffic gets blocked or filtered, and approval can take days. Campaign review will ask for your opt-in wording and a link to the page with it; use the exact sentences below.
6. Leave Twilio's built-in STOP / HELP handling switched on (Messaging Service -> Opt-Out Management). Twilio then blocks further texts to anyone who replies STOP.

## Step 3: Omnisend setup

1. Make sure your Omnisend account is verified and your sending domain is authenticated for email.
2. **SMS:** enable SMS in Omnisend, complete its sender / country compliance steps (Omnisend has its own registration for US SMS sender numbers), and confirm the signup consent language is accepted. Without this, contacts are saved as SMS-subscribed but Omnisend will not deliver SMS campaigns.
3. Contacts arrive with tags `website-signup`, `source:<where>`, or `booking-request`. Build a segment or automation from those tags (for example a welcome series for `website-signup`).
4. Booking contacts are saved **not subscribed** to email. Booking an appointment is not permission for marketing email.

## Step 4: Test safely

1. Open `https://YOUR-SITE/api/health` after redeploying. You should see `omnisend`, `twilioSend`, `twilioScheduling` as `true` for what you configured. If something is `false`, that variable is missing in this environment (Production vs Preview).
2. Test on a **Preview** deployment first, using **your own phone number and email**.
3. Submit a booking with the SMS box ticked and an appointment 4 or more hours away, ideally tomorrow. You should get the "request received" text right away. In Twilio -> Monitor -> Logs -> Messaging you can see the scheduled reminder (status "scheduled"). In Omnisend, check the new contact, tags, and custom properties.
4. Reply STOP from your phone and confirm no more texts arrive; reply START to resume.
5. Submit once with the SMS box **unticked**: no text should be sent.
6. Only then go live on Production.

## Step 5: Flip the front-end switch

The site code has a config block with `ET.CONFIG.live`. Set `live:true` in the config block, flagged by the lead (the lead is adding it). While it is `false`, the forms don't call these endpoints.

## What the forms say (consent wording)

These exact sentences are shown beside the checkboxes and are saved with each signup (`consentText`):

- **SMS (signup):** "By checking this box you agree to receive texts from Extreme Tires about your request and offers. Msg & data rates may apply. Message frequency varies. Reply STOP to opt out, HELP for help. Consent is not a condition of purchase."
- **SMS (booking):** same sentence with "...texts from Extreme Tires about your appointment request and offers..." instead.
- **Email:** "I agree to receive marketing emails from Extreme Tires. Unsubscribe anytime."

If you change the wording, change it in the site and re-submit it for Twilio campaign review.

## Compliance checklist

- [ ] Checkboxes are **unticked by default** and separate for email and SMS. Consent is not required to submit a booking.
- [ ] Consent sentence, timestamp, and source are stored on every contact (done by the API).
- [ ] STOP and HELP work (Twilio handles it on the Messaging Service; keep it enabled). The texts themselves say "Reply STOP to opt out".
- [ ] Quiet hours: reminders are only scheduled between 8:00 AM and 8:00 PM Eastern. The immediate "request received" text is a reply to something the person just did, so it goes right away. Keep marketing sends from Omnisend inside local-time windows too (watch recipients in other time zones).
- [ ] No double texting: Omnisend sends marketing, Twilio sends the booking confirmation and reminder only. Do not build an Omnisend automation that also texts on `booking-request`.
- [ ] No prices in automated texts; texts never say "confirmed" (a human confirms).
- [ ] A2P 10DLC brand and campaign approved before real traffic.
- [ ] Privacy policy page mentions texting and email, linked near the forms.
- [ ] Counsel reviewed the wording (TCPA and Florida rules, including Florida's telephone solicitation law, are the usual concerns).

## Technical safeguards built in

Honeypot field (`website`) silently ignored; optional origin check; roughly 8 requests per 10 minutes per visitor (best effort: it lives in server memory, and serverless instances reset, so treat it as a speed bump, not a guarantee); 8 second timeout on every provider call; phone numbers must be valid US numbers; secrets are read only from environment variables and never logged or returned; log lines have emails and phone numbers masked. Texts use plain GSM characters; the confirmation text is about two SMS segments long.

## API details to re-verify against current docs when wiring

This code was written from memory with no internet access. Check each item in the live Omnisend and Twilio docs before launch:

1. **Omnisend contacts endpoint and version.** Code uses `POST https://api.omnisend.com/v3/contacts` with header `X-API-KEY`. Confirm v3 is still supported (newer versions may exist) and whether POST **updates** an existing contact instead of returning a conflict error.
2. **Omnisend identifier shape.** Code sends `identifiers: [{type:'email'|'phone', id, channels:{email|sms:{status, statusDate}}}]`. Confirm field names, that phone IDs accept `+1XXXXXXXXXX`, and the status values `subscribed` / `nonSubscribed` / `unsubscribed`.
3. **Omnisend extras.** `tags` as an array of strings, `customProperties` key naming and allowed value types, `firstName` / `lastName` at top level. Confirm whether `sendWelcomeMessage` or double opt-in settings in your account change behavior.
4. **Omnisend SMS consent.** Whether the API accepts SMS subscription without extra consent fields (some versions want a consent source / custom consent text) and any sender registration prerequisites.
5. **Twilio Messages API.** `POST https://api.twilio.com/2010-04-01/Accounts/{AccountSid}/Messages.json`, form fields `To`, `Body`, `MessagingServiceSid` or `From`, Basic auth `AccountSid:AuthToken`.
6. **Twilio Message Scheduling.** Fields `ScheduleType=fixed`, `SendAt` (ISO-8601 UTC), requires `MessagingServiceSid`, allowed window 15 minutes to 35 days ahead. The code requires about 16 minutes minimum for margin. Confirm limits, and whether scheduling is billed or limited differently on your plan.
7. **Twilio STOP behavior on scheduled messages** (a message scheduled before someone opts out should be blocked at send time; verify), and quiet-hours / "Smart Encoding" options in the Messaging Service settings.
8. **A2P 10DLC** campaign use-case names and current fees / review times.
9. **Vercel.** Root `api/*.js` as Node functions with `module.exports = async (req,res)`, automatic JSON body parsing, files starting with `_` not routed, default function timeout, and that Node 22 is selected.

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `/api/health` shows `false` | Variable missing in that environment, or no redeploy yet | Add it for Production and Preview, redeploy |
| Form returns "not configured" (503) | No keys at all, or Twilio missing a sender | Add `OMNISEND_API_KEY` and/or Twilio SID + token + Messaging Service SID |
| 502 `provider_error` | Provider rejected the call (bad key, account limit, unverified account) | Check Vercel -> Logs for the `[omnisend]` / `[twilio]` line (status and code only); check key and account status |
| Text never arrives, Twilio log says filtered / error 30034 or 30007 | A2P 10DLC not approved or content filtered | Finish registration, wait for approval |
| Twilio error 21610 | The person replied STOP | Expected; they must text START |
| Twilio error 21211 | Phone number not valid | Check the number entered |
| Confirmation sent, no reminder | Appointment under 2.5 hours away or over 35 days, no `TWILIO_MESSAGING_SERVICE_SID`, no start time, or no allowed send time inside 8 AM to 8 PM | See `reasons.reminder` in the API response (visible in the browser network tab) |
| Reminder time looks different from 2 hours before | Quiet-hours adjustment to 8 AM / 8 PM Eastern | Working as designed |
| Contact in Omnisend but not receiving SMS | Omnisend SMS not enabled or sender not registered | Finish Omnisend SMS setup |
| 403 `origin_not_allowed` | `ALLOWED_ORIGIN` does not include the site address you are testing from | Add it (comma-separated), redeploy |
| 429 `rate_limited` | Too many submits from one connection | Wait 10 minutes |
| Nothing happens and no error | Honeypot filled (some browser autofill tools fill hidden fields) | Make sure the hidden `website` field is truly hidden and `autocomplete="off"` |

## For developers

Run the tests (no install needed, Node 22): `node --test tests/*.test.js` or `sh tests/run.sh`.
