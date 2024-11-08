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

// Highlight selected navbar item
const navItems = document.querySelectorAll('.nav-item');

if (navItems.length > 0) {

    const setActiveClass = (selectedItem) => {
        navItems.forEach(item => item.classList.remove('active'));
        selectedItem.classList.add('active');
        localStorage.setItem('activeNavItem', selectedItem.getAttribute('href'));
    }

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            setActiveClass(e.target);
        });
    });

    // handle cart item cause <a> of cart include <i>
    const cartLink = document.querySelector('.nav-item[href="/cart"]');
    cartLink.addEventListener('click', (event) => {
        setActiveClass(cartLink)
    });

    document.addEventListener('DOMContentLoaded', () => {
        const activeNavItem = localStorage.getItem('activeNavItem');

        if (activeNavItem) {
            const item = document.querySelector(`li .nav-item[href="${activeNavItem}"]`);

            if (item) {
                setActiveClass(item);
            }
        }
    });

}

// End highlight selected navbar item

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

// Upload Image Preview
const uploadImage = document.querySelector("[upload-image]");
if (uploadImage) {
    const uploadImageInput = uploadImage.querySelector("[upload-image-input]");
    const uploadImagePreview = uploadImage.querySelector("[upload-image-preview]");
    uploadImageInput.addEventListener("change", (e) => {
        if (e.target.files.length) {
            const image = URL.createObjectURL(e.target.files[0]);
            uploadImagePreview.src = image;
        }
    });
}
// End Upload Image Preview

// Get country data list from API

const formUserProfileEdit = document.querySelector('[form-edit-user-profile]');

if (formUserProfileEdit) {
    const countrySelect = formUserProfileEdit.querySelector('[name="citizen"]');
    const firstOption = countrySelect.querySelector('option');
    console.log(firstOption)
    const api = 'https://restcountries.com/v3.1/all';

    fetch(api)
        .then(res => res.json())
        .then(countries => {
            const html = countries.map(item => item.name.common)
                .sort()
                .map(country => `
                <option value=${country}>${country}</option>
            `).join('');

            firstOption.insertAdjacentHTML("afterend", html);
        })
        .catch(error => console.error('Error:', error));

}
// End get country data list from API



