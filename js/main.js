let shoppingCart = {
    currentPrice: 0
}

function pseudopay(){
    alert(`La compra ha costado ${shoppingCart.currentPrice}€.`);
}

// Update shopping cart in HTML view
function updateShoppingCartDisplay(){
    const productList = document.querySelector('.product-list');

    // We remove the current product list
    productList.innerHTML = '';

    // We create the product list elements iterating the shopping cart
    Object.keys(shoppingCart).forEach((key) => {
        if(key !== 'currentPrice'){

            // Product element
            let elem = document.createElement('li');

            // We set the text of the product in the list
            let elemText = document.createElement('span');
            elemText.innerHTML = shoppingCart[key].quantity + "x " + key.charAt(0).toUpperCase() + key.slice(1);


            // We create the add/del buttons to the element
            let controlsContainer = document.createElement('div');
            controlsContainer.className = 'product-controls-container';

            // Add button (to add more of the same product directly from the shopping cart)
            let addControl = document.createElement('button');
            addControl.className = 'product-control';
            addControl.innerHTML = '+';

            addControl.addEventListener('click', () => {
                updateShoppingCart('add', {name: key, price: shoppingCart[key].price });
            });

            controlsContainer.appendChild(addControl);

            // Del button (to delete a product directly from the shopping cart)
            let delControl = document.createElement('button');
            delControl.className = 'product-control';
            delControl.innerHTML = '-';

            delControl.addEventListener('click', () => {
                updateShoppingCart('del', {name: key, price: shoppingCart[key].price });
            });

            controlsContainer.appendChild(delControl);

            // We append the controls container to the <li>
            elem.appendChild(controlsContainer);
            elem.appendChild(elemText);

            // We append the text and controls to the <ul>
            productList.appendChild(elem);
        }
    });
}

// Update current price function
function updateCurrentPrice(){
    shoppingCart.currentPrice = 0;

    // We iterate over shopping cart object keys in order to calculate the current price
    Object.keys(shoppingCart).forEach((key) => {
        if(key !== 'currentPrice'){
            shoppingCart.currentPrice += shoppingCart[key].quantity * shoppingCart[key].price;
        }
    });

    // We update the value on the HTML and prevent float comma
    document.querySelector('.current-price').innerHTML = Math.round(shoppingCart.currentPrice * 100 + Number.EPSILON ) / 100;
}

// Update shopping cart function
function updateShoppingCart(operation, product){
    // We check if the product already exists in the shopping cart
    if(!(product.name in shoppingCart)){
        // If it doesn't exist we add it with a quantity = 1
        shoppingCart[product.name] = {
            quantity: 1,
            price: product.price
        };
    }else{
        // Else we update the product quantity on the shopping cart depending on the operation
        newQuantity = (operation === 'add')
            ? shoppingCart[product.name].quantity + 1
            : shoppingCart[product.name].quantity - 1;
        
        shoppingCart[product.name].quantity = newQuantity;

        // If the product reaches 0 in quantity is automatically removed of the shopping cart
        if(shoppingCart[product.name].quantity === 0){
            delete shoppingCart[product.name];
        }
    }

    // We update the current price
    updateCurrentPrice()

    // We call the function to update the HTML view
    updateShoppingCartDisplay();

    // We set the default text if the product list is empty
    let productList = document.querySelector('.product-list');

    if(productList.childNodes.length === 0){
        productList.innerHTML = "<i>No hay productos</i>"
    }
}

// Checkout function
function checkout(e){
    e.preventDefault();

    // We get the product information from the drag event
    const product = {
        name: e.dataTransfer.getData('name'),
        price: parseFloat(e.dataTransfer.getData('price'))
    };

    // We call update shopping cart function
    updateShoppingCart('add', product);
}

// Initialize function
document.addEventListener('DOMContentLoaded', () => {
    // We attach the dragstart and dragend events to each product
    const items = document.querySelectorAll('.product-row .product');
    items.forEach(function(item) {
        item.addEventListener('dragstart', handleDragStart);
        item.addEventListener('dragend', handleDragEnd);
    });

    // We initialize the current price in the HTML view
    document.querySelector('.current-price').innerHTML = shoppingCart.currentPrice;
});

