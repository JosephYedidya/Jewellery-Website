   /***********************
     * Data - Products list
     ***********************/
   const PRODUCTS = [
    {
      id: "p1",
      name: "Collier Éclat d'Or",
      price: 149.00,
      img: "https://sspark.genspark.ai/cfimages?u1=cK8q0aRNlI3Q5KFDemtgNlyj3AtXHfqM4bmoe1elkvIsuoibiEOEM70HYNX48F%2BNqfgeDbZxH4mr49iIDc5mq%2F4am5BARATx%2B0oNGP0MdylgKTHxzbyspeGjck0czYXptNW7EPah%2FHZi%2F90XvT6sa0Uf3Sa1oQ%3D%3D&u2=4sDC7PnCb3qwcrz1&width=2560",
      short: "Collier délicat en or 18K, finition polie.",
      desc: "Un collier raffiné, parfait pour sublimer une tenue de soirée ou apporter une touche élégante au quotidien."
    },
    {
      id: "p2",
      name: "Bague Élégance Argent",
      price: 99.00,
      img: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fwww.amglacouronne.com%2F1245-chevaliere-or-ovale-homme-1315-mm.html&psig=AOvVaw18-HMCGqOmjlb4_YxhS8QE&ust=1762872717919000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPi-95rr55ADFQAAAAAdAAAAABAL",
      short: "Bague en argent fin au design minimal.",
      desc: "Bague confortable, finition mate, idéale pour une superposition moderne."
    },
    {
      id: "p3",
      name: "Bracelet Lueur",
      price: 179.00,
      img: "https://sspark.genspark.ai/cfimages?u1=FWqaZY96%2BPwiEoKnuUJpe6ZNx%2BH%2B7on2Sk32%2BzcXP44R%2F35nU70%2F9JVGchY%2Fu8pVUi8Ix6YyGidF2maP7lxiXo1UGT9ob%2FGDMMRzSK3dMKZosyuJ0gX1huhNyrhssY%2BWhbNoxwFfR2Fmk%2BJeBNZDemU59Ek%3D&u2=1h5qaslr7tUW%2BDkV&width=2560",
      short: "Bracelet élégant orné d'un petit diamant.",
      desc: "Bracelet signé DiamondBD, réalisé par des artisans expérimentés, pensé pour durer et briller."
    },
    {
      id: "p4",
      name: "Boucles Purity",
      price: 89.00,
      img: "https://sspark.genspark.ai/cfimages?u1=dzuFkjcjgJWiEFtHfttSs5j93RT4w8I%2FpL0wGFxxtfx%2Fr6CXiZTSzNWofAARcTtrIVvLRx7SNcnw3adC3GKWy1oQFw2wQ4%2B2Vs8OI%2Bb3NFgOIH4Q3uKdHNV2MMO8s7m7nt%2Bq%2F4rHHDd%2BI1yi6t8iwFF2sz8O888GX8cujy3u&u2=f95%2FG%2FRbpfEsq5Vv&width=2560",
      short: "Boucles d'oreilles petites et raffinées.",
      desc: "Boucles légères, parfaites pour les journées actives et les looks soignés."
    },
    {
      id: "p5",
      name: "Chevalière Moderne",
      price: 129.00,
      img: "https://www.google.com/url?sa=i&url=https%3A%2F%2Fchevaliere-prestige.com%2Fproducts%2Fchevaliere-homme-argent-avec-armoiries%3Fsrsltid%3DAfmBOorTPv93jLt1_dX43UB_lcfxlhuzcTLOaZrJhCg0434-0tbEbd_z&psig=AOvVaw18-HMCGqOmjlb4_YxhS8QE&ust=1762872717919000&source=images&cd=vfe&opi=89978449&ved=0CBUQjRxqFwoTCPi-95rr55ADFQAAAAAdAAAAABAE",
      short: "Chevalière au design contemporain.",
      desc: "Pièce forte et assumée, idéale pour affirmer un style unique."
    }
  ];

  /***********************
   * Cart - state & utils
   ***********************/
  let CART = {}; // { productId: {product, qty} }

  const cartCountEl = document.getElementById('cartCount');
  const cartPanel = document.getElementById('cartPanel');
  const cartBody = document.getElementById('cartBody');
  const cartSubtotalEl = document.getElementById('cartSubtotal');

  // Load cart from localStorage
  function loadCart() {
    try {
      const raw = localStorage.getItem('diamondbd_cart');
      if (raw) {
        const parsed = JSON.parse(raw);
        CART = parsed;
      }
    } catch(e) { CART = {}; }
    renderCartUI();
  }

  function saveCart() {
    localStorage.setItem('diamondbd_cart', JSON.stringify(CART));
  }

  function addToCart(productId, qty = 1) {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;
    if (!CART[productId]) {
      CART[productId] = { product: prod, qty: 0 };
    }
    CART[productId].qty += qty;
    if (CART[productId].qty < 1) CART[productId].qty = 1;
    saveCart();
    renderCartUI();
    openCart();
  }

  function removeFromCart(productId) {
    delete CART[productId];
    saveCart();
    renderCartUI();
  }

  function updateQty(productId, qty) {
    if (CART[productId]) {
      CART[productId].qty = qty;
      if (CART[productId].qty <= 0) removeFromCart(productId);
      saveCart();
      renderCartUI();
    }
  }

  function clearCart() {
    CART = {};
    saveCart();
    renderCartUI();
  }

  function cartTotals() {
    let total = 0;
    let count = 0;
    Object.values(CART).forEach(item => {
      total += item.product.price * item.qty;
      count += item.qty;
    });
    return { total, count };
  }

  function formatPrice(n) {
    // ensure digit-by-digit correctness: use toFixed after numeric ops
    return (Math.round(n * 100) / 100).toFixed(2) + "€";
  }

  function renderCartUI() {
    // count badge
    const { total, count } = cartTotals();
    if (count > 0) {
      cartCountEl.style.display = 'block';
      cartCountEl.textContent = count;
    } else {
      cartCountEl.style.display = 'none';
    }

    // body items
    cartBody.innerHTML = '';
    if (count === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty';
      empty.textContent = "Ton panier est vide.";
      cartBody.appendChild(empty);
    } else {
      Object.values(CART).forEach(item => {
        const wrapper = document.createElement('div');
        wrapper.className = 'cart-item';
        wrapper.innerHTML = `
          <img class="ci-thumb" src="${item.product.img}" alt="${escapeHtml(item.product.name)}">
          <div class="ci-info">
            <div class="ci-title">${escapeHtml(item.product.name)}</div>
            <div style="display:flex;justify-content:space-between;align-items:center;margin-top:6px;">
              <div class="ci-qty">Quantité: <strong>${item.qty}</strong></div>
              <div style="font-weight:700">${formatPrice(item.product.price * item.qty)}</div>
            </div>
          </div>
          <div class="ci-actions">
            <div style="display:flex;flex-direction:column;gap:6px;">
              <button class="remove-btn ci-decrease" data-id="${item.product.id}">−</button>
              <button class="remove-btn ci-increase" data-id="${item.product.id}">+</button>
              <button class="remove-btn ci-remove" data-id="${item.product.id}">Suppr</button>
            </div>
          </div>
        `;
        cartBody.appendChild(wrapper);
      });
    }

    cartSubtotalEl.textContent = formatPrice(total);

    // wire up buttons inside cart
    cartBody.querySelectorAll('.ci-remove').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        removeFromCart(id);
      });
    });
    cartBody.querySelectorAll('.ci-increase').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        updateQty(id, CART[id].qty + 1);
      });
    });
    cartBody.querySelectorAll('.ci-decrease').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        updateQty(id, CART[id].qty - 1);
      });
    });
  }

  /***********************
   * Product grid rendering
   ***********************/
  const productsGrid = document.getElementById('productsGrid');

  function renderProducts(sort = 'default') {
    // Clone array to avoid mutating original
    const list = PRODUCTS.slice();
    if (sort === 'price-asc') list.sort((a,b) => a.price - b.price);
    if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);

    productsGrid.innerHTML = '';
    list.forEach(p => {
      const card = document.createElement('article');
      card.className = 'card';
      card.innerHTML = `
        <img class="card-img" src="${p.img}" alt="${escapeHtml(p.name)}">
        <div class="card-body">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;">
            <div>
              <div class="product-title">${escapeHtml(p.name)}</div>
              <div class="product-desc">${escapeHtml(p.short)}</div>
            </div>
            <div style="text-align:right;">
              <div class="price">${formatPrice(p.price)}</div>
              <div style="font-size:12px;color:var(--text-muted);">TVA incl.</div>
            </div>
          </div>
          <div class="product-meta">
            <div class="card-actions">
              <button class="btn add-js" data-id="${p.id}">Ajouter</button>
              <button class="btn secondary view-js" data-id="${p.id}" style="background:transparent;border:1px solid var(--border-color);">Voir</button>
            </div>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });

    // wire events
    document.querySelectorAll('.add-js').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        addToCart(id, 1);
      });
    });
    document.querySelectorAll('.view-js').forEach(btn => {
      btn.addEventListener('click', e => {
        const id = e.currentTarget.dataset.id;
        showProductView(id);
      });
    });
  }

  /***********************
   * Product view (single)
   ***********************/
  const productViewSection = document.getElementById('productView');
  const pvLeft = document.getElementById('pvLeft');
  const pvRight = document.getElementById('pvRight');

  function showProductView(productId) {
    const prod = PRODUCTS.find(p => p.id === productId);
    if (!prod) return;
    // left: image
    pvLeft.innerHTML = `<img src="${prod.img}" alt="${escapeHtml(prod.name)}">`;
    // right: details
    pvRight.innerHTML = `
      <h2>${escapeHtml(prod.name)}</h2>
      <div class="pv-price">${formatPrice(prod.price)}</div>
      <p>${escapeHtml(prod.desc)}</p>
      <div class="qty-row">
        <div class="qty">
          <button id="pvDec">−</button>
          <div id="pvQty" style="min-width:28px;text-align:center;font-weight:700;">1</div>
          <button id="pvInc">+</button>
        </div>
        <div style="margin-left:12px;color:var(--text-muted);font-size:13px;">Livraison 3-6 jours</div>
      </div>
      <div style="display:flex;gap:12px;">
        <button class="btn" id="pvAdd">Ajouter au panier</button>
        <button class="btn secondary" id="pvBack">Retour</button>
      </div>
    `;

    // show section
    productViewSection.style.display = 'flex';
    productViewSection.setAttribute('aria-hidden','false');
    // scroll into view
    productViewSection.scrollIntoView({behavior:'smooth', block:'start'});

    // qty behaviour
    let qty = 1;
    document.getElementById('pvInc').addEventListener('click', () => {
      qty++; document.getElementById('pvQty').textContent = qty;
    });
    document.getElementById('pvDec').addEventListener('click', () => {
      qty = Math.max(1, qty-1); document.getElementById('pvQty').textContent = qty;
    });

    // add to cart from product view
    document.getElementById('pvAdd').addEventListener('click', () => {
      addToCart(prod.id, qty);
    });

    document.getElementById('pvBack').addEventListener('click', () => {
      hideProductView();
    });
  }

  function hideProductView() {
    productViewSection.style.display = 'none';
    productViewSection.setAttribute('aria-hidden','true');
    window.scrollTo({top:0, behavior:'smooth'});
  }

  /***********************
   * Navigation & interactions
   ***********************/
  document.getElementById('shopNow').addEventListener('click', () => {
    document.querySelector('[data-target="collection"]').click();
    document.getElementById('collection').scrollIntoView({behavior:'smooth'});
  });
  document.getElementById('learnBtn').addEventListener('click', () => {
    document.querySelector('[data-target="about"]').click();
    document.getElementById('about').scrollIntoView({behavior:'smooth'});
  });

  // nav links
  document.querySelectorAll('.nav-link').forEach(a => {
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelectorAll('.nav-link').forEach(x => x.classList.remove('active'));
      a.classList.add('active');
      const target = a.dataset.target;
      if (target && document.getElementById(target)) {
        document.getElementById(target).scrollIntoView({behavior:'smooth'});
      }
    });
  });

  // sort select
  document.getElementById('sortSelect').addEventListener('change', (e) => {
    renderProducts(e.target.value);
  });

  // auth form (mock)
  document.getElementById('authForm').addEventListener('submit', e => {
    e.preventDefault();
    alert('Connexion simulée — fonctionnalité à implémenter côté serveur.');
  });
  document.getElementById('signupBtn').addEventListener('click', () => {
    alert('Inscription simulée — fonctionnalité à implémenter côté serveur.');
  });

  // cart panel open/close
  const openCartBtn = document.getElementById('openCartBtn');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  openCartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  clearCartBtn.addEventListener('click', () => {
    if (confirm('Vider le panier ?')) clearCart();
  });
  checkoutBtn.addEventListener('click', () => {
    const { total, count } = cartTotals();
    if (count === 0) {
      alert('Ton panier est vide.');
      return;
    }
    // Simulated checkout flow
    alert('Paiement simulé — total: ' + formatPrice(total) + '\nMerci pour votre commande ! (Simulation)');
    clearCart();
    closeCart();
  });

  function openCart() {
    cartPanel.classList.add('open');
    cartPanel.setAttribute('aria-hidden','false');
  }
  function closeCart() {
    cartPanel.classList.remove('open');
    cartPanel.setAttribute('aria-hidden','true');
  }

  // close cart on outside click (small)
  document.addEventListener('click', (e) => {
    if (!cartPanel.contains(e.target) && !openCartBtn.contains(e.target)) {
      // don't auto-close if panel is not open
      if (cartPanel.classList.contains('open')) {
        // do not close immediately to avoid annoyance; keep as is
      }
    }
  });

  /***********************
   * Search Functionality
   ***********************/
  const searchBtn = document.getElementById('searchBtn');
  const searchBar = document.getElementById('searchBar');
  const searchInput = document.getElementById('searchInput');
  const searchSubmitBtn = document.getElementById('searchSubmitBtn');
  
  // Fonction utilitaire pour masquer la barre de recherche
  function hideSearchBar() {
      searchBar.style.display = 'none';
  }

  // Fonction de recherche principale
  function handleSearch(query) {
      const normalizedQuery = query.toLowerCase().trim();

      if (normalizedQuery.length === 0) {
          alert('Veuillez entrer un terme de recherche.');
          return;
      }

      // Tente de trouver un produit correspondant
      const foundProduct = PRODUCTS.find(p => {
          const name = p.name.toLowerCase();
          const short = p.short.toLowerCase();
          const desc = p.desc.toLowerCase();

          // Vérifie si la requête est dans le nom, la description courte ou la description complète
          return name.includes(normalizedQuery) || short.includes(normalizedQuery) || desc.includes(normalizedQuery);
      });

      if (foundProduct) {
          // Produit trouvé : masque la barre de recherche, efface l'entrée et affiche la vue du produit
          hideSearchBar();
          searchInput.value = ''; 
          showProductView(foundProduct.id);
      } else {
          // Aucun résultat
          alert(`Aucun article trouvé pour la recherche : "${escapeHtml(query)}". Veuillez essayer un autre terme.`);
      }
  }


  // 1. Bascule l'affichage de la barre de recherche
  searchBtn.addEventListener('click', () => {
    const isHidden = searchBar.style.display === 'none';
    searchBar.style.display = isHidden ? 'block' : 'none';

    // Donne le focus au champ de saisie lorsque la barre est affichée
    if (isHidden) {
      searchInput.focus();
    }
  });

  // 2. Active l'action de recherche sur le bouton "Recherche"
  searchSubmitBtn.addEventListener('click', (e) => {
    // e.preventDefault(); 
    const query = searchInput.value;
    handleSearch(query); // Appel de la fonction de recherche
  });

  // 3. Permet de lancer la recherche en appuyant sur la touche Entrée dans le champ
  searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
          e.preventDefault(); // Empêche l'action par défaut
          searchSubmitBtn.click(); // Déclenche le clic du bouton "Recherche"
      }
  });


  /***********************
   * Theme Toggle Functionality
   ***********************/
  const themeToggleBtn = document.getElementById('themeToggleBtn');

  function setTheme(theme) {
      // Applique l'attribut data-theme au corps du document
      document.body.setAttribute('data-theme', theme);
      // Sauvegarde la préférence de l'utilisateur
      localStorage.setItem('theme', theme);
      
      // Met à jour l'icône du bouton
      themeToggleBtn.textContent = (theme === 'dark') ? '☀️' : '🌙'; 
      themeToggleBtn.title = (theme === 'dark') ? 'Passer au mode clair' : 'Passer au mode sombre';
  }

  function toggleTheme() {
      const currentTheme = document.body.getAttribute('data-theme');
      const newTheme = (currentTheme === 'dark') ? 'light' : 'dark';
      setTheme(newTheme);
  }

  // Initialisation: Vérifie les préférences (sauvegardée > système > défaut)
  function initTheme() {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (savedTheme) {
          setTheme(savedTheme);
      } else if (prefersDark) {
          setTheme('dark');
      } else {
          setTheme('light');
      }
  }

  themeToggleBtn.addEventListener('click', toggleTheme);

  /***********************
   * Utilities
   ***********************/
  function escapeHtml(s) {
    return String(s)
      .replaceAll('&','&amp;')
      .replaceAll('<','&lt;')
      .replaceAll('>','&gt;')
      .replaceAll('"','&quot;')
      .replaceAll("'",'&#039;');
  }

  /***********************
   * Initialization
   ***********************/
  initTheme(); // Initialisation du thème avant le rendu

  // initial render
  renderProducts();
  loadCart();

  // make "Add" keyboard accessible and friendly (progressive enhancement)
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      hideProductView();
      closeCart();
    }
  });

  // small onboarding: hide product view on load
  hideProductView();

         //function qui empêche le clic droit
         document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
if (e.keyCode == 123) return false; // F12
if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false; // Ctrl+Shift+I
if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; // Ctrl+U
};

// Empêcher le clic droit
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showAlert();
  });

  // Empêcher le raccourci pour Inspecter
  document.onkeydown = function (e) {
    if (e.keyCode === 123) return showAlert(); // F12
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) return showAlert(); // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) return showAlert(); // Ctrl+Shift+J
    if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) return showAlert(); // Ctrl+U
    if (e.ctrlKey && e.keyCode === 'S'.charCodeAt(0)) return showAlert(); // Ctrl+S
  };

   // Alerte visuelle simple
   function showAlert() {
    const box = document.getElementById("alertBox");
    box.style.display = "block";
    setTimeout(() => { box.style.display = "none"; }, 2000);
    return false;
  }

  // Obfuscation légère du JavaScript
  (function(){
    const msg = ["Ce site appartient à Joseph Yedidya", "Toute copie est interdite 🚫"];
    console.log(msg[Math.floor(Math.random()*msg.length)]);
  })();

        
      //function qui empêche le clic droit
      document.addEventListener('contextmenu', event => event.preventDefault());
document.onkeydown = function(e) {
if (e.keyCode == 123) return false; // F12
if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) return false; // Ctrl+Shift+I
if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) return false; // Ctrl+U
};

// Empêcher le clic droit
document.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    showAlert();
  });

  // Empêcher le raccourci pour Inspecter
  document.onkeydown = function (e) {
    if (e.keyCode === 123) return showAlert(); // F12
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'I'.charCodeAt(0)) return showAlert(); // Ctrl+Shift+I
    if (e.ctrlKey && e.shiftKey && e.keyCode === 'J'.charCodeAt(0)) return showAlert(); // Ctrl+Shift+J
    if (e.ctrlKey && e.keyCode === 'U'.charCodeAt(0)) return showAlert(); // Ctrl+U
    if (e.ctrlKey && e.keyCode === 'S'.charCodeAt(0)) return showAlert(); // Ctrl+S
  };

   // Alerte visuelle simple
   function showAlert() {
    const box = document.getElementById("alertBox");
    box.style.display = "block";
    setTimeout(() => { box.style.display = "none"; }, 2000);
    return false;
  }

  // Obfuscation légère du JavaScript
  (function(){
    const msg = ["Ce site appartient à Joseph Yedidya", "Toute copie est interdite 🚫"];
    console.log(msg[Math.floor(Math.random()*msg.length)]);
  })();
