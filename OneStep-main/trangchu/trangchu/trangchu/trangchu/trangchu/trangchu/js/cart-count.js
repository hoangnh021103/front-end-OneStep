function updateCartItemCount() {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  const uniqueProductNames = new Set(cart.map(item => item.name));
  const itemCount = uniqueProductNames.size;
  document.getElementById('cart-item-count').textContent = `[${itemCount}]`;
  console.log('Cart item count updated by js/cart-count.js:', itemCount);
}

document.addEventListener('DOMContentLoaded', updateCartItemCount);
window.addEventListener('storage', updateCartItemCount);