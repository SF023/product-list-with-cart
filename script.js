// Product class
class Product {
  constructor(id, name, price) {
    this.id = id;              
    this.name = name;          
    this.price = price;        
    this.quantity = 1;         
  }

  // Inncrement product quantity
  increaseQuantity() {
    this.quantity++;
  }

  // Decrement product quantity
  decreaseQuantity() {
    this.quantity--;
  }
}


// Cart class
class Cart {
  constructor() {
    this.items = [];                               
    this.cartDiv = document.querySelector('.cart');
  }

  // Add a product to the cart
  addProduct(productId, productName, productPrice) {

    // Check if product is already in cart
    let product = this.items.find(item => item.id === productId);

    if (!product) { 
      product = new Product(productId, productName, productPrice);
      this.items.push(product);
    } else {
      product.increaseQuantity();
    }

    this.updateCart();
  }

  // Update product quantity in the cart
  updateQuantity(productId, action) {
    const product = this.items.find(item => item.id === productId);
    if (!product) return; // If not found, do nothing

    if (action === 'increase') product.increaseQuantity();
    if (action === 'decrease') product.decreaseQuantity();

    // Remove product if quantity falls below 1
    if (product.quantity < 1) {
      this.items = this.items.filter(item => item.id !== productId);
    }

    this.updateCart();
  }

  // Remove a product entirely from the cart
  removeProduct(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.updateCart();

    // Also reset product controls on the product card
    const itemCard = document.getElementById(productId)?.closest('.item');
    if (itemCard) {
      itemCard.querySelector('.quantity-controls').style.display = 'none';
      itemCard.querySelector('.buy-btn').style.display = 'block';
      itemCard.querySelector('.quantity').textContent = 0;
    }
  }

  // Get quantity of product in the cart
  getProductQuantity(productId) {
    const product = this.items.find(item => item.id === productId);
    return product ? product.quantity : 0;
  }

  // Refresh the cart display
  updateCart() {
    const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);

    // Show empty cart message if no items
    if (this.items.length === 0) {
      this.cartDiv.innerHTML = `
        <h3>Your Cart (${totalQuantity})</h3>
        <div class="empty-cart">
          <img src="assets/images/illustration-empty-cart.svg">
          <p class="empty-cart">Your added items will appear here</p>
        </div>
      `;
      return;
    }

    let totalAmount = 0;
    // Generate HTML for each product in cart
    const cartItems = this.items.map(item => {
      const subtotal = item.price * item.quantity;
      totalAmount += subtotal;
      return `
        <div class="cart-item">
          <span class="cart-item-name">${item.name}</span><br>
          <span class="cart-item-quantity-price"><span class="item-quantity">${item.quantity}x</span> @$${item.price.toFixed(2)}</span>
          <strong class="cart-item-subtotal">$${subtotal.toFixed(2)}</strong>
          <img src="assets/images/icon-remove-item.svg" 
               class="remove-item" 
               data-id="${item.id}">
        </div>
        <hr>
      `;
    }).join('');

    // Full cart display with total
    this.cartDiv.innerHTML = `
      <h3>Your Cart (${totalQuantity})</h3>
      ${cartItems}
      <div class="cart-total">
        <span class=order-total>Order Total</span>
        <span class=total-amount>$${totalAmount.toFixed(2)}</span><br>
        <span class="delivery-info"><img src="assets/images/icon-carbon-neutral.svg"> This is a <strong>carbon-neutral </strong> delivery</span>
        <div class="confirm-button">
        <button class="btn-confirm" id="confirm-order-btn">Confirm Order</button>
        </div>
      </div>
    `;

    // Add click event to all remove icons
    this.cartDiv.querySelectorAll('.remove-item').forEach(icon => {
      icon.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.removeProduct(id);
      });
    });

    // Confirm order button click event
    const confirmBtn = document.getElementById('confirm-order-btn');
    if (confirmBtn) {
      confirmBtn.onclick = confirmationModal;
    }

      }
    }

// Creating a cart object
const cart = new Cart();

// Map product button IDs to product data
const productMap = {
  "btn-waffle": { name: "Waffle with Berries", price: 6.50 },
  "btn-creme-brulee": { name: "Vanilla Bean Crème Brûlée", price: 7.00 },
  "btn-macaron": { name: "Macaron Mix of Five", price: 8.00 },
  "btn-tiramisu": { name: "Classic Tiramisu", price: 5.50 },
  "btn-baklava": { name: "Pistachio Baklava", price: 4.00 },
  "btn-meringue": { name: "Lemon Meringue Pie", price: 5.00 },
  "btn-cake": { name: "Red Velvet Cake", price: 4.50 },
  "btn-brownie": { name: "Salted Caramel Brownie", price: 5.50 },
  "btn-panna-costa": { name: "Vanilla Panna Cotta", price: 6.50 }
}; 

// Setup event listeners for each product card
document.querySelectorAll('.item').forEach(item => {
  const button = item.querySelector('.buy-btn');             
  const quantityControls = item.querySelector('.quantity-controls'); 
  const increaseBtn = item.querySelector('.increase');       
  const decreaseBtn = item.querySelector('.decrease');        
  const quantitySpan = item.querySelector('.quantity');       
  const productId = button.id;                               
  const productData = productMap[productId];             

  // Add to cart when buy button clicked
  button.addEventListener('click', () => {
    cart.addProduct(productId, productData.name, productData.price);

    const quantity = cart.getProductQuantity(productId);
    quantitySpan.textContent = quantity;

    // Hide buy button and show quantity controls
    button.style.display = 'none';
    quantityControls.style.display = 'flex';
  });

  // Increase quantity
  increaseBtn.addEventListener('click', () => {
    cart.updateQuantity(productId, 'increase');
    quantitySpan.textContent = cart.getProductQuantity(productId);
  });

  // Decrease quantity
  decreaseBtn.addEventListener('click', () => {
    cart.updateQuantity(productId, 'decrease');
    const quantity = cart.getProductQuantity(productId);
    quantitySpan.textContent = quantity;

    // If quantity is 0, hide quantity controls and show buy button again
    if (quantity < 1) {
      quantityControls.style.display = 'none';
      button.style.display = 'block';
    }
  });
});

function confirmationModal() {
  // Check if modal already exists 
  let modal = document.getElementById("confirmation-modal");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "confirmation-modal";
    modal.style.display = "none";
    modal.innerHTML = `
      <div class="modal-content">
        <img src="assets/images/icon-order-confirmed.svg" alt="Order Confirmed">
        <h3>Order Confirmed</h3>
        <p>We hope you enjoy your food!</p>
        <div id="modal-cart-items"></div>
        <div class="new-order-btn">
          <button id="new-order-btn">Start New Order</button>   
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  }

  const modalCartItems = modal.querySelector("#modal-cart-items");
  modalCartItems.innerHTML = "";

  cart.items.forEach(product => {
  const itemDiv = document.createElement("div");
  itemDiv.classList.add("modal-cart-item");

  const nameSpan = document.createElement("span");
  nameSpan.textContent = product.name;

  const qtySpan = document.createElement("span");
  qtySpan.textContent = `${product.quantity}x`;

  const priceSpan = document.createElement("span");
  priceSpan.textContent  = `@$${product.price.toFixed(2)}`;

  const totPriceSpan = document.createElement("span");
  totPriceSpan.textContent = `$${(product.price * product.quantity).toFixed(2)}`;

  
  itemDiv.appendChild(nameSpan);
  itemDiv.appendChild(document.createElement("br"));
  itemDiv.appendChild(qtySpan);
  itemDiv.appendChild(priceSpan);
  itemDiv.appendChild(totPriceSpan);
  itemDiv.appendChild(document.createElement("hr"));

  modalCartItems.appendChild(itemDiv);
});

const totalDiv = document.createElement("div");
totalDiv.classList.add("modal-cart-item", "modal-cart-total"); 

const totalLabelSpan = document.createElement("span");
totalLabelSpan.textContent = "Order Total:";

const totalQtySpan = document.createElement("span");
totalQtySpan.textContent = ""; 

const totalPriceSpan = document.createElement("span");
const totalPrice = cart.items.reduce((sum, product) => sum + product.price * product.quantity, 0);
totalPriceSpan.textContent = `$${totalPrice.toFixed(2)}`;

totalDiv.appendChild(totalLabelSpan);
totalDiv.appendChild(totalQtySpan);
totalDiv.appendChild(totalPriceSpan);


modalCartItems.appendChild(totalDiv);


  modalCartItems.appendChild(totalDiv);
  modal.style.display = "flex";

  const newOrderBtn = modal.querySelector("#new-order-btn");
  newOrderBtn.onclick = () => {
    cart.items = []; // Clear cart

    document.querySelectorAll('.item').forEach(itemCard => {
      itemCard.querySelector('.quantity-controls').style.display = 'none';
      itemCard.querySelector('.buy-btn').style.display = 'block';
      itemCard.querySelector('.quantity').textContent = 0;
      });

    cart.updateCart();
    modal.style.display = "none"; 
  };
}

cart.updateCart();
