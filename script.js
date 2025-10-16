// UniBite app — updated to show Details in a right-side panel; connected to db.json (dishes)
// Keep this file as script.js

let allDishes = [];
let cart = [];

/* ---------- ELEMENTS ---------- */
const appetizersEl = document.getElementById("appetizers");
const mainMealsEl = document.getElementById("mainMeals");
const dessertsEl = document.getElementById("desserts");
const likedMealsEl = document.getElementById("likedMeals");

const cartToggleBtn = document.getElementById("cartToggle");
const cartSidebar = document.getElementById("cartSidebar");
const closeCartBtn = document.getElementById("closeCart");
const cartItemsEl = document.getElementById("cartItems");
const cartSubtotalEl = document.getElementById("cartSubtotal");
const cartDeliveryEl = document.getElementById("cartDelivery");
const cartTotalEl = document.getElementById("cartTotal");
const cartCountEl = document.getElementById("cartCount");

const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const clearSearch = document.getElementById("clearSearch");

// detail panel elements
const detailPanel = document.getElementById("detailPanel");
const detailImage = document.getElementById("detailImage");
const detailTitle = document.getElementById("detailTitle");
const detailPrice = document.getElementById("detailPrice");
const detailIngredients = document.getElementById("detailIngredients");
const detailProcedure = document.getElementById("detailProcedure");
const detailAddCart = document.getElementById("detailAddCart");
const detailBack = document.getElementById("detailBack");
const detailClose = document.getElementById("detailClose");

/* ---------- FETCH DISHES ---------- */
async function loadDishes() {
  try {
    const res = await fetch("http://localhost:3000/dishes");
    if (!res.ok) throw new Error("Could not fetch dishes");
    allDishes = await res.json();

    // limit to 5 per category if db has more (ensures layout)
    const appetizers = allDishes.filter(d => d.category === "Appetizer").slice(0,5);
    const mains = allDishes.filter(d => d.category === "Main" || d.category === "Meal").slice(0,5);
    const desserts = allDishes.filter(d => d.category === "Dessert").slice(0,5);

    // recombine in that order for initial render
    const initial = [...appetizers, ...mains, ...desserts];
    renderLists(initial); // will distribute into category sections
    renderLiked(initial);
  } catch (err) {
    console.error(err);
    document.querySelector(".main-content").innerHTML = `<p style="color:red;text-align:center;">⚠️ Failed to load dishes. Is json-server running?</p>`;
  }
}

/* ---------- RENDER HELPERS ---------- */
function makeCard(dish) {
  const div = document.createElement("div");
  div.className = "meal-card";
  div.innerHTML = `
    <img src="${dish.image}" alt="${dish.name}">
    <div class="content">
      <h3>${dish.name}</h3>
      <p class="price">KSh ${dish.price}</p>
      <div class="card-actions">
        <button class="btn-detail" data-id="${dish.id}">Details</button>
        <button class="btn-add" data-id="${dish.id}">Add</button>
      </div>
    </div>`;
  return div;
}

function renderLists(list) {
  appetizersEl.innerHTML = "";
  mainMealsEl.innerHTML = "";
  dessertsEl.innerHTML = "";

  list.forEach(d => {
    const card = makeCard(d);
    if (d.category === "Appetizer") appetizersEl.appendChild(card);
    else if (d.category === "Main" || d.category === "Meal") mainMealsEl.appendChild(card);
    else if (d.category === "Dessert") dessertsEl.appendChild(card);
  });

  // attach events
  document.querySelectorAll(".btn-detail").forEach(b => b.addEventListener("click", () => showDetails(b.dataset.id)));
  document.querySelectorAll(".btn-add").forEach(b => b.addEventListener("click", () => addToCart(b.dataset.id)));
}

function renderLiked(list) {
  // simple top liked by price (placeholder since db.json items may not have likes)
  likedMealsEl.innerHTML = "";
  const sample = list.slice(0,4);
  sample.forEach(d => {
    const card = makeCard(d);
    likedMealsEl.appendChild(card);
  });
}

/* ---------- CATEGORY FILTER ---------- */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const cat = btn.dataset.cat;
    if (cat === "All") {
      renderLists(allDishes);
    } else if (cat === "Meals") {
      renderLists(allDishes.filter(d => d.category === "Main" || d.category === "Meal").slice(0,5));
    } else {
      renderLists(allDishes.filter(d => d.category === cat).slice(0,5));
    }

    // close detail panel when switching categories
    hideDetailPanel();
  });
});

/* ---------- SEARCH ---------- */
searchBtn.addEventListener("click", () => {
  const q = (searchInput.value || "").trim().toLowerCase();
  if (!q) { renderLists(allDishes); return; }
  const results = allDishes.filter(d => d.name.toLowerCase().includes(q) || (d.ingredients && d.ingredients.toLowerCase().includes(q)));
  renderLists(results);
  hideDetailPanel();
});
clearSearch.addEventListener("click", () => { searchInput.value = ""; renderLists(allDishes); hideDetailPanel(); });

/* ---------- CART ---------- */
cartToggleBtn.addEventListener("click", () => cartSidebar.classList.add("open"));
closeCartBtn.addEventListener("click", () => cartSidebar.classList.remove("open"));

function addToCart(id) {
  const dish = allDishes.find(d => String(d.id) === String(id));
  if (!dish) return;
  const existing = cart.find(c => c.id === dish.id);
  if (existing) existing.qty++;
  else cart.push({ id: dish.id, name: dish.name, price: dish.price, qty: 1, image: dish.image });

  renderCart();
}

function renderCart() {
  cartItemsEl.innerHTML = "";
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    const li = document.createElement("li");
    li.className = "cart-item";
    li.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div style="flex:1">
        <strong>${item.name}</strong>
        <div class="qty-controls">
          <button class="qty-btn" data-id="${item.id}" data-action="dec">−</button>
          <span style="padding:0 8px">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-action="inc">+</button>
        </div>
      </div>
      <div style="text-align:right">
        <div>KSh ${item.price * item.qty}</div>
        <button class="remove-btn" data-id="${item.id}">Remove</button>
      </div>
    `;
    cartItemsEl.appendChild(li);
  });

  const delivery = subtotal > 0 && subtotal < 500 ? 50 : 0;
  cartSubtotalEl.textContent = `KSh ${subtotal}`;
  cartDeliveryEl.textContent = `KSh ${delivery}`;
  cartTotalEl.textContent = `KSh ${subtotal + delivery}`;
  cartCountEl.textContent = cart.reduce((s,i)=>s+i.qty,0);

  // carts controls (delegated)
  document.querySelectorAll(".qty-btn").forEach(b => b.addEventListener("click", e => {
    const id = e.currentTarget.dataset.id;
    const action = e.currentTarget.dataset.action;
    const item = cart.find(c => String(c.id) === String(id));
    if(!item) return;
    if(action === "inc") item.qty++;
    else item.qty = Math.max(1, item.qty - 1);
    renderCart();
  }));
  document.querySelectorAll(".remove-btn").forEach(b => b.addEventListener("click", e => {
    const id = e.currentTarget.dataset.id;
    cart = cart.filter(c => String(c.id) !== String(id));
    renderCart();
  }));
}

/* ---------- DETAILS PANEL (RIGHT SIDE) ---------- */
function showDetails(id) {
  const dish = allDishes.find(d => String(d.id) === String(id));
  if (!dish) return;

  detailImage.src = dish.image || "";
  detailTitle.textContent = dish.name || "";
  detailPrice.textContent = `KSh ${dish.price || 0}`;
  if (dish.ingredients) {
    // Accept both array or comma string
    if (Array.isArray(dish.ingredients)) {
      detailIngredients.innerHTML = dish.ingredients.map(i => `<li>${i}</li>`).join("");
    } else {
      detailIngredients.innerHTML = dish.ingredients.split(",").map(i => `<li>${i.trim()}</li>`).join("");
    }
  } else detailIngredients.innerHTML = "";

  detailProcedure.textContent = dish.recipe || dish.procedure || "";

  detailAddCart.onclick = () => addToCart(dish.id);

  // show panel
  detailPanel.setAttribute("aria-hidden","false");
  // optional: blur main content for focus
  document.querySelector(".menu-side").style.filter = "blur(2px)";
}

function hideDetailPanel() {
  detailPanel.setAttribute("aria-hidden","true");
  document.querySelector(".menu-side").style.filter = "none";
}

detailBack.addEventListener("click", hideDetailPanel);
detailClose.addEventListener("click", hideDetailPanel);

/* ---------- INIT ---------- */
document.addEventListener("DOMContentLoaded", loadDishes);
