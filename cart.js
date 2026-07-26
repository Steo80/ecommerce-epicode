const cartContainer = document.getElementById('cartContainer');
const cartCount = document.getElementById('cartCount');
const totalPrice = document.getElementById('totalPrice');
const clearCartButton = document.getElementById('clearCartButton');

let cart = JSON.parse(localStorage.getItem('cart')) || [];


const updateCartCount = () => {
    cartCount.innerText = cart.length;
};


const saveCart = () => {
    localStorage.setItem('cart', JSON.stringify(cart));
};


const removeFromCart = (index) => {
    const product = cart[index];

    const confirmed = confirm(
        `Vuoi eliminare ${product.name} dal carrello?`
    );

    if (!confirmed) {
        return;
    }

    cart.splice(index, 1);

    saveCart();

    displayCart();
};


const clearCart = () => {
    cart = [];

    saveCart();
    displayCart();
};


const displayCart = () => {
    cartContainer.innerHTML = '';

    if (cart.length === 0) {
        cartContainer.innerHTML = `
            <div class="alert alert-info">
                Il carrello è vuoto.
                <a href="./index.html" class="alert-link">Torna ai prodotti</a>
            </div>
        `;

        totalPrice.innerText = 'Totale: € 0';
        clearCartButton.classList.add('d-none');

        updateCartCount();

        return;
    }

    clearCartButton.classList.remove('d-none');

    const table = document.createElement('table');
    table.classList.add('table', 'table-striped', 'align-middle');

    table.innerHTML = `
        <thead>
            <tr>
                <th>Immagine</th>
                <th>Prodotto</th>
                <th>Prezzo</th>
                <th>Azioni</th>
            </tr>
        </thead>

        <tbody id="cartRows"></tbody>
    `;

    cartContainer.appendChild(table);

    const cartRows = document.getElementById('cartRows');

    let total = 0;

    cart.forEach((product, index) => {
        total = total + Number(product.price);

        const row = document.createElement('tr');

        row.innerHTML = `
            <td>
                <img
                    src="${product.imageUrl}"
                    alt="${product.name}"
                    style="width: 80px; height: 60px; object-fit: cover;"
                >
            </td>

            <td>
                <strong>${product.name}</strong>
                <br>
                <small>${product.brand}</small>
            </td>

            <td>€ ${product.price}</td>

            <td>
                <button class="btn btn-outline-danger btn-sm rounded-circle remove-button"
                        title="Rimuovi dal carrello">
                    <i class="bi bi-recycle"></i>
                </button>
            </td>`;

        const removeButton = row.querySelector('.remove-button');

        removeButton.addEventListener('click', () => {
            removeFromCart(index);
        });

        cartRows.appendChild(row);
    });

    totalPrice.innerText = `Totale: € ${total.toFixed(2)}`;

    updateCartCount();

    //crea un pulsante per tornare allo shopping
    const backToShoppingButton = document.createElement('a');
    backToShoppingButton.href = './index.html';
    backToShoppingButton.classList.add('btn', 'btn-primary', 'mt-3');
    backToShoppingButton.innerHTML = '<i class="bi bi-arrow-left"></i> Torna allo shopping';

    cartContainer.appendChild(backToShoppingButton);
};


clearCartButton.addEventListener('click', () => {
    clearCart();
});


displayCart();
