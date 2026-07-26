const productRow = document.getElementById('productRow');

const productForm = document.getElementById('productForm');

const nameProduct = document.getElementById('name');
const brandProduct = document.getElementById('brand');
const priceProduct = document.getElementById('price');
const imageUrlProduct = document.getElementById('imageUrl');
const descriptionProduct = document.getElementById('description');

const editForm = document.getElementById('editForm');

const editName = document.getElementById('editName');
const editBrand = document.getElementById('editBrand');
const editPrice = document.getElementById('editPrice');
const editImageUrl = document.getElementById('editImageUrl');
const editDescription = document.getElementById('editDescription');

const editModalElement = document.getElementById('editModal');
const editModal = new bootstrap.Modal(editModalElement);

const tokenApi = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2YTYyNGVkNjIxMDU5ZjAwMTVlMjNhMGYiLCJpYXQiOjE3ODQ5MTM2NzcsImV4cCI6MTc4NjEyMzI3N30.EW7MFHLZYh-SgcJuy9Xsg7o3gjCP1kb7D6O-DifJIdo'
const apiUrl = 'https://striveschool-api.herokuapp.com/api/product/';

let productIdToEdit;


// CARICARE I PRODOTTI

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

        displayTableProducts(products);
    } catch (error) {
        console.log(error);
        alert('Errore nel caricamento dei prodotti');
    }
};


// CREARE UNA RIGA DELLA TABELLA

const createProductRow = (product) => {
    const trProduct = document.createElement('tr');

    const tdName = document.createElement('td');
    tdName.innerText = product.name;

    const tdBrand = document.createElement('td');
    tdBrand.innerText = product.brand;

    const tdPrice = document.createElement('td');
    tdPrice.innerText = `€ ${product.price}`;

    const tdImage = document.createElement('td');

    const imgProduct = document.createElement('img');
    imgProduct.src = product.imageUrl;
    imgProduct.alt = product.name;
    imgProduct.style.width = '80px';
    imgProduct.style.height = '60px';
    imgProduct.style.objectFit = 'cover';

    tdImage.appendChild(imgProduct);

    const tdDescription = document.createElement('td');
    tdDescription.innerText = product.description;

    const tdActions = document.createElement('td');

    const actionsContainer = document.createElement('div');
    actionsContainer.classList.add(
        'd-flex',
        'justify-content-center',
        'gap-2'
    );

    const editButton = document.createElement('button');
    editButton.innerHTML = '<i class="bi bi-pencil-square"></i>';
    editButton.title = 'Modifica prodotto';
    editButton.classList.add(
        'btn',
        'btn-outline-warning',
        'btn-sm',
        'rounded-circle'
    );

    editButton.addEventListener('click', () => {
        startEdit(product);
    });

    const deleteButton = document.createElement('button');
    deleteButton.innerHTML = '<i class="bi bi-recycle"></i>';
    deleteButton.title = 'Elimina prodotto';
    deleteButton.classList.add(
        'btn',
        'btn-outline-danger',
        'btn-sm',
        'rounded-circle'
    );

    deleteButton.addEventListener('click', () => {
        deleteProduct(product._id);
    });

    actionsContainer.append(editButton, deleteButton);

    tdActions.appendChild(actionsContainer);

    trProduct.append(
        tdName,
        tdBrand,
        tdPrice,
        tdImage,
        tdDescription,
        tdActions
    );

    return trProduct;
};


// MOSTRARE I PRODOTTI NELLA TABELLA

const displayTableProducts = (products) => {
    productRow.innerHTML = '';

    products.forEach((product) => {
        const row = createProductRow(product);

        productRow.appendChild(row);
    });
};


// CREARE UN NUOVO PRODOTTO - POST

productForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const newProduct = {
        name: nameProduct.value,
        brand: brandProduct.value,
        price: Number(priceProduct.value),
        imageUrl: imageUrlProduct.value,
        description: descriptionProduct.value
    };

    try {
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${tokenApi}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newProduct)
        });

        if (!response.ok) {
            throw new Error('Errore nella creazione del prodotto');
        }

        productForm.reset();

        getProducts();
    } catch (error) {
        console.log(error);
        alert('Errore nella creazione del prodotto');
    }
});


// APRIRE IL MODALE DI MODIFICA

const startEdit = (product) => {
    productIdToEdit = product._id;

    editName.value = product.name;
    editBrand.value = product.brand;
    editPrice.value = product.price;
    editImageUrl.value = product.imageUrl;
    editDescription.value = product.description;

    editModal.show();
};


// MODIFICARE IL PRODOTTO - PUT

editForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const modifiedProduct = {
        name: editName.value,
        brand: editBrand.value,
        price: Number(editPrice.value),
        imageUrl: editImageUrl.value,
        description: editDescription.value
    };

    try {
        const response = await fetch(`${apiUrl}${productIdToEdit}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${tokenApi}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(modifiedProduct)
        });

        if (!response.ok) {
            throw new Error('Errore nella modifica del prodotto');
        }

        document.activeElement.blur();
        editModal.hide();

        getProducts();
    } catch (error) {
        console.log(error);
        alert('Errore nella modifica del prodotto');
    }
});


// ELIMINARE UN PRODOTTO - DELETE

const deleteProduct = async (id) => {
    const confirmed = confirm('Vuoi eliminare questo prodotto?');

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch(`${apiUrl}${id}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${tokenApi}`
            }
        });

        if (!response.ok) {
            throw new Error('Errore nell’eliminazione del prodotto');
        }

        getProducts();
    } catch (error) {
        console.log(error);
        alert('Errore nell’eliminazione del prodotto');
    }
};


// AVVIA IL CARICAMENTO ALL'APERTURA DELLA PAGINA

getProducts();