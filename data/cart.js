export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [];
}

//FIRST WE DEFINE THE PREVIOUS TIMEOUT IN GLOBAL SCOPE!!!

const addedToCartTimeouts = {};
let previousTimeoutId = {}; 



export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateCartOnLoad(totalQuantity) {
  const localStorageCartItems = JSON.parse(localStorage.getItem('cart'))

  totalQuantity = 0;
  localStorageCartItems.forEach(element => {
    totalQuantity += element.quantity
  });

  document.querySelector('.js-cart-quantity').innerHTML = totalQuantity;
  return totalQuantity
}

export function addToCart(productId) {
  let matchingItem;
  const quantityPicked = Number(document.querySelector(`.js-quantity-picker-${productId}`).value)

  if (!canAddToCart(productId)) {
    return; // exit early if addition is not allowed
  }

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  if (matchingItem) {
    matchingItem.quantity += quantityPicked;
  } else {
    cart.push({
      productId,
      quantity: quantityPicked
    });
  }
  makeAddedTextAppear(productId);
  saveToStorage();
}

function canAddToCart(productId) {
  const cartFullBanner = document.querySelector('.js-cart-is-full-banner') // stop if cart has more than 10 items
  let cartSize = updateCartOnLoad()
  const quantityPicked = Number(document.querySelector(`.js-quantity-picker-${productId}`).value);

  if (cartSize + quantityPicked > 100) {
    cartFullBanner.classList.add('js-cart-is-full-visible');

    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId)
    };

    const timeoutId = setInterval(() => cartFullBanner.classList.remove('js-cart-is-full-visible')
     , 2000);

     previousTimeoutId = timeoutId

    return false; // this shit prrevents the addition
  }

  //can add more shit here
  cartFullBanner.classList.remove('js-cart-is-full-visible');
  return true; // this return true allows the addition
}

function makeAddedTextAppear(productId) {
  const addedToCart = document.querySelector(`.js-added-to-cart-${productId}`);

    /* Add classlist for Added to cart text and fix Timeout issue when overlapping. vvv */
    addedToCart.classList.add('added-to-cart-visible');

    const previousTimeoutId = addedToCartTimeouts[productId]
    
    if (previousTimeoutId) {clearTimeout(previousTimeoutId)}

    const timeoutId = setTimeout(() => addedToCart.classList.remove('added-to-cart-visible')
    , 2000);

    addedToCartTimeouts[productId] = timeoutId
}

export function removeFromCart(productId) {
  const newCart = [];

  cart.forEach((cartItem) => {
    if (cartItem.productId !== productId) {
      newCart.push(cartItem);
    }
  });

  cart = newCart;
  saveToStorage();
}

export function updateQuantityFromInput(productId, inputNewQuantity) {

  let matchingItem;

  cart.forEach((cartItem) => {
    if (productId === cartItem.productId) {
      matchingItem = cartItem;
    }
  });

  matchingItem.quantity = inputNewQuantity;

  saveToStorage();
}



