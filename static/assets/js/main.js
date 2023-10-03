const swiper = new Swiper('.main-slider', {
  // Optional parameters
  direction: 'horizontal',
  autoplay: true,
  delay: 2000,
  // Navigation arrows
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  }
});

const productSwiper = new Swiper(".product-swiper", {
  slidesPerView: 'auto',
  spaceBetween: 5,
  loop: false,
  direction: 'horizontal'
});

const inp = document.querySelector('.search input');
const shadow = document.querySelector('.over__shadow');
const searchResult = document.querySelector('.search__result');
const overlay = document.querySelector('.overlay');

inp.addEventListener('click', () => {
  searchResult.classList.add('show');
  shadow.classList.add('show');
  document.body.setAttribute('data-type', 'noScroll');
});

shadow.addEventListener('click', () => {
  searchResult.classList.remove('show');
  shadow.classList.remove('show');
  document.body.setAttribute('data-type', 'Scroll');
});

overlay.addEventListener('click', () => {
  searchResult.classList.remove('show');
  shadow.classList.remove('show');
  document.body.setAttribute('data-type', 'Scroll');
});