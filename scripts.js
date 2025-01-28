const params = new URLSearchParams(window.location.search);

/**
 * Attach the Noibu collect script if 'noNjs' is not present
 */
if (params.has('noNjs')) {
  console.log('noNjs detected, skipping collect script');
} else {
  console.log('noNjs param not detected, attaching collect script');
  const script = document.createElement('script');
  script.src = 'https://cdn.noibu.com/collect-core.js';
  document.head.appendChild(script);
}

// Handle the delayed or immediate script loading
if (params.has('delayBodyScript')) {
  document.addEventListener('loadBodyScript', init);
} else {
  init();
}

/**
 * Replaces links with query parameters appended if any exist.
 */
function replaceLinks() {
  if ([...params.keys()].length) {
    const links = [
      ...document.querySelectorAll('[src]'),
      ...document.querySelectorAll('[href]'),
    ];

    links.forEach((el) => {
      if (el.src) {
        el.src = `${el.src.replace('?', '')}?${params.toString()}`;
      }
      if (el.href) {
        el.href = `${el.href.replace('?', '')}?${params.toString()}`;
      }
    });
  }
}

/**
 * Main listener function to initialize content and behaviors.
 */
function listener() {
  Promise.allSettled([
    // Load the navigation bar
    fetch('nav.html')
      .then((response) => response.text())
      .then((data) => {
        document.querySelector('header').innerHTML += data;
      }),

    // Load the footer
    fetch('footer.html')
      .then((response) => response.text())
      .then((data) => {
        document.body.innerHTML += data;
        attachEventListeners();
      }),
  ]).then(replaceLinks);
}

/**
 * Attaches event listeners for various user interactions.
 */
function attachEventListeners() {
  // Add to cart functionality
  document.querySelectorAll('.btn#add-to-cart').forEach((button) => {
    button.addEventListener('click', addToCart);
  });

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
        // Simulate an error for demonstration purposes
        undefinedFunction();
      } catch (error) {
        console.error('An error occurred:', error);
        event.preventDefault();
        quantityInput.value = parseInt(quantityInput.value) - 1;
      }
    });
  }

  // Custom price quote functionality
  const getQuoteBtn = document.getElementById('get-quote');
  if (getQuoteBtn) {
    getQuoteBtn.addEventListener('click', () => {
      fetch('https://httpstat.us/500', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: 'product3' }),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((data) => {
          alert(`Custom price quote: ${data.quote}`);
        })
        .catch((error) => {
          console.error('Fetch operation error:', error);
          alert('Failed to get custom price quote. Please try again later.');
        });
    });
  }
}

/**
 * Initializes the main listener once DOM content is loaded.
 */
function init() {
  document.addEventListener('DOMContentLoaded', listener);
}
