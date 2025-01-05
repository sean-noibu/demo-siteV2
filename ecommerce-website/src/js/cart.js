document.addEventListener('DOMContentLoaded', () => {
    const cartItemsContainer = document.querySelector('.cart-items');
    const cartTotalElement = document.getElementById('cart-total');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    function displayCartItems() {
        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach((product, index) => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <div class="cart-item-details">
                    <h3>${product.name}</h3>
                    <p class="price">${product.price}</p>
                    <button class="btn-remove" data-index="${index}">Remove</button>
                </div>
            `;
            cartItemsContainer.appendChild(cartItem);

            const price = parseFloat(product.price.replace('$', ''));
            total += price;
        });

        cartTotalElement.innerText = total.toFixed(2);

        const removeButtons = document.querySelectorAll('.btn-remove');
        removeButtons.forEach(button => {
            button.addEventListener('click', removeFromCart);
        });
    }

    function removeFromCart(event) {
        const button = event.target;
        const index = button.getAttribute('data-index');
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        displayCartItems();
    }

    displayCartItems();
});