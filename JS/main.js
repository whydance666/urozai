document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const toggleBtn = document.getElementById('sidebar-toggle');
  
  const searchContainer = document.getElementById('search-container');
  const searchBtn = document.getElementById('search-btn');
  const searchInput = document.getElementById('search-input');

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    sidebar.classList.toggle('sidebar--opened');
    
    if (!sidebar.classList.contains('sidebar--opened')) {
      closeAllSubmenus();
    }
  });

  const submenuToggles = document.querySelectorAll('.js-submenu-toggle');

  submenuToggles.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();

      if (!sidebar.classList.contains('sidebar--opened')) {
        sidebar.classList.add('sidebar--opened');
      }

      const parentGroup = btn.closest('.sidebar__menu-group');
      const submenu = parentGroup.querySelector('.sidebar__submenu');

      if (!submenu) return;

      const isOpen = submenu.classList.contains('sidebar__submenu--active');

      closeAllSubmenus();

      if (!isOpen) {
        submenu.classList.add('sidebar__submenu--active');
        submenu.style.maxHeight = submenu.scrollHeight + "px";
      }
    });
  });

  function closeAllSubmenus() {
    document.querySelectorAll('.sidebar__submenu').forEach(sub => {
      sub.classList.remove('sidebar__submenu--active');
      sub.style.maxHeight = null;
    });
  }

  searchBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    
    if (!searchContainer.classList.contains('main-header__search-container--active')) {
      searchContainer.classList.add('main-header__search-container--active');
      setTimeout(() => searchInput.focus(), 200);
    } else {
      if (searchInput.value.trim() === '') {
        searchContainer.classList.remove('main-header__search-container--active');
      } else {
        console.log('Ищем запрос:', searchInput.value);
      }
    }
  });


  document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && sidebar.classList.contains('sidebar--opened')) {
      sidebar.classList.remove('sidebar--opened');
      closeAllSubmenus();
    }
    
    if (!searchContainer.contains(e.target) && searchContainer.classList.contains('main-header__search-container--active') && searchInput.value.trim() === '') {
      searchContainer.classList.remove('main-header__search-container--active');
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (sidebar.classList.contains('sidebar--opened')) {
        sidebar.classList.remove('sidebar--opened');
        closeAllSubmenus();
      }
      if (searchContainer.classList.contains('main-header__search-container--active')) {
        searchInput.blur();
        searchContainer.classList.remove('main-header__search-container--active');
      }
    }
  });
});