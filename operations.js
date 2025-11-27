let productsData = [];

async function fetchData() {
    const response = await fetch('https://fakestoreapi.com/products');
    const data = await response.json();
    productsData = data;
    return data;
}

function showProducts(products = productsData) {
    const container = document.getElementById('products');
    
    container.innerHTML = '';
    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No products found.</p>';
        return;
    }

    products.forEach(product => {
        const card = `
            <div class="rounded-lg border border-gray-200  bg-[#fcfdf2] p-6 shadow-sm flex flex-col transition-transform duration-200 hover:scale-105">
                <div class="h-56 w-full">
                    <a href="#">
                        <img class="mx-auto h-full" src="${product.image}" alt="${product.title}" />
                    </a>
                </div>
                <div class="pt-6">
                    <div class="mb-4 flex items-center justify-between gap-4">
                        <span class="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">${product.category}</span>
                    </div>
                    <a href="#" class="text-lg font-semibold leading-tight text-gray-900 hover:underline">${product.title}</a>
                    <div class="mt-2 flex items-center gap-2">
                        <p class="text-sm font-medium text-gray-900">${product.rating?.rate ?? ''}</p>
                        <p class="text-sm font-medium text-gray-500">(${product.rating?.count ?? ''})</p>
                    </div>
                    <div class="mt-auto flex items-center justify-between gap-4 pt-4">
                        <p class="text-2xl font-extrabold leading-tight text-gray-900">$${product.price}</p>
                        <button class="items-center rounded-lg  bg-[#4b5ae4] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Add to cart</button>
                    </div>
                </div>
            </div>
        `;

        container.insertAdjacentHTML('beforeend', card);
    });
}

//category 
async function categoryFilter() {
    const response = await fetch('https://fakestoreapi.com/products/categories');
    const data = await response.json();
    const categoryContainer = document.getElementById('filter-section-category');
    categoryContainer.innerHTML = '';
    
    data.forEach((cat, index) => {
        const categoryItem = `
            
            <div class="space-y-4">
                <div class="flex gap-3">
                  <div class="flex h-5 shrink-0 items-center">
                    <div class="group grid size-4 grid-cols-1">
                      <input id="filter-category-${index}" type="checkbox" name="category[]" value="${cat}" class="col-start-1 row-start-1 appearance-none rounded-sm border border-gray-300  bg-[#fcfdf2] checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto" />
                      <svg viewBox="0 0 14 14" fill="none" class="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-disabled:stroke-gray-950/25">
                        <path d="M3 8L6 11L11 3.5" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-checked:opacity-100" />
                        <path d="M3 7H11" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="opacity-0 group-has-indeterminate:opacity-100" />
                      </svg>
                    </div>
                  </div>
                  <label for="filter-category-${index}" class="text-sm text-gray-600">${cat}</label>
                </div>
            </div>
        `;
        categoryContainer.insertAdjacentHTML('beforeend', categoryItem);
    });
    
    const categoryCheckboxes = document.querySelectorAll('input[name="category[]"]');
    categoryCheckboxes.forEach( cb => cb.addEventListener('change', applyFilters) );
}


//all filter
function applyFilters() {
    const searchInput = document.getElementById('search').value.trim().toLowerCase();

    const selected= Array.from(document.querySelectorAll('input[name="category[]"]:checked')).map(cb => cb.value);

    let filtered = productsData;

    // filter by category
    if (selected.length > 0) {
        filtered = filtered.filter(product => selected.includes(product.category));
    }

    // filter by search input

    if (searchInput){
         filtered = filtered.filter(product =>
            (product.title || '' ).toLowerCase().includes(searchInput) || (product.category || '').toLowerCase().includes(searchInput)
        );
    }

    

    showProducts(filtered);
}




//this is for searching

function debounce(searchingFun, delay = 300) {
    let timeout;
    return function (...args) {
        clearTimeout(timeout);
        timeout = setTimeout(() => searchingFun.apply(this, args), delay);
    };
}


window.onload = async function () {
    await fetchData();
    showProducts();
    await categoryFilter();

    const searchInput = document.getElementById('search');

    const search = debounce(function () {
        applyFilters();
     }, 300);

    if (searchInput) {
        searchInput.addEventListener('input', search);
    }

  
};


//show product pop
function showProducts(products = productsData) {
    const container = document.getElementById('products');
    container.innerHTML = '';

    if (!products || products.length === 0) {
        container.innerHTML = '<p class="text-gray-500">No products found.</p>';
        return;
    }

    products.forEach(product => {
        const card = document.createElement('div');
        card.className = "rounded-lg border border-gray-200  bg-[#fcfdf2] p-6 shadow-sm flex flex-col transition-transform duration-200 hover:scale-105 cursor-pointer";
        card.innerHTML = `
            <div class="h-56 w-full">
                <img class="mx-auto h-full" src="${product.image}" alt="${product.title}" />
            </div>
            <div class="pt-6">
                <div class="mb-4 flex items-center justify-between gap-4">
                    <span class="me-2 rounded bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">${product.category}</span>
                </div>
                <a href="#" class="text-lg font-semibold leading-tight text-gray-900 hover:underline">${product.title}</a>
                <div class="mt-2 flex items-center gap-2">
                    <p class="text-sm font-medium text-gray-900">${product.rating?.rate ?? ''}</p>
                    <p class="text-sm font-medium text-gray-500">(${product.rating?.count ?? ''})</p>
                </div>
                <div class="mt-auto flex items-center justify-between gap-4 pt-4">
                    <p class="text-2xl font-extrabold leading-tight text-gray-900">$${product.price}</p>
                    <button class="items-center rounded-lg  bg-[#4b5ae4] px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">Add to cart</button>
                </div>
            </div>
        `;

        // Attach click event directly here
        card.addEventListener('click', () => openModal(product));

        container.appendChild(card);
    });
}

function openModal(product) {
    const modal = document.getElementById('productModal');
    const imgElem = document.getElementById('prodImage');
    const modalContent = document.getElementById('modalContent');

    imgElem.src = product.image;

    modalContent.innerHTML = `
    <h2 class="text-3xl font-bold mb-2">${product.title}</h2>
        <p class="text-gray-600 mb-4">${product.category}</p>
        <div class="mt-2 flex items-center gap-2">
            <p class="text-sm font-medium text-gray-900">${product.rating?.rate ?? ''}</p>
            <p class="text-sm font-medium text-gray-500">(${product.rating?.count ?? ''})</p>
        </div>
        <div class="mb-4">
            <span class="text-2xl font-bold mr-2">$${product.price}</span>
        </div>
        <p class="text-gray-700 mb-6">${product.description ?? ''}</p>

        
    `;

    modal.classList.remove('hidden');
}

// Close modal
document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('productModal').classList.add('hidden');
});

// Close modal if clicking outside content
document.getElementById('productModal').addEventListener('click', (e) => {
    if (e.target.id === 'productModal') {
        document.getElementById('productModal').classList.add('hidden');
    }
});
