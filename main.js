const demoSection = document.getElementById("demo"),
    cartSection = document.getElementById("container"),
    cartItem = document.getElementById("demoItem")
let arr = []
let currentColor = "Black", currentImageIndex = 0

// Updated to store cart items with quantities
let localStorageItems = JSON.parse(localStorage.getItem("carsWithQuantities")) || []
async function abc() {

    const options = {
        method: 'GET'
        // headers: {
        //     'x-rapidapi-key': 'c27e1a3cd4msh21bf1715578a128p194a9ejsnffda7608df8f',
        //     'x-rapidapi-host': 'cars-database-with-image.p.rapidapi.com'
        // }
    };

    const url = await fetch('./car.json', options);
    const result = await url.json();
    arr = result.cars
    // console.log(arr.length);
    handleDisplay();
    // console.log(result.cars);

}

// Initialize localStorageItems with data from localStorage
localStorageItems = JSON.parse(localStorage.getItem("carsWithQuantities")) || [];

abc();
displayCart();


function handleDisplay() {
    let html = ``
    for (let i = 0; i < arr.length; i++) {
        html += `<div class="col-12 col-lg-4">
        <div class="mx-auto w-25 pos">
        <div class="car-bg-image" style="background-image: url('${arr[i].images.Black[0]}');"></div>
        </div>
            <h1>${arr[i].model}</h1>
            <button onclick="addToCart(`+ i + `)" class="btn btn-primary">Add to cart</button>
        </div>`
    }
    if (demoSection) {
        demoSection.innerHTML = html
    }
    // console.log(html);
}
function addToCart(index) {
    // Check if item already exists in cart
    let existingItemIndex = localStorageItems.findIndex(item => item.id === arr[index].id);

    if (existingItemIndex !== -1) {
        // If item exists, increment quantity
        localStorageItems[existingItemIndex].quantity += 1;
    } else {
        // If item doesn't exist, add it with quantity 1
        let itemWithQuantity = { ...arr[index] };
        itemWithQuantity.quantity = 1;
        localStorageItems.push(itemWithQuantity);
    }

    localStorage.setItem("carsWithQuantities", JSON.stringify(localStorageItems));
    displayCart();
}

function displayCart() {
    let html = ``
    let cart = JSON.parse(localStorage.getItem("carsWithQuantities"))
    if (cartSection) {
        if (cart != null && cart.length > 0) {
            let totalPrice = 0;
            for (let i = 0; i < cart.length; i++) {
                let itemTotal = cart[i].price * cart[i].quantity;
                totalPrice += itemTotal;
                // Use the global currentColor as default
                let selectedColor = currentColor;
                // Try to find the color from the item's own property first
                if (cart[i].selectedColor) {
                    selectedColor = cart[i].selectedColor;
                }
                // check if product is already added or no
                html += `<div class="col-12 col-lg-4">
                <div class="border-dark rounded p-3 bg-light-subtle">
            <div class="d-flex">
            <div class="w-50 h-50 mx-auto position-relative cart-image-container">
                <div class="blurred-bg" style="background-image: url('${cart[i].images[selectedColor][0]}');"></div>
                <img src="${cart[i].images[selectedColor][0]}" alt="car" class="w-50 h-100 position-relative"/>
            </div>
            <div>
            <h1>${cart[i].model}</h1>
            <p>Quantity: ${cart[i].quantity}</p>
            <p>Total: ${itemTotal} EGP</p>
            <p>Color: ${selectedColor}</p>
            </div>
            </div>
            <button onclick="removeFromCart(${i})" class="btn btn-danger">
                <i class="fa-solid fa-trash" style="color: #ffffff;"></i>
            </button>
            <button onclick="displayCartItem(${i})" class="btn btn-warning">
                <i class="fa-solid fa-eye" style="color: #000000;"></i>
            </button>
            </div>
            </div>`
            }
            html += `<div class="col-12">
                <h2>Total Price: ${totalPrice} EGP</h2>
                <button class="btn btn-success" onclick="calculateAndStoreTotal()">Proceed to Checkout</button>
            </div>`;
            cartSection.innerHTML = html
        }
        else {
            cartSection.innerHTML = `<div class="empty-cart-img">
            <img src="./images/shopping.png" alt="empty cart section">
            </div>
            <h3 class="empty-cart-img-title">cart is empty</h3>
            `;
        }
    }
}

// Function to calculate total price and proceed to checkout
function calculateAndStoreTotal() {
    // Get items from localStorage
    const items = JSON.parse(localStorage.getItem("carsWithQuantities")) || [];

    // Calculate total price
    const totalPrice = items.reduce((total, item) => {
        return total + (item.price * item.quantity);
    }, 0);

    // Store total price in localStorage
    localStorage.setItem("totalPrice", totalPrice);

    // Redirect to proceed page
    window.location.href = "./proceed.html";
}

// Function to get total price for a specific item in cart
function getItemTotal(item) {
    return item.price * (item.quantity || 1);
}

function removeFromCart(index) {
    // Show SweetAlert confirmation dialog
    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
        if (result.isConfirmed) {
            // User confirmed deletion
            localStorageItems.splice(index, 1)
            localStorage.setItem("carsWithQuantities", JSON.stringify(localStorageItems))
            // Update the global localStorageItems array
            localStorageItems = JSON.parse(localStorage.getItem("carsWithQuantities")) || [];
            displayCart()

            // Show success message
            Swal.fire(
                'Deleted!',
                'Your item has been deleted.',
                'success'
            )
        }
    })
}

function displayCartItem(index) {

    cartItem.classList.remove("close-cart-item")
    cartItem.classList.add("open-cart-item")

    // console.log("hello");

    let html = ``, htmlColors = ``
    let cart = JSON.parse(localStorage.getItem("carsWithQuantities"))

    for (let key in cart[index].images) {
        htmlColors += `<span onclick="changeImgBg('${key}', ${index})" style="cursor:pointer; background:${key}; width:20px; height:20px; display:inline-block;" class="mx-2 rounded    "></span>`
    }

    html = `
         <div class="w-100 position-relative" >
            <div class="position-absolute m-3 bg-light rounded py-1 px-2" onclick="closeCartItem()">
                <i class="fa-solid fa-close"></i>
            </div>
            <img id="displayed-img-cart" src="${cart[index].images.Black[0]}" alt="car" class="w-100">
            <div class="handle-cart-images-btns w-100">
            <div class="d-flex justify-content-between">
            <button class="bg-light rounded cart-item-display-btn" onclick="handlePrevImg(${index})">
                <i class="fa-solid fa-angle-left"></i>
            </button>
            <button class="bg-light rounded cart-item-display-btn" onclick="handleNextImg(${index})">
                <i class="fa-solid fa-angle-right"></i>
            </button>
        </div>
        </div>
        </div>
        <div class="container-fluid mt-3">
            <h2 class="text-center">${cart[index].model}</h2>
            <h3 class="text-center">
                ${htmlColors}
            </h3 >
            <div class="quantity my-1 text-center">
                <button class="btn btn-success" onclick="increaseCounter(${index})">+</button>
                <span id="counterId">${cart[index].quantity}</span>
                <button class="btn btn-danger" onclick="decreaseCounter(${index})">-</button>
            </div>
            <h4 class="calc-price text-center">${cart[index].price * cart[index].quantity} EGP</h4>
        </div >
    <button class="btn btn-success w-75 position-absolute top-100 start-50 translate-middle" onclick="calculateAndStoreTotal()">Proceed to Checkout</button>
`
    cartItem.innerHTML = html
}

function increaseCounter(index) {
    let counterIdItem = document.getElementById("counterId"),
        calcPriceItem = document.querySelector(".calc-price")

    // Increase quantity for the specific item
    localStorageItems[index].quantity += 1;

    // Update UI
    counterIdItem.innerHTML = localStorageItems[index].quantity;
    calcPriceItem.innerHTML = localStorageItems[index].price * localStorageItems[index].quantity;

    // Update localStorage
    localStorage.setItem("carsWithQuantities", JSON.stringify(localStorageItems));

    // Update cart display
    displayCart();
}

function decreaseCounter(index) {
    let counterIdItem = document.getElementById("counterId"),
        calcPriceItem = document.querySelector(".calc-price")

    if (localStorageItems[index].quantity > 1) {
        // Decrease quantity for the specific item
        localStorageItems[index].quantity -= 1;

        // Update UI
        counterIdItem.innerHTML = localStorageItems[index].quantity;
        calcPriceItem.innerHTML = localStorageItems[index].price * localStorageItems[index].quantity;

        // Update localStorage
        localStorage.setItem("carsWithQuantities", JSON.stringify(localStorageItems));

        // Update cart display
        displayCart();
    }
}

function closeCartItem() {
    document.getElementById("demoItem").classList.add("close-cart-item")
    document.getElementById("demoItem").classList.remove("open-cart-item")
}

function changeImgBg(imageKey, index) {
    const displayedImgCart = document.getElementById("displayed-img-cart")

    let lol = localStorageItems[index].images[imageKey][0]

    displayedImgCart.src = lol

    if (cartItem) {
        cartItem.setAttribute("data-current-color", imageKey);
    }

    // Update the selected color in localStorageItems
    localStorageItems[index].selectedColor = imageKey;
    localStorage.setItem("carsWithQuantities", JSON.stringify(localStorageItems));

    currentImageIndex = 0;
}

function handleNextImg(index) {
    const displayedImgCart = document.getElementById("displayed-img-cart");
    let cart = JSON.parse(localStorage.getItem("carsWithQuantities")),
        selectedColor = cartItem.getAttribute("data-current-color") || currentColor,
        images = cart[index].images[selectedColor];
    currentImageIndex = (currentImageIndex + 1) % images.length;
    displayedImgCart.src = images[currentImageIndex];
}

function handlePrevImg(index) {
    const displayedImgCart = document.getElementById("displayed-img-cart");
    let cart = JSON.parse(localStorage.getItem("carsWithQuantities")),
        selectedColor = cartItem.getAttribute("data-current-color") || currentColor,
        images = cart[index].images[selectedColor];
    currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
    displayedImgCart.src = images[currentImageIndex];
}

// Add event listener when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    // Check if we're on the proceed page
    if (document.getElementById('cardNumber')) {
        initializePaymentValidation();
    }
});

// Initialize payment form validation
function initializePaymentValidation() {
    const cardNumberInput = document.getElementById('cardNumber');
    expirationDateInput = document.getElementById('expirationDate'),
        cvvInput = document.getElementById('cvv'),
        cardHolderNameInput = document.getElementById('cardHolderName'),
        completePaymentBtn = document.getElementById('completePaymentBtn');

    // Add input event listeners for real-time validation
    cardNumberInput.addEventListener('input', formatAndValidateCardNumber);
    expirationDateInput.addEventListener('input', validateExpirationDate);
    cvvInput.addEventListener('input', validateCVV);
    cardHolderNameInput.addEventListener('input', validateCardHolderName);

    // Add button click event listener
    completePaymentBtn.addEventListener('click', validatePaymentForm);
}

// Format and validate card number
function formatAndValidateCardNumber(e) {
    let value = e.target.value.replace(/\s/g, ''); // Remove existing spaces
    const cardNumberError = document.getElementById('cardNumberError');

    // Only allow digits
    value = value.replace(/\D/g, '');

    // Limit to 16 digits
    if (value.length > 16) {
        value = value.substring(0, 16);
    }

    // Format as 4 4 4 4
    let formattedValue = '';
    for (let i = 0; i < value.length; i++) {
        if (i > 0 && i % 4 === 0) {
            formattedValue += ' ';
        }
        formattedValue += value[i];
    }

    e.target.value = formattedValue;

    // Validate card number
    if (value.length === 16) {
        if (value.startsWith('4')) {
            // Visa validation
            cardNumberError.textContent = '';
            e.target.classList.remove('is-invalid');
            e.target.classList.add('is-valid');
        } else if (value.startsWith('5')) {
            // Mastercard validation
            cardNumberError.textContent = '';
            e.target.classList.remove('is-invalid');
            e.target.classList.add('is-valid');
        } else {
            // Invalid starting digit
            cardNumberError.textContent = 'Card number must start with 4 (Visa) or 5 (Mastercard)';
            e.target.classList.remove('is-valid');
            e.target.classList.add('is-invalid');
        }
    } else if (value.length > 0) {
        // Incomplete number
        cardNumberError.textContent = 'Card number must be 16 digits';
        e.target.classList.remove('is-valid');
        e.target.classList.add('is-invalid');
    } else {
        // Empty field
        cardNumberError.textContent = '';
        e.target.classList.remove('is-valid', 'is-invalid');
    }
}

// Validate expiration date
function validateExpirationDate(e) {
    const value = e.target.value;
    const expirationDateError = document.getElementById('expirationDateError');

    // Basic format validation (MM/YY)
    const dateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
    if (!dateRegex.test(value)) {
        if (value.length > 0) {
            expirationDateError.textContent = 'Invalid date format. Use MM/YY';
            e.target.classList.remove('is-valid');
            e.target.classList.add('is-invalid');
        } else {
            expirationDateError.textContent = '';
            e.target.classList.remove('is-valid', 'is-invalid');
        }
        return;
    }

    // Extract month and year
    const parts = value.split('/');
    const month = parseInt(parts[0], 10);
    const year = parseInt(parts[1], 10);

    // Get current date
    const now = new Date();
    const currentYear = now.getFullYear() % 100; // Get last two digits of year
    const currentMonth = now.getMonth() + 1; // Get month (0-11, so add 1)

    // Validate date
    if (year < currentYear || (year === currentYear && month < currentMonth)) {
        expirationDateError.textContent = 'Card has expired';
        e.target.classList.remove('is-valid');
        e.target.classList.add('is-invalid');
    } else {
        expirationDateError.textContent = '';
        e.target.classList.remove('is-invalid');
        e.target.classList.add('is-valid');
    }
}

// Validate CVV
function validateCVV(e) {
    const value = e.target.value;
    const cvvError = document.getElementById('cvvError');

    // Only allow digits
    const numericValue = value.replace(/\D/g, '');

    // Update input value
    if (numericValue !== value) {
        e.target.value = numericValue;
    }

    // Validate length
    if (numericValue.length === 3) {
        cvvError.textContent = '';
        e.target.classList.remove('is-invalid');
        e.target.classList.add('is-valid');
    } else if (numericValue.length > 0) {
        cvvError.textContent = 'CVV must be 3 digits';
        e.target.classList.remove('is-valid');
        e.target.classList.add('is-invalid');
    } else {
        cvvError.textContent = '';
        e.target.classList.remove('is-valid', 'is-invalid');
    }
}

// Validate card holder name
function validateCardHolderName(e) {
    const value = e.target.value;
    const cardHolderNameError = document.getElementById('cardHolderNameError');

    // Check if all uppercase letters and spaces
    const nameRegex = /^[A-Z\s]+$/;
    if (value.length > 0) {
        if (!nameRegex.test(value)) {
            cardHolderNameError.textContent = 'Name must contain only uppercase letters and spaces';
            e.target.classList.remove('is-valid');
            e.target.classList.add('is-invalid');
        } else if (value.trim().split(/\s+/).length < 2) {
            cardHolderNameError.textContent = 'Please enter full name';
            e.target.classList.remove('is-valid');
            e.target.classList.add('is-invalid');
        } else {
            cardHolderNameError.textContent = '';
            e.target.classList.remove('is-invalid');
            e.target.classList.add('is-valid');
        }
    } else {
        cardHolderNameError.textContent = '';
        e.target.classList.remove('is-valid', 'is-invalid');
    }
}

// Validate entire payment form
function validatePaymentForm(e) {
    e.preventDefault();

    const cardNumberInput = document.getElementById('cardNumber');
    const expirationDateInput = document.getElementById('expirationDate');
    const cvvInput = document.getElementById('cvv');
    const cardHolderNameInput = document.getElementById('cardHolderName');

    // Trigger validation for all fields
    formatAndValidateCardNumber({ target: cardNumberInput });
    validateExpirationDate({ target: expirationDateInput });
    validateCVV({ target: cvvInput });
    validateCardHolderName({ target: cardHolderNameInput });

    // Check if all fields are valid
    const isCardNumberValid = cardNumberInput.classList.contains('is-valid');
    const isExpirationDateValid = expirationDateInput.classList.contains('is-valid');
    const isCvvValid = cvvInput.classList.contains('is-valid');
    const isCardHolderNameValid = cardHolderNameInput.classList.contains('is-valid');

    if (isCardNumberValid && isExpirationDateValid && isCvvValid && isCardHolderNameValid) {
        // Use SweetAlert for success message
        Swal.fire({
            title: 'Success!',
            text: 'Payment processed successfully!',
            icon: 'success',
            confirmButtonText: 'OK'
        });
        // Here you would typically submit the form or make an API call
        // For now, we'll just show a SweetAlert
    } else {
        // Use SweetAlert for error message
        Swal.fire({
            title: 'Error!',
            text: 'Please correct the errors in the form before submitting.',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }
}
