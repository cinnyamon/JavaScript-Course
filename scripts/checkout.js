import {cart, removeFromCart, saveToStorage, updateCartOnLoad, updateQuantityFromInput} from '../data/cart.js';
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';

export function updateCartQuantity() {
  let cartQuantity = 0;

  cart.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  document.querySelector('.js-cart-quantity')
    .innerHTML = cartQuantity;

}

/* Global variables */
let previousQuantityTimerId = {}
let otherPreviousTimerId = {}
let cartSummaryHTML = '';


cart.forEach((cartItem) => {
  const productId = cartItem.productId;

  let matchingProduct;

  products.forEach((product) => {
    if (product.id === productId) {
      matchingProduct = product;
    }
  });

  cartSummaryHTML += `
    <div class="cart-item-container
      js-cart-item-container-${matchingProduct.id}">
      <div class="delivery-date">
        Delivery date: Tuesday, June 21
      </div>

      <div class="cart-item-details-grid">
        <img class="product-image"
          src="${matchingProduct.image}">

        <div class="cart-item-details">
          <div class="product-name">
            ${matchingProduct.name}
          </div>
          <div class="product-price">
            $${formatCurrency(matchingProduct.priceCents)}
          </div>
          <div class="product-quantity">
            <span>
              Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${cartItem.quantity}</span>
            </span>
            <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
              Update
            </span>

            <input class="quantity-input">
            <span class="save-quantity-link link-primary" data-product-id="${matchingProduct.id}">Save</span>

            <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
              Delete
            </span>
          </div>
          <p class="invalid-quantity js-invalid-quantity-${matchingProduct.id}"></p>
        </div>

        <div class="delivery-options">
          <div class="delivery-options-title">
            Choose a delivery option:
          </div>
          <div class="delivery-option">
            <input type="radio" checked
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Tuesday, June 21
              </div>
              <div class="delivery-option-price">
                FREE Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Wednesday, June 15
              </div>
              <div class="delivery-option-price">
                $4.99 - Shipping
              </div>
            </div>
          </div>
          <div class="delivery-option">
            <input type="radio"
              class="delivery-option-input"
              name="delivery-option-${matchingProduct.id}">
            <div>
              <div class="delivery-option-date">
                Monday, June 13
              </div>
              <div class="delivery-option-price">
                $9.99 - Shipping
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
});

document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;

document.querySelectorAll('.js-delete-link')
  .forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
    });
  });

  let cartQuantity = 0;

cart.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
});

document.querySelector('.js-checkout-quantity-header')
  .innerHTML = `${cartQuantity} items`;


/* Selecting all of the buttons from the page that we want and putting them in a constant */
const updateQuantityLink = document.querySelectorAll(`.js-update-link`);
const inputQuantity = document.querySelector('.quantity-input')


/* for each link we add an event listener for the click button which then defines productId as the links dataset */
updateQuantityLink.forEach((link) => {
  link.addEventListener('click', () => {
    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const saveLinks = document.querySelectorAll('.save-quantity-link');
    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);

    container.classList.add('is-editing-quantity');

    inputQuantity.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        const inputNewQuantity = Number(inputQuantity.value);
        updateQuantityFromInput(productId, inputNewQuantity);
        container.classList.remove('is-editing-quantity');
        quantityLabel.innerHTML = inputNewQuantity;
      }
    });

    saveLinks.forEach((saveLink) => {
      saveLink.addEventListener('click', () => {
        const inputNewQuantity = Number(inputQuantity.value);
        container.classList.remove('is-editing-quantity');

        if (inputNewQuantity <= 0) {

          const invalQuan = document.querySelector(`.js-invalid-quantity-${productId}`);
          invalQuan.innerHTML = 'Invalid quantity. Please add more items.';


          // this is a bullshit clear timeout bug FIXED
          if (previousQuantityTimerId) {clearTimeout(previousQuantityTimerId)
          }
          const timeoutId = setInterval(() => {
            invalQuan.innerHTML = ''
          }, 2000);
          previousQuantityTimerId = timeoutId;
          // the bullshit ends here 

        } else if (inputNewQuantity >= 100){


          document.querySelector(`.js-invalid-quantity-${productId}`).innerHTML = 'Too many items in the cart.'

          if (otherPreviousTimerId) {clearTimeout(otherPreviousTimerId)
          }
          const timeoutId = setInterval(() => {
            document.querySelector(`.js-invalid-quantity-${productId}`).innerHTML = ''
          }, 2000);
          otherPreviousTimerId = timeoutId;


        } else {

          updateQuantityFromInput(productId, inputNewQuantity)
        }
        quantityLabel.innerHTML = inputNewQuantity;
      })
    })
  })
})

 