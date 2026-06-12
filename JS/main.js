document.addEventListener('DOMContentLoaded', () => {

  // осн. элементы
  const sidebar        = document.getElementById('sidebar');
  const toggleBtn      = document.getElementById('sidebar-toggle');
  const searchContainer = document.getElementById('search-container');
  const searchBtn      = document.getElementById('search-btn');
  const searchInput    = document.getElementById('search-input');

  //  сайдбар 

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('sidebar--opened');

    // при закрытии схлопывание все сабменю
    if (!sidebar.classList.contains('sidebar--opened')) {
      closeAllSubmenus();
    }
  });

  //  сабменю 

  const submenuToggles = document.querySelectorAll('.js-submenu-toggle');

  submenuToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      // если сайдбар свёрнут - открытие его перед раскрытием сабменю
      if (!sidebar.classList.contains('sidebar--opened')) {
        sidebar.classList.add('sidebar--opened');
      }

      const parentGroup = btn.closest('.sidebar__menu-group');
      const submenu     = parentGroup.querySelector('.sidebar__submenu');

      if (!submenu) return;

      const isOpen = submenu.classList.contains('sidebar__submenu--active');

      // выход  прежде чем открыть новое
      closeAllSubmenus();

      if (!isOpen) {
        submenu.classList.add('sidebar__submenu--active');
        //  реальная высоту для css transition
        submenu.style.maxHeight = submenu.scrollHeight + 'px';
        //  aria атрибут доступности
        btn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  function closeAllSubmenus() {
    document.querySelectorAll('.sidebar__submenu').forEach(sub => {
      sub.classList.remove('sidebar__submenu--active');
      sub.style.maxHeight = '0px';
    });
    // сброс aria у всех кнопок
    submenuToggles.forEach(btn => btn.setAttribute('aria-expanded', 'false'));
  }

  //  поиск 

  searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();

    if (!searchContainer.classList.contains('main-header__search-container--active')) {
      // открытие и фокусируем инпут после анимации
      searchContainer.classList.add('main-header__search-container--active');
      setTimeout(() => searchInput.focus(), 200);
    } else {
      if (searchInput.value.trim() === '') {
        // пустой запрос - просто выход
        searchContainer.classList.remove('main-header__search-container--active');
      } else {
        // здесь можно кинуть событие или вызвать fn поиска
        dispatchSearchEvent(searchInput.value.trim());
      }
    }
  });
  function dispatchSearchEvent(query) {
    const event = new CustomEvent('search', { detail: { query } });
    document.dispatchEvent(event);
  }

  //  клик вне элементов 

  document.addEventListener('click', (e) => {
    // клик вне сайдбара - выход
    if (!sidebar.contains(e.target) && sidebar.classList.contains('sidebar--opened')) {
      sidebar.classList.remove('sidebar--opened');
      closeAllSubmenus();
    }

    // клик вне поиска с пустым инпутом - выход
    if (
      !searchContainer.contains(e.target) &&
      searchContainer.classList.contains('main-header__search-container--active') &&
      searchInput.value.trim() === ''
    ) {
      searchContainer.classList.remove('main-header__search-container--active');
    }
  });

  // esc

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;

    if (sidebar.classList.contains('sidebar--opened')) {
      sidebar.classList.remove('sidebar--opened');
      closeAllSubmenus();
    }

    if (searchContainer.classList.contains('main-header__search-container--active')) {
      searchInput.blur();
      searchContainer.classList.remove('main-header__search-container--active');
    }
  });

});