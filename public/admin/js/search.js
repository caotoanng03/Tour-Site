function debounce(func, delay) {
    let debounceTimer;

    return function () {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(() => func.apply(this, arguments), delay);
    }
}

// Search users
function searchUsers(keyword) {
    if (!keyword) {
        $('#userResults').empty();
        return;
    }

    $.getJSON(`/admin/users/search/suggest?keyword=${keyword}`, function (data) {
        const users = data.users;
        $('#userResults').empty();
        users.forEach(user => {
            $('#userResults').append(`<li data-user-id="${user.id}" data-user-email="${user.email}" class="user-item">${user.fullName} (${user.email})</li>`);
        });
    });

    // fetch(`/admin/users/search/suggest?keyword=${keyword}`)
    //     .then(response => {
    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }
    //         return response.json(); // Parse JSON from the response
    //     })
    //     .then(users => {

    //         console.log(users);
    //         const userResults = document.getElementById('userResults');
    //         userResults.innerHTML = ''; // Clear previous results

    //         for (const user of users.users) {
    //             const listItem = document.createElement('li');
    //             listItem.classList.add('user-item');
    //             listItem.dataset.userId = user.id;
    //             listItem.textContent = `${user.fullName} (${user.email})`;
    //             userResults.appendChild(listItem);
    //         }
    //     })
    //     .catch(error => {
    //         console.error('There was a problem with the fetch operation:', error);
    //     });
}

$(document).ready(function () {
    // search on input with debounce
    $('#userSearch').on('input', debounce(function () {
        const keyword = $(this).val().trim();
        searchUsers(keyword);
    }, 300))

    // handle user selection from the results
    $('#userResults').on('click', '.user-item', function () {
        const userId = $(this).data('user-id');
        const email = $(this).data('user-email');
        $('#userIdInput').val(userId);
        $('#userSearch').val(email);
        $('#userResults').empty();
    })
})
// End search users

// Search tours
function searchTours(keyword) {
    if (!keyword) {
        $('#tourResults').empty();
        return;
    }

    $.getJSON(`/admin/tours/search/suggest?keyword=${keyword}`, function (data) {
        $('#tourResults').empty();
        const tours = data.tours;

        for (const tour of tours) {
            $('#tourResults').append(`
                <li class="tour-item" data-tour-id="${tour.id}">   
                    ${tour.title} - discounted price: ${tour.discounted_price.toLocaleString()} USD
                    <button type="button" class="add-tour" data-tour-id="${tour.id}" data-tour-title="${tour.title}"><i class="fa-solid fa-plus"></i></button>
                </li>
            `)
        }
    })
}

$('#tourResults').on('click', '.add-tour', function () {
    const tourId = $(this).data('tour-id');
    const tourTitle = $(this).data('tour-title');

    if ($(`#selectedTours .selected-tour[data-tour-id="${tourId}"]`).length) {
        alert("Tour is already selected");
        return;
    }

    $('#selectedTours').append(`
        <div class="selected-tour" data-tour-id="${tourId}">
            <span>${tourTitle}</span>
            <input type="number" min="1" value="1" class="tour-quantity" data-tour-id="${tourId}">
            <button type="button" class="remove-tour" data-tour-id="${tourId}">Remove</button>
        </div>    
    `)
})

$('#selectedTours').on('click', '.remove-tour', function () {
    $(this).closest('.selected-tour').remove();
})

$('#tourSearch').on('input', debounce(function () {
    const keyword = $(this).val().trim();
    searchTours(keyword);
}, 300))

$('button[type="submit"]').on('click', function (event) {
    // Clear previous hidden fields
    $('#selectedToursHiddenFields').remove();

    // Create a container for hidden fields
    const hiddenFieldsContainer = $('<div id="selectedToursHiddenFields"></div>');

    // Gather selectedTours data
    $('#selectedTours .selected-tour').each(function () {
        const tourId = $(this).data('tour-id');
        const quantity = $(this).find('.tour-quantity').val();
        const tour = JSON.stringify({
            tourId,
            quantity
        })

        hiddenFieldsContainer.append(`<input type="hidden" name="tours[]" value="${encodeURIComponent(tour)}">`);
    });

    // Append the hidden fields to the form
    $(this).append(hiddenFieldsContainer);
});

// End search tours
