/**
 * RibaClear — App Logic
 * Security notes:
 *  - No innerHTML with user input (XSS prevention)
 *  - Amount validated server-side in production; client enforces range
 *  - No external API calls; no data leaves the browser in this prototype
 *  - All DOM manipulation via textContent / createElement (safe)
 */

const App = (() => {
  'use strict';

  // ── State ─────────────────────────────────
  const state = {
    selectedOrgs: new Set(),
    amount: 0,
    payMethod: 'Thai QR Payment',
  };

  // ── Screen navigation ─────────────────────
  function show(id) {
    document.querySelectorAll('.screen').forEach(s => {
      s.classList.remove('active');
    });
    const target = document.getElementById(`screen-${id}`);
    if (target) {
      target.classList.add('active');
      // scroll to top of new screen
      target.scrollTop = 0;
      window.scrollTo(0, 0);
    }
  }

  // ── Org selection ─────────────────────────
  function toggleOrg(card) {
    const name = card.dataset.name;
    if (!name) return;

    if (state.selectedOrgs.has(name)) {
      state.selectedOrgs.delete(name);
      card.classList.remove('selected');
      card.setAttribute('aria-checked', 'false');
    } else {
      state.selectedOrgs.add(name);
      card.classList.add('selected');
      card.setAttribute('aria-checked', 'true');
    }

    const btn = document.getElementById('btn-next');
    const hasSelection = state.selectedOrgs.size > 0;
    btn.disabled = !hasSelection;
  }

  // ── Checkout ──────────────────────────────
  function goCheckout() {
    if (state.selectedOrgs.size === 0) return;

    const container = document.getElementById('summary-orgs');
    

    // Clear container safely then build rows
    container.replaceChildren();
    document.querySelectorAll('.org-card.selected').forEach(card => {
      const icon = card.dataset.icon || '';
      const name = card.dataset.name || '';

      const row = document.createElement('div');
      row.className = 'summary-org';

      const iconEl = document.createElement('div');
      iconEl.className = 's-icon';
      iconEl.setAttribute('aria-hidden', 'true');
      iconEl.textContent = icon;          // textContent — safe

      const nameEl = document.createElement('span');
      nameEl.className = 's-name';
      nameEl.textContent = name;          // textContent — safe

      row.appendChild(iconEl);
      row.appendChild(nameEl);
      container.appendChild(row);
    });

    const splitInfo = document.getElementById('split-info');
    splitInfo.hidden = state.selectedOrgs.size <= 1;

    updateSplit();
    show('checkout');
  }

  // ── Amount helpers ────────────────────────
  function updateSplit() {
    const raw = document.getElementById('amount-input').value;
    const amt = sanitizeAmount(raw);
    state.amount = amt;

    const n = state.selectedOrgs.size || 1;
    const splitEl = document.getElementById('split-amt');
    const totalEl = document.getElementById('total-amt');

    if (splitEl) {
      splitEl.textContent = amt > 0
        ? `฿${formatNum(Math.round(amt / n))}/องค์กร`
        : '—';
    }
    if (totalEl) {
      totalEl.textContent = amt > 0 ? `฿${formatNum(amt)}` : '฿0';
    }
  }

  function setAmt(n) {
    const input = document.getElementById('amount-input');
    input.value = n;
    state.amount = n;

    document.querySelectorAll('.preset').forEach(p => {
      const val = parseInt(p.textContent.replace(',', ''), 10);
      p.classList.toggle('picked', val === n);
    });
    updateSplit();
  }

  // ── Payment method ────────────────────────
  function pickPay(card) {
    document.querySelectorAll('.pay-card').forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });
    card.classList.add('selected');
    card.setAttribute('aria-checked', 'true');
    state.payMethod = card.dataset.method || 'Thai QR Payment';
  }

  // ── Confirm & Success ─────────────────────
  function goPay() {
    const amt = state.amount;
    if (amt <= 0) {
      // Graceful: focus amount field
      document.getElementById('amount-input').focus();
      return;
    }

    const names = [...state.selectedOrgs];

    // Populate receipt — all textContent (safe)
    document.getElementById('success-amt').textContent =
      `฿${formatNum(amt)}`;

    document.getElementById('success-to').textContent =
      names.length > 1
        ? `${names.length} องค์กร`
        : (names[0] || '—');

    document.getElementById('rc-ref').textContent =
      generateRef();

    document.getElementById('rc-date').textContent =
      new Date().toLocaleDateString('th-TH', {
        year: 'numeric', month: 'long', day: 'numeric',
      });

    document.getElementById('rc-method').textContent = state.payMethod;

    show('success');
  }

  // ── Reset ─────────────────────────────────
  function reset() {
    state.selectedOrgs.clear();
    state.amount = 0;
    state.payMethod = 'Thai QR Payment';

    document.querySelectorAll('.org-card').forEach(c => {
      c.classList.remove('selected');
      c.setAttribute('aria-checked', 'false');
    });

    document.getElementById('btn-next').disabled = true;

    const input = document.getElementById('amount-input');
    if (input) input.value = '';

    document.querySelectorAll('.preset').forEach(p => p.classList.remove('picked'));

    // Reset payment to first option
    const firstPay = document.querySelector('.pay-card');
    if (firstPay) {
      document.querySelectorAll('.pay-card').forEach(c => {
        c.classList.remove('selected');
        c.setAttribute('aria-checked', 'false');
      });
      firstPay.classList.add('selected');
      firstPay.setAttribute('aria-checked', 'true');
    }

    show('home');
  }

  // ── Helpers ───────────────────────────────

  /**
   * Sanitize amount input
   * - Must be a number
   * - Min 1, Max 1,000,000 (server should re-validate)
   */
  function sanitizeAmount(raw) {
    const n = parseFloat(raw);
    if (!isFinite(n) || n < 0) return 0;
    return Math.min(Math.floor(n), 1_000_000);
  }

  function formatNum(n) {
    return n.toLocaleString('th-TH');
  }

  function generateRef() {
    // Non-cryptographic, client-side only — replace with server token in production
    const ts = Date.now().toString(36).toUpperCase();
    const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
    return `RC-${ts}-${rnd}`;
  }

  // ── Keyboard accessibility ─────────────────
  document.addEventListener('keydown', e => {
    const el = e.target;

    // Allow Enter/Space to activate org cards and pay cards
    if ((e.key === 'Enter' || e.key === ' ') && el.classList.contains('org-card')) {
      e.preventDefault();
      toggleOrg(el);
    }
    if ((e.key === 'Enter' || e.key === ' ') && el.classList.contains('pay-card')) {
      e.preventDefault();
      pickPay(el);
    }
  });

  // ── Public API ────────────────────────────
  return { show, toggleOrg, goCheckout, updateSplit, setAmt, pickPay, goPay, reset };
})();
