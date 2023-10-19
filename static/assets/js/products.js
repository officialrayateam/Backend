const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const searchId = urlParams.get("category");
const searchName = urlParams.get("name");

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

  if (searchId != null) {
    fetch(URL + "products/?category=" + searchId, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (data) {
        if (data.length > 0) {
          const mainGridProducts = document.querySelector(
            ".main-grid-products"
          );
          let textResult = "";

          data.forEach((element) => {
            textResult += `<div class="product__cart">
            <div class="image">
              <img src="${element.image}" alt="${element.description}">
            </div>
            <hr>
            <div class="row">
              <h3>${element.name}</h3>
              <div>
              ${
                element.discount == 0
                  ? `<p>${element.price} <span>تومان</span></p>`
                  : `<del>${element.discount} <span>تومان</span></del>
                  <p>${element.price} <span>تومان</span></p>`
              }
              </div>
            </div>
            <button>
              <i class="bx bx-shopping-bag"></i>
            </button>
          </div>`;
          });

          mainGridProducts.insertAdjacentHTML("beforeend", textResult);
        } else {
          const notFoundProduct = document.querySelector(".not-found-product");

          notFoundProduct.classList.add("activeNotFound");
        }
      })
      .then(function () {
        const btnAddProduct = document.querySelectorAll("button");

        addProductFunc(btnAddProduct);
      });
  } else if (searchName != null) {
    fetch(URL + "products/?name=" + searchName, {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (data) {
        if (data.length > 0) {
          const mainGridProducts = document.querySelector(
            ".main-grid-products"
          );
          let textResult = "";

          data.forEach((element) => {
            textResult += `<div class="product__cart">
            <div class="image">
              <img src="${element.image}" alt="${element.description}">
            </div>
            <hr>
            <div class="row">
              <h3>${element.name}</h3>
              <div>
              ${
                element.discount == 0
                  ? `<p>${element.price} <span>تومان</span></p>`
                  : `<del>${element.discount} <span>تومان</span></del>
                  <p>${element.price} <span>تومان</span></p>`
              }
              </div>
            </div>
            <button data-productId=${element.id}>
              <i class="bx bx-shopping-bag"></i>
            </button>
          </div>`;
          });

          mainGridProducts.insertAdjacentHTML("beforeend", textResult);
        } else {
          const notFoundProduct = document.querySelector(".not-found-product");

          notFoundProduct.classList.add("activeNotFound");
        }
      })
      .then(function () {
        const btnAddProduct = document.querySelectorAll("button");

        addProductFunc(btnAddProduct);
      });
  } else {
    fetch(URL + "products", {
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (data) {
        if (data.length > 0) {
          const mainGridProducts = document.querySelector(
            ".main-grid-products"
          );
          let textResult = "";

          data.forEach((element) => {
            textResult += `<div class="product__cart">
            <div class="image">
              <img src="${element.image}" alt="${element.description}">
            </div>
            <hr>
            <div class="row">
              <h3>${element.name}</h3>
              <div>
              ${
                element.discount == 0
                  ? `<p>${element.price} <span>تومان</span></p>`
                  : `<del>${element.discount} <span>تومان</span></del>
                  <p>${element.price} <span>تومان</span></p>`
              }
              </div>
            </div>
            <button>
              <i class="bx bx-shopping-bag"></i>
            </button>
          </div>`;
          });

          mainGridProducts.insertAdjacentHTML("beforeend", textResult);
        } else {
          const notFoundProduct = document.querySelector(".not-found-product");

          notFoundProduct.classList.add("activeNotFound");
        }
      })
      .then(function () {
        const btnAddProduct = document.querySelectorAll("button");

        addProductFunc(btnAddProduct);
      });
  }

  let counter = 0;

  function addProductFunc(btnName) {
    btnName.forEach(function (el) {
      el.addEventListener("click", function () {
        let productId = el.getAttribute("data-productId");

        fetch(URL + "basket/add/?count=1&product=" + parseInt(productId), {
          headers: {
            Authorization: "Token " + getCookie("token"),
          },
        }).then(function () {
          const dataCounter = document.querySelectorAll(".data-counter");
          const addProductToast = document.querySelector(".add-product-toast");

          dataCounter.forEach(function (el) {
            if (el.getAttribute("data-count") == "") {
              el.setAttribute("data-count", 0);
            } else {
              counter = parseInt(el.getAttribute("data-count")) + 1;
            }
          });

          dataCounter.forEach(function (el) {
            el.setAttribute("data-count", counter);
          });
          addProductToast.classList.add("activeProduct");

          setTimeout(function () {
            addProductToast.classList.remove("activeProduct");
          }, 3000);
        });
      });
    });
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
});
