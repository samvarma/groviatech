// ============================================================
// GroviaTech.in — shared site behaviour
// ============================================================

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Apply site config (config.js) to the DOM ---------- */
  /* Fills in WhatsApp links, Formspree action, and social links   */
  /* from window.GROVIA_CONFIG so those values live in one place.  */
  const cfg = window.GROVIA_CONFIG;
  if(cfg){
    document.querySelectorAll('[data-config="whatsapp-href"]').forEach(el => {
      const params = el.getAttribute('data-whatsapp-params') || '';
      el.setAttribute('href', `https://wa.me/${cfg.whatsappNumber}${params}`);
    });
    document.querySelectorAll('[data-config="formspree-action"]').forEach(el => {
      el.setAttribute('action', `https://formspree.io/f/${cfg.formspreeId}`);
    });
    document.querySelectorAll('[data-config="email-href"]').forEach(el => {
      el.setAttribute('href', `mailto:${cfg.email}`);
      el.textContent = cfg.email;
    });
    ['instagram', 'linkedin', 'twitter'].forEach(key => {
      document.querySelectorAll(`[data-config="social-${key}"]`).forEach(el => {
        el.setAttribute('href', cfg.social[key]);
      });
    });
  }

  /* ---------- Sticky nav on scroll ---------- */
  const nav = document.querySelector('.nav');
  const onScroll = () => {
    if(!nav) return;
    if(window.scrollY > 20) nav.classList.add('scrolled');
    else nav.classList.remove('scrolled');
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector('.nav-toggle');
  const panel = document.querySelector('.mobile-panel');
  if(toggle && panel){
    toggle.addEventListener('click', () => {
      panel.classList.toggle('open');
    });
    panel.querySelectorAll('a').forEach(a => a.addEventListener('click', () => panel.classList.remove('open')));
  }

  /* ---------- Active nav link ---------- */
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-panel a').forEach(a => {
    const href = a.getAttribute('href');
    if(href === path || (path === '' && href === 'index.html')){
      a.classList.add('active');
    }
  });

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll('.reveal');
  if('IntersectionObserver' in window){
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          entry.target.classList.add('in-view');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add('in-view'));
  }

  /* ---------- Animated stat counters ---------- */
  const counters = document.querySelectorAll('[data-count]');
  const animateCount = (el) => {
    const target = parseFloat(el.getAttribute('data-count'));
    const suffix = el.getAttribute('data-suffix') || '';
    const duration = 1400;
    const start = performance.now();
    const step = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if(progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  if('IntersectionObserver' in window && counters.length){
    const cio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(c => cio.observe(c));
  }

  /* ---------- FAQ accordion ---------- */
  document.querySelectorAll('.faq-item').forEach(item => {
    item.addEventListener('click', () => {
      const wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if(!wasOpen) item.classList.add('open');
    });
  });

  /* ---------- Portfolio filter ---------- */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const portfolioCards = document.querySelectorAll('[data-category]');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');
      portfolioCards.forEach(card => {
        const show = cat === 'all' || card.getAttribute('data-category') === cat;
        card.style.display = show ? '' : 'none';
      });
    });
  });

  /* ---------- Footer year ---------- */
  document.querySelectorAll('.year').forEach(el => el.textContent = new Date().getFullYear());

  /* ---------- Hero WhatsApp automation demo ---------- */
  const chatWindow = document.querySelector('.chat-window');
  const stepsEls = document.querySelectorAll('.demo-step');
  if(chatWindow){
    const script = [
      { type: 'in',  text: 'Hi! I saw your ad — do you have slots this week for a demo?' },
      { type: 'out', text: 'Hey Priya 👋 Yes! I can get you booked in. What day works best?' },
      { type: 'in',  text: 'Thursday afternoon would be great.' },
      { type: 'out', text: 'Thursday 3:00 PM is open ✅ Booked, and synced to your CRM.' },
    ];
    let i = 0;
    let stepIdx = 0;
    const runStep = () => {
      if(i < stepsEls.length){
        stepsEls[stepIdx]?.classList.add('active');
      }
    };
    const pushBubble = () => {
      if(i >= script.length){
        setTimeout(() => {
          chatWindow.innerHTML = '';
          stepsEls.forEach(s => s.classList.remove('active'));
          i = 0; stepIdx = 0;
          setTimeout(loop, 500);
        }, 2600);
        return;
      }
      const item = script[i];
      const bubble = document.createElement('div');
      bubble.className = 'bubble ' + item.type;
      bubble.textContent = item.text;
      chatWindow.appendChild(bubble);
      if(item.type === 'out' && stepIdx < stepsEls.length){
        stepsEls[stepIdx].classList.add('active');
        stepIdx++;
      }
      i++;
      setTimeout(pushBubble, 1400);
    };
    const loop = () => pushBubble();
    setTimeout(loop, 700);
  }

});
