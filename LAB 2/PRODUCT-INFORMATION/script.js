/**
 * ============================================================================
 * Product Information Dashboard - Main Script
 * Vanilla JavaScript implementation for product catalog management.
 * Supports Search, Filters, Sorting, CRUD, Favorites, Dark Mode, Pagination.
 * ============================================================================
 */

// --- Default Initial Products Dataset ---
const DEFAULT_PRODUCTS = [
  {
    id: "101",
    name: "iPhone 15",
    brand: "Apple",
    category: "Smartphone",
    price: 69999,
    availability: "In Stock",
    rating: 4.6
  },
  {
    id: "102",
    name: "Galaxy S24",
    brand: "Samsung",
    category: "Smartphone",
    price: 74999,
    availability: "In Stock",
    rating: 4.5
  },
  {
    id: "103",
    name: "MacBook Air M2",
    brand: "Apple",
    category: "Laptop",
    price: 89990,
    availability: "In Stock",
    rating: 4.8
  },
  {
    id: "104",
    name: "Inspiron 15",
    brand: "Dell",
    category: "Laptop",
    price: 55999,
    availability: "Available",
    rating: 4.3
  },
  {
    id: "105",
    name: "WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    price: 29990,
    availability: "In Stock",
    rating: 4.7
  },
  {
    id: "106",
    name: "iPad Air M2",
    brand: "Apple",
    category: "Tablet",
    price: 59900,
    availability: "In Stock",
    rating: 4.7
  },
  {
    id: "107",
    name: "Galaxy Tab S9",
    brand: "Samsung",
    category: "Tablet",
    price: 67999,
    availability: "In Stock",
    rating: 4.6
  },
  {
    id: "108",
    name: "ROG Zephyrus G14",
    brand: "ASUS",
    category: "Laptop",
    price: 149990,
    availability: "In Stock",
    rating: 4.9
  },
  {
    id: "109",
    name: "XPS 13 Plus",
    brand: "Dell",
    category: "Laptop",
    price: 129990,
    availability: "Available",
    rating: 4.5
  },
  {
    id: "110",
    name: "Pixel 8 Pro",
    brand: "Google",
    category: "Smartphone",
    price: 84999,
    availability: "In Stock",
    rating: 4.4
  },
  {
    id: "111",
    name: "QuietComfort Ultra",
    brand: "Bose",
    category: "Headphones",
    price: 35900,
    availability: "In Stock",
    rating: 4.8
  },
  {
    id: "112",
    name: "AirPods Pro (2nd Gen)",
    brand: "Apple",
    category: "Headphones",
    price: 24900,
    availability: "In Stock",
    rating: 4.7
  },
  {
    id: "113",
    name: "Apple Watch Ultra 2",
    brand: "Apple",
    category: "Smartwatch",
    price: 89900,
    availability: "In Stock",
    rating: 4.9
  },
  {
    id: "114",
    name: "Galaxy Watch 6",
    brand: "Samsung",
    category: "Smartwatch",
    price: 28999,
    availability: "Available",
    rating: 4.4
  },
  {
    id: "115",
    name: "ThinkPad X1 Carbon",
    brand: "Lenovo",
    category: "Laptop",
    price: 134990,
    availability: "In Stock",
    rating: 4.6
  },
  {
    id: "116",
    name: "OnePlus 12",
    brand: "OnePlus",
    category: "Smartphone",
    price: 64999,
    availability: "In Stock",
    rating: 4.5
  },
  {
    id: "117",
    name: "PlayStation 5 Slim",
    brand: "Sony",
    category: "Gaming",
    price: 44990,
    availability: "Out of Stock",
    rating: 4.9
  },
  {
    id: "118",
    name: "MX Master 3S Wireless Mouse",
    brand: "Logitech",
    category: "Accessories",
    price: 8995,
    availability: "In Stock",
    rating: 4.8
  }
];

// --- Application State ---
const AppState = {
  products: [],
  favorites: new Set(),
  currentView: 'table', // 'table' or 'grid'
  currentPage: 1,
  itemsPerPage: 5,
  searchTerm: '',
  selectedCategory: 'all',
  selectedBrand: 'all',
  selectedSort: 'default',
  showOnlyFavorites: false,
  pendingConfirmAction: null
};

// Storage Keys
const STORAGE_KEYS = {
  PRODUCTS: 'product_catalog_items_v2',
  FAVORITES: 'product_catalog_favorites_v2',
  THEME: 'product_catalog_theme_v1'
};

// --- DOM Elements Cache ---
const DOM = {
  // Theme & Global
  html: document.documentElement,
  themeToggleBtn: document.getElementById('themeToggleBtn'),
  themeToggleText: document.getElementById('themeToggleText'),
  resetProductsBtn: document.getElementById('resetProductsBtn'),
  openAddModalBtn: document.getElementById('openAddModalBtn'),
  toastContainer: document.getElementById('toastContainer'),

  // Stats
  statTotal: document.getElementById('statTotal'),
  statSmartphones: document.getElementById('statSmartphones'),
  statLaptops: document.getElementById('statLaptops'),
  statHeadphones: document.getElementById('statHeadphones'),
  statAvgRating: document.getElementById('statAvgRating'),

  // Controls
  searchInput: document.getElementById('searchInput'),
  clearSearchBtn: document.getElementById('clearSearchBtn'),
  categoryFilter: document.getElementById('categoryFilter'),
  brandFilter: document.getElementById('brandFilter'),
  sortBySelect: document.getElementById('sortBySelect'),
  favoritesFilterBtn: document.getElementById('favoritesFilterBtn'),
  favoritesBadge: document.getElementById('favoritesBadge'),
  resultsCount: document.getElementById('resultsCount'),
  tableViewBtn: document.getElementById('tableViewBtn'),
  gridViewBtn: document.getElementById('gridViewBtn'),

  // Views & Content
  tableViewContainer: document.getElementById('tableViewContainer'),
  gridViewContainer: document.getElementById('gridViewContainer'),
  productTableBody: document.getElementById('productTableBody'),
  productGrid: document.getElementById('productGrid'),
  emptyState: document.getElementById('emptyState'),
  clearAllFiltersBtn: document.getElementById('clearAllFiltersBtn'),

  // Pagination
  paginationContainer: document.getElementById('paginationContainer'),
  paginationInfo: document.getElementById('paginationInfo'),
  paginationControls: document.getElementById('paginationControls'),

  // Add/Edit Modal
  productFormModal: document.getElementById('productFormModal'),
  productForm: document.getElementById('productForm'),
  formModalTitle: document.getElementById('formModalTitle'),
  formModalSubtitle: document.getElementById('formModalSubtitle'),
  formModalIcon: document.getElementById('formModalIcon'),
  formMode: document.getElementById('formMode'),
  originalProductId: document.getElementById('originalProductId'),
  productIdInput: document.getElementById('productIdInput'),
  productNameInput: document.getElementById('productNameInput'),
  brandInput: document.getElementById('brandInput'),
  categoryInput: document.getElementById('categoryInput'),
  priceInput: document.getElementById('priceInput'),
  availabilityInput: document.getElementById('availabilityInput'),
  ratingInput: document.getElementById('ratingInput'),
  formRatingStarsPreview: document.getElementById('formRatingStarsPreview'),
  closeFormModalBtn: document.getElementById('closeFormModalBtn'),
  cancelFormModalBtn: document.getElementById('cancelFormModalBtn'),
  saveButtonText: document.getElementById('saveButtonText'),

  // Errors
  productIdError: document.getElementById('productIdError'),
  productNameError: document.getElementById('productNameError'),
  brandError: document.getElementById('brandError'),
  categoryError: document.getElementById('categoryError'),
  priceError: document.getElementById('priceError'),
  availabilityError: document.getElementById('availabilityError'),
  ratingError: document.getElementById('ratingError'),

  // Details Modal
  detailsModal: document.getElementById('detailsModal'),
  detailsModalTitle: document.getElementById('detailsModalTitle'),
  detailCategoryBadge: document.getElementById('detailCategoryBadge'),
  detailIdText: document.getElementById('detailIdText'),
  detailPrice: document.getElementById('detailPrice'),
  detailStars: document.getElementById('detailStars'),
  detailId: document.getElementById('detailId'),
  detailBrand: document.getElementById('detailBrand'),
  detailCategory: document.getElementById('detailCategory'),
  detailAvailability: document.getElementById('detailAvailability'),
  detailCategoryIcon: document.getElementById('detailCategoryIcon'),
  closeDetailsModalBtn: document.getElementById('closeDetailsModalBtn'),
  detailsFavoriteToggleBtn: document.getElementById('detailsFavoriteToggleBtn'),
  detailsFavText: document.getElementById('detailsFavText'),
  detailsEditBtn: document.getElementById('detailsEditBtn'),

  // Confirm Modal
  confirmModal: document.getElementById('confirmModal'),
  confirmTitle: document.getElementById('confirmTitle'),
  confirmMessage: document.getElementById('confirmMessage'),
  confirmCancelBtn: document.getElementById('confirmCancelBtn'),
  confirmProceedBtn: document.getElementById('confirmProceedBtn')
};

// Selected product tracker for details modal
let currentDetailProductId = null;

// ============================================================================
// Initialization & Storage
// ============================================================================

/**
 * Initialize Dashboard
 */
function initDashboard() {
  loadTheme();
  loadFromLocalStorage();
  setupEventListeners();
  populateFilterDropdowns();
  updateStatistics();
  renderProducts();
}

/**
 * Load products and favorites from LocalStorage or use defaults
 */
function loadFromLocalStorage() {
  try {
    const storedProducts = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (storedProducts) {
      AppState.products = JSON.parse(storedProducts);
    } else {
      AppState.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
      saveToLocalStorage();
    }

    const storedFavorites = localStorage.getItem(STORAGE_KEYS.FAVORITES);
    if (storedFavorites) {
      AppState.favorites = new Set(JSON.parse(storedFavorites));
    } else {
      AppState.favorites = new Set();
    }
  } catch (error) {
    console.error('Error loading data from localStorage:', error);
    AppState.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    AppState.favorites = new Set();
  }
}

/**
 * Save current products and favorites to LocalStorage
 */
function saveToLocalStorage() {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(AppState.products));
    localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(Array.from(AppState.favorites)));
  } catch (error) {
    console.error('Error saving data to localStorage:', error);
    showToast('Failed to save data locally.', 'error');
  }
}

/**
 * Reset products back to original catalog
 */
function resetProducts() {
  openConfirmModal(
    'Reset Product Data?',
    'This will restore the complete default product catalog and reset all modifications and favorites.',
    () => {
      AppState.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
      AppState.favorites.clear();
      AppState.searchTerm = '';
      AppState.selectedCategory = 'all';
      AppState.selectedBrand = 'all';
      AppState.selectedSort = 'default';
      AppState.showOnlyFavorites = false;
      AppState.currentPage = 1;

      DOM.searchInput.value = '';
      DOM.categoryFilter.value = 'all';
      DOM.brandFilter.value = 'all';
      DOM.sortBySelect.value = 'default';
      DOM.clearSearchBtn.classList.add('hidden');
      updateFavoritesButtonState();

      saveToLocalStorage();
      populateFilterDropdowns();
      updateStatistics();
      renderProducts();
      showToast(`Product catalog reset to ${DEFAULT_PRODUCTS.length} default products!`, 'success');
    }
  );
}

/**
 * Load Theme preference
 */
function loadTheme() {
  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  applyTheme(savedTheme);
}

/**
 * Apply theme and update toggle button UI
 */
function applyTheme(theme) {
  DOM.html.setAttribute('data-theme', theme);
  const isDark = theme === 'dark';
  DOM.themeToggleText.textContent = isDark ? 'Light Mode' : 'Dark Mode';
  const icon = DOM.themeToggleBtn.querySelector('.theme-icon');
  if (icon) {
    icon.className = isDark ? 'fa-solid fa-sun theme-icon' : 'fa-solid fa-moon theme-icon';
  }
  localStorage.setItem(STORAGE_KEYS.THEME, theme);
}

/**
 * Toggle Dark/Light Mode
 */
function toggleDarkMode() {
  const currentTheme = DOM.html.getAttribute('data-theme') || 'light';
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  applyTheme(newTheme);
  showToast(`Switched to ${newTheme} mode`, 'info');
}

// ============================================================================
// Formatting & Visual Helpers
// ============================================================================

/**
 * Formats numeric price into Indian Currency (e.g. ₹69,999)
 */
function formatIndianCurrency(amount) {
  const num = Number(amount);
  if (isNaN(num)) return '₹0';
  return '₹' + num.toLocaleString('en-IN');
}

/**
 * Generate Visual Star Rating HTML
 */
function generateStarRating(rating) {
  const numRating = Math.max(0, Math.min(5, Number(rating) || 0));
  let starsHtml = '<span class="stars-icons">';

  for (let i = 1; i <= 5; i++) {
    if (numRating >= i) {
      starsHtml += '<i class="fa-solid fa-star"></i>';
    } else if (numRating >= i - 0.5) {
      starsHtml += '<i class="fa-solid fa-star-half-stroke"></i>';
    } else {
      starsHtml += '<i class="fa-regular fa-star star-empty"></i>';
    }
  }

  starsHtml += `</span><span class="rating-number">${numRating.toFixed(1)}</span>`;
  return starsHtml;
}

/**
 * Generate Category Icon Class
 */
function getCategoryIcon(category) {
  const catLower = (category || '').toLowerCase();
  if (catLower.includes('phone')) return 'fa-solid fa-mobile-screen-button';
  if (catLower.includes('laptop')) return 'fa-solid fa-laptop';
  if (catLower.includes('headphone') || catLower.includes('audio') || catLower.includes('earphone')) return 'fa-solid fa-headphones';
  if (catLower.includes('watch')) return 'fa-solid fa-clock';
  if (catLower.includes('tablet') || catLower.includes('pad')) return 'fa-solid fa-tablet-screen-button';
  if (catLower.includes('game') || catLower.includes('gaming') || catLower.includes('console')) return 'fa-solid fa-gamepad';
  if (catLower.includes('access') || catLower.includes('mouse') || catLower.includes('keyboard')) return 'fa-solid fa-keyboard';
  return 'fa-solid fa-cube';
}

/**
 * Get Badge Class according to availability
 */
function getAvailabilityBadgeClass(availability) {
  const status = (availability || '').trim().toLowerCase();
  if (status === 'in stock') return 'badge-in-stock';
  if (status === 'available') return 'badge-available';
  return 'badge-out-of-stock';
}

// ============================================================================
// Filtering, Searching, & Sorting Logic
// ============================================================================

/**
 * Filters, searches, and sorts products based on current AppState
 */
function getProcessedProducts() {
  let result = [...AppState.products];

  // 1. Search Query
  if (AppState.searchTerm.trim() !== '') {
    const query = AppState.searchTerm.toLowerCase().trim();
    result = result.filter(product => {
      const matchId = String(product.id).toLowerCase().includes(query);
      const matchName = String(product.name).toLowerCase().includes(query);
      const matchBrand = String(product.brand).toLowerCase().includes(query);
      const matchCategory = String(product.category).toLowerCase().includes(query);
      const matchAvailability = String(product.availability).toLowerCase().includes(query);
      const matchPrice = String(product.price).includes(query);
      return matchId || matchName || matchBrand || matchCategory || matchAvailability || matchPrice;
    });
  }

  // 2. Category Filter
  if (AppState.selectedCategory !== 'all') {
    result = result.filter(product =>
      String(product.category).toLowerCase() === AppState.selectedCategory.toLowerCase()
    );
  }

  // 3. Brand Filter
  if (AppState.selectedBrand !== 'all') {
    result = result.filter(product =>
      String(product.brand).toLowerCase() === AppState.selectedBrand.toLowerCase()
    );
  }

  // 4. Show Favorites Only
  if (AppState.showOnlyFavorites) {
    result = result.filter(product => AppState.favorites.has(String(product.id)));
  }

  // 5. Sorting
  switch (AppState.selectedSort) {
    case 'price-asc':
      result.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case 'price-desc':
      result.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    case 'rating-desc':
      result.sort((a, b) => Number(b.rating) - Number(a.rating));
      break;
    case 'name-asc':
      result.sort((a, b) => String(a.name).localeCompare(String(b.name)));
      break;
    case 'name-desc':
      result.sort((a, b) => String(b.name).localeCompare(String(a.name)));
      break;
    default:
      // Preserve default order
      break;
  }

  return result;
}

/**
 * Dynamically populate filter dropdown options from available data
 */
function populateFilterDropdowns() {
  const categories = new Set(['Smartphone', 'Laptop', 'Headphones']);
  const brands = new Set(['Apple', 'Samsung', 'Dell', 'Sony']);

  AppState.products.forEach(p => {
    if (p.category) categories.add(p.category);
    if (p.brand) brands.add(p.brand);
  });

  // Preserve category selection if possible
  const currentCategory = DOM.categoryFilter.value || 'all';
  DOM.categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  Array.from(categories).sort().forEach(cat => {
    const opt = document.createElement('option');
    opt.value = cat;
    opt.textContent = cat;
    DOM.categoryFilter.appendChild(opt);
  });
  DOM.categoryFilter.value = categories.has(currentCategory) ? currentCategory : 'all';

  // Preserve brand selection if possible
  const currentBrand = DOM.brandFilter.value || 'all';
  DOM.brandFilter.innerHTML = '<option value="all">All Brands</option>';
  Array.from(brands).sort().forEach(brand => {
    const opt = document.createElement('option');
    opt.value = brand;
    opt.textContent = brand;
    DOM.brandFilter.appendChild(opt);
  });
  DOM.brandFilter.value = brands.has(currentBrand) ? currentBrand : 'all';
}

// ============================================================================
// Statistics Calculations
// ============================================================================

/**
 * Updates top dashboard statistics cards
 */
function updateStatistics() {
  const total = AppState.products.length;
  let smartphoneCount = 0;
  let laptopCount = 0;
  let headphoneCount = 0;
  let ratingSum = 0;

  AppState.products.forEach(p => {
    const cat = (p.category || '').toLowerCase();
    if (cat.includes('smartphone') || cat.includes('phone')) smartphoneCount++;
    else if (cat.includes('laptop')) laptopCount++;
    else if (cat.includes('headphone') || cat.includes('audio')) headphoneCount++;

    ratingSum += Number(p.rating) || 0;
  });

  const avgRating = total > 0 ? (ratingSum / total).toFixed(1) : '0.0';

  DOM.statTotal.textContent = total;
  DOM.statSmartphones.textContent = smartphoneCount;
  DOM.statLaptops.textContent = laptopCount;
  DOM.statHeadphones.textContent = headphoneCount;
  DOM.statAvgRating.textContent = `${avgRating} ★`;

  // Update favorites badge count
  DOM.favoritesBadge.textContent = AppState.favorites.size;
}

// ============================================================================
// Rendering Functions (Table, Card Grid, Pagination)
// ============================================================================

/**
 * Main Render function for products list
 */
function renderProducts() {
  const filteredProducts = getProcessedProducts();
  const totalFiltered = filteredProducts.length;

  // Update showing count
  DOM.resultsCount.innerHTML = `Showing <strong>${totalFiltered}</strong> of ${AppState.products.length} products`;

  // Handle Empty State
  if (totalFiltered === 0) {
    DOM.tableViewContainer.classList.add('hidden');
    DOM.gridViewContainer.classList.add('hidden');
    DOM.paginationContainer.classList.add('hidden');
    DOM.emptyState.classList.remove('hidden');
    return;
  }

  DOM.emptyState.classList.add('hidden');

  // Pagination calculation
  const totalPages = Math.ceil(totalFiltered / AppState.itemsPerPage) || 1;
  if (AppState.currentPage > totalPages) {
    AppState.currentPage = totalPages;
  }
  if (AppState.currentPage < 1) {
    AppState.currentPage = 1;
  }

  const startIndex = (AppState.currentPage - 1) * AppState.itemsPerPage;
  const endIndex = Math.min(startIndex + AppState.itemsPerPage, totalFiltered);
  const currentPaginatedProducts = filteredProducts.slice(startIndex, endIndex);

  // Render Table View
  renderTableView(currentPaginatedProducts);

  // Render Grid View
  renderGridView(currentPaginatedProducts);

  // Show Active View
  if (AppState.currentView === 'table') {
    DOM.tableViewContainer.classList.remove('hidden');
    DOM.gridViewContainer.classList.add('hidden');
  } else {
    DOM.tableViewContainer.classList.add('hidden');
    DOM.gridViewContainer.classList.remove('hidden');
  }

  // Render Pagination Controls
  renderPagination(startIndex + 1, endIndex, totalFiltered, totalPages);
}

/**
 * Render Table Rows
 */
function renderTableView(products) {
  DOM.productTableBody.innerHTML = '';

  products.forEach(product => {
    const isFav = AppState.favorites.has(String(product.id));
    const badgeClass = getAvailabilityBadgeClass(product.availability);
    const categoryIcon = getCategoryIcon(product.category);

    const tr = document.createElement('tr');
    tr.dataset.id = product.id;

    tr.innerHTML = `
      <td class="th-fav">
        <button class="fav-btn ${isFav ? 'is-fav' : ''}" data-action="fav" data-id="${product.id}" title="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </td>
      <td>
        <span class="table-id-badge">#${escapeHtml(product.id)}</span>
      </td>
      <td>
        <div class="product-name-cell">
          <span>${escapeHtml(product.name)}</span>
        </div>
      </td>
      <td><strong>${escapeHtml(product.brand)}</strong></td>
      <td>
        <span class="category-tag">
          <i class="${categoryIcon}"></i> ${escapeHtml(product.category)}
        </span>
      </td>
      <td>
        <span class="product-price-cell">${formatIndianCurrency(product.price)}</span>
      </td>
      <td>
        <span class="badge ${badgeClass}">${escapeHtml(product.availability)}</span>
      </td>
      <td>
        <div class="stars-wrapper">
          ${generateStarRating(product.rating)}
        </div>
      </td>
      <td class="text-right">
        <div class="action-buttons">
          <button class="action-btn edit-btn" data-action="edit" data-id="${product.id}" title="Edit Product">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="action-btn delete-btn" data-action="delete" data-id="${product.id}" title="Delete Product">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </td>
    `;

    DOM.productTableBody.appendChild(tr);
  });
}

/**
 * Render Card Grid
 */
function renderGridView(products) {
  DOM.productGrid.innerHTML = '';

  products.forEach(product => {
    const isFav = AppState.favorites.has(String(product.id));
    const badgeClass = getAvailabilityBadgeClass(product.availability);
    const categoryIcon = getCategoryIcon(product.category);

    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;

    card.innerHTML = `
      <div class="card-top">
        <span class="card-category-badge">
          <i class="${categoryIcon}"></i> ${escapeHtml(product.category)}
        </span>
        <button class="fav-btn ${isFav ? 'is-fav' : ''}" data-action="fav" data-id="${product.id}" title="${isFav ? 'Remove from Favorites' : 'Add to Favorites'}">
          <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart"></i>
        </button>
      </div>

      <div class="card-main-info">
        <h4 class="card-title">${escapeHtml(product.name)}</h4>
        <div class="card-meta">
          <span class="brand-pill">${escapeHtml(product.brand)}</span>
          <span>•</span>
          <span class="table-id-badge">#${escapeHtml(product.id)}</span>
        </div>
      </div>

      <div class="card-middle">
        <div class="card-price">${formatIndianCurrency(product.price)}</div>
        <span class="badge ${badgeClass}">${escapeHtml(product.availability)}</span>
      </div>

      <div class="card-bottom">
        <div class="stars-wrapper">
          ${generateStarRating(product.rating)}
        </div>
        <div class="action-buttons">
          <button class="action-btn edit-btn" data-action="edit" data-id="${product.id}" title="Edit Product">
            <i class="fa-solid fa-pen-to-square"></i>
          </button>
          <button class="action-btn delete-btn" data-action="delete" data-id="${product.id}" title="Delete Product">
            <i class="fa-solid fa-trash-can"></i>
          </button>
        </div>
      </div>
    `;

    DOM.productGrid.appendChild(card);
  });
}

/**
 * Render Pagination Bar
 */
function renderPagination(start, end, total, totalPages) {
  if (total <= AppState.itemsPerPage) {
    DOM.paginationContainer.classList.add('hidden');
    return;
  }

  DOM.paginationContainer.classList.remove('hidden');
  DOM.paginationInfo.textContent = `Showing ${start} to ${end} of ${total} entries`;
  DOM.paginationControls.innerHTML = '';

  // Previous button
  const prevBtn = document.createElement('button');
  prevBtn.className = 'page-btn';
  prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
  prevBtn.disabled = AppState.currentPage === 1;
  prevBtn.title = 'Previous Page';
  prevBtn.addEventListener('click', () => {
    if (AppState.currentPage > 1) {
      AppState.currentPage--;
      renderProducts();
    }
  });
  DOM.paginationControls.appendChild(prevBtn);

  // Page Numbers
  for (let p = 1; p <= totalPages; p++) {
    const pageBtn = document.createElement('button');
    pageBtn.className = `page-btn ${p === AppState.currentPage ? 'active' : ''}`;
    pageBtn.textContent = p;
    pageBtn.addEventListener('click', () => {
      AppState.currentPage = p;
      renderProducts();
    });
    DOM.paginationControls.appendChild(pageBtn);
  }

  // Next button
  const nextBtn = document.createElement('button');
  nextBtn.className = 'page-btn';
  nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';
  nextBtn.disabled = AppState.currentPage === totalPages;
  nextBtn.title = 'Next Page';
  nextBtn.addEventListener('click', () => {
    if (AppState.currentPage < totalPages) {
      AppState.currentPage++;
      renderProducts();
    }
  });
  DOM.paginationControls.appendChild(nextBtn);
}

// ============================================================================
// Product CRUD Operations
// ============================================================================

/**
 * Open Add Product Modal
 */
function openAddProductModal() {
  resetFormErrors();
  DOM.productForm.reset();
  DOM.formMode.value = 'add';
  DOM.originalProductId.value = '';
  DOM.productIdInput.disabled = false;
  DOM.formModalTitle.textContent = 'Add New Product';
  DOM.formModalSubtitle.textContent = 'Fill in the details below to add a product to inventory.';
  DOM.formModalIcon.innerHTML = '<i class="fa-solid fa-plus"></i>';
  DOM.saveButtonText.textContent = 'Add Product';

  // Suggest next ID
  const maxId = AppState.products.reduce((max, p) => {
    const parsed = parseInt(p.id, 10);
    return !isNaN(parsed) && parsed > max ? parsed : max;
  }, 100);
  DOM.productIdInput.value = maxId + 1;

  updateFormRatingPreview(4.5);
  DOM.ratingInput.value = '4.5';
  DOM.availabilityInput.value = 'In Stock';

  DOM.productFormModal.classList.remove('hidden');
  DOM.productNameInput.focus();
}

/**
 * Open Edit Product Modal
 */
function openEditProductModal(productId) {
  const product = AppState.products.find(p => String(p.id) === String(productId));
  if (!product) return;

  resetFormErrors();
  DOM.formMode.value = 'edit';
  DOM.originalProductId.value = product.id;
  DOM.productIdInput.value = product.id;
  DOM.productIdInput.disabled = true; // Product ID is unique primary key
  DOM.productNameInput.value = product.name;
  DOM.brandInput.value = product.brand;
  DOM.categoryInput.value = product.category;
  DOM.priceInput.value = product.price;
  DOM.availabilityInput.value = product.availability;
  DOM.ratingInput.value = product.rating;

  DOM.formModalTitle.textContent = 'Edit Product';
  DOM.formModalSubtitle.textContent = `Modify specifications for "${product.name}".`;
  DOM.formModalIcon.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
  DOM.saveButtonText.textContent = 'Save Changes';

  updateFormRatingPreview(product.rating);
  DOM.productFormModal.classList.remove('hidden');
  DOM.productNameInput.focus();
}

/**
 * Close Form Modal
 */
function closeFormModal() {
  DOM.productFormModal.classList.add('hidden');
}

/**
 * Validate and Save Product (Add or Edit)
 */
function handleProductFormSubmit(e) {
  e.preventDefault();
  resetFormErrors();

  const mode = DOM.formMode.value;
  const originalId = DOM.originalProductId.value;
  const id = DOM.productIdInput.value.trim();
  const name = DOM.productNameInput.value.trim();
  const brand = DOM.brandInput.value.trim();
  const category = DOM.categoryInput.value.trim();
  const price = parseFloat(DOM.priceInput.value);
  const availability = DOM.availabilityInput.value;
  const rating = parseFloat(DOM.ratingInput.value);

  let hasError = false;

  // Validation
  if (!id) {
    setFieldError('productId', 'Product ID is required.');
    hasError = true;
  } else if (mode === 'add' && AppState.products.some(p => String(p.id) === id)) {
    setFieldError('productId', 'This Product ID already exists. Please choose a unique ID.');
    hasError = true;
  }

  if (!name) {
    setFieldError('productName', 'Product Name is required.');
    hasError = true;
  }

  if (!brand) {
    setFieldError('brand', 'Brand is required.');
    hasError = true;
  }

  if (!category) {
    setFieldError('category', 'Please select a category.');
    hasError = true;
  }

  if (isNaN(price) || price <= 0) {
    setFieldError('price', 'Please enter a valid positive price.');
    hasError = true;
  }

  if (!availability) {
    setFieldError('availability', 'Please select availability status.');
    hasError = true;
  }

  if (isNaN(rating) || rating < 0 || rating > 5) {
    setFieldError('rating', 'Rating must be between 0.0 and 5.0.');
    hasError = true;
  }

  if (hasError) return;

  const productData = {
    id,
    name,
    brand,
    category,
    price: Math.round(price),
    availability,
    rating: parseFloat(rating.toFixed(1))
  };

  if (mode === 'add') {
    addProduct(productData);
  } else {
    updateProduct(originalId, productData);
  }

  closeFormModal();
}

/**
 * Add New Product
 */
function addProduct(productData) {
  AppState.products.unshift(productData);
  saveToLocalStorage();
  populateFilterDropdowns();
  updateStatistics();
  renderProducts();
  showToast(`Product "${productData.name}" added successfully!`, 'success');
}

/**
 * Update Existing Product
 */
function updateProduct(productId, productData) {
  const index = AppState.products.findIndex(p => String(p.id) === String(productId));
  if (index !== -1) {
    AppState.products[index] = { ...productData };
    saveToLocalStorage();
    populateFilterDropdowns();
    updateStatistics();
    renderProducts();

    // If details modal is open for this product, refresh it
    if (currentDetailProductId === productId && !DOM.detailsModal.classList.contains('hidden')) {
      openProductModal(productId);
    }

    showToast(`Product "${productData.name}" updated successfully!`, 'success');
  }
}

/**
 * Delete Product with confirmation
 */
function deleteProduct(productId) {
  const product = AppState.products.find(p => String(p.id) === String(productId));
  if (!product) return;

  openConfirmModal(
    'Delete Product?',
    `Are you sure you want to delete "${product.name}" (#${product.id})? This action cannot be undone.`,
    () => {
      AppState.products = AppState.products.filter(p => String(p.id) !== String(productId));
      AppState.favorites.delete(String(productId));

      // Close details modal if open for this product
      if (currentDetailProductId === productId) {
        closeDetailsModal();
      }

      saveToLocalStorage();
      populateFilterDropdowns();
      updateStatistics();
      renderProducts();
      showToast(`Product "${product.name}" was deleted.`, 'info');
    }
  );
}

// ============================================================================
// Product Details Modal
// ============================================================================

/**
 * Open Product Details Modal
 */
function openProductModal(productId) {
  const product = AppState.products.find(p => String(p.id) === String(productId));
  if (!product) return;

  currentDetailProductId = productId;
  const isFav = AppState.favorites.has(String(product.id));
  const badgeClass = getAvailabilityBadgeClass(product.availability);
  const categoryIcon = getCategoryIcon(product.category);

  DOM.detailsModalTitle.textContent = product.name;
  DOM.detailCategoryBadge.textContent = product.category;
  DOM.detailIdText.textContent = `Product ID: #${product.id}`;
  DOM.detailId.textContent = product.id;
  DOM.detailBrand.textContent = product.brand;
  DOM.detailCategory.textContent = product.category;
  DOM.detailPrice.textContent = formatIndianCurrency(product.price);

  DOM.detailAvailability.innerHTML = `<span class="badge ${badgeClass}">${escapeHtml(product.availability)}</span>`;
  DOM.detailStars.innerHTML = generateStarRating(product.rating);
  DOM.detailCategoryIcon.innerHTML = `<i class="${categoryIcon}"></i>`;

  // Update Favorite toggle in Details Modal
  updateDetailsFavoriteButton(isFav);

  DOM.detailsModal.classList.remove('hidden');
}

/**
 * Close Product Details Modal
 */
function closeDetailsModal() {
  DOM.detailsModal.classList.add('hidden');
  currentDetailProductId = null;
}

/**
 * Update details modal favorite button visual
 */
function updateDetailsFavoriteButton(isFav) {
  DOM.detailsFavoriteToggleBtn.innerHTML = `
    <i class="${isFav ? 'fa-solid' : 'fa-regular'} fa-heart" style="color: ${isFav ? 'var(--heart-color)' : 'inherit'};"></i>
    <span>${isFav ? 'Remove Favorite' : 'Add to Favorites'}</span>
  `;
}

// ============================================================================
// Favorites Logic
// ============================================================================

/**
 * Toggle Product Favorite state
 */
function toggleFavorite(productId, event) {
  if (event) {
    event.stopPropagation();
  }

  const idStr = String(productId);
  let isNowFav = false;

  if (AppState.favorites.has(idStr)) {
    AppState.favorites.delete(idStr);
    isNowFav = false;
    showToast('Removed from Favorites', 'info');
  } else {
    AppState.favorites.add(idStr);
    isNowFav = true;
    showToast('Added to Favorites ❤️', 'success');
  }

  saveToLocalStorage();
  updateStatistics();

  // If in details modal
  if (currentDetailProductId === idStr) {
    updateDetailsFavoriteButton(isNowFav);
  }

  renderProducts();
}

/**
 * Toggle "Show Favorites" filter
 */
function toggleShowOnlyFavorites() {
  AppState.showOnlyFavorites = !AppState.showOnlyFavorites;
  AppState.currentPage = 1;
  updateFavoritesButtonState();
  renderProducts();
}

/**
 * Update favorites filter button active style
 */
function updateFavoritesButtonState() {
  if (AppState.showOnlyFavorites) {
    DOM.favoritesFilterBtn.classList.add('active');
    DOM.favoritesFilterBtn.setAttribute('aria-pressed', 'true');
  } else {
    DOM.favoritesFilterBtn.classList.remove('active');
    DOM.favoritesFilterBtn.setAttribute('aria-pressed', 'false');
  }
}

// ============================================================================
// Confirmation Modal
// ============================================================================

/**
 * Open Generic Confirmation Dialog
 */
function openConfirmModal(title, message, onConfirm) {
  DOM.confirmTitle.textContent = title;
  DOM.confirmMessage.textContent = message;
  AppState.pendingConfirmAction = onConfirm;
  DOM.confirmModal.classList.remove('hidden');
}

/**
 * Close Confirmation Dialog
 */
function closeConfirmModal() {
  DOM.confirmModal.classList.add('hidden');
  AppState.pendingConfirmAction = null;
}

// ============================================================================
// Toast Notification System
// ============================================================================

/**
 * Show a floating Toast alert
 */
function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;

  let iconClass = 'fa-solid fa-circle-info';
  if (type === 'success') iconClass = 'fa-solid fa-circle-check';
  if (type === 'error') iconClass = 'fa-solid fa-triangle-exclamation';

  toast.innerHTML = `
    <i class="${iconClass} toast-icon"></i>
    <div class="toast-content">${escapeHtml(message)}</div>
  `;

  DOM.toastContainer.appendChild(toast);

  // Auto remove toast from DOM after animation ends (3 seconds total)
  setTimeout(() => {
    if (toast.parentNode) {
      toast.parentNode.removeChild(toast);
    }
  }, 3100);
}

// ============================================================================
// Validation & Form Helpers
// ============================================================================

function setFieldError(fieldPrefix, message) {
  const errorEl = DOM[`${fieldPrefix}Error`];
  const inputEl = DOM[`${fieldPrefix}Input`];
  if (errorEl) errorEl.textContent = message;
  if (inputEl) inputEl.classList.add('is-invalid');
}

function resetFormErrors() {
  const errorFields = ['productId', 'productName', 'brand', 'category', 'price', 'availability', 'rating'];
  errorFields.forEach(f => {
    const errorEl = DOM[`${f}Error`];
    const inputEl = DOM[`${f}Input`];
    if (errorEl) errorEl.textContent = '';
    if (inputEl) inputEl.classList.remove('is-invalid');
  });
}

function updateFormRatingPreview(val) {
  const num = parseFloat(val);
  if (!isNaN(num) && num >= 0 && num <= 5) {
    DOM.formRatingStarsPreview.innerHTML = generateStarRating(num);
  } else {
    DOM.formRatingStarsPreview.innerHTML = '<span class="star-text">★★★★★ 0.0</span>';
  }
}

/**
 * Sanitize strings for HTML insertion to prevent XSS
 */
function escapeHtml(str) {
  if (str === null || str === undefined) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

// ============================================================================
// Event Listeners Setup
// ============================================================================

function setupEventListeners() {
  // Theme Toggle
  DOM.themeToggleBtn.addEventListener('click', toggleDarkMode);

  // Reset Products Data
  DOM.resetProductsBtn.addEventListener('click', resetProducts);

  // Add Product Button
  DOM.openAddModalBtn.addEventListener('click', openAddProductModal);

  // Search Input (Real-time Instant Search)
  DOM.searchInput.addEventListener('input', (e) => {
    AppState.searchTerm = e.target.value;
    AppState.currentPage = 1;
    if (AppState.searchTerm.length > 0) {
      DOM.clearSearchBtn.classList.remove('hidden');
    } else {
      DOM.clearSearchBtn.classList.add('hidden');
    }
    renderProducts();
  });

  // Clear Search Button
  DOM.clearSearchBtn.addEventListener('click', () => {
    DOM.searchInput.value = '';
    AppState.searchTerm = '';
    DOM.clearSearchBtn.classList.add('hidden');
    AppState.currentPage = 1;
    renderProducts();
    DOM.searchInput.focus();
  });

  // Category Filter
  DOM.categoryFilter.addEventListener('change', (e) => {
    AppState.selectedCategory = e.target.value;
    AppState.currentPage = 1;
    renderProducts();
  });

  // Brand Filter
  DOM.brandFilter.addEventListener('change', (e) => {
    AppState.selectedBrand = e.target.value;
    AppState.currentPage = 1;
    renderProducts();
  });

  // Sort By
  DOM.sortBySelect.addEventListener('change', (e) => {
    AppState.selectedSort = e.target.value;
    AppState.currentPage = 1;
    renderProducts();
  });

  // Show Favorites Button
  DOM.favoritesFilterBtn.addEventListener('click', toggleShowOnlyFavorites);

  // View Switchers (Table vs Grid)
  DOM.tableViewBtn.addEventListener('click', () => {
    AppState.currentView = 'table';
    DOM.tableViewBtn.classList.add('active');
    DOM.gridViewBtn.classList.remove('active');
    renderProducts();
  });

  DOM.gridViewBtn.addEventListener('click', () => {
    AppState.currentView = 'grid';
    DOM.gridViewBtn.classList.add('active');
    DOM.tableViewBtn.classList.remove('active');
    renderProducts();
  });

  // Clear All Filters (Empty State Button)
  DOM.clearAllFiltersBtn.addEventListener('click', () => {
    AppState.searchTerm = '';
    AppState.selectedCategory = 'all';
    AppState.selectedBrand = 'all';
    AppState.selectedSort = 'default';
    AppState.showOnlyFavorites = false;
    AppState.currentPage = 1;

    DOM.searchInput.value = '';
    DOM.categoryFilter.value = 'all';
    DOM.brandFilter.value = 'all';
    DOM.sortBySelect.value = 'default';
    DOM.clearSearchBtn.classList.add('hidden');
    updateFavoritesButtonState();

    renderProducts();
  });

  // Table Body Delegation (Card/Row click for details, edit, delete, favorite)
  DOM.productTableBody.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
      e.stopPropagation();
      const action = actionBtn.dataset.action;
      const id = actionBtn.dataset.id;
      if (action === 'fav') toggleFavorite(id, e);
      if (action === 'edit') openEditProductModal(id);
      if (action === 'delete') deleteProduct(id);
      return;
    }

    const row = e.target.closest('tr');
    if (row && row.dataset.id) {
      openProductModal(row.dataset.id);
    }
  });

  // Grid Container Delegation
  DOM.productGrid.addEventListener('click', (e) => {
    const actionBtn = e.target.closest('[data-action]');
    if (actionBtn) {
      e.stopPropagation();
      const action = actionBtn.dataset.action;
      const id = actionBtn.dataset.id;
      if (action === 'fav') toggleFavorite(id, e);
      if (action === 'edit') openEditProductModal(id);
      if (action === 'delete') deleteProduct(id);
      return;
    }

    const card = e.target.closest('.product-card');
    if (card && card.dataset.id) {
      openProductModal(card.dataset.id);
    }
  });

  // Form Modal Rating live preview & validation removal on input
  DOM.ratingInput.addEventListener('input', (e) => {
    updateFormRatingPreview(e.target.value);
    DOM.ratingInput.classList.remove('is-invalid');
    DOM.ratingError.textContent = '';
  });

  ['productId', 'productName', 'brand', 'price'].forEach(field => {
    DOM[`${field}Input`].addEventListener('input', () => {
      DOM[`${field}Input`].classList.remove('is-invalid');
      DOM[`${field}Error`].textContent = '';
    });
  });

  ['category', 'availability'].forEach(field => {
    DOM[`${field}Input`].addEventListener('change', () => {
      DOM[`${field}Input`].classList.remove('is-invalid');
      DOM[`${field}Error`].textContent = '';
    });
  });

  // Form Modal Submit & Cancel
  DOM.productForm.addEventListener('submit', handleProductFormSubmit);
  DOM.closeFormModalBtn.addEventListener('click', closeFormModal);
  DOM.cancelFormModalBtn.addEventListener('click', closeFormModal);

  // Details Modal Actions
  DOM.closeDetailsModalBtn.addEventListener('click', closeDetailsModal);
  DOM.detailsFavoriteToggleBtn.addEventListener('click', () => {
    if (currentDetailProductId) {
      toggleFavorite(currentDetailProductId);
    }
  });
  DOM.detailsEditBtn.addEventListener('click', () => {
    if (currentDetailProductId) {
      const id = currentDetailProductId;
      closeDetailsModal();
      openEditProductModal(id);
    }
  });

  // Confirm Modal Actions
  DOM.confirmCancelBtn.addEventListener('click', closeConfirmModal);
  DOM.confirmProceedBtn.addEventListener('click', () => {
    if (typeof AppState.pendingConfirmAction === 'function') {
      AppState.pendingConfirmAction();
    }
    closeConfirmModal();
  });

  // Close modals on clicking overlay backdrop
  [DOM.productFormModal, DOM.detailsModal, DOM.confirmModal].forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.add('hidden');
        if (modal === DOM.confirmModal) AppState.pendingConfirmAction = null;
        if (modal === DOM.detailsModal) currentDetailProductId = null;
      }
    });
  });

  // Keyboard accessibility: Close modals on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (!DOM.confirmModal.classList.contains('hidden')) {
        closeConfirmModal();
      } else if (!DOM.productFormModal.classList.contains('hidden')) {
        closeFormModal();
      } else if (!DOM.detailsModal.classList.contains('hidden')) {
        closeDetailsModal();
      }
    }
  });
}

// --- Start the Application on DOM ready ---
document.addEventListener('DOMContentLoaded', initDashboard);
