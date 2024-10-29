const $next = document.querySelector('.next');
const $prev = document.querySelector('.prev');

if ($next) {
    $next.addEventListener('click', () => {
        const items = document.querySelectorAll('.item');
        const slideContainer = document.querySelector('.slide')
        slideContainer.appendChild(items[0]);
    })
}

if ($prev) {
    $prev.addEventListener('click', () => {
        const items = document.querySelectorAll('.item');
        document.querySelector('.slide').prepend(items[items.length - 1]);
    })
}
