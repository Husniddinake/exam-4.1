const productList = document.getElementById('product-list');
const loader = document.getElementById('loader');
const searchInput = document.getElementById('search');
const categoryFilter = document.getElementById('categoryFilter');
const priceSort = document.getElementById('priceSort');

let products = [];

function showLoader() {
  loader.style.display = 'block';
}

function hideLoader() {
  loader.style.display = 'none';
}

function fetchProducts() {
  showLoader();
  fetch('https://fakestoreapi.com/products')
    .then(res => res.json())
    .then(data => {
      products = data;
      populateCategories(data);
      renderProducts(products);
    })
    .catch(err => {
      productList.innerHTML = '<p>Xatolik yuz berdi. Qaytadan urinib ko\'ring.</p>';
    })
    .finally(() => {
      hideLoader();
    });
}

function renderProducts(productArray) {
  productList.innerHTML = '';
  productArray.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}">
      <h2 class="product-title">${product.title}</h2>
      <p class="product-price">$${product.price}</p>
      <p class="product-category">${product.category}</p>
    `;
    productList.appendChild(card);
  });
}

function populateCategories(data) {
  const categories = [...new Set(data.map(p => p.category))];
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
}

// Filtering, Searching, Sorting
searchInput.addEventListener('input', () => {
  applyFilters();
});

categoryFilter.addEventListener('change', () => {
  applyFilters();
});

priceSort.addEventListener('change', () => {
  applyFilters();
});

function applyFilters() {
  let filtered = [...products];

  const searchText = searchInput.value.toLowerCase();
  const selectedCategory = categoryFilter.value;
  const sortOption = priceSort.value;

  if (searchText) {
    filtered = filtered.filter(p => p.title.toLowerCase().includes(searchText));
  }

  if (selectedCategory !== 'all') {
    filtered = filtered.filter(p => p.category === selectedCategory);
  }

  if (sortOption === 'asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortOption === 'desc') {
    filtered.sort((a, b) => b.price - a.price);
  }

  renderProducts(filtered);
}

// Start
fetchProducts();
