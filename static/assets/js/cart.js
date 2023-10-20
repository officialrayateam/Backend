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
  const purchaseProducts = document.querySelector("#purchase__products");
  const progressBar = document.querySelector("#progress__bar");
  const emptyBasket = document.querySelector("#basket-empty");
  let coutnerProducts = parseInt(document.querySelector(".count").textContent);

  if (coutnerProducts == 0) {
    emptyBasket.classList.add("activeEmpty");
    purchaseProducts.remove();
    progressBar.remove();
  }

  productBoxes.forEach((box) => {
    const btnPlus = box.querySelector(".plus__btn");
    const btnMinus = box.querySelector(".minus__btn");

    btnPlus.addEventListener("click", function () {
      const productID = box.querySelector("input").value;
      const productCount = box.querySelector(".product__count");

      fetch(URL + "basket/add/?count=1" + "&product=" + productID, {
        headers: {
          Authorization: "Token " + getCookie("token"),
        },
      }).then(function () {
        let counterPlus = parseInt(productCount.innerHTML);
        counterPlus += 1;

        const price = parseInt(
          box.querySelector(".actual__count span").textContent
        );

        const discount = box.querySelector(".discount");
        let checkerDiscount =
          discount == null
            ? parseInt(box.querySelector(".actual__count span").textContent)
            : parseInt(discount.querySelector("del").textContent);

        if (counterPlus != 0) {
          calculateProductFunc(price, checkerDiscount, "plus");
          productCount.innerHTML = counterPlus;
        }
      });
    });

    btnMinus.addEventListener("click", function () {
      const productID = box.querySelector("input").value;
      const productCount = box.querySelector(".product__count");

      fetch(URL + "basket/remove/?count=1" + "&product=" + productID, {
        headers: {
          Authorization: "Token " + getCookie("token"),
        },
      }).then(function () {
        let counterMinus = parseInt(productCount.innerHTML);
        counterMinus -= 1;

        const price = parseInt(
          box.querySelector(".actual__count span").textContent
        );

        const discount = box.querySelector(".discount");
        let checkerDiscount =
          discount == null
            ? parseInt(box.querySelector(".actual__count span").textContent)
            : parseInt(discount.querySelector("del").textContent);

        calculateProductFunc(price, checkerDiscount, "minus");

        if (counterMinus == 0) {
          box.remove();
          coutnerProducts -= 1;
          document.querySelector(".count").textContent = coutnerProducts;

          if (coutnerProducts == 0) {
            purchaseProducts.remove();
            progressBar.remove();
            emptyBasket.classList.add("activeEmpty");
          }
        } else {
          productCount.innerHTML = counterMinus;
        }
      });
    });
  });

  function calculateProductFunc(price, discount, activeBtn) {
    let discountCalc = discount - price;
    let actualPriceCalc = price - discountCalc;

    let priceEl = document.querySelector(".product__actualcount .price");
    let discountEl = document.querySelector(".product__discount .discount");
    let actualPriceEl = document.querySelector(
      ".product__discountprice .actual__price"
    );

    if (activeBtn == "plus") {
      priceEl.innerHTML =
        price +
        parseInt(priceEl.textContent.split(" ")[0]) +
        " <span>تومان</span>";
      discountEl.innerHTML =
        discountCalc +
        parseInt(discountEl.textContent.split(" ")[0]) +
        " <span>تومان</span>";
      actualPriceEl.innerHTML =
        actualPriceCalc +
        parseInt(actualPriceEl.textContent.split(" ")[0]) +
        " <span>تومان</span>";
    } else {
      priceEl.innerHTML =
        parseInt(priceEl.textContent.split(" ")[0]) -
        price +
        " <span>تومان</span>";
      discountEl.innerHTML =
        parseInt(discountEl.textContent.split(" ")[0]) -
        discountCalc +
        " <span>تومان</span>";
      actualPriceEl.innerHTML =
        parseInt(actualPriceEl.textContent.split(" ")[0]) -
        actualPriceCalc +
        " <span>تومان</span>";
    }
  }

  function getCookie(name) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(";").shift();
  }
});
