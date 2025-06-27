export let cart = JSON.parse(localStorage.getItem('cart'));

if (!cart) {
  cart = [{
    id: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
    quantity: 2,
  }, {
    id: '15b6fc6f-327a-4ec4-896f-486349e85a3d',
    quantity: 1
  }];
}


const addedToCartTimeouts = {};



export function saveToStorage() {
  localStorage.setItem('cart', JSON.stringify(cart));
}

export function updateCartOnLoad() {
  const localStorageCartItems = JSON.parse(localStorage.getItem('cart'))

  let totalQuantity = 0;
  localStorageCartItems.forEach(element => {
    totalQuantity += element.quantity
  });

  document.querySelector('.js-cart-quantity').innerHTML = totalQuantity
}

export function addToCart(productId) {
  let matchingItem;
  const quantityPicked = Number(document.querySelector(`.js-quantity-picker-${productId}`).value)

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
  saveToStorage();
  makeAddedTextAppear(productId)
}

function makeAddedTextAppear(productId) {
  const addedToCart = document.querySelector(`.js-added-to-cart-${productId}`);

    /* Add classlist for Added to cart text and fix Timeout issue when overlapping. vvv */
    addedToCart.classList.add('added-to-cart-visible');

    const previousTimeoutId = addedToCartTimeouts[productId]
    
    if (previousTimeoutId) {
      clearTimeout(previousTimeoutId)
    }

    const timeoutId = setTimeout(() => {
      addedToCart.classList.remove('added-to-cart-visible');
    }, 2000);

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