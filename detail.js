const productDetail = document.getElementById('productDetail');
const cartCount = document.getElementById('cartCount');
const cartMessage = document.getElementById('cartMessage');

let messageTimer;

const tokenApi = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTYyNGVkNjIxMDU5ZjAwMTVlMjNhMGYiLCJpYXQiOjE3ODQ5MTM2NzcsImV4cCI6MTc4NjEyMzI3N30.EW7MFHLZYh-SgcJuy9Xsg7o3gjCP1kb7D6O-DifJIdo'
const apiUrl = 'https://striveschool-api.herokuapp.com/api/product/';

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const productId = urlParams.get('id');

let cart = JSON.parse(localStorage.getItem('cart')) || [];


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


const getProduct = async () => {
    try {
        const response = await fetch(`${apiUrl}${productId}`, {
            headers: {
                Authorization: `Bearer ${tokenApi}`
            }
        });

        if (!response.ok) {
            throw new Error('Errore nel caricamento del prodotto');
        }

        const product = await response.json();

        displayProduct(product);
    } catch (error) {
        console.log(error);

        productDetail.innerHTML = `
            <p class="text-danger">
                Errore nel caricamento del prodotto.
            </p>
        `;
    }
};


const displayProduct = (product) => {
    productDetail.innerHTML = `
        <div class="row g-5">

            <div class="col-12 col-md-6">
                <img
                    src="${product.imageUrl}"
                    alt="${product.name}"
                    class="img-fluid rounded shadow-sm"
                >
            </div>

            <div class="col-12 col-md-6">

                <p class="text-secondary">${product.brand}</p>

                <h1>${product.name}</h1>

                <h2 class="my-4">€ ${product.price}</h2>

                <p>${product.description}</p>

                <button class="btn btn-success mt-3" id="addToCartButton">
                    <i class="bi bi-cart-plus"></i>
                    Aggiungi al carrello
                </button>

            </div>

        </div>
    `;

    const addToCartButton = document.getElementById('addToCartButton');

    addToCartButton.addEventListener('click', () => {
        addToCart(product);
    });
};


updateCartCount();

getProduct();