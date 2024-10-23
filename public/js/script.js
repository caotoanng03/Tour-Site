// Slide Tour Detail
var imagesThumb = new Swiper(".imagesThumb", {
    spaceBetween: 10,
    slidesPerView: 4,
    freeMode: true,
    watchSlidesProgress: true,
});
var imagesMain = new Swiper(".imagesMain", {
    spaceBetween: 10,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
    thumbs: {
        swiper: imagesThumb,
    },
});
// End Slide Tour Detail

// Alert Add Cart Successfully
const showAlertAddToCartSuccess = () => {
    const alertElement = document.querySelector("[alert-add-cart-success]");
    if (alertElement) {
        alertElement.classList.remove("alert-hidden");

        setTimeout(() => {
            alertElement.classList.add("alert-hidden");
        }, 3000);

        const closeAlert = alertElement.querySelector("[close-alert]");
        if (closeAlert) {
            closeAlert.addEventListener("click", () => {
                alertElement.classList.add("alert-hidden");
            });
        }
    }
}
// End Alert Add Cart Successfully

// Display minicart icon on header
const showMiniCart = () => {
    const miniCart = document.querySelector("[mini-cart]");
    if (miniCart) {
        const cart = JSON.parse(localStorage.getItem("cart"));
        let totalQuantity = 0;
        if (cart) {
            totalQuantity = cart.reduce((acc, elem) => acc + elem.quantity, 0);
        }
        miniCart.innerText = totalQuantity;
    };
};
showMiniCart();
// End display minicart icon on header

// Cart
const cart = localStorage.getItem("cart");

// if not existed cart in localStorage, then create new one
if (!cart) {
    localStorage.setItem("cart", JSON.stringify([]))
};

// if existed, then add items to cart
const formAddToCart = document.querySelector("[form-add-to-cart]");
if (formAddToCart) {
    formAddToCart.addEventListener("submit", (event) => {
        event.preventDefault();

        const quantity = parseInt(event.target.elements.quantity.value);
        const tourId = parseInt(formAddToCart.getAttribute("tour-id"));

        if (quantity > 0 && tourId) {
            const cart = JSON.parse(localStorage.getItem("cart"));

            const indexExistTour = cart.findIndex(item => item.tourId == tourId);

            if (indexExistTour == -1) {
                cart.push({
                    tourId: tourId,
                    quantity: quantity
                });
            } else {
                cart[indexExistTour].quantity += quantity;
            };
            localStorage.setItem("cart", JSON.stringify(cart));

            showMiniCart();
            showAlertAddToCartSuccess();
        };
    });
};

// End Cart

// Dropdown profile
const profileImage = document.querySelector('.inner-menu>ul>.user-pic');
if (profileImage) {
    const subMenu = document.querySelector('.sub-menu-wrap');

    profileImage.addEventListener('click', () => {
        subMenu.classList.toggle('open-sub-menu');
    });
}
// End Dropdown profile

// Show alert
const showAlert = document.querySelector('[show-alert]');
if (showAlert) {
    const time = parseInt(showAlert.getAttribute('date-time')) || 3000;
    const closetAlert = showAlert.querySelector('[close-alert]');

    setTimeout(() => {
        showAlert.classList.add('alert-hidden');
    }, time);

    closetAlert.addEventListener('click', () => {
        showAlert.classList.add('alert-hidden');
    });
};
// End Show alert