const track = document.getElementById('workTrack');

if (track) {
  const prev = document.querySelector('.slider-btn.prev');
  const next = document.querySelector('.slider-btn.next');

  const scrollByCard = () => {
    const card = track.querySelector('.work-card');
    if (!card) return 0;
    const style = window.getComputedStyle(track);
    const gap = parseInt(style.columnGap || style.gap || '0', 10) || 0;
    return card.getBoundingClientRect().width + gap;
  };

  const scroll = (direction) => {
    const amount = scrollByCard();
    track.scrollBy({ left: amount * direction, behavior: 'smooth' });
  };

  if (prev && next) {
    prev.addEventListener('click', () => scroll(-1));
    next.addEventListener('click', () => scroll(1));
  }
}
