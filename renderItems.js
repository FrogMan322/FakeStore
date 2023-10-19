// RENDER ON SCREEN HTML

export function renderElemensFunction(category, image, title, price, id, idx) {
  return `
  <div class="prod__container" data-filter="${category}">
  <div class="img__container" data-loc="${idx}">
    <img
      src="${image}"
      alt=""
      class="img__element"
    />
  </div>
  <h1 class="descritpion__text">${title}</h1>
  <h1 class="category"><span class="textDecor">Category: ${category}</span></h1>
  <h1 class="price"><span class="textDecor">Price: ${price}$</span></h1>
  <div class="cartBtn" ><h1 class="addToCart" data-id="${id}">Add To Cart</h1></div>
</div>`;
}
// ITEMS IN CART HTML
export function renderCart(category, image, title, price, id, item, index) {
  return `
  <div class="cart__elements">
  <img
    src="${image}"
    alt=""
  />
  </div>
  <h1 class="cartElement__price">Price: ${(price * item).toFixed(2)}$</h1>
  <h1 class="cartElement__quontity">
  quontity: <i class="bi bi-patch-minus sizingBtns" data-idx="${index}" data-id="${id}""></i> 
  <span class="number__order">${item}</span>
  <i class="bi bi-patch-plus sizingBtns" data-idx="${index}" data-id="${id}" ></i>
  </h1>
  <button class="deleteBtn" data-idx="${index}">delete item</button>`;
}
// RENDER MODAL IMAGE
export function rederImgModal(imgForModal) {
  return `
  <div class="imgModal">
  <img
    src="${imgForModal}"
    alt="modal image"
  />
</div>`;
}
