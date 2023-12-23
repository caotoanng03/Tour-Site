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
        };
    });
};

// End Cart