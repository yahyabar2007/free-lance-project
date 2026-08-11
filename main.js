// =========================================================
// AURA RESTAURANT — MAIN JAVASCRIPT
// =========================================================

"use strict";

// =========================================================
// CART
// =========================================================

let cart = [];

// =========================================================
// UPDATE CART
// =========================================================

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const cartCount = document.getElementById("cart-count");
  const totalElement = document.getElementById("total");

  if (!cartItems) return;

  cartItems.innerHTML = "";

  let total = 0;

  // Empty cart
  if (cart.length === 0) {
    const empty = document.createElement("li");

    empty.className = "empty-cart";
    empty.textContent = "Your cart is empty.";

    cartItems.appendChild(empty);
  } else {
    cart.forEach(function (item, index) {
      total += item.price;

      const li = document.createElement("li");

      const text = document.createElement("span");

      text.className = "cart-item-text";
      text.textContent = item.name + " - $" + item.price.toFixed(2);

      const remove = document.createElement("button");

      remove.type = "button";
      remove.className = "remove-item";
      remove.innerHTML = "×";

      remove.setAttribute("aria-label", "Remove " + item.name);

      remove.addEventListener("click", function (event) {
        event.stopPropagation();

        cart.splice(index, 1);

        updateCart();
      });

      li.appendChild(text);
      li.appendChild(remove);

      cartItems.appendChild(li);
    });
  }

  // Cart count
  if (cartCount) {
    cartCount.textContent = cart.length;
  }

  // Total
  if (totalElement) {
    totalElement.textContent = total.toFixed(2);
  }
}

// =========================================================
// ADD TO CART
// =========================================================

function addToCart(name, price) {
  const itemPrice = Number(price);

  if (!name || isNaN(itemPrice)) {
    return;
  }

  cart.push({
    name: name,
    price: itemPrice,
  });

  updateCart();

  // Automatically open the small side cart
  openCart();
}

// =========================================================
// SETUP ADD TO CART BUTTONS
// =========================================================

function setupAddToCart() {
  const addButtons = document.querySelectorAll(".food-bottom .btn-info");

  addButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      const card = button.closest(".food-card");

      if (!card) return;

      const nameElement = card.querySelector(".card-title");
      const priceElement = card.querySelector(".price");

      if (!nameElement || !priceElement) {
        return;
      }

      const name = nameElement.textContent.trim();

      const priceText = priceElement.textContent.replace("$", "").trim();

      const price = parseFloat(priceText);

      addToCart(name, price);
    });
  });
}

// =========================================================
// CREATE CART OVERLAY
// =========================================================

function createCartOverlay() {
  let overlay = document.getElementById("cart-overlay");

  if (overlay) {
    return overlay;
  }

  overlay = document.createElement("div");

  overlay.id = "cart-overlay";
  overlay.className = "cart-overlay";

  document.body.appendChild(overlay);

  overlay.addEventListener("click", function () {
    closeCart();
  });

  return overlay;
}

// =========================================================
// OPEN CART
// =========================================================

function openCart() {
  const cartBox = document.getElementById("cart");

  if (!cartBox) return;

  const overlay = createCartOverlay();

  // Make sure cart is visible
  cartBox.style.display = "flex";

  // Prevent page scrolling while cart is open
  document.body.classList.add("cart-is-open");

  // Force browser repaint before animation
  requestAnimationFrame(function () {
    cartBox.classList.add("cart-open");

    if (overlay) {
      overlay.classList.add("show");
    }
  });
}

// =========================================================
// CLOSE CART
// =========================================================

function closeCart() {
  const cartBox = document.getElementById("cart");

  const overlay = document.getElementById("cart-overlay");

  if (!cartBox) return;

  cartBox.classList.remove("cart-open");

  if (overlay) {
    overlay.classList.remove("show");
  }

  document.body.classList.remove("cart-is-open");

  setTimeout(function () {
    if (!cartBox.classList.contains("cart-open")) {
      cartBox.style.display = "none";
    }
  }, 350);
}

// =========================================================
// TOGGLE CART
// =========================================================

function toggleCart(event) {
  if (event) {
    event.preventDefault();
    event.stopPropagation();
  }

  const cartBox = document.getElementById("cart");

  if (!cartBox) return;

  if (cartBox.classList.contains("cart-open")) {
    closeCart();
  } else {
    openCart();
  }
}

// =========================================================
// CLEAR CART
// =========================================================

function clearCart() {
  cart = [];

  updateCart();
}

// =========================================================
// CHECKOUT
// =========================================================

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  const total = cart.reduce(function (sum, item) {
    return sum + item.price;
  }, 0);

  alert(
    "Thank you for your order!\n\n" +
      "Total: $" +
      total.toFixed(2) +
      "\n\n" +
      "Your order has been placed successfully.",
  );

  clearCart();

  closeCart();
}

// =========================================================
// SETUP CART
// =========================================================

function setupCart() {
  const cartButton = document.querySelector(".navbar .nav-cart-btn");

  const closeButton = document.querySelector(".cart-close");

  const checkoutButton = document.querySelector(".cart-footer .btn-success");

  const clearButton = document.querySelector(".cart-footer .btn-danger");

  // Create overlay
  createCartOverlay();

  // Navbar cart button
  if (cartButton) {
    cartButton.addEventListener("click", function (event) {
      toggleCart(event);
    });
  }

  // Close X
  if (closeButton) {
    closeButton.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();

      closeCart();
    });
  }

  // Checkout
  if (checkoutButton) {
    checkoutButton.addEventListener("click", function (event) {
      event.preventDefault();

      checkout();
    });
  }

  // Clear cart
  if (clearButton) {
    clearButton.addEventListener("click", function (event) {
      event.preventDefault();

      clearCart();
    });
  }

  // ESC closes cart
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeCart();
    }
  });
}

// =========================================================
// BACK TO TOP
// =========================================================

function setupBackToTop() {
  let button = document.getElementById("backToTop");

  // Create button if it doesn't exist
  if (!button) {
    button = document.createElement("button");

    button.id = "backToTop";
    button.className = "back-to-top";
    button.type = "button";
    button.setAttribute("aria-label", "Back to top");
    button.innerHTML = "↑";

    document.body.appendChild(button);
  }

  function updateButton() {
    if (window.scrollY > 400) {
      button.classList.add("show");
    } else {
      button.classList.remove("show");
    }
  }

  window.addEventListener("scroll", updateButton, {
    passive: true,
  });

  button.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });

  updateButton();
}

// =========================================================
// SMOOTH NAVIGATION
// =========================================================

function setupNavigation() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach(function (link) {
    link.addEventListener("click", function (event) {
      const targetId = link.getAttribute("href");

      if (!targetId || targetId === "#") {
        return;
      }

      const target = document.querySelector(targetId);

      if (!target) {
        return;
      }

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

      // Close mobile Bootstrap navbar
      const navbarCollapse = document.querySelector(".navbar-collapse");

      if (
        navbarCollapse &&
        navbarCollapse.classList.contains("show") &&
        typeof window.jQuery !== "undefined"
      ) {
        window.jQuery(navbarCollapse).collapse("hide");
      }
    });
  });
}

// =========================================================
// RESTAURANT MAP
// =========================================================

// Restaurant location
const AURA_LOCATION = [30.7865, 31.0004];

let restaurantMap = null;

// =========================================================
// MAP MESSAGE
// =========================================================

function setLocationMessage(message) {
  const messageElement = document.getElementById("location-message");

  if (messageElement) {
    messageElement.textContent = message;
  }
}

// =========================================================
// INITIALIZE RESTAURANT MAP
// =========================================================

function initializeMap() {
  const mapElement = document.getElementById("liveMap");

  if (!mapElement) {
    console.warn("AURA map container #liveMap was not found.");

    return;
  }

  // Check Leaflet
  if (typeof L === "undefined") {
    setLocationMessage(
      "The map could not be loaded. Please check your internet connection.",
    );

    return;
  }

  // Prevent initializing twice
  if (restaurantMap) {
    return;
  }

  // Create map
  restaurantMap = L.map("liveMap", {
    zoomControl: true,
    scrollWheelZoom: false,
    dragging: true,
    doubleClickZoom: true,
    touchZoom: true,
  });

  // OpenStreetMap
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,

    attribution:
      '© <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors',
  }).addTo(restaurantMap);

  // =====================================================
  // CUSTOM RESTAURANT ICON
  // =====================================================

  const auraIcon = L.divIcon({
    className: "aura-map-marker",

    html: `
      <div class="aura-marker-pin">
        <span>🍽️</span>
      </div>
    `,

    iconSize: [46, 46],

    iconAnchor: [23, 46],

    popupAnchor: [0, -42],
  });

  // =====================================================
  // RESTAURANT MARKER
  // =====================================================

  const restaurantMarker = L.marker(AURA_LOCATION, {
    icon: auraIcon,
    title: "AURA Restaurant",
  }).addTo(restaurantMap);

  // =====================================================
  // RESTAURANT POPUP
  // =====================================================

  restaurantMarker.bindPopup(`
    <div class="aura-map-popup">
      <div class="popup-title">
        🍽️ AURA Restaurant
      </div>

      <div class="popup-location">
        📍 Tanta, Egypt
      </div>

      <div class="popup-status">
        ✦ Welcome to AURA
      </div>
    </div>
  `);

  // Center map
  restaurantMap.setView(AURA_LOCATION, 15);

  // Open restaurant popup
  restaurantMarker.openPopup();

  setLocationMessage("Find AURA Restaurant in Tanta, Egypt.");

  // Fix map rendering
  setTimeout(function () {
    if (restaurantMap) {
      restaurantMap.invalidateSize();
      restaurantMap.setView(AURA_LOCATION, 15);
    }
  }, 300);

  setTimeout(function () {
    if (restaurantMap) {
      restaurantMap.invalidateSize();
    }
  }, 1000);

  // Responsive map
  window.addEventListener("resize", function () {
    if (restaurantMap) {
      restaurantMap.invalidateSize();
    }
  });
}

// =========================================================
// REMOVE LIVE LOCATION BUTTON
// =========================================================

function setupLocationSection() {
  // We don't need visitor location
  const locateButton = document.getElementById("locateMe");

  if (locateButton) {
    locateButton.style.display = "none";
  }

  // Remove Google Maps link
  const locationLinks = document.querySelectorAll(".location-link");

  locationLinks.forEach(function (link) {
    link.style.display = "none";
  });
}

// =========================================================
// MAKE DISH CARDS CONSISTENT
// =========================================================

function setupDishCards() {
  const cards = document.querySelectorAll(
    ".food-card, .card, .menu-card, .dish-card",
  );

  cards.forEach(function (card) {
    card.classList.add("aura-dish-card");
  });
}

// =========================================================
// FOOTER CREDIT
// =========================================================

function setupFooterCredit() {
  const footer = document.querySelector("footer");

  if (!footer) return;

  // Don't add twice
  if (footer.querySelector(".developer-credit")) {
    return;
  }

  const credit = document.createElement("div");

  credit.className = "developer-credit";

  credit.innerHTML = `
    Made by
    <a
      href="https://github.com/yahyabar2007"
      target="_blank"
      rel="noopener noreferrer"
    >
      Yhaya Bar
    </a>
  `;

  footer.appendChild(credit);
}

// =========================================================
// RESPONSIVE MOBILE MENU
// =========================================================

function setupResponsiveMenu() {
  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  window.addEventListener("resize", function () {
    if (window.innerWidth > 991) {
      document.body.classList.remove("mobile-menu-open");
    }
  });
}

// =========================================================
// INITIALIZE WEBSITE
// =========================================================

document.addEventListener("DOMContentLoaded", function () {
  // Cart
  updateCart();

  setupAddToCart();

  setupCart();

  // Navigation
  setupNavigation();

  // Back to top
  setupBackToTop();

  // Restaurant map
  initializeMap();

  // Location section
  setupLocationSection();

  // Consistent cards
  setupDishCards();

  // Footer
  setupFooterCredit();

  // Responsive menu
  setupResponsiveMenu();

  console.log("AURA Restaurant website initialized successfully.");
});
