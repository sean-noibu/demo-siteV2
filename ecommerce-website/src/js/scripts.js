document.addEventListener('DOMContentLoaded', () => {
    const addToCartButtons = document.querySelectorAll('.btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', addToCart);
    });

    function addToCart(event) {
        console.log('Add to Cart button clicked'); // Debugging statement
        const button = event.target;
        const productCard = button.closest('.product-card, .product-details');
        console.log('Product Card:', productCard); // Debugging statement

        if (!productCard) {
            console.error('Product card not found');
            return;
        }

        const productNameElement = productCard.querySelector('h3, h2');
        const productPriceElement = productCard.querySelector('.price');
        const productImageElement = productCard.querySelector('img');

        if (!productNameElement || !productPriceElement || !productImageElement) {
            console.error('Product details not found');
            return;
        }

        const productName = productNameElement.innerText;
        const productPrice = productPriceElement.innerText;

        console.log('Product Price:', productPrice); // Debugging statement
        console.log('Product Image:', productImage); // Debugging statement

        const product = {
            name: productName,
            price: productPrice,
            image: productImage
        };

        let cart = JSON.parse(localStorage.getItem('cart')) || [];
        cart.push(product);
        localStorage.setItem('cart', JSON.stringify(cart));
        alert(`${productName} has been added to your cart.`);
    }
});