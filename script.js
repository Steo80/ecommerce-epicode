const productContainer = document.getElementById('productContainer');
const searchInput = document.getElementById('searchInput');

let allProducts = [];

const tokenApi = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTYyNGVkNjIxMDU5ZjAwMTVlMjNhMGYiLCJpYXQiOjE3ODQ5MTM2NzcsImV4cCI6MTc4NjEyMzI3N30.EW7MFHLZYh-SgcJuy9Xsg7o3gjCP1kb7D6O-DifJIdo'
const apiUrl = 'https://striveschool-api.herokuapp.com/api/product/';

let cart = JSON.parse(localStorage.getItem('cart')) || [];

const cartCount = document.getElementById('cartCount');
const cartMessage = document.getElementById('cartMessage');
let messageTimer;

const updateCartCount = () => {
    cartCount.innerText = cart.length;

};

const addToCart = (product) => {
    cart.push(product);

    localStorage.setItem('cart', JSON.stringify(cart));

    updateCartCount();

    cartMessage.innerText = `${product.name} aggiunto al carrello!`;

    cartMessage.classList.remove('d-none');

    clearTimeout(messageTimer);

    messageTimer = setTimeout(() => {
        cartMessage.classList.add('d-none');
    }, 2000);
};

updateCartCount();

const getProducts = async () => {
    try {
        const response = await fetch(apiUrl, {
            headers: {
                Authorization: `Bearer ${tokenApi}`
            }
        });

        if (!response.ok) {
            throw new Error('Errore nel caricamento prodotti');
        }

        const products = await response.json();
        allProducts = products;
        displayProducts(allProducts);
    } catch (error) {
        console.log(error);

        productContainer.innerHTML = `<p class="text-danger">Errore nel caricamento dei prodotti.</p>`;
    }
};

const createProductCard = (product) => {
    const column = document.createElement('div');

    column.classList.add('col-12', 'col-sm-6', 'col-md-4');

    column.innerHTML = `
        <div class="card h-100 shadow-sm">

            <img
                src="${product.imageUrl}"
                class="card-img-top"
                alt="${product.name}"
                style="height: 220px; object-fit: contain;">

            <div class="card-body d-flex flex-column">

                <p class="text-secondary mb-1">${product.brand}</p>
                <h5 class="card-title">${product.name}</h5>
                <p class="card-text">${product.description}</p>
                <h4 class="mt-auto">€ ${product.price}</h4>
                <a href="./detail.html?id=${product._id}"
                    class="btn btn-primary mt-3">
                    Vedi prodotto
                </a>
                <button class="btn btn-outline-success mt-2 cart-button">
                    <i class="bi bi-cart-plus"></i>
                    Aggiungi al carrello
                </button>

            </div>
        </div>
    `;

    const cartButton = column.querySelector('.cart-button');

    cartButton.addEventListener('click', () => {
        addToCart(product);
    });

    return column;
};

const displayProducts = (products) => {
    productContainer.innerHTML = '';

    products.forEach((product) => {
        const card = createProductCard(product);

        productContainer.appendChild(card);
    });
};

getProducts();

searchInput.addEventListener('input', () => {
    const searchText = searchInput.value.toLowerCase();

    const filteredProducts = allProducts.filter((product) => {
        return (
            product.name.toLowerCase().includes(searchText) ||
            product.brand.toLowerCase().includes(searchText)
        );
    });

    displayProducts(filteredProducts);
});