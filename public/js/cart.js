// fetch data from servers and render tour items table
fetch("/cart/list-json", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: localStorage.getItem("cart")
})
    .then(res => res.json())
    .then(data => {
        const htmls = data.tours.map((element, index) => {
            return `
            <tr>
                <td>${index + 1}</td>
                <td><img src=${element.image} alt=${element.info.title} width="80px" /></td>
                <td><a href="/tours/detail/${element.info.slug}">${element.info.title}</a></td>
                <td>${element.discounted_price}VND</td>
                <td><input type="number" name="quantity" value=${element.quantity} min="1" item-id="${element.info.id}" style="width: 60px" /></td>
                <td>${element.total}VND</td>
                <td><button class="btn btn-danger" btn-delete="${element.info.id}">Remove</button></td>
            </tr>
            `;
        });

        const wrapperElem = document.querySelector("[tour-list]");
        wrapperElem.innerHTML = htmls.join("");

        // summary order price
        const totalOrder = data.tours.reduce((acc, elem) => acc + elem.total, 0);
        const totalOrderElem = document.querySelector("[total-order]");
        totalOrderElem.innerText = totalOrder.toLocaleString();
    });
// End fetch data from servers and render tour items table
