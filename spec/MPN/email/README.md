# Email Notifications

Emails sent via [Resend](https://resend.com). Supabase Auth handles its own verification and password-reset emails natively — Resend is used for all custom application emails.

---

## Setup

```ts
// lib/email.ts
import { Resend } from 'resend'
const resend = new Resend(process.env.RESEND_API_KEY)

export async function sendEmail({ to, subject, html }: { to: string | string[], subject: string, html: string }) {
  return resend.emails.send({
    from: 'MPN <mpn@sunwayplanetaryhealth.com>',
    to,
    subject,
    html,
  })
}
```

---

## Email Triggers

| # | Trigger | To | Subject |
|---|---------|-----|---------|
| 1 | User submits registration | New user | *(Supabase Auth native — verify your email)* |
| 2 | User verifies email | Admin(s) | New pending MPN member: {name} |
| 3 | Admin approves member | New member | Welcome to the Media Professional Network |
| 4 | Admin rejects member | Applicant | Your MPN application |
| 5 | Admin sends announcement | Target audience | {announcement title} |
| 6 | Publication approved | Author | Your publication is live on MPN |
| 7 | New reply on own café thread | Thread author | New reply in: {thread title} |

---

## Template: New Pending Member (→ Admin)

```html
<h2>New MPN Application</h2>
<p><strong>{full_name}</strong> from {organisation} ({country}) has registered and is awaiting approval.</p>
<p>Workshop attended: Workshop {number} — {title}</p>
<a href="{SITE_URL}/community/mpn/admin/members">Review in Admin Dashboard →</a>
```

---

## Template: Welcome Email (→ New Member)

```html
<h2>Welcome to the Media Professional Network</h2>
<p>Hi {first_name},</p>
<p>Your application has been approved. You now have full access to the MPN portal.</p>
<a href="{SITE_URL}/community/mpn/login">Access the Portal →</a>
<hr>
<p>The MPN is your private space to access SCPH research, connect with fellow journalists, and publish your work.</p>
```

---

## Template: Rejection Email (→ Applicant)

```html
<h2>Your MPN Application</h2>
<p>Hi {first_name},</p>
<p>Thank you for applying to the Media Professional Network. Unfortunately, we are unable to approve your application at this time.</p>
{#if reason}<p>Reason: {reason}</p>{/if}
<p>If you believe this is an error, please contact us at mpn@sunwayplanetaryhealth.com.</p>
```

---

## Template: Publication Approved (→ Author)

```html
<h2>Your publication is live</h2>
<p>Hi {first_name},</p>
<p>Your submission "<strong>{title}</strong>" has been approved and is now visible in the MPN Publications catalogue.</p>
<a href="{SITE_URL}/community/mpn/publications/{id}">View your publication →</a>
```

---

## Template: Announcement (→ Members)

```html
<h2>{announcement.title}</h2>
<div>{announcement.body}</div>
<hr>
<p style="color: #64748b; font-size: 0.8rem;">
  You received this because you are a member of the SCPH Media Professional Network.
</p>
```

---

## Audience Resolution (Announcements)

The `announcements.audience` field determines the recipient list:

| Value | Recipients |
|-------|-----------|
| `all` | All profiles with `role = 'member'` |
| `workshop:1` | Members whose `workshop_id` matches workshop number 1 |
| `country:MY` | Members with `country = 'MY'` |

```ts
// Resolve recipients
async function resolveAudience(audience: string): Promise<string[]> {
  let query = supabase.from('profiles').select('email').eq('role', 'member')

  if (audience.startsWith('workshop:')) {
    const workshopNumber = parseInt(audience.split(':')[1])
    const { data: workshop } = await supabase
      .from('workshops').select('id').eq('number', workshopNumber).single()
    if (workshop) query = query.eq('workshop_id', workshop.id)
  } else if (audience.startsWith('country:')) {
    query = query.eq('country', audience.split(':')[1])
  }

  const { data } = await query
  return (data ?? []).map(p => p.email)
}
```

Resend supports batch sending up to 100 emails per API call. For larger audiences, chunk the list:

```ts
const BATCH_SIZE = 100
for (let i = 0; i < emails.length; i += BATCH_SIZE) {
  await sendEmail({ to: emails.slice(i, i + BATCH_SIZE), subject, html })
}
```

---

## Café Reply Notifications

To avoid email spam, café reply notifications use a digest approach (optional, v2):

**v1:** No automated reply notifications — the real-time feed in the browser is the notification mechanism.  
**v2:** Daily digest email if the user hasn't visited in 24 hours (requires tracking last_seen_at in profiles).
