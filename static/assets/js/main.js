document.addEventListener("DOMContentLoaded", () => {
  const swiper = new Swiper(".main-slider", {
    // Optional parameters
    direction: "horizontal",
    autoplay: true,
    delay: 2000,
    // Navigation arrows
    navigation: {
      nextEl: ".swiper-button-next",
      prevEl: ".swiper-button-prev",
    },
  });

  const productSwiper = new Swiper(".product-swiper", {
    slidesPerView: "auto",
    spaceBetween: 5,
    loop: false,
    direction: "horizontal",
  });

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

  const searchForm = document.querySelector(".search");

  searchForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const searchValueForm = searchForm.querySelector("input").value.trim();

    fetch(URL + "products/?name=" + searchValueForm + "&done=1", {
      headers: {
        Authorization: "Token " + getCookie("token"),
      },
    })
      .then(() => {
        location.href = "/products/?name=" + searchValueForm;
      })
      .catch(function (error) {
        console.log(error);
      });
  });

  if (getCookie("token")) {
    fetch(URL + "history", {
      headers: {
        Authorization: "Token " + getCookie("token"),
        "Content-Type": "application/json",
      },
    })
      .then(function (response) {
        if (response.ok) {
          return response.json();
        }
      })
      .then(function (data) {
        const searchResult = document.querySelector(".search__result");
        let noResult = "";
        let result = "";

        if (data.done == false) {
          noResult += `<div class="no__result">
            <img
              src="/static/images/search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
              alt="No Result"
            />
          </div>`;

          searchResult.insertAdjacentHTML("beforeend", noResult);
        } else {
          data.forEach(function (el) {
            result += `<li>
              <a href="/products/?name=${el.text}"><i class="bx bx-search-alt"></i>${el.text}</a>
            </li>`;
          });

          searchResult
            .querySelector("ul")
            .insertAdjacentHTML("beforeend", result);
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  } else {
    const searcResult = document.querySelector(".search__result");

    searcResult.remove();
  }

  fetch(URL + "categories", {
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
        const gridItems = document.querySelector(".grid-items");
        let text = "";

        data.forEach((el) => {
          text += `<li><a href="/products/?category=${el.id}">
            <img src="${el.image}" alt="${el.name}">
            <h3>${el.name}</h3>
          </a></li>`;
        });

        gridItems.insertAdjacentHTML("beforeend", text);
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  let activeSpecials = true;
  let activeMostSell = true;

  fetch(URL + "specials", {
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
        const specialsSection = document.querySelector(
          "#specials-section .swiper-wrapper"
        );
        let text = "";

        data.forEach(function (el) {
          text += itemProductFunc(el, "add-product-btn-specials");

          specialsSection.insertAdjacentHTML("beforeend", text);
          if (data.length > 5) {
            specialsSection.insertAdjacentHTML(
              "beforeend",
              buttonShowAllFunc()
            );
          }
        });
      } else {
        activeSpecials = false;

        const sliderSpecials = document.querySelectorAll("#product-slider")[0];
        sliderSpecials.remove();
      }
    })
    .then(function () {
      if (activeSpecials) {
        const btnSpecials = document.querySelectorAll(
          ".add-product-btn-specials"
        );

        addProductFunc(btnSpecials);
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  fetch(URL + "most_sell", {
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
        let mostSellSection = document.querySelector(
          ".most-sells .swiper-wrapper"
        );
        let mostSellItems = "";

        data.forEach(function (el) {
          mostSellItems += itemProductFunc(el, "add-product-btn-most-sell");
        });
        mostSellSection.insertAdjacentHTML("beforeend", mostSellItems);
        if (data.length > 5) {
          mostSellSection.insertAdjacentHTML("beforeend", buttonShowAllFunc());
        }
      } else {
        activeMostSell = false;

        const sliderMostSell = document.querySelector(".most-sells");
        sliderMostSell.remove();
      }
    })
    .then(function () {
      if (activeMostSell) {
        const btnMostSell = document.querySelectorAll(
          ".add-product-btn-most-sell"
        );

        addProductFunc(btnMostSell);
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  function itemProductFunc(data, nameBtn) {
    let text = `<div class="swiper-slide">
        <div class="item">
          <div class="img">
            <img src="${data.image}" alt="${data.description}">
          </div>
          <h3>${data.name}</h3>
          <div class="price">
          ${
            data.discount == 0
              ? `<p>${data.price} <span>تومان</span></p>`
              : `<del>${data.discount} <span>تومان</span></del>
              <p>${data.price} <span>تومان</span></p>`
          }
          </div>
          <button class="${nameBtn}" data-productId= ${data.id}>
            <i class='bx bxs-shopping-bag'></i>
          </button>
        </div>
      </div>`;

    return text;
  }

  function buttonShowAllFunc() {
    let text = `
      <div class="swiper-slide activeShowAllIcon">
        <div class="item">
          <i class='bx bx-plus'></i>
        </div>
      </div>`;

    return text;
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
