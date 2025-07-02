import {cart, removeFromCart, saveToStorage, updateQuantityFromInput} from '../data/cart.js';
import { deliveryOptions } from "../data/deliveryoptions.js";
import {products} from '../data/products.js';
import {formatCurrency} from './utils/money.js';
import dayjs from 'https://unpkg.com/supersimpledev@8.5.0/dayjs/esm/index.js';


const today = dayjs();
const deliveryDate = today.add(7, 'days')
deliveryDate.format('dddd, MMMM D');
console.log(deliveryDate.format('dddd, MMMM D'));


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
let cartSummaryHTML = '';
/////////////////////////////////////////


// Generate the html for the checkout page
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

            <input class="quantity-input js-quantity-input-${matchingProduct.id}"
            data-product-id="${matchingProduct.id}">
            <span class="save-quantity-link link-primary js-save-quantity-${matchingProduct.id}" data-product-id="${matchingProduct.id}">Save</span>

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
          ${generateDeliveryDate(matchingProduct)}
        </div>
      </div>
    </div>
  `;
});
document.querySelector('.js-order-summary')
  .innerHTML = cartSummaryHTML;
////////////////////////////////////////////


// Generate delivery date on the option html and display it on the page
function generateDeliveryDate(matchingProduct) {

  let html = '';

  deliveryOptions.forEach((deliveryItem) => {
    const today = dayjs();
    const deliveryDate = today.add(deliveryItem.deliveryDays, 'days')
    const dateString = deliveryDate.format('dddd, MMMM D');
    const priceString = deliveryItem.priceCents === 0
    ? 'FREE'
    : `$${formatCurrency(deliveryItem.priceCents)} -`
    // ^^ this line above basically takes the priceCents and puts it into the formatCurrency function and gives us the price in dollars. this wholes constant is a ternary operator that says if the priceCents is 0 then display the text FREE and if not display the actual price from the deliveryoptions.js file

    html += `<div class="delivery-option js-delivery-option">
                <input type="radio"
                  class="delivery-option-input js-input-option"
                  name="delivery-option">
                <div>
                  <div class="delivery-option-date">
                    ${dateString}
                  </div>
                  <div class="delivery-option-price">
                     ${priceString} Shipping
                  </div>
                </div>
              </div>`
    
  });
  return html;
};
///////////////////////////////////////////////////

  const actualDate = { date: null } //setting default null value is optional but its good practice to set the key instead of leaving it undefined

// Get the date in string form from radio selectors on click
  function getDateFromRadio() {
    document.querySelectorAll('.js-delivery-option').forEach((element) => {
      element.addEventListener('click', () => {
        const dateElement = element.querySelector('.delivery-option-date');
        const date = dateElement?.textContent.trim();
        console.log(actualDate);

        if (date) {
          actualDate.date = date;
          console.log(actualDate);
        }
      })
    })
  }
///////////////////////////////////////////////////


// Testing switch case instead of if else statements for date cases. if date then ... if anotherDate then ...
// getDateFromRadio()
// switch (actualDate) {
//   case actualDate === 'Wednesday, July 9':
//     console.log('worked again');
//     break;
//   case actualDate === 'Saturday, July 5':
//     console.log('worked again');
//     break;
//   case actualDate === undefined:
//     console.log('the object was empty');
//     break;
// }
// let testOfDate = ''
// for (let date in actualDate) {
//   testOfDate += actualDate[date]
// }

// Delete functionality of the links from the checkout page
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
////////////////////////////////////////////


// Update checkout quantity header with the quantity of items in the cart
let cartQuantity = 0;

cart.forEach((cartItem) => {
  cartQuantity += cartItem.quantity;
});
document.querySelector('.js-checkout-quantity-header')
  .innerHTML = `${cartQuantity} items`;
////////////////////////////////////////////


/* Selecting all of the buttons from the page that we want and putting them in a constant */
const updateQuantityLink = document.querySelectorAll(`.js-update-link`);
/* for each link we add an event listener for the click button which then defines productId as the links dataset */
updateQuantityLink.forEach((link) => {
  link.addEventListener('click', () => {

    const productId = link.dataset.productId;
    const container = document.querySelector(`.js-cart-item-container-${productId}`);
    const saveLinks = document.querySelectorAll(`.js-save-quantity-${productId}`);
    const quantityLabel = document.querySelector(`.js-quantity-label-${productId}`);
    const inputBox = document.querySelectorAll(`.js-quantity-input-${productId}`);

      let liveQuantity = null;

      inputBox.forEach((inputbox) => {
        inputbox.addEventListener('input', () => {
          liveQuantity = Number(inputbox.value);
        });

      container.classList.add('is-editing-quantity');

      console.log(productId);
      console.log(inputBox);

      inputBox.forEach((inputbox) => {
        inputbox.addEventListener('keydown', (event) => {

          liveQuantity = Number(inputbox.value)
          if (event.key === 'Enter' && liveQuantity > 0) {
            console.log(liveQuantity)
            updateQuantityFromInput(productId, liveQuantity);
            container.classList.remove('is-editing-quantity');
            quantityLabel.innerHTML = liveQuantity;
          } else if (event.key === 'Enter' && (liveQuantity <= 0 || liveQuantity > 100)) {
            
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

          }
        })
      });

      saveLinks.forEach((saveLink) => {
      saveLink.addEventListener('click', () => {
          if (liveQuantity <= 0 || liveQuantity > 100 || isNaN(liveQuantity)) {
            const invalQuan = document.querySelector(`.js-invalid-quantity-${productId}`);
            invalQuan.innerHTML = 'Invalid quantity. Please add more items.';
      
            if (previousQuantityTimerId) clearTimeout(previousQuantityTimerId);
            previousQuantityTimerId = setTimeout(() => {
              invalQuan.innerHTML = '';
            }, 2000);
          } else {
            updateQuantityFromInput(productId, liveQuantity);
            quantityLabel.innerHTML = liveQuantity;
            container.classList.remove('is-editing-quantity');
          }
        })
      });
    })
  })
})

