/**
 * Bruggeman Digital — Vanilla JS Interactions, Smooth Anchor Scrolling & Form Wiring
 * Zero dependencies, ultra-fast execution.
 */

document.addEventListener('DOMContentLoaded', () => {
  const CALL_SUBJECT = 'Vrijblijvende kennismaking (30 min)';

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // 1. Mobile Navigation Toggle & Escape Handling
  const mobileBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileIcon = document.getElementById('mobile-menu-icon');

  function setMobileMenuOpen(open) {
    if (!mobileMenu || !mobileBtn) return;
    mobileMenu.classList.toggle('is-open', open);
    mobileBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    mobileBtn.setAttribute('aria-label', open ? 'Menu sluiten' : 'Menu openen');
    if (mobileIcon) {
      mobileIcon.innerHTML = open
        ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>'
        : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/>';
    }
  }

  if (mobileBtn && mobileMenu) {
    mobileBtn.addEventListener('click', () => {
      const nextState = !mobileMenu.classList.contains('is-open');
      setMobileMenuOpen(nextState);
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('is-open')) {
        setMobileMenuOpen(false);
        mobileBtn.focus();
      }
    });
  }

  // 1b. Interactive Hero Visual Stage Tabs (WAI-ARIA compliant + Arrow/Home/End keyboard nav)
  const stageTabs = Array.from(document.querySelectorAll('[data-stage-tab]'));
  const stagePanels = Array.from(document.querySelectorAll('[data-stage-panel]'));
  if (stageTabs.length > 0 && stagePanels.length > 0) {
    function activateStageTab(tab, focusTab = false) {
      const target = tab.getAttribute('data-stage-tab');
      stageTabs.forEach((t) => {
        const active = t === tab;
        t.classList.toggle('is-active', active);
        t.setAttribute('aria-selected', active ? 'true' : 'false');
        t.setAttribute('tabindex', active ? '0' : '-1');
      });
      stagePanels.forEach((p) => {
        const active = p.getAttribute('data-stage-panel') === target;
        p.classList.toggle('is-active', active);
        p.hidden = !active;
      });
      if (focusTab) tab.focus();
    }

    stageTabs.forEach((tab, idx) => {
      tab.addEventListener('click', () => activateStageTab(tab, false));
      tab.addEventListener('keydown', (e) => {
        let nextIdx = null;
        if (e.key === 'ArrowRight') nextIdx = (idx + 1) % stageTabs.length;
        else if (e.key === 'ArrowLeft') nextIdx = (idx - 1 + stageTabs.length) % stageTabs.length;
        else if (e.key === 'Home') nextIdx = 0;
        else if (e.key === 'End') nextIdx = stageTabs.length - 1;
        if (nextIdx !== null) {
          e.preventDefault();
          activateStageTab(stageTabs[nextIdx], true);
        }
      });
    });
  }

  // 2. Reliable Smooth Anchor Scrolling (with sticky header offset)
  const HEADER_OFFSET = 84;

  function scrollToHash(hash, updateHistory = true) {
    if (!hash || hash === '#' || hash === '#top') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      if (updateHistory && history.pushState) {
        history.pushState(null, '', window.location.pathname + window.location.search);
      }
      return;
    }

    const targetEl = document.querySelector(hash);
    if (targetEl) {
      const rect = targetEl.getBoundingClientRect();
      const targetTop = rect.top + window.pageYOffset - HEADER_OFFSET;
      window.scrollTo({ top: Math.max(0, targetTop), behavior: 'smooth' });
      if (updateHistory && history.pushState) {
        history.pushState(null, '', hash);
      }
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', (e) => {
      const href = anchor.getAttribute('href');
      if (!href) return;

      // Close mobile menu first if open so layout height is stable before calculating offset
      if (mobileMenu && mobileMenu.classList.contains('is-open')) {
        setMobileMenuOpen(false);
      }

      if (href === '#' || href === '#top' || document.querySelector(href)) {
        e.preventDefault();
        scrollToHash(href, true);
      }
    });
  });

  // 3. Package Selection Pre-fill & Dynamic Bericht Requirement Toggle
  const subjectSelect = document.getElementById('onderwerp');
  const berichtInput = document.getElementById('bericht');
  const berichtLabel = document.getElementById('bericht-label');
  const submitBtnText = document.getElementById('submit-btn-text');
  const packageButtons = document.querySelectorAll('[data-package-select]');
  let highlightTimer = null;

  function syncFormWithSubject() {
    if (!subjectSelect) return;
    const isIntroCall = subjectSelect.value === CALL_SUBJECT;

    if (berichtInput) {
      berichtInput.required = !isIntroCall;
      berichtInput.placeholder = isIntroCall
        ? 'Optioneel: deel alvast kort je vraag, idee of voorkeur voor een moment...'
        : 'Korte toelichting op je vraag of idee...';
    }
    if (berichtLabel) {
      berichtLabel.textContent = isIntroCall
        ? 'Korte toelichting (optioneel bij kennismaking)'
        : 'Bericht *';
    }
    if (submitBtnText) {
      submitBtnText.textContent = isIntroCall
        ? 'Gesprek aanvragen'
        : 'Bericht versturen';
    }
  }

  if (subjectSelect) {
    const params = new URLSearchParams(window.location.search);
    const pakketParam = params.get('pakket');
    const pakketAliasMap = {
      ai: 'AI & automatisering',
      automatisering: 'AI & automatisering',
      koppelingen: 'Procesverbetering & systeemkoppelingen',
      proces: 'Procesverbetering & systeemkoppelingen',
      maatwerk: 'Maatwerksoftware & webtools',
      software: 'Maatwerksoftware & webtools',
      web: 'Websites',
      website: 'Websites',
      dashboard: 'Data & overzicht',
      data: 'Data & overzicht',
      verkenning: CALL_SUBJECT,
      kennismaking: CALL_SUBJECT,
    };
    const pakketKey = (pakketParam || '').trim().toLowerCase();
    if (pakketKey && pakketAliasMap[pakketKey]) {
      const mappedValue = pakketAliasMap[pakketKey];
      if (Array.from(subjectSelect.options).some((opt) => opt.value === mappedValue)) {
        subjectSelect.value = mappedValue;
      }
    }

    syncFormWithSubject();
    subjectSelect.addEventListener('change', syncFormWithSubject);

    if (packageButtons.length > 0) {
      packageButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
          const targetValue = btn.getAttribute('data-package-select');
          if (targetValue && Array.from(subjectSelect.options).some((opt) => opt.value === targetValue)) {
            subjectSelect.value = targetValue;
            syncFormWithSubject();
            subjectSelect.classList.add('is-highlighted');
            clearTimeout(highlightTimer);
            highlightTimer = setTimeout(() => {
              subjectSelect.classList.remove('is-highlighted');
            }, 1400);
          }
        });
      });
    }
  }

  // Ensure initial URL hash lands accurately below sticky header
  if (window.location.hash && document.querySelector(window.location.hash)) {
    setTimeout(() => {
      scrollToHash(window.location.hash, false);
    }, 60);
  }

  // 4. Contact Form Integration (Web3Forms API + WhatsApp/Mailto fallback)
  const form = document.getElementById('contact-form');
  if (form) {
    if (window.location.search.includes('bericht=verzonden')) {
      const successNotice = document.createElement('div');
      successNotice.style.cssText =
        'margin-bottom: 1.25rem; padding: 1rem 1.25rem; border-radius: 12px; background-color: #ECFDF5; border: 1px solid #A7F3D0; color: #065F46; font-size: 0.88rem; display: flex; align-items: flex-start; gap: 0.75rem;';
      successNotice.innerHTML = `
        <span style="width: 24px; height: 24px; border-radius: 50%; background-color: #047857; color: #FFFFFF; display: inline-flex; align-items: center; justify-content: center; font-weight: 700; font-size: 0.75rem; flex-shrink: 0; margin-top: 2px;">✓</span>
        <div>
          <strong style="display: block; font-weight: 700; color: #065F46;">Bedankt voor je bericht!</strong>
          <span style="font-size: 0.8rem; color: #047857;">Ik heb je aanvraag ontvangen en je ontvangt binnen één werkdag een eerste reactie.</span>
        </div>
      `;
      form.parentNode.insertBefore(successNotice, form);
    }

    form.addEventListener('submit', async (e) => {
      if (!form.checkValidity()) return;

      e.preventDefault();
      const submitBtn = form.querySelector('button[type="submit"]');
      const originalBtnHtml = submitBtn ? submitBtn.innerHTML : '<span>Bericht versturen</span>';

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.style.opacity = '0.8';
        submitBtn.style.cursor = 'not-allowed';
        submitBtn.innerHTML = '<span>Verzenden...</span>';
      }

      // Collect form field values
      const naam = (document.getElementById('naam')?.value || '').trim();
      const bedrijf = (document.getElementById('bedrijf')?.value || '').trim();
      const email = (document.getElementById('email')?.value || '').trim();
      const telefoon = (document.getElementById('telefoon')?.value || '').trim();
      const onderwerp = (document.getElementById('onderwerp')?.value || '').trim();
      const bericht = (document.getElementById('bericht')?.value || '').trim();

      // Dynamic email subject so each lead lands in its own Gmail thread
      const hiddenSubject = form.querySelector('input[name="subject"]');
      if (hiddenSubject) {
        hiddenSubject.value = `Nieuwe aanvraag (${naam || email || 'bezoeker'}): ${onderwerp || 'Contact'}`;
      }

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      try {
        const formData = new FormData(form);
        const json = JSON.stringify(Object.fromEntries(formData));
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: json,
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        let data = null;
        try {
          data = await res.json();
        } catch (_) {}

        if (res.ok && data && (data.success === true || data.success === 'true')) {
          const formHeading = document.getElementById('form-heading');
          if (formHeading) formHeading.style.display = 'none';
          const safeNaam = escapeHtml(naam);
          const safeContact = escapeHtml(email || 'je contactgegevens');

          form.innerHTML = `
            <div style="padding: 2rem 1rem; text-align: center;">
              <div style="width: 56px; height: 56px; border-radius: 50%; background-color: #D1FAE5; color: #047857; margin: 0 auto 1rem; display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.5rem;">
                ✓
              </div>
              <h4 style="font-size: 1.4rem; margin-bottom: 0.5rem; color: #13294B;">Aanvraag ontvangen!</h4>
              <p style="font-size: 0.92rem; color: #525B68; max-width: 44ch; margin: 0 auto 1.25rem; line-height: 1.6;">
                Bedankt${safeNaam ? ', ' + safeNaam : ''}. Ik heb je aanvraag in goede orde ontvangen; je ontvangt uiterlijk binnen één werkdag een eerste reactie.
              </p>
              <span style="display: inline-block; font-size: 0.78rem; font-weight: 600; color: #065F46; background-color: #ECFDF5; padding: 0.45rem 0.9rem; border-radius: 8px; border: 1px solid #A7F3D0;">
                Aanvraag geregistreerd • Eerste reactie binnen 1 werkdag via ${safeContact}
              </span>
            </div>
          `;
          return;
        }

        throw new Error((data && data.message) || 'Verzending mislukt via server');
      } catch (err) {
        clearTimeout(timeoutId);
        console.warn('Formulier submit fallback geactiveerd:', err);

        // Pre-fill WhatsApp message text
        const waText = encodeURIComponent(
          `Hallo Sander,\n\nIk stuur een bericht via je website (Bruggeman Digital):\n` +
          `• Naam: ${naam}\n` +
          (bedrijf ? `• Bedrijf: ${bedrijf}\n` : '') +
          `• E-mail: ${email}\n` +
          (telefoon ? `• Telefoon: ${telefoon}\n` : '') +
          `• Onderwerp: ${onderwerp}\n` +
          (bericht ? `\nToelichting:\n${bericht}` : '')
        );

        // Pre-fill Mailto link
        const mailSubject = encodeURIComponent(`Nieuwe aanvraag via website: ${onderwerp || naam}`);
        const mailBody = encodeURIComponent(
          `Naam: ${naam}\nBedrijf: ${bedrijf}\nE-mail: ${email}\nTelefoon: ${telefoon}\nOnderwerp: ${onderwerp}\n\nToelichting:\n${bericht}`
        );

        // Reset submit button
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.style.opacity = '1';
          submitBtn.style.cursor = 'pointer';
          submitBtn.innerHTML = originalBtnHtml;
        }

        // Show friendly in-place fallback notice above form (preserves all typed input)
        let errorNotice = document.getElementById('form-error-notice');
        if (!errorNotice) {
          errorNotice = document.createElement('div');
          errorNotice.id = 'form-error-notice';
          form.insertBefore(errorNotice, form.firstChild);
        }

        errorNotice.style.cssText =
          'margin-bottom: 1.25rem; padding: 1.15rem; border-radius: 12px; background-color: #FFF7ED; border: 1px solid #FCD2BD; color: #9A3412; font-size: 0.88rem;';
        errorNotice.innerHTML = `
          <strong style="display: block; font-size: 0.95rem; margin-bottom: 0.35rem; color: #9A3412;">Verbinding met formulierserver tijdelijk vertraagd</strong>
          <p style="margin-bottom: 0.85rem; line-height: 1.5; color: #7C2D12;">
            Je ingevulde gegevens zijn bewaard. Je kunt direct met 1 klik contact opnemen via WhatsApp of e-mail:
          </p>
          <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
            <a href="https://wa.me/31619588717?text=${waText}" target="_blank" rel="noopener noreferrer" class="btn btn--orange" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; text-decoration: none;">
              Stuur via WhatsApp ↗
            </a>
            <a href="mailto:info@bruggemandigital.nl?subject=${mailSubject}&body=${mailBody}" class="btn btn--surface" style="padding: 0.45rem 0.9rem; font-size: 0.82rem; text-decoration: none;">
              Stuur via E-mail ↗
            </a>
          </div>
        `;
      }
    });
  }
});
