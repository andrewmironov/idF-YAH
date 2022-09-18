let button = document.querySelector('.header-menu__button');
let contentindex = document.querySelector('.content-index');

button.addEventListener('click', function () {
    console.log('Button click');
    if (contentindex.style.display == 'none') {
        contentindex.style.display = 'flex';
        button.textContent = 'Скрыть оглавление';
    } else {
        contentindex.style.display = 'none';
        button.textContent = 'Показать оглавление';
    }
  });