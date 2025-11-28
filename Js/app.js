// bizzhuss app.js — handles demo data, cart, favourites, search modal, and UI interactions
(function(){
  const STORAGE = { CART: 'bizzhuss_cart_v1', FAV: 'bizzhuss_fav_v1' };

  // --- Seed product dataset (12 items) ---
  const products = [
    { id: 'p1', title: 'Aero Wireless Headphones', slug:'aero-wireless-headphones', description: 'Lightweight noise-cancelling Bluetooth headphones.', price: 129.00, salePrice: 99.00, images: ['https://images.unsplash.com/photo-1518443982064-4c3f8f0f3b19?w=1200&q=80'], category: 'Audio', tags:['wireless','audio'], rating:4.6, stock: 14 },
    { id: 'p2', title: 'Urban Minimal Watch', slug:'urban-minimal-watch', description: 'Water-resistant watch with clean minimal face.', price: 149.00, images: ['https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?w=1200&q=80'], category: 'Accessories', tags:['watch','minimal'], rating:4.4, stock: 8 },
    { id: 'p3', title: 'Transit Everyday Bag', slug:'transit-everyday-bag', description: 'Rugged modern tote for everyday essentials.', price: 79.00, salePrice: 59.00, images: ['https://images.unsplash.com/photo-1520975920083-5b9d4db9d3b4?w=1200&q=80'], category: 'Bags', tags:['travel','everyday'], rating:4.2, stock: 20 },
    { id: 'p4', title: 'Lumen Desk Lamp', slug:'lumen-desk-lamp', description: 'Warm LED desk lamp with dimmer and USB-C.', price: 59.00, images: ['https://images.unsplash.com/photo-1503602642458-232111445657?w=1200&q=80'], category: 'Home', tags:['lamp','home'], rating:4.7, stock: 11 },
    { id: 'p5', title: 'Canvas Running Shoes', slug:'canvas-running-shoes', description: 'Lightweight canvas sneakers for daily runs.', price: 89.00, salePrice:69.00, images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200&q=80'], category: 'Footwear', tags:['shoes','running'], rating:4.5, stock: 25 },
    { id: 'p6', title: 'Aurora Laptop Sleeve', slug:'aurora-laptop-sleeve', description: 'Sleek 13" protective laptop sleeve.', price: 35.00, images: ['https://images.unsplash.com/photo-1527430253228-e93688616381?w=1200&q=80'], category: 'Accessories', tags:['laptop','cover'], rating:4.3, stock: 9 },
    { id: 'p7', title: 'Grid Ceramic Mug', slug:'grid-ceramic-mug', description: 'Handmade ceramic mug for your morning brew.', price: 18.00, images: ['https://images.unsplash.com/photo-1526318472351-c75fcf07039e?w=1200&q=80'], category: 'Home', tags:['mug','kitchen'], rating:4.1, stock: 40 },
    { id: 'p8', title: 'Pulse Fitness Watch', slug:'pulse-fitness-watch', description: 'Activity tracker with heart-rate sensor.', price:199.00, salePrice:159.00, images: ['https://images.unsplash.com/photo-1556404396-1b1d53a260e0?w=1200&q=80'], category: 'Fitness', tags:['fitness','tracker'], rating:4.8, stock: 6 },
    { id: 'p9', title: 'Studio Microphone', slug:'studio-microphone', description: 'USB condenser mic for streaming & podcasting.', price: 129.00, images: ['https://images.unsplash.com/photo-1517949908114-ec9a0cc5de1b?w=1200&q=80'], category: 'Audio', tags:['microphone','recording'], rating:4.5, stock: 12 },
    { id: 'p10', title: 'Nomad Travel Pillow', slug:'nomad-travel-pillow', description: 'Comfort neck pillow for long trips.', price: 29.00, images: ['https://images.unsplash.com/photo-1494220821768-4b18533b46a1?w=1200&q=80'], category: 'Travel', tags:['travel','comfort'], rating:4.0, stock: 33 },
    { id: 'p11', title: 'Nova Wireless Charger', slug:'nova-wireless-charger', description: 'Fast wireless charger – Qi-compatible.', price: 39.00, images: ['https://images.unsplash.com/photo-1585386959984-a4155222a3b6?w=1200&q=80'], category: 'Accessories', tags:['charger','wireless'], rating:4.2, stock: 18 },
    { id: 'p12', title: 'Orbit Bluetooth Speaker', slug:'orbit-bluetooth-speaker', description: 'Portable speaker with rich bass and 12h battery.', price: 79.00, images: ['https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=1200&q=80'], category: 'Audio', tags:['speaker','portable'], rating:4.6, stock: 15 }
  ];

  // --- Storage helpers ---
  function readJSON(key, fallback){ try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
  function writeJSON(key,val){ localStorage.setItem(key, JSON.stringify(val)); }

  // --- Cart / Fav helpers ---
  function getCart(){ return readJSON(STORAGE.CART, []); }
  function setCart(cart){ writeJSON(STORAGE.CART, cart); updateCartCount(); }
  function addToCart(id, qty=1){ const cart=getCart(); const item=cart.find(c=>c.id===id); if(item) item.qty = Math.min(item.qty+qty,99); else cart.push({id,qty}); setCart(cart); }
  function removeFromCart(id){ const cart = getCart().filter(c=>c.id!==id); setCart(cart); }
  function updateQty(id, qty){ const cart=getCart(); const it=cart.find(c=>c.id===id); if(!it) return; it.qty = Math.max(1, Math.min(qty,99)); setCart(cart); }
  function cartTotalCount(){ return getCart().reduce((s,i)=>s + i.qty, 0); }
  function cartLineItemsDetailed(){ const cart = getCart(); return cart.map(item=>{ const p = products.find(prod=>prod.id===item.id); return {...p, qty:item.qty, lineTotal: item.qty * (p.salePrice || p.price)}; }); }

  function getFav(){ return readJSON(STORAGE.FAV, []); }
  function toggleFav(id){ const fav = new Set(getFav()); if(fav.has(id)) fav.delete(id); else fav.add(id); writeJSON(STORAGE.FAV, Array.from(fav)); renderFavIcons(); }

  function formatPrice(n){ return n==null ? '' : '$' + n.toFixed(2); }

  // --- Rendering / UI ---
  function makeProductCardHTML(p){
    const priceHtml = p.salePrice ? `<div><span class="card-price me-2">${formatPrice(p.salePrice)}</span><small class="text-muted text-decoration-line-through">${formatPrice(p.price)}</small></div>` : `<div><span class="card-price">${formatPrice(p.price)}</span></div>`;
    return `
      <div class="card-product animate-on-scroll" tabindex="0">
        <div class="position-relative">
          <img src="${p.images[0]}" alt="${p.title}" loading="lazy" />
          <button class="btn btn-sm position-absolute top-0 end-0 m-2 icon-btn fav-btn" data-id="${p.id}" aria-label="Toggle favourite">
            <i class="bi bi-heart${getFav().includes(p.id) ? '-fill text-danger' : ''}"></i>
          </button>
        </div>
        <div class="mt-3">
          <div class="card-title">${p.title}</div>
          <div class="text-muted small mb-2">${p.category} • ${p.rating} ★</div>
          ${priceHtml}
          <div class="d-flex justify-content-between align-items-center mt-3">
            <a href="product.html?slug=${p.slug}" class="btn btn-outline-secondary btn-sm">View</a>
            <button class="btn btn-primary btn-sm add-to-cart" data-id="${p.id}"><i class="bi bi-cart me-1"></i>Add</button>
          </div>
        </div>
      </div>
    `;
  }

  function renderGrid(selector, list){ const container = document.querySelector(selector); if(!container) return; container.innerHTML=''; list.forEach(p=>{ const div = document.createElement('div'); div.className = 'col-6 col-md-4 col-lg-3'; div.innerHTML = makeProductCardHTML(p); container.appendChild(div); }); setupGridButtons(container); }

  function setupGridButtons(container){ container.querySelectorAll('.add-to-cart').forEach(btn=> btn.addEventListener('click', ()=>{ addToCart(btn.dataset.id,1); showToast('Added to cart'); })); container.querySelectorAll('.fav-btn').forEach(btn=> btn.addEventListener('click', ()=> toggleFav(btn.dataset.id)) ); }

  function renderFavIcons(){ document.querySelectorAll('.fav-btn').forEach(btn=>{ const id = btn.dataset.id; const icon = btn.querySelector('i'); if(getFav().includes(id)) icon.className = 'bi bi-heart-fill text-danger'; else icon.className = 'bi bi-heart'; }); }

  function updateCartCount(){ document.querySelectorAll('.cart-count').forEach(el=> el.innerText = cartTotalCount()); }

  function showToast(message='Done'){ const t = document.createElement('div'); t.className = 'position-fixed bottom-0 end-0 m-4 p-3 rounded shadow bg-white border'; t.style.zIndex = 9999; t.innerHTML = `<strong>${message}</strong>`; document.body.appendChild(t); setTimeout(()=> t.classList.add('fade-out'), 1600); setTimeout(()=> t.remove(), 2000); }

  function searchProducts(query, category='', minPrice=0, maxPrice=1e9){ query = (query||'').toLowerCase().trim(); return products.filter(p=>{ const qMatch = !query || p.title.toLowerCase().includes(query) || p.description.toLowerCase().includes(query) || (p.tags||[]).some(t=>t.includes(query)); const catMatch = !category || p.category === category; const price = p.salePrice || p.price; const priceMatch = price >= minPrice && price <= maxPrice; return qMatch && catMatch && priceMatch; }); }

  function renderCartPage(){ const cartList = document.getElementById('cart-items'); if(!cartList) return; const items = cartLineItemsDetailed(); if(items.length === 0){ cartList.innerHTML = `<div class="p-4 text-center text-muted">Your cart is empty.</div>`; document.getElementById('cart-summary-total').innerText = '$0.00'; return; } cartList.innerHTML=''; items.forEach(item=>{ const row = document.createElement('div'); row.className = 'd-flex align-items-center gap-3 mb-3 p-3 rounded card-product'; row.innerHTML = `
      <img src="${item.images[0]}" alt="${item.title}" width="90" height="90" style="object-fit:cover;border-radius:10px;">
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-start">
            <div>
              <div class="fw-semibold">${item.title}</div>
              <div class="small text-muted">${item.category} • ${item.rating} ★</div>
            </div>
            <div class="text-end">
              <div class="fw-bold">${formatPrice(item.salePrice || item.price)}</div>
              <div class="text-muted small">Available: ${item.stock}</div>
            </div>
          </div>
          <div class="d-flex align-items-center gap-2 mt-3">
            <div class="input-group qty-input" style="width:140px">
              <button class="btn btn-outline-secondary btn-qty-decrease" data-id="${item.id}" type="button">-</button>
              <input class="form-control input-qty" data-id="${item.id}" value="${item.qty}" aria-label="Quantity">
              <button class="btn btn-outline-secondary btn-qty-increase" data-id="${item.id}" type="button">+</button>
            </div>
            <button class="btn btn-outline-danger btn-sm ms-2 btn-remove" data-id="${item.id}">Remove</button>
          </div>
        </div>
      `; cartList.appendChild(row); });

    cartList.querySelectorAll('.btn-qty-decrease').forEach(btn=> btn.addEventListener('click', ()=>{ const id=btn.dataset.id; const item = cartLineItemsDetailed().find(i=>i.id===id); if(!item) return; updateQty(id, Math.max(1, item.qty-1)); renderCartPage(); }));
    cartList.querySelectorAll('.btn-qty-increase').forEach(btn=> btn.addEventListener('click', ()=>{ const id=btn.dataset.id; const item=cartLineItemsDetailed().find(i=>i.id===id); if(!item) return; updateQty(id, Math.min(99, item.qty+1)); renderCartPage(); }));
    cartList.querySelectorAll('.input-qty').forEach(inp=> inp.addEventListener('change', ()=>{ const id=inp.dataset.id; const v=parseInt(inp.value)||1; updateQty(id, v); renderCartPage(); }));
    cartList.querySelectorAll('.btn-remove').forEach(btn=> btn.addEventListener('click', ()=>{ removeFromCart(btn.dataset.id); renderCartPage(); }));

    const total = items.reduce((s,i)=>s+i.lineTotal, 0); const totalEl = document.getElementById('cart-summary-total'); if(totalEl) totalEl.innerText = formatPrice(total);
  }

  function renderFavPage(){ const c = document.getElementById('favourites-list'); if(!c) return; const fav = getFav(); if(fav.length === 0) { c.innerHTML = `<div class="p-4 text-muted text-center">No favourites yet</div>`; return; } const arr = products.filter(p => fav.includes(p.id)); c.innerHTML = arr.map(p => `
      <div class="d-flex align-items-center gap-3 p-3 rounded card-product mb-2">
        <img src="${p.images[0]}" alt="${p.title}" width="90" height="90" style="object-fit:cover;border-radius:10px;">
        <div class="flex-grow-1 d-flex justify-content-between">
          <div>
            <div class="fw-semibold">${p.title}</div>
            <div class="small text-muted">${p.category}</div>
          </div>
          <div class="text-end">
            <div class="fw-semibold">${formatPrice(p.salePrice || p.price)}</div>
            <button class="btn btn-sm btn-primary mt-2 add-to-cart" data-id="${p.id}">Add to cart</button>
          </div>
        </div>
      </div>
    `).join(''); c.querySelectorAll('.add-to-cart').forEach(b=> b.addEventListener('click', ()=> { addToCart(b.dataset.id); showToast('Added to cart'); })); }

  // --- Search page specific ---
  function initSearchPage(){ const searchInput = document.getElementById('search-input'); const grid = document.getElementById('search-results-grid'); if(!grid) return; function update(){ const q = (searchInput && searchInput.value) || new URLSearchParams(window.location.search).get('q') || ''; const results = searchProducts(q); if(results.length === 0) grid.innerHTML = `<div class="p-4 search-results-empty">No results for "${q}"</div>`; else renderGrid('#search-results-grid', results); }
    if(searchInput) searchInput.addEventListener('input', update); const urlQ = new URLSearchParams(window.location.search).get('q') || ''; if(urlQ && searchInput) searchInput.value = urlQ; update(); }

  // --- Header search icon behaviour — modal injected globally ---
  function createSearchModal(){ if(document.getElementById('bizzhuss-search-modal')) return; const backdrop = document.createElement('div'); backdrop.className = 'search-modal-backdrop'; backdrop.id = 'bizzhuss-search-modal'; backdrop.innerHTML = `
    <div class="search-modal rounded">
      <div class="d-flex justify-content-between align-items-center mb-2">
        <strong>Search products</strong>
        <button class="btn-close" id="b-search-close" aria-label="Close search"></button>
      </div>
      <div>
        <input id="b-search-input" class="w-100" placeholder="Search for products, categories or tags" aria-label="Search input" />
      </div>
      <div id="b-search-results" class="mt-3"></div>
    </div>
  `; document.body.appendChild(backdrop);

    // handlers
    backdrop.addEventListener('click', (e)=>{ if(e.target === backdrop) closeSearchModal(); });
    document.getElementById('b-search-close').addEventListener('click', closeSearchModal);
    const input = document.getElementById('b-search-input'); if(input){ input.addEventListener('input', ()=>{ const q = input.value; const res = searchProducts(q); const target = document.getElementById('b-search-results'); if(!target) return; if(res.length===0) target.innerHTML = `<div class="small text-muted">No results</div>`; else target.innerHTML = `<div class="row g-3">${res.slice(0,8).map(p=>`<div class="col-12"><div class="d-flex gap-2 align-items-center p-2 rounded card-product"><img src="${p.images[0]}" alt="" width="64" height="64" style="object-fit:cover;border-radius:8px;"><div class="flex-grow-1"><div class="fw-semibold">${p.title}</div><div class="small text-muted">${p.category} • ${formatPrice(p.salePrice || p.price)}</div></div><a class="btn btn-sm btn-outline-secondary" href="product.html?slug=${p.slug}">View</a></div></div>`).join('')}</div>`; } ); input.addEventListener('keydown', e=>{ if(e.key === 'Enter'){ const q = input.value.trim(); window.location.href = `search.html?q=${encodeURIComponent(q)}`; }} ); }
  }
  function openSearchModal(){ createSearchModal(); const el = document.getElementById('bizzhuss-search-modal'); if(!el) return; el.classList.add('show'); setTimeout(()=> document.getElementById('b-search-input')?.focus(), 60); }
  function closeSearchModal(){ const el = document.getElementById('bizzhuss-search-modal'); if(!el) return; el.classList.remove('show'); }

  // --- Track page stub ---
  function initTrackPage(){ const form = document.getElementById('track-form'); if(!form) return; form.addEventListener('submit', (ev)=>{ ev.preventDefault(); const id = document.getElementById('track-id').value.trim(); const statusEl = document.getElementById('track-status'); if(!id){ statusEl.innerHTML = `<div class="text-danger small">Enter a valid order ID</div>`; return; } const statuses = ['Processing','Shipped','In transit','Out for delivery','Delivered']; const idx = Math.floor(Math.random()*statuses.length); statusEl.innerHTML = `
      <div class="p-3 rounded card-product">
        <div class="fw-semibold">Order ${id}</div>
        <div class="small text-muted mb-2">Last update: ${new Date().toLocaleString()}</div>
        <div class="mt-2"><span class="badge bg-white text-primary">${statuses[idx]}</span></div>
      </div>`; }); }

  // --- Account page validation (bootstrap form validation) ---
  function initAccountPage(){ const login = document.getElementById('login-form'); const signup = document.getElementById('signup-form'); if(login){ login.addEventListener('submit', (e)=>{ e.preventDefault(); const email = login.querySelector('#login-email').value.trim(); const pass = login.querySelector('#login-password').value.trim(); if(!email || !pass) return alert('Please fill both email and password'); alert('Logged in (demo) — no backend implemented'); }); }
    if(signup){ signup.addEventListener('submit', (e)=>{ e.preventDefault(); const email = signup.querySelector('#signup-email').value.trim(); const pass = signup.querySelector('#signup-password').value.trim(); const pass2 = signup.querySelector('#signup-password-confirm').value.trim(); if(!email || !pass) return alert('Please fill required fields'); if(pass !== pass2) return alert('Passwords do not match'); alert('Account created (demo) — no backend implemented'); }); }
  }

  // --- Product detail rendering (product.html) ---
  function initProductDetail(){ const prodDetailEl = document.getElementById('product-detail-root'); if(!prodDetailEl) return; const slug = new URLSearchParams(window.location.search).get('slug'); const p = products.find(x=>x.slug===slug) || products[0]; if(!p){ prodDetailEl.innerHTML = `<div class="p-4">Product not found</div>`; return; } const priceHtml = p.salePrice ? `<h3 class="text-primary">${formatPrice(p.salePrice)} <small class="text-muted text-decoration-line-through">${formatPrice(p.price)}</small></h3>` : `<h3 class="text-primary">${formatPrice(p.price)}</h3>`; prodDetailEl.innerHTML = `
    <div class="row g-4">
      <div class="col-12 col-md-6">
        <img src="${p.images[0]}" alt="${p.title}" class="w-100 rounded" style="height:360px;object-fit:cover;">
      </div>
      <div class="col-12 col-md-6">
        <h2>${p.title}</h2>
        <div class="small text-muted mb-2">${p.category} • ${p.rating} ★</div>
        <div>${priceHtml}</div>
        <p class="text-muted mt-3">${p.description}</p>
        <div class="d-flex gap-2 align-items-center mt-4">
          <div class="input-group qty-input" style="width:150px">
            <button class="btn btn-outline-secondary" id="pd-decr">-</button>
            <input class="form-control text-center" id="pd-qty" value="1" />
            <button class="btn btn-outline-secondary" id="pd-incr">+</button>
          </div>
          <button class="btn btn-primary" id="pd-add">Add to cart</button>
          <button class="btn btn-outline-secondary" id="pd-fav"><i class="bi bi-heart" id="pd-fav-icon"></i></button>
        </div>
      </div>
    </div>`;

    document.getElementById('pd-add').addEventListener('click', ()=>{ const qty = parseInt(document.getElementById('pd-qty').value) || 1; addToCart(p.id, qty); showToast('Added to cart'); });
    document.getElementById('pd-incr').addEventListener('click', ()=> document.getElementById('pd-qty').value = Math.min(99, parseInt(document.getElementById('pd-qty').value||1)+1));
    document.getElementById('pd-decr').addEventListener('click', ()=> document.getElementById('pd-qty').value = Math.max(1, parseInt(document.getElementById('pd-qty').value||1)-1));
    document.getElementById('pd-fav').addEventListener('click', ()=>{ toggleFav(p.id); const icon = document.getElementById('pd-fav-icon'); icon.className = getFav().includes(p.id) ? 'bi bi-heart-fill text-danger' : 'bi bi-heart'; });
  }

  // --- Scroll animations (IntersectionObserver) ---
  function initScrollAnimations(){ if(!('IntersectionObserver' in window)) return; const io = new IntersectionObserver((entries)=>{ entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in-view'); io.unobserve(e.target); } }); }, { threshold: 0.12 }); document.querySelectorAll('.animate-on-scroll').forEach(el=> io.observe(el)); }

  // --- Global initializer ---
  document.addEventListener('DOMContentLoaded', ()=>{
    // Expose some helpers
    window.bizzhuss = { products, getCart, addToCart, getFav, toggleFav, searchProducts, renderGrid };

    // init UI components
    updateCartCount(); renderFavIcons(); initScrollAnimations();

    if(document.getElementById('featured-products')) renderGrid('#featured-products', products.slice(0,8));
    if(document.getElementById('top-categories')){ const cats = Array.from(new Set(products.map(p=>p.category))); document.getElementById('top-categories').innerHTML = cats.map(c=>`<div class="col-6 col-md-3 mb-3"><div class="p-3 rounded card-product text-center animate-on-scroll"><div class="fw-semibold">${c}</div><small class="text-muted">Explore ${c}</small></div></div>`).join(''); }

    // Pages
    if(document.getElementById('search-results-grid')) initSearchPage();
    if(document.getElementById('cart-items')) renderCartPage();
    if(document.getElementById('favourites-list')) renderFavPage();
    initTrackPage(); initAccountPage(); initProductDetail();

    // Insert search modal and wire header search icon buttons
    createSearchModal(); document.querySelectorAll('.nav-search-btn, #header-search-btn, .search-icon').forEach(el=> el.addEventListener('click', (e)=>{ e.preventDefault(); openSearchModal(); }));

    // header search input (if left in pages) remove it visually
    document.querySelectorAll('#header-search-input').forEach(inp => inp.remove());

    // enable ESC to close modal
    document.addEventListener('keydown', (e)=> { if(e.key === 'Escape') closeSearchModal(); });

    // keyboard accessibility: enter on press of search icon triggers it
    document.querySelectorAll('.nav-search-btn').forEach(btn=> btn.addEventListener('keypress', e=>{ if(e.key === 'Enter') btn.click(); }));
  });

})();
