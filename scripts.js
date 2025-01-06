document.addEventListener('DOMContentLoaded', () => {
    // Load the navigation bar
    fetch('nav.html')
        .then(response => response.text())
        .then(data => {
            document.querySelector('header').innerHTML += data;
        });

    // Load the footer
    fetch('footer.html')
        .then(response => response.text())
        .then(data => {
            document.body.innerHTML += data;
            attachEventListeners(); // Attach event listeners after footer is loaded
        });

    function attachEventListeners() {
        // Add to cart functionality
        const addToCartButtons = document.querySelectorAll('.btn#add-to-cart');
        addToCartButtons.forEach(button => {
            button.addEventListener('click', addToCart);
        });

        function addToCart(event) {
            const button = event.target;
            const productCard = button.closest('.product-card, .product-details');
            const productName = productCard.querySelector('h3, h2').innerText;
            const productPrice = productCard.querySelector('.price').innerText;
            const productImageElement = productCard.querySelector('img');
            const productImage = productImageElement ? productImageElement.src : '';

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

        // Quantity buttons functionality
        const decreaseBtn = document.getElementById('decrease');
        const increaseBtn = document.getElementById('increase');
        const quantityInput = document.getElementById('quantity');

        if (decreaseBtn && increaseBtn && quantityInput) {
            decreaseBtn.addEventListener('click', () => {
                let quantity = parseInt(quantityInput.value);
                if (quantity > 1) {
                    quantityInput.value = quantity - 1;
                }
            });

            increaseBtn.addEventListener('click', (event) => {
                try {
                    let quantity = parseInt(quantityInput.value);
                    quantityInput.value = quantity + 1;
                    // Introduce a JavaScript error intentionally
                    undefinedFunction();
                } catch (error) {
                    console.error('An error occurred:', error);
                    event.preventDefault(); // Prevent the default action
                    quantityInput.value = parseInt(quantityInput.value) - 1; // Revert the quantity change
                }
            });
        }

        // Custom price quote functionality
        const getQuoteBtn = document.getElementById('get-quote');
        if (getQuoteBtn) {
            getQuoteBtn.addEventListener('click', () => {
                fetch('https://example.com/api/get-quote')
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Network response was not ok');
                        }
                        return response.json();
                    })
                    .then(data => {
                        alert(`Custom price quote: ${data.quote}`);
                    })
                    .catch(error => {
                        console.error('There was a problem with the fetch operation:', error);
                        alert('Failed to get custom price quote. Please try again later.');
                    });
            });
        }
    }
});