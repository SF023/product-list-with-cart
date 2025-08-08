// Product class
class Product {
  constructor(id, name, price) {
    this.id = id;
    this.name = name;
    this.price = price;
    this.quantity = 1;
  }

  increaseQuantity() {
    this.quantity++;
  }

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

  addProduct(productId, productName, productPrice) {
    let product = this.items.find(item => item.id === productId);

    if (!product) {
      product = new Product(productId, productName, productPrice);
      this.items.push(product);
    } else {
      product.increaseQuantity();
    }

    this.updateCart();
  }

  updateQuantity(productId, action) {
    const product = this.items.find(item => item.id === productId);
    if (!product) return;

    if (action === 'increase') product.increaseQuantity();
    if (action === 'decrease') product.decreaseQuantity();

    if (product.quantity < 1) {
      this.items = this.items.filter(item => item.id !== productId);
    }

    this.updateCart();
  }

  removeProduct(productId) {
    this.items = this.items.filter(item => item.id !== productId);
    this.updateCart();

    const itemCard = document.getElementById(productId)?.closest('.item');
    if (itemCard) {
      itemCard.querySelector('.quantity-controls').style.display = 'none';
      itemCard.querySelector('.buy-btn').style.display = 'block';
      itemCard.querySelector('.quantity').textContent = 0;
    }
  }

  getProductQuantity(productId) {
    const product = this.items.find(item => item.id === productId);
    return product ? product.quantity : 0;
  }

  updateCart() {
    const totalQuantity = this.items.reduce((sum, item) => sum + item.quantity, 0);

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

    // Remove item event listeners
    this.cartDiv.querySelectorAll('.remove-item').forEach(icon => {
      icon.addEventListener('click', (e) => {
        const id = e.target.dataset.id;
        this.removeProduct(id);
      });
    });

    // Confirm order listener
    document.getElementById('confirm-order-btn').addEventListener('click', () => {
      this.items = [];
      this.updateCart();

      // Reset quantity selectors back to buttons
      document.querySelectorAll('.item').forEach(itemCard => {
      itemCard.querySelector('.quantity-controls').style.display = 'none';
      itemCard.querySelector('.buy-btn').style.display = 'block';
      itemCard.querySelector('.quantity').textContent = 0;
      });

      showToast("Your order has been placed");
    });
  }
}

// Creating an instance of the cart
const cart = new Cart();

// Map of product button IDs to names and prices
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

// Setup all item cards
document.querySelectorAll('.item').forEach(item => {
  const button = item.querySelector('.buy-btn');
  const quantityControls = item.querySelector('.quantity-controls');
  const increaseBtn = item.querySelector('.increase');
  const decreaseBtn = item.querySelector('.decrease');
  const quantitySpan = item.querySelector('.quantity');
  const productId = button.id;
  const productData = productMap[productId];

  button.addEventListener('click', () => {
    cart.addProduct(productId, productData.name, productData.price);

    const quantity = cart.getProductQuantity(productId);
    quantitySpan.textContent = quantity;

    button.style.display = 'none';
    quantityControls.style.display = 'flex';
  });

  increaseBtn.addEventListener('click', () => {
    cart.updateQuantity(productId, 'increase');
    quantitySpan.textContent = cart.getProductQuantity(productId);
  });

  decreaseBtn.addEventListener('click', () => {
    cart.updateQuantity(productId, 'decrease');
    const quantity = cart.getProductQuantity(productId);
    quantitySpan.textContent = quantity;

    if (quantity < 1) {
      quantityControls.style.display = 'none';
      button.style.display = 'block';
    }
  });
});

function showToast(message) {
  const toast = document.createElement('div');
  toast.textContent = message;
  toast.classList.add('toast');
  document.body.appendChild(toast);

  // Force a reflow so we can add the show class and trigger transition
  void toast.offsetWidth; 
  toast.classList.add('show');

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 500);
  }, 2000);
}


cart.updateCart();
