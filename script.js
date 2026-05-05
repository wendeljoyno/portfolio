const page = document.body.dataset.page;
const yearNodes = document.querySelectorAll('#year');
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const mobileMenu = document.getElementById('mobileMenu');
const homeHeroImage = document.querySelector('body[data-page="home"] .hero-photo img');
const musicVideoId = 'c8mAJtnvslA';
const musicModeKey = 'portfolioMusicMode';
const defaultHeroImage = 'assets/pic.png';
const musicHeroImage = 'assets/WIN_20260408_09_05_30_Pro.jpg';

yearNodes.forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const markActiveLinks = (selector) => {
  document.querySelectorAll(selector).forEach((link) => {
    const href = link.getAttribute('href');
    if (!href) return;

    const targetPage = href.replace('.html', '').replace('index', 'home');
    if (targetPage === page) {
      link.classList.add('is-active');
    }
  });
};

markActiveLinks('.nav-links a');
markActiveLinks('.mobile-nav a');

const getMusicEmbedUrl = (mode) => {
  const mute = mode === 'sound' ? '0' : '1';
  return `https://www.youtube-nocookie.com/embed/${musicVideoId}?autoplay=1&controls=0&loop=1&playlist=${musicVideoId}&mute=${mute}&modestbranding=1&rel=0`;
};

const createMusicPlayer = () => {
  let mode = localStorage.getItem(musicModeKey) || 'muted';

  const player = document.createElement('div');
  player.className = 'music-player';
  player.setAttribute('aria-hidden', 'true');

  const iframe = document.createElement('iframe');
  iframe.title = 'Background music';
  iframe.allow = 'autoplay';
  iframe.referrerPolicy = 'strict-origin-when-cross-origin';

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'music-toggle';

  const render = () => {
    document.body.classList.toggle('music-live', mode === 'sound');

    if (homeHeroImage) {
      homeHeroImage.src = mode === 'sound' ? musicHeroImage : defaultHeroImage;
    }

    if (mode === 'off') {
      iframe.removeAttribute('src');
    } else {
      iframe.src = getMusicEmbedUrl(mode);
    }

    if (mode === 'sound') {
      button.classList.add('is-on');
      button.setAttribute('aria-label', 'Turn music off');
      button.title = 'Turn music off';
    } else if (mode === 'muted') {
      button.classList.remove('is-on');
      button.setAttribute('aria-label', 'Turn music on');
      button.title = 'Turn music on';
    } else {
      button.classList.remove('is-on');
      button.setAttribute('aria-label', 'Play music');
      button.title = 'Play music';
    }

    button.textContent = '';
  };

  button.addEventListener('click', () => {
    if (mode === 'muted') {
      mode = 'sound';
    } else if (mode === 'sound') {
      mode = 'off';
    } else {
      mode = 'sound';
    }

    localStorage.setItem(musicModeKey, mode);
    render();
  });

  player.appendChild(iframe);
  document.body.appendChild(player);
  document.body.appendChild(button);
  render();
};

createMusicPlayer();

const setMenuState = (isOpen) => {
  if (!navToggle || !mobileMenu) return;

  navToggle.setAttribute('aria-expanded', String(isOpen));
  mobileMenu.classList.toggle('is-open', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
};

navToggle?.addEventListener('click', () => {
  const expanded = navToggle.getAttribute('aria-expanded') === 'true';
  setMenuState(!expanded);
});

document.querySelectorAll('.mobile-nav a').forEach((link) => {
  link.addEventListener('click', () => setMenuState(false));
});

const getHeaderOffset = () => (header ? header.offsetHeight + 16 : 0);

const scrollToHash = (hash) => {
  if (!hash || hash === '#') return;

  const target = document.querySelector(hash);
  if (!target) return;

  const top = target.getBoundingClientRect().top + window.scrollY - getHeaderOffset();
  window.scrollTo({
    top,
    behavior: 'smooth',
  });
};

document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (event) => {
    const hash = link.getAttribute('href');
    const target = hash ? document.querySelector(hash) : null;
    if (!target) return;

    event.preventDefault();
    history.pushState(null, '', hash);
    scrollToHash(hash);
    setMenuState(false);
  });
});

window.addEventListener('load', () => {
  if (window.location.hash) {
    scrollToHash(window.location.hash);
  }
});

const contactForm = document.getElementById('contactForm');
const formStatus = document.getElementById('formStatus');
const copyEmailButton = document.querySelector('.copy-email');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();

  const formData = new FormData(contactForm);
  const name = (formData.get('name') || '').toString().trim();
  const email = (formData.get('email') || '').toString().trim();
  const business = (formData.get('business') || '').toString().trim();
  const goal = (formData.get('goal') || '').toString().trim();
  const timeline = (formData.get('timeline') || '').toString().trim();
  const message = (formData.get('message') || '').toString().trim();

  if (!name || !email || !business || !goal || !message) {
    if (formStatus) {
      formStatus.textContent = 'Please complete the required fields before sending your inquiry.';
    }
    return;
  }

  const subject = `Website Inquiry from ${name}`;
  const body = [
    `Name: ${name}`,
    `Email: ${email}`,
    `Business/Project Type: ${business}`,
    `Main Goal: ${goal}`,
    `Timeline: ${timeline || 'Not specified'}`,
    '',
    'Project Details:',
    message,
  ].join('\n');

  const mailto = `mailto:wendeldesabille382@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  if (formStatus) {
    formStatus.textContent = 'Your email app is opening with your project details.';
  }

  window.location.href = mailto;
});

copyEmailButton?.addEventListener('click', async () => {
  const email = copyEmailButton.dataset.email;
  if (!email) return;

  try {
    await navigator.clipboard.writeText(email);
    copyEmailButton.textContent = 'Email Copied';
  } catch {
    window.location.href = `mailto:${email}`;
  }
});

const track = document.getElementById('workTrack');

if (track) {
  const prev = document.querySelector('.slider-btn.prev');
  const next = document.querySelector('.slider-btn.next');

  const scrollByCard = () => {
    const card = track.querySelector('.project-card');
    if (!card) return 0;

    const style = window.getComputedStyle(track);
    const gap = parseInt(style.columnGap || style.gap || '0', 10) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const scroll = (direction) => {
    track.scrollBy({
      left: scrollByCard() * direction,
      behavior: 'smooth',
    });
  };

  prev?.addEventListener('click', () => scroll(-1));
  next?.addEventListener('click', () => scroll(1));
}
