// SELECTED ELEMENTS FROM HTML
const itemContaner = document.querySelector(".item__container");
const exitCart = document.querySelector(".infoSidebar .bi-x-lg");
const cartModal = document.querySelector(".modal__cart");
const cartBtn = document.querySelector(".cart");
const sideBar = document.querySelector(".sideBar__container");
const imgModal = document.querySelector(".img__modal");
const cartContainer = document.querySelector(".containerEl__cart");

// CART ITEMS
const cartItems = JSON.parse(localStorage.getItem("data")) || [];

// IMG FOR MODAL
const modalImg = [];

// FREE STORE API
const api = "https://fakestoreapi.com/products";
// LOCATION API
const locationApi = "http://ip-api.com/json/?fields=61439";

// RENDER ITEMS FROM API TO SCREEN
async function renderItems() {
  try {
    const response = await fetch(api);
    const data = await response.json();
    const items = data
      .map((obj) => {
        const { id, title, price, category, description, image, rating } = obj;
        return renderElemensFunction(category, image, title, price, id);
      })
      .join("");
    renderItemsInCart();
    return (itemContaner.innerHTML = items);
  } catch (err) {
    throw new Error(`Fali jedno slovo: ${err}`);
  }
}

renderItems();

// OPEN SIDEBAR FUNCTION
function openSidebar(action) {
  if (action === "open") {
    sideBar.classList.add("open");
    cartModal.style.display = "block";
  } else if (action === "close") {
    sideBar.classList.remove("open");
    cartModal.style.display = "none";
  }
}
// OPEN SIDEBAR EVENT LISTENERS
exitCart.addEventListener("click", openSidebar.bind(this, "close"));
cartBtn.addEventListener("click", openSidebar.bind(this, "open"));
cartModal.addEventListener("click", openSidebar.bind(this, "close"));

// ADD ITEMS TO CART
async function addToCart(id) {
  const response = await fetch(api);
  const data = await response.json();
  // nadje item u koji hoces da ubacis u cart
  let searchItem = data.find((obj) => obj.id === id);
  //proveri da li item vec postoji cart preko if logike
  let search = cartItems.find((obj) => obj.id === id);
  // ako se item ne nalazi u cart push
  if (search === undefined) {
    cartItems.push({ ...searchItem, item: 1 });
  } else {
    // ako vec postoji povecaj item za jedan
    search.item += 1;
  }

  renderItemsInCart();
}

// ADD IMAGE TO MODAL
itemContaner.addEventListener("click", (e) => {
  if (!e.target.src) return;
  const imageData = e.target.src;
  modalImg.splice(0, modalImg.length);
  modalImg.push({ imgForModal: imageData });
  addImageToModal();
  imgModal.classList.add("display__img__container");
});

function addImageToModal() {
  const element = modalImg
    .map((obj) => {
      const { imgForModal } = obj;
      return rederImgModal(imgForModal);
    })
    .join("");
  imgModal.innerHTML = element;
}

imgModal.addEventListener("click", (e) => {
  imgModal.classList.remove("display__img__container");
});

// RENDERING ITEMS TO CART AND OTHERE SETTINGS

function renderItemsInCart() {
  const element = cartItems
    .map((obj, index) => {
      const { price, item, image, id } = obj;
      return renderCart(undefined, image, undefined, price, id, item, index);
    })
    .join("");
  cartContainer.innerHTML = element;
  sumTotalPrice();
  numberOfItems();
  // localStorage.setItem("data", JSON.stringify(cartItems));
}
//DELETE BUTTONN FROM CART
function deleteItem(index) {
  cartItems.splice(index, 1);

  numberOfItems();
  renderItemsInCart();
  localStorage.setItem("data", JSON.stringify(cartItems));
}

//CART NUMBER OF ITEMS
const cartNumber = document.querySelector(".cartNumber");

function numberOfItems() {
  const element = cartItems.reduce((acc, cv) => {
    let sum = acc + cv.item;
    return sum;
  }, 0);
  cartNumberShow();
  return (cartNumber.textContent = element);
}
numberOfItems();
//SHOW CART ITEM NUMBER WHEN THERE IS ONE ITEM IN CART
function cartNumberShow() {
  if (cartItems.length > 0) {
    cartNumber.classList.add("visibleNumber");
  } else {
    cartNumber.classList.remove("visibleNumber");
  }
}

// DELETE ALL ITEMS BUTTON
const deleteBtn = document.querySelector(".deleteBtnAll");
deleteBtn.addEventListener("click", () => {
  cartItems.splice(0, cartItems.length);

  numberOfItems();
  renderItemsInCart();
  localStorage.setItem("data", JSON.stringify(cartItems));
});

// TOTAL BILL
const sumTotal = document.querySelector(".totalBill");

function sumTotalPrice() {
  const element = cartItems
    .map((obj) => {
      return obj.item * obj.price;
    })
    .reduce((a, c) => {
      return a + c;
    }, 0);

  sumTotal.innerHTML = `Total Bill: ${element.toFixed(2)}$`;
  localStorage.setItem("data", JSON.stringify(cartItems));
}
sumTotalPrice();

async function showLocation() {
  const response = await fetch(locationApi);
  const data = await response.json();
  const element = document.querySelector(".location");
  const { country, city } = data;
  element.textContent = `Location: ${city}, ${country}`;
}

showLocation();

function incriment(id, index) {
  const search = cartItems.find((obj) => obj.id === id);

  if (search.id === id) {
    search.item += 1;
  }

  renderItemsInCart();
}

function decriment(id, index) {
  const search = cartItems.find((obj) => obj.id === id);

  if (search.id === id) {
    search.item -= 1;
  }
  if (search.item === 0) {
    cartItems.splice(index, 1);
  }

  renderItemsInCart();
  localStorage.setItem("data", JSON.stringify(cartItems));
}

//FILTER ITEMS FUNCTION
const filterForm = document.querySelector(".itemFilter");
const itemElementsForm = document.getElementById("itemElementsForm");
const resetBtn = document.querySelector(".itemFilter>.removeFilter");

filterForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const formValue = itemElementsForm.value;
  Array.from(itemContaner.querySelectorAll(".prod__container")).forEach(
    (obj) => {
      const filterdElement = obj.dataset.filter;
      if (!(filterdElement === formValue)) {
        obj.classList.add("filter__item");
      } else if (filterdElement === formValue) {
        obj.classList.remove("filter__item");
      }
    }
  );
});

//RESET FILTER FUNCTION
resetBtn.addEventListener("click", (e) => {
  e.preventDefault();
  Array.from(itemContaner.querySelectorAll(".prod__container")).forEach(
    (obj) => {
      obj.classList.remove("filter__item");
    }
  );
});

// SORT BY PRICE

//? LOW TO HIGHT PRICE FUNCTION
async function smalBig() {
  try {
    const response = await fetch(api);
    const data = await response.json();
    const items = data
      .sort((a, b) => {
        return a.price - b.price;
      })
      .map((obj) => {
        const { id, title, price, category, description, image, rating } = obj;
        return renderElemensFunction(category, image, title, price, id);
      })
      .join("");
    renderItemsInCart();
    return (itemContaner.innerHTML = items);
  } catch (err) {
    throw new Error(`Fali jedno slovo: ${err}`);
  }
}
//? HIGH TO LOW PRICE FUNCTION
async function bigSmall() {
  try {
    const response = await fetch(api);
    const data = await response.json();
    const items = data
      .sort((a, b) => {
        return b.price - a.price;
      })
      .map((obj) => {
        const { id, title, price, category, description, image, rating } = obj;
        return renderElemensFunction(category, image, title, price, id);
      })
      .join("");
    renderItemsInCart();
    return (itemContaner.innerHTML = items);
  } catch (err) {
    throw new Error(`Fali jedno slovo: ${err}`);
  }
}

const lowPrice = document.querySelector(".lower");
const higherPrice = document.querySelector(".higher");
const resetPrice = document.querySelector(".resetPrice");

lowPrice.addEventListener("click", smalBig);
higherPrice.addEventListener("click", bigSmall);
resetPrice.addEventListener("click", renderItems);

// todo mobile burger menu
const burgerMenu = document.querySelector(".buergerMenu");
const sideBarMobile = document.querySelector(".mobile__filter");
const mobileExiteNav = document.querySelector(".bi-x-octagon");

burgerMenu.addEventListener("click", () => {
  sideBarMobile.classList.add("open");
});
mobileExiteNav.addEventListener("click", () => {
  sideBarMobile.classList.remove("open");
});
