const rootProducts = document.querySelector('.row');
const filterBtns = document.getElementsByClassName('filterBtn');
const cartModal = document.querySelector('.cartModal');
const cartBtn  = document.querySelector('.cartOpenBtn');
const cartCloseBtn = document.querySelector('.cartCloseBtn');
const cartModalBody = document.querySelector('.cartModal-body');
const totalCountRoot = document.querySelector('.totalCount');

const MAIN_URL = 'http://localhost:8080';

const getLaptops = async () => {
    try {
        const { data } = await axios.get(`${MAIN_URL}/laptops`);
        renderProducts(data, rootProducts);
    } catch (error) {
        console.error(error.message);
        alert('Что пошло не так...');
    }
};

const getLaptop = (data) => {
    const { id, image, name, price } = data;
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
        <h1>${name}</h1>
        <p>${price}</p>
        <img src="${image}">
    `;

    const cardBtn = document.createElement('button');
    cardBtn.innerHTML = "Add to cart";
    cardBtn.onclick = () => {
        const { id, ...remaining } = data;
        addToCart(remaining);
    }

    div.append(cardBtn);

    return div;
};

const getCartLaptop = (data) => {
    const { id, image, name, price } = data;
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
        <h1>${name}</h1>
        <p>${price}</p>
        <img src="${image}">
    `;

    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = "Удалить с корзины";
    deleteBtn.onclick = () => {
        deleteFromCart(id);
    };

    div.append(deleteBtn);

    return div;
};

const renderProducts = (data, root, isCart) => {
    root.innerHTML = "";
    data.forEach((laptop) => {
        let card;
        
        if (isCart) {
            card = getCartLaptop(laptop);
        } else {
            card = getLaptop(laptop);
        }
        root.append(card);
    });
};

const addToCart = async (laptop) => {
    try {
        await axios.post(`${MAIN_URL}/cart`, laptop);
    } catch (error) {
        alert(error.message);
        console.log(error);
    }
};

const filterByBrand = async (brand) => {
    try {
        const { data } = await axios.get(`${MAIN_URL}/laptops?brand=${brand}`);
        renderProducts(data, rootProducts);
    } catch (error) {
        console.log(error.message);
    }
};

[...filterBtns].forEach((filterBtn) => {
    filterBtn.onclick = () => {
        if (filterBtn.dataset.brand === "ALL") {
            getLaptops();
        } else {
            filterByBrand(filterBtn.dataset.brand);
        }
    };
});

const getCartItems = async () => {
    try {
        const { data } = await axios.get(`${MAIN_URL}/cart`);
        return data;
    } catch (error) {
        alert(error.message);
        console.error(error);
    }
};

const deleteFromCart = async (id) => {
    try {
        await axios.delete(`${MAIN_URL}/cart/${id}`);
        renderCart();
    } catch (error) {
        alert(error.message);
        console.error(error);
    }
}

const getTotalCount = (data) => {
    const totalCount = data.reduce((acc, currentItem) => {
        acc += currentItem.price;
        return acc;
    }, 0);

    totalCountRoot.innerHTML = totalCount;
};

const renderCart = async () => {
    const cartItems = await getCartItems();
    getTotalCount(cartItems);
    renderProducts(cartItems, cartModalBody, true);
};

const openCart = () => {
    cartModal.classList.remove('cartModalHidden');
    renderCart();
};

const closeCart = () => {
    cartModal.classList.add('cartModalHidden');
};

cartBtn.onclick = openCart;
cartCloseBtn.onclick= closeCart;

getLaptops();


















