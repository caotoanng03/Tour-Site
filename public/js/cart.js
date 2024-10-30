
// Fetch data from servers and render tour items table
const renderTourListInCart = () => {
    const cartJson = localStorage.getItem("cart");
    const cart = JSON.parse(cartJson);

    if (cart.length <= 0) {
        const cartContainer = document.querySelector('.cart-container');
        console.log(cartContainer)
        const html = `<div class="alert alert-error"> Your cart is empty. Please add some tours!</div>`;
        cartContainer.innerHTML = html;
    }

    fetch("/cart/list-json", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: cartJson
    })
        .then(res => res.json())
        .then(data => {
            let htmls = [];
            if (data.code === 200) {
                htmls = data.tours.map((element, index) => {
                    return `
                    <tr>
                        <td>${index + 1}</td>
                        <td><img src=${element.image} alt=${element.info.title} width="80px" /></td>
                        <td><a href="/tours/detail/${element.info.slug}">${element.info.title}</a></td>
                        <td>${element.discounted_price.toLocaleString()}$</td>
                        <td><input type="number" name="quantity" value=${element.quantity} min="1" item-id="${element.info.id}" style="width: 60px" /></td>
                        <td>${element.total.toLocaleString()}$</td>
                        <td><button class="btn btn-danger" btn-delete="${element.info.id}"><i class="fa-regular fa-trash-can"></i></button></td>
                    </tr>
                    `;
                });
            }

            const wrapperElem = document.querySelector("[tour-list]");
            wrapperElem.innerHTML = htmls.join("");

            // summary order price
            const totalOrder = data.tours.reduce((acc, elem) => acc + elem.total, 0);
            const totalOrderElem = document.querySelector("[total-order]");
            totalOrderElem.innerText = totalOrder.toLocaleString();

            deleteTourInCart();
            updateQuantityInCart();
        });
}
renderTourListInCart();
// End fetch data from servers and render tour items table

// Remove tour item
const deleteTourInCart = () => {
    const listButtonDelete = document.querySelectorAll("[btn-delete]")
    listButtonDelete.forEach(button => {
        button.addEventListener("click", (e) => {
            console.log(e.target)
            const tourId = button.getAttribute("btn-delete");
            const cart = JSON.parse(localStorage.getItem("cart"));
            const notDeletedItems = cart.filter(elem => elem.tourId != tourId);
            localStorage.setItem("cart", JSON.stringify(notDeletedItems));

            // remove order-item row from the DOM
            e.target.closest("tr").remove();

            // update the overall cart total in the DOM
            const totalOrder = notDeletedItems.reduce((acc, elem) => acc + elem.total, 0);
            console.log(totalOrder)
            document.querySelector("[total-order]").innerText = totalOrder.toLocaleString();

        });
    });
};
// End Remove tour item

// Update quantity
const updateQuantityInCart = () => {
    const listInputQuantity = document.querySelectorAll("input[name=quantity]");
    listInputQuantity.forEach(input => {
        input.addEventListener("change", (event) => {
            const updatedQuantity = parseInt(event.target.value);
            const tourId = input.getAttribute("item-id");

            const cart = JSON.parse(localStorage.getItem("cart"));
            const tour = cart.find(elem => elem.tourId == tourId);
            tour.quantity = updatedQuantity;
            localStorage.setItem("cart", JSON.stringify(cart));

            renderTourListInCart();
        });
    });
};
// End Update quantity

// Reserve Form
const formOrder = document.querySelector("[form-order]");

if (formOrder) {
    formOrder.addEventListener("submit", (event) => {
        event.preventDefault();
        const cart = JSON.parse(localStorage.getItem("cart"));

        const fullName = event.target.elements.fullName.value;
        const email = event.target.elements.email.value;
        const phone = event.target.elements.phone.value;
        const note = event.target.elements.note.value;
        let info = {
            fullName,
            email,
            phone
        }
        if (note) info.note = note;

        if (cart) {
            const data = {
                info,
                cart
            };

            fetch(`/order`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            })
                .then(res => res.json())
                .then(data => {
                    if (data.code == 200) {
                        localStorage.setItem("cart", JSON.stringify([]));
                        window.location.href = `/order/success?orderCode=${data.orderCode}`;
                    } else {
                        alert(`Failed to order!`);
                    }
                });
        } else {
            alert(`Cart can not be empty to order!`)
        }
    });
};
// End Reserve Form



