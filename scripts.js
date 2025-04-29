const params = new URLSearchParams(window.location.search);

/**
 * GTM
 */
const gtm = document.createElement('gtm');
gtm.src = (function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != 'dataLayer' ? '&l=' + l : '';
  j.async = true;
  j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, 'script', 'dataLayer', 'GTM-WS7T3NM2');
document.head.appendChild(gtm);

/**
 * Attach the Noibu collect script
 */
const script = document.createElement('script');
script.src = 'https://cdn.noibu.com/collect-core.js';
document.head.appendChild(script);

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
  document.querySelectorAll('.btn[name=add-to-cart]').forEach((button) => {
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
  document.addEventListener('DOMContentLoaded', () => {
    listener();

    async function checkSDKExistenceAndRequestHelpCode() {
      // Check if the current page is the contact-us page
      if (window.location.pathname.includes('contact-us')) {
        try {
          // Wait for the Noibu SDK to load if it's not already available
          if (!window.NOIBUJS) {
            await new Promise((resolve, reject) => {
              const timeout = setTimeout(() => {
                reject(new Error('Noibu SDK did not load within the expected time.'));
              }, 10000); // Timeout after 10 seconds

              window.addEventListener('noibuSDKReady', () => {
                clearTimeout(timeout);
                resolve();
              });
            });
          }

          // Call the requestHelpCode function
          if (window.NOIBUJS) {
            const helpcode = await NOIBUJS.requestHelpCode(false);
            console.log(helpcode);
          } else {
            console.error('NOIBUJS is not available after waiting for the SDK.');
          }
        } catch (error) {
          console.error('Error while requesting help code:', error);
        }
      }
    }

    checkSDKExistenceAndRequestHelpCode();
  });
}

// Add a listener for the Noibu SDK and attach the help code functionality
document.addEventListener("DOMContentLoaded", () => {
  if (window.NOIBUJS) {
    attachHelpCodeListener();
  } else {
    window.addEventListener("noibuSDKReady", attachHelpCodeListener);
  }
});

function attachHelpCodeListener() {
  const button = document.getElementById("request-help-code");
  const label = document.getElementById("help-code-result");

  if (button && label) {
    button.addEventListener("click", async () => {
      try {
        const helpCode = await window.NOIBUJS.requestHelpCode(false);
        label.innerText = helpCode;
      } catch (error) {
        console.error("Error fetching help code:", error);
      }
    });
  } else {
    console.warn("Help code button or result label not found on this page.");
  }
}
