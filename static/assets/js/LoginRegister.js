// login register

document.addEventListener("DOMContentLoaded", () => {
  let registerBtn = document.querySelector("#LoginRegister .register");
  let loginBtn = document.querySelector("#LoginRegister .login");
  let loginRegisterCard = document.querySelector("#LoginRegister .card");
  registerBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginRegisterCard.setAttribute("data-type", "register");
  });

  loginBtn.addEventListener("click", (e) => {
    e.preventDefault();
    loginRegisterCard.setAttribute("data-type", "login");
  });

  const loginForm = document.querySelectorAll("form")[0];
  const loginUserName = loginForm.querySelector("#username");
  const loginPassword = loginForm.querySelector("#password");
  let activeLoginForm = [null, null];

  loginForm.addEventListener("submit", function (e) {
    if (validateLoginForm() == false) {
      e.preventDefault();
    }
  });

  function validateLoginForm() {
    let loginUserNameValue = loginUserName.value.trim();
    let loginPasswordValue = loginPassword.value.trim();

    if (loginUserNameValue == "") {
      setErr(loginUserName, "فیلد نام کاربری اجباری است");
      activeLoginForm[0] = false;
    } else {
      setSucc(loginUserName, "نام کاربری");
      activeLoginForm[0] = true;
    }

    if (loginPasswordValue == "") {
      setErr(loginPassword, "فیلد رمز عبور اجباری است");
      activeLoginForm[1] = false;
    } else {
      setSucc(loginPassword, "رمز");
      activeLoginForm[1] = true;
    }

    let checker = (arr) => arr.every((validate) => validate === true);
    return checker(activeLoginForm);
  }

  const registerForm = document.querySelectorAll("form")[1];
  const registerUserName = registerForm.querySelector("#R-username");
  const registerPassword = registerForm.querySelector("#R-password");
  const registerConfirmPassword = registerForm.querySelector(
    "#R-confirm-password"
  );
  let activeRegisterForm = [null, null, null];

  registerForm.addEventListener("submit", function (e) {
    if (validateRegisterForm() == false) {
      e.preventDefault();
    }
  });

  function validateRegisterForm() {
    let registerUserNameValue = registerUserName.value.trim();
    let regsiterPasswordValue = registerPassword.value.trim();
    let regsiterConfirmPasswordValue = registerConfirmPassword.value.trim();

    if (registerUserNameValue == "") {
      setErr(registerUserName, "فیلد نام کاربری اجباری است");
      activeRegisterForm[0] = false;
    } else {
      setSucc(registerUserName, "نام کاربری");
      activeRegisterForm[0] = true;
    }

    if (regsiterPasswordValue == "") {
      setErr(registerPassword, "فیلد رمز عبور اجباری است");
      activeRegisterForm[1] = false;
    } else {
      setSucc(registerPassword, "رمز");
      activeRegisterForm[1] = true;
    }

    if (regsiterConfirmPasswordValue == "") {
      setErr(registerConfirmPassword, "فیلد تکرار رمز عبور اجباری است");
      activeRegisterForm[2] = false;
    } else if (regsiterConfirmPasswordValue != regsiterPasswordValue) {
      setErr(registerConfirmPassword, "فیلد های رمز عبور با هم مطابقت ندارند");
      activeRegisterForm[2] = false;
    } else {
      setSucc(registerConfirmPassword, " تکرار رمز");
      activeRegisterForm[2] = true;
    }

    let checker = (arr) => arr.every((validate) => validate === true);
    return checker(activeRegisterForm);
  }

  function setErr(el, msg) {
    el.placeholder = msg;
    el.className = "showErr";
  }

  function setSucc(el, msg) {
    el.placeholder = msg;
    el.className = "";
  }
});

// login register
