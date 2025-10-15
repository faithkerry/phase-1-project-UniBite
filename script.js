// UniBite app: Kenyan dishes, categories, cart with totals, likes, details and search.

// ---------- DATA (Kenyan dishes) ----------
const MEALS = [
  // Appetizers
  { id: "a1", name: "Samosa (3 pcs)", category: "Appetizer", price: 80, image: "https://images.unsplash.com/photo-1603898037225-9b74fce5b9b1?auto=format&fit=crop&w=800&q=80",
    ingredients:["Potato","Peas","Pastry","Oil","Spices"], procedure:"Prepare spiced potato filling, stuff into pastry, deep fry until golden.", likes: 18 },
  { id: "a2", name: "Fruit Salad", category: "Appetizer", price: 120, image: "https://images.unsplash.com/photo-1556767576-cfba2f3b2d5e?auto=format&fit=crop&w=800&q=80",
    ingredients:["Mango","Pineapple","Banana","Lime","Honey"], procedure:"Chop fruits, toss with lime & honey, chill and serve.", likes: 10 },
  { id: "a3", name: "Vegetable Soup", category: "Appetizer", price: 100, image: "https://images.unsplash.com/photo-1604908177729-150d6ef83f0c?auto=format&fit=crop&w=800&q=80",
    ingredients:["Carrot","Cabbage","Onion","Stock","Salt"], procedure:"Simmer veg in stock until tender. Season to taste.", likes: 7 },

  // Main meals
  { id: "m1", name: "Ugali & Sukuma Wiki", category: "Main", price: 120, image: "https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=80",
    ingredients:["Maize flour","Kale","Tomato","Onion","Oil"], procedure:"Cook ugali until firm. Sauté onions & tomatoes; add sukuma and serve with ugali.", likes: 30 },
  { id: "m2", name: "Pilau & Kachumbari", category: "Main", price: 200, image: "https://images.unsplash.com/photo-1625944526746-1c6261e25e12?auto=format&fit=crop&w=800&q=80",
    ingredients:["Rice","Pilau spices","Meat","Onion","Tomatoes"], procedure:"Fry spices & onions, add meat, then rice & water. Serve with kachumbari.", likes: 42 },
  { id: "m3", name: "Chapati & Beans", category: "Main", price: 110, image: "https://images.unsplash.com/photo-1630538519915-f90efbdf8a5e?auto=format&fit=crop&w=800&q=80",
    ingredients:["Flour","Beans","Onion","Tomato","Oil"], procedure:"Make chapati dough, pan-fry. Cook beans in sauce and serve together.", likes: 25 },
  { id: "m4", name: "Fried Tilapia & Ugali", category: "Main", price: 300, image: "https://images.unsplash.com/photo-1617196034796-73a55a9a5562?auto=format&fit=crop&w=800&q=80",
    ingredients:["Tilapia","Maize flour","Salt","Oil"], procedure:"Season tilapia & fry until crisp. Prepare ugali; serve together.", likes: 15 },

  // Desserts
  { id: "d1", name: "Chocolate Cake Slice", category: "Dessert", price: 200, image: "https://images.unsplash.com/photo-1605478042350-5f0b1a5f1f02?auto=format&fit=crop&w=800&q=80",
    ingredients:["Flour","Cocoa","Sugar","Eggs","Butter"], procedure:"Mix batter, bake at 180°C until set. Cool & slice.", likes: 35 },
  { id: "d2", name: "Vanilla Ice Cream", category: "Dessert", price: 150, image: "https://images.unsplash.com/photo-1565958011705-44e2110a16df?auto=format&fit=crop&w=800&q=80",
    ingredients:["Milk","Cream","Sugar","Vanilla"], procedure:"Churn mix until set. Serve chilled.", likes: 22 },
  { id: "d3", name: "Brownie", category: "Dessert", price: 180, image: "https://images.unsplash.com/photo-1605478492201-c33efb8bdb56?auto=format&fit=crop&w=800&q=80",
    ingredients:["Chocolate","Butter","Sugar","Flour","Eggs"], procedure:"Mix, bake until just set; cool and cut.", likes: 28 }
];

// ---------- STATE ----------
let cart = []; // {id, qty}
let likes = {}; // dynamic likes stored by id (starts from MEALS data)
MEALS.forEach(m => likes[m.id] = m.likes || 0);

// ---------- ELEMENTS ----------
const appetizersEl = document.getElementById("appetizers");
const mainMealsEl  = document.getElementById("mainMeals");
const dessertsEl   = document.getElementById("desserts");
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

// detail overlay
const detailOverlay = document.getElementById("detailOverlay");
const detailImage = document.getElementById("detailImage");
const detailTitle = document.getElementById("detailTitle");
const detailPrice = document.getElementById("detailPrice");
const detailIngredients = document.getElementById("detailIngredients");
const detailProcedure = document.getElementById("detailProcedure");
const detailAddCart = document.getElementById("detailAddCart");
const detailBack = document.getElementById("detailBack");
const detailClose = document.getElementById("detailClose");

let currentDetail = null; // last item shown in detail

// ---------- HELPERS ----------
function formatKsh(n){ return `KSh ${n}`; }

function getById(id){ return MEALS.find(m=>m.id===id); }

// ---------- RENDER FUNCTIONS ----------
function renderCard(item){
  return `
    <div class="meal-card" data-id="${item.id}">
      <img src="${item.image}" alt="${item.name}" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22240%22 height=%22160%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23fff4eb%22/><text x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 fill=%22%23ff7b00%22 font-family=%22Poppins%22 font-size=%2212%22>Image not found</text></svg>'">
      <div class="content">
        <h3>${item.name}</h3>
        <p>${item.category}</p>
        <p class="text-success">${formatKsh(item.price)}</p>
        <div class="btn-row">
          <span class="like-heart" data-id="${item.id}">❤️ ${likes[item.id]}</span>
          <div style="margin-left:auto;display:flex;gap:8px">
            <button class="btn-primary-sm add-cart-btn" data-id="${item.id}">Add</button>
            <button class="btn-outline-sm details-btn" data-id="${item.id}">Details</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

function renderListTo(containerEl, list){
  containerEl.innerHTML = list.map(renderCard).join("");
}

// Render categories
function renderAll(){
  const apps = MEALS.filter(m=>m.category==="Appetizer");
  const mains = MEALS.filter(m=>m.category==="Main");
  const dess = MEALS.filter(m=>m.category==="Dessert");
  renderListTo(appetizersEl, apps);
  renderListTo(mainMealsEl, mains);
  renderListTo(dessertsEl, dess);
  renderLiked();
}

// Most liked: top 6 by likes
function renderLiked(){
  const sorted = [...MEALS].sort((a,b)=> likes[b.id] - likes[a.id]).slice(0,6);
  likedMealsEl.innerHTML = sorted.map(m => `
    <div class="meal-card" data-id="${m.id}">
      <img src="${m.image}" alt="${m.name}">
      <div class="content"><h3>${m.name}</h3><p class="text-success">${formatKsh(m.price)}</p><small>${likes[m.id]} ❤️ likes</small></div>
    </div>
  `).join("");
}

// ---------- CATEGORY FILTER (nav buttons) ----------
document.querySelectorAll('.nav-btn').forEach(btn=>{
  btn.addEventListener('click', ()=> {
    const cat = btn.dataset.cat;
    if(cat === 'All') {
      document.getElementById('appetizerSection').style.display = '';
      document.getElementById('mainSection').style.display = '';
      document.getElementById('dessertSection').style.display = '';
    } else {
      // hide all, show only matching
      document.getElementById('appetizerSection').style.display = (cat==='Appetizer') ? '' : 'none';
      document.getElementById('mainSection').style.display = (cat==='Main') ? '' : 'none';
      document.getElementById('dessertSection').style.display = (cat==='Dessert') ? '' : 'none';
    }
    // scroll to first visible category
    const visible = document.querySelector('section.category:not([style*="display: none"])');
    if(visible) visible.scrollIntoView({behavior:'smooth'});
  });
});

// ---------- CLICK DELEGATION for cards (like, add, details) ----------
document.addEventListener('click', (e)=>{
  // like
  const likeEl = e.target.closest('.like-heart');
  if(likeEl){
    const id = likeEl.dataset.id;
    likes[id] = (likes[id] || 0) + 1;
    renderAll();
    return;
  }

  // add to cart
  const addBtn = e.target.closest('.add-cart-btn');
  if(addBtn){
    const id = addBtn.dataset.id;
    addToCart(id);
    return;
  }

  // details
  const detailBtn = e.target.closest('.details-btn');
  if(detailBtn){
    const id = detailBtn.dataset.id;
    openDetail(id);
    return;
  }
});

// ---------- DETAILS overlay ----------
function openDetail(id){
  const meal = getById(id);
  if(!meal) return;
  currentDetail = meal;
  detailImage.src = meal.image;
  detailTitle.textContent = meal.name;
  detailPrice.textContent = formatKsh(meal.price);
  detailIngredients.innerHTML = (meal.ingredients || []).map(i=>`<li>${i}</li>`).join('');
  detailProcedure.textContent = meal.procedure || '';
  detailOverlay.style.display = 'flex';
}
detailClose.addEventListener('click', ()=> detailOverlay.style.display='none');
detailBack.addEventListener('click', ()=> detailOverlay.style.display='none');
detailAddCart.addEventListener('click', ()=>{
  if(currentDetail) addToCart(currentDetail.id);
  detailOverlay.style.display = 'none';
});

// ---------- CART functions ----------
function addToCart(id){
  const existing = cart.find(i=>i.id===id);
  if(existing) existing.qty++;
  else cart.push({id, qty:1});
  renderCart();
  openCart(); // open so user sees change
}

function removeFromCart(id){
  cart = cart.filter(i=> i.id !== id);
  renderCart();
}

function changeQty(id, delta){
  const item = cart.find(i=>i.id===id);
  if(!item) return;
  item.qty += delta;
  if(item.qty < 1) removeFromCart(id);
  renderCart();
}

function renderCart(){
  if(cart.length===0){
    cartItemsEl.innerHTML = `<p class="text-muted">Your cart is empty.</p>`;
    cartSubtotalEl.textContent = formatKsh(0);
    cartDeliveryEl.textContent = formatKsh(0);
    cartTotalEl.textContent = formatKsh(0);
    cartCountEl.textContent = 0;
    return;
  }
  const rows = cart.map(entry=>{
    const meal = getById(entry.id);
    const lineTotal = meal.price * entry.qty;
    return `
      <li class="cart-item" data-id="${entry.id}">
        <img src="${meal.image}" alt="${meal.name}" onerror="this.onerror=null;this.src='data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2264%22 height=%2254%22><rect width=%22100%25%22 height=%22100%25%22 fill=%22%23fff4eb%22/></svg>'" />
        <div style="flex:1">
          <strong>${meal.name}</strong>
          <div class="qty-controls">
            <button onclick="changeQty('${entry.id}', -1)">−</button>
            <span style="padding:0 8px">${entry.qty}</span>
            <button onclick="changeQty('${entry.id}', 1)">+</button>
          </div>
        </div>
        <div style="text-align:right">
          <div>${formatKsh(lineTotal)}</div>
          <button class="remove-btn" onclick="removeFromCart('${entry.id}')">Remove</button>
        </div>
      </li>
    `;
  }).join('');
  cartItemsEl.innerHTML = rows;
  const subtotal = cart.reduce((s, c) => {
    const meal = getById(c.id);
    return s + meal.price * c.qty;
  }, 0);
  const delivery = subtotal > 0 && subtotal < 500 ? 50 : 0; // simple rule: KSh50 delivery under 500
  cartSubtotalEl.textContent = formatKsh(subtotal);
  cartDeliveryEl.textContent = formatKsh(delivery);
  cartTotalEl.textContent = formatKsh(subtotal + delivery);
  cartCountEl.textContent = cart.reduce((s,c)=> s + c.qty, 0);
}

// cart open/close
function openCart(){ cartSidebar.classList.add('open'); cartSidebar.setAttribute('aria-hidden','false'); }
function closeCart(){ cartSidebar.classList.remove('open'); cartSidebar.setAttribute('aria-hidden','true'); }

cartToggleBtn.addEventListener('click', ()=> {
  if(cartSidebar.classList.contains('open')) closeCart(); else openCart();
});
closeCartBtn.addEventListener('click', ()=> closeCart());

// ---------- SEARCH ----------
function doSearch(query){
  const q = (query||'').trim().toLowerCase();
  if(!q){
    // show full menu
    renderAll();
    return;
  }
  // search across name, category, ingredients
  const results = MEALS.filter(m => {
    const inName = m.name.toLowerCase().includes(q);
    const inCat = m.category.toLowerCase().includes(q);
    const inIng = (m.ingredients || []).join(' ').toLowerCase().includes(q);
    return inName || inCat || inIng;
  });
  // hide category sections and create temporary results
  document.getElementById('appetizerSection').style.display = 'none';
  document.getElementById('mainSection').style.display = 'none';
  document.getElementById('dessertSection').style.display = 'none';
  document.getElementById('likedSection').style.display = 'none';

  // create results area (replace previous if exists)
  let container = document.getElementById('searchResults');
  if(container) container.remove();
  container = document.createElement('section');
  container.id = 'searchResults';
  container.className = 'category';
  container.innerHTML = `<h2>Search results for "${query}"</h2><div id="searchGrid" class="meal-grid"></div>
    <div style="margin-top:18px"><button id="backMenu" class="btn-outline-sm">⬅ Back to Menu</button></div>`;
  document.querySelector('.main-content').prepend(container);
  const searchGrid = document.getElementById('searchGrid');
  searchGrid.innerHTML = results.map(renderCard).join('');
  document.getElementById('backMenu').addEventListener('click', ()=> {
    container.remove();
    document.getElementById('appetizerSection').style.display = '';
    document.getElementById('mainSection').style.display = '';
    document.getElementById('dessertSection').style.display = '';
    document.getElementById('likedSection').style.display = '';
  });
}

searchBtn?.addEventListener('click', ()=> doSearch(searchInput.value));
clearSearch?.addEventListener('click', ()=> { searchInput.value=''; doSearch(''); });
searchInput?.addEventListener('keypress', (e)=> { if(e.key==='Enter') doSearch(searchInput.value); });

// ---------- INIT ----------
renderAll();
renderCart();
