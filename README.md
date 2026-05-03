# RibaClear 🕌

**เปลี่ยนดอกเบี้ย (Riba) ให้เกิดประโยชน์กับสังคม**

RibaClear is a mobile-first donation platform that helps Muslims dispose of bank interest (Riba) correctly, according to Islamic law (Shariah). Instead of letting interest sit idle or being misused, RibaClear routes it to verified charitable causes across Southeast Asia.

🔗 **Live:** [ribaclear.vercel.app](https://ribaclear.vercel.app)

---

## The Problem

- 93% of Muslims acknowledge that Riba (bank interest) is forbidden (Haram)
- Most have no structured, trusted digital channel to dispose of it correctly
- Riba often ends up funding mosques or religious buildings — which is also not permitted
- No transparency on where the money actually goes

## The Solution

RibaClear is an aggregator that:
1. Lets donors choose verified causes (debt relief, education, healthcare, infrastructure)
2. Routes 100% of the donation to the selected organization
3. Charges operational fees to the receiving organization — not the donor
4. Provides a receipt and reference number for every transaction

---

## User Flow

```
Home → Select Organizations → Checkout → Payment → Success + Receipt
```

**Payment methods supported:**
- Thai QR Payment (PromptPay QR)
- PromptPay
- Bank Transfer (Bangkok Bank, Kasikorn, SCB, GSB)

---

## Shariah Compliance

| Riba CAN fund | Riba CANNOT fund |
|---|---|
| Debt relief | Mosques / masjids |
| Healthcare | Printing Quran |
| Education | Personal benefit |
| Roads & infrastructure | Religious ceremonies |
| Food security | |

> Donating Riba does not earn religious merit (thawab). It is an act of purification — removing Haram money from one's life in a responsible way.

All organizations on the platform are vetted by Islamic finance scholars before being listed.

---

## Tech Stack

- **Pure HTML/CSS/JS** — no framework dependencies, fast load on mobile
- **Hosted on Vercel** — global CDN, automatic HTTPS
- **No backend** — prototype stage; payment integration to be added

## Security

| Check | Status |
|---|---|
| No `innerHTML` with user input | ✅ All DOM via `textContent` / `createElement` |
| No `eval` or `document.write` | ✅ |
| Content-Security-Policy header | ✅ |
| X-Frame-Options: DENY | ✅ Clickjacking protection |
| HSTS (2 years + preload) | ✅ |
| Input sanitization & range clamp | ✅ 1–1,000,000 THB |
| No sensitive data in source | ✅ |
| No external untrusted scripts | ✅ |

---

## Project Structure

```
ribaclear/
├── public/
│   ├── index.html     # Semantic HTML, all screens
│   ├── style.css      # Mobile-first styles, CSS variables
│   └── app.js         # App logic (IIFE, strict mode, safe DOM)
├── vercel.json        # Routing + security headers
├── .gitignore
└── README.md
```

## Deploy

```bash
# Clone
git clone https://github.com/akaLEGO/ribaclear.git
cd ribaclear

# Deploy to Vercel
vercel login
vercel --prod
```

---

## Roadmap

- [ ] Real payment gateway integration (Omise / 2C2P)
- [ ] Bank API for auto-detecting interest balance
- [ ] Indonesia & Malaysia expansion
- [ ] Shariah scholar advisory board page
- [ ] Impact dashboard with real-time reporting
- [ ] White-label API for Islamic banks

---

## Business Model

RibaClear is **free for donors**. Revenue comes from organizations:

- **Org subscription fee** — verified NGOs pay a monthly SaaS fee to be listed
- **Platform service fee** — 5–8% deducted from the organization's payout (fully disclosed)
- **White-label API** — licensed to Islamic banks in TH/ID/MY (future)

---

## Contact

📧 contact@ribaclear.com  
🌐 ribaclear.com

*Supervised by Shariah scholars. Built for Southeast Asia's 280M+ Muslim population.*
