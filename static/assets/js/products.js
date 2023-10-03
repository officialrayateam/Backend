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