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
          text += `<li><a href="/products/?id=${el.id}">
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
          text += itemProductFunc(el, "add-product-btn-most-sell");

          specialsSection.insertAdjacentHTML("beforeend", text);
          if (data.length > 5) {
            specialsSection.insertAdjacentHTML(
              "beforeend",
              buttonShowAllFunc()
            );
          }
        });
      } else {
      }
    })
    .catch(function (error) {
      console.log(error);
    });

  let mostSellSection = document.querySelector(".most-sells .swiper-wrapper");
  let mostSellItems = "";

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
        data.forEach(function (el) {
          mostSellItems += itemProductFunc(el, "add-product-btn-most-sell");
        });
        mostSellSection.insertAdjacentHTML("beforeend", mostSellItems);
        if (data.length > 5) {
          mostSellSection.insertAdjacentHTML("beforeend", buttonShowAllFunc());
        }
      } else {
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
            data.discount == null
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
});
