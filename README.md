# RibaClear

เปลี่ยนดอกเบี้ย (Riba) ให้เกิดประโยชน์กับสังคม — Shariah-compliant donation aggregator

## Deploy ใน 3 คำสั่ง

```bash
# 1. push ขึ้น GitHub
git init && git add . && git commit -m "init: RibaClear MVP"
git remote add origin https://github.com/YOUR_USERNAME/ribaclear.git
git push -u origin main

# 2. ติดตั้ง Vercel CLI (ถ้ายังไม่มี)
npm install -g vercel

# 3. Deploy
vercel --prod
```

Vercel จะถามชื่อ project และ link กับ GitHub repo อัตโนมัติ

## Structure

```
ribaclear/
├── public/
│   ├── index.html   # markup + semantic HTML
│   ├── style.css    # styles
│   └── app.js       # app logic (IIFE, strict mode)
├── vercel.json      # routing + security headers
└── .gitignore
```

## Security

- Content-Security-Policy header (ป้องกัน XSS)
- X-Frame-Options: DENY (ป้องกัน clickjacking)
- Referrer-Policy: no-referrer
- Strict-Transport-Security (HSTS)
- ไม่มี innerHTML กับ user input ทุกกรณี
- Amount validation ทั้ง client และควร validate ซ้ำ server-side ก่อน payment จริง
- ไม่มี external script ที่ไม่น่าเชื่อถือ
