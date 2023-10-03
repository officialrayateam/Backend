// login register

let registerBtn = document.querySelector('#LoginRegister .register');
let loginBtn = document.querySelector('#LoginRegister .login')
let loginRegisterCard = document.querySelector('#LoginRegister .card');
registerBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loginRegisterCard.setAttribute('data-type', 'register');
});

loginBtn.addEventListener('click', (e) => {
  e.preventDefault();
  loginRegisterCard.setAttribute('data-type', 'login');
});

// login register