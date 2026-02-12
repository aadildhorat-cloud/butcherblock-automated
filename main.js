// === CART ===
const cart = {
items: [],
init() {
const stored = localStorage.getItem('butcher_block_cart');
if (stored) this.items = JSON.parse(stored);
this.updateCartDisplay();
},
saveCart() {
localStorage.setItem('butcher_block_cart', JSON.stringify(this.items));
this.updateCartDisplay();
},
addToCart(product) {
const existing = this.items.find(item => item.id === product.id);
if (existing) existing.quantity += product.quantity;
else this.items.push(product);
this.saveCart();
},
updateQuantity(id, delta) {
const item = this.items.find(i => i.id === id);
if (item) {
item.quantity += delta;
if (item.quantity <= 0) this.removeItem(id);
else this.saveCart();
}
},
removeItem(id) {
this.items = this.items.filter(item => item.id !== id);
this.saveCart();
},
calculateTotal() {
return this.items.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2);
},
updateCartDisplay() {
const countEl = document.getElementById('cartCount');
const itemsEl = document.getElementById('cartItems');
const totalEl = document.getElementById('cartTotal');
const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
if (countEl) countEl.textContent = totalItems;
if (itemsEl) {
if (this.items.length === 0) {
itemsEl.innerHTML = '<p style="text-align: center; color: #555;">Your cart is empty.</p>';
} else {
itemsEl.innerHTML = '';
this.items.forEach(item => {
const div = document.createElement('div');
div.className = 'cart-item';
div.innerHTML = \`
<img src="\${item.image}" style="width:60px;height:60px;object-fit:cover;">
<div class="cart-item-details">
<div class="cart-item-name">\${item.name}</div>
<div class="cart-item-price">\${item.price === 0 ? 'Call for Quote' : 'R'+(item.price * item.quantity).toFixed(2)}</div>
<div class="cart-item-quantity">
<button onclick="cart.updateQuantity('\${item.id}', -1)">-</button>
<span>\${item.quantity}</span>
<button onclick="cart.updateQuantity('\${item.id}', 1)">+</button>
</div>
</div>
<button onclick="cart.removeItem('\${item.id}')"><i class="fas fa-trash"></i></button>
\`;
itemsEl.appendChild(div);
});
}
}
if (totalEl) totalEl.textContent = \`Total: R\${this.calculateTotal()}\`;
}
};

// === MODALS ===
function showBusinessModal() {
document.getElementById('businessModalOverlay').style.display = 'flex';
setTimeout(() => document.getElementById('businessModal').classList.add('active'), 10);
}
function hideBusinessModal() {
document.getElementById('businessModal').classList.remove('active');
setTimeout(() => document.getElementById('businessModalOverlay').style.display = 'none', 700);
}
document.getElementById('closeBusinessModal').addEventListener('click', hideBusinessModal);
document.getElementById('businessModalOverlay').addEventListener('click', (e) => {
if (e.target === e.currentTarget) hideBusinessModal();
});

// === CART MODAL ===
function showCartModal() {
document.getElementById('cartModalOverlay').style.display = 'flex';
setTimeout(() => document.getElementById('cartModal').classList.add('active'), 10);
cart.updateCartDisplay();
}
function closeCartModal() {
document.getElementById('cartModal').classList.remove('active');
setTimeout(() => document.getElementById('cartModalOverlay').style.display = 'none', 300);
}

// === WHATSAPP ===
function sendCartToWhatsApp() {
if (cart.items.length === 0) {
alert("Your cart is empty!");
return;
}
let msg = "Hi! I'd like to place an order from Butcher Block:\\n";
cart.items.forEach(item => {
msg += \`• \${item.name} x\${item.quantity} — \${item.price === 0 ? 'Call for Quote' : 'R'+(item.price * item.quantity).toFixed(2)}\\n\`;
});
msg += \`\\nTotal: R\${cart.calculateTotal()}\\nThank you!\`;
const url = \`https://wa.me/27615023930?text=\${encodeURIComponent(msg)}\`;
window.open(url, '_blank');
}

// === HAMBURGER MENU ===
function toggleMenu() {
document.getElementById('hamburgerBtn').classList.toggle('active');
document.getElementById('menuOverlay').classList.toggle('active');
document.getElementById('sideMenu').classList.toggle('active');
document.body.style.overflow = document.getElementById('sideMenu').classList.contains('active') ? 'hidden' : '';
}
document.getElementById('hamburgerBtn').addEventListener('click', toggleMenu);

// === INIT ===
document.addEventListener('DOMContentLoaded', () => {
cart.init();
});