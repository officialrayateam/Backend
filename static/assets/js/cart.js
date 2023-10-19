document.addEventListener("DOMContentLoaded", function () {
  const inp = document.querySelector(".search input");
  const shadow = document.querySelector(".over__shadow");
  const searchResult = document.querySelector(".search__result");
  const overlay = document.querySelector(".overlay");

  inp.addEventListener("click", () => {
    searchResult.classList.add("show");
    shadow.classList.add("show");
    document.body.setAttribute("data-type", "noScroll");
  });

  shadow.addEventListener("click", () => {
    searchResult.classList.remove("show");
    shadow.classList.remove("show");
    document.body.setAttribute("data-type", "Scroll");
  });

  overlay.addEventListener("click", () => {
    searchResult.classList.remove("show");
    shadow.classList.remove("show");
    document.body.setAttribute("data-type", "Scroll");
  });

  const URL = "http://127.0.0.1:8000/api/";

  const productBoxes = document.querySelectorAll(".main-grid .product__box");

  productBoxes.forEach((box) => {
    const btnPlus = box.querySelector(".plus__btn");

    btnPlus.addEventListener("click", function () {
      const productID = box.querySelector("input").value;
      const productCount = box.querySelector(".product__count");

      fetch(URL + "basket/add/?count=1" + "&product=" + productID, {
        headers: {
          Authorization: "Token " + getCookie("token"),
        },
      }).then(function () {
        if (productCount != 0) {
          let counterPlus = parseInt(productCount.innerHTML);
          counterPlus += 1;
          productCount.innerHTML = counterPlus;
        }
      });
    });
  });

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
});
