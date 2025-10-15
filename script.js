// UniBite app: Kenyan dishes, categories, cart with totals, likes, details and search.

// ---------- GLOBAL DATA ----------
let MEALS = []; // will now be fetched from db.json
let cart = [];
let likes = {};

// ---------- FETCH FROM db.json ----------
async function loadMeals() {
  try {
    const res = await fetch("http://localhost:3000/meals"); // connect to your local JSON API
    if (!res.ok) throw new Error("Failed to fetch meals");
    MEALS = await res.json();

    // Initialize likes from db.json
    MEALS.forEach(m => likes[m.id] = m.likes || 0);

    renderAll();
    renderCart();
  } catch (err) {
    console.error("Error loading meals:", err);
    const main = document.querySelector(".main-content");
    main.innerHTML = `<p style="color:red;text-align:center;">⚠️ Failed to load meals. Check if JSON server is running.</p>`;
  }
}

// ---------- RENDER FUNCTIONS ----------
function renderAll() {
  renderMeals("Appetizer", document.getElementById("appetizers"));
  renderMeals("Main", document.getElementById("mainMeals"));
  renderMeals("Dessert", document.getElementById("desserts"));
  renderLiked();
}

function renderMeals(category, container) {
  container.innerHTML = "";
  MEALS.filter(m => category === "All" || m.category === category).forEach(m => {
    const card = document.createElement("div");
    card.className = "meal-card";
    card.innerHTML = `
      <img src="${m.image}" alt="${m.name}" class="meal-img" />
      <h4>${m.name}</h4>
      <p class="price">KSh ${m.price}</p>
      <div class="meal-actions">
        <button class="btn-like" data-id="${m.id}">❤️ ${likes[m.id] || 0}</button>
        <button class="btn-cart" data-id="${m.id}">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });
}

function renderLiked() {
  const likedContainer = document.getElementById("likedMeals");
  likedContainer.innerHTML = "";
  const sorted = Object.entries(likes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([id]) => MEALS.find(m => m.id === id))
    .filter(Boolean);
  sorted.forEach(m => {
    const card = document.createElement("div");
    card.className = "meal-card";
    card.innerHTML = `
      <img src="${m.image}" alt="${m.name}" class="meal-img" />
      <h4>${m.name}</h4>
      <p class="price">KSh ${m.price}</p>
      <div class="meal-actions">
        <button class="btn-like" data-id="${m.id}">❤️ ${likes[m.id]}</button>
        <button class="btn-cart" data-id="${m.id}">Add to Cart</button>
      </div>
    `;
    likedContainer.appendChild(card);
  });
}

function renderCart() {
  const cartList = document.getElementById("cartItems");
  const cartCount = document.getElementById("cartCount");
  const subtotalEl = document.getElementById("cartSubtotal");
  const totalEl = document.getElementById("cartTotal");
  cartList.innerHTML = "";

  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const li = document.createElement("li");
    li.innerHTML = `
      <div class="cart-line">
        <span>${item.name} (${item.qty})</span>
        <span>KSh ${item.price * item.qty}</span>
      </div>
    `;
    cartList.appendChild(li);
  });

  const delivery = subtotal > 0 ? 50 : 0;
  subtotalEl.textContent = `KSh ${subtotal}`;
  totalEl.textContent = `KSh ${subtotal + delivery}`;
  cartCount.textContent = cart.length;
}

// ---------- EVENT HANDLERS ----------
document.addEventListener("click", e => {
  if (e.target.classList.contains("btn-cart")) {
    const id = e.target.dataset.id;
    const meal = MEALS.find(m => m.id === id);
    if (meal) addToCart(meal);
  }

  if (e.target.classList.contains("btn-like")) {
    const id = e.target.dataset.id;
    likes[id] = (likes[id] || 0) + 1;
    renderAll();
  }

  if (e.target.id === "cartToggle") {
    document.getElementById("cartSidebar").classList.toggle("open");
  }

  if (e.target.id === "closeCart") {
    document.getElementById("cartSidebar").classList.remove("open");
  }
});

function addToCart(meal) {
  const existing = cart.find(i => i.id === meal.id);
  if (existing) existing.qty++;
  else cart.push({ ...meal, qty: 1 });
  renderCart();
}

// ---------- SEARCH ----------
document.getElementById("searchBtn").addEventListener("click", () => {
  const term = document.getElementById("searchInput").value.toLowerCase();
  const filtered = MEALS.filter(m => m.name.toLowerCase().includes(term));
  showSearchResults(filtered);
});

document.getElementById("clearSearch").addEventListener("click", () => {
  document.getElementById("searchInput").value = "";
  renderAll();
});

function showSearchResults(results) {
  document.querySelectorAll(".meal-grid").forEach(g => g.innerHTML = "");
  const container = document.createElement("div");
  container.className = "meal-grid";
  results.forEach(m => {
    const card = document.createElement("div");
    card.className = "meal-card";
    card.innerHTML = `
      <img src="${m.image}" alt="${m.name}" class="meal-img" />
      <h4>${m.name}</h4>
      <p class="price">KSh ${m.price}</p>
      <div class="meal-actions">
        <button class="btn-like" data-id="${m.id}">❤️ ${likes[m.id]}</button>
        <button class="btn-cart" data-id="${m.id}">Add to Cart</button>
      </div>
    `;
    container.appendChild(card);
  });

  const main = document.querySelector(".main-content");
  main.innerHTML = `
    <section>
      <h2>🔍 Search Results</h2>
      ${container.outerHTML}
      <button id="backToMenu" class="btn-outline-sm">⬅ Back to Menu</button>
    </section>
  `;

  document.getElementById("backToMenu").addEventListener("click", renderAll);
}

// ---------- INITIALIZE ----------
document.addEventListener("DOMContentLoaded", () => {
  loadMeals(); // load meals from db.json when page opens
});
