const TWOGIS_KEY = 'YOUR_2GIS_KEY';

document.addEventListener('DOMContentLoaded', () => {


  const map = L.map('map', {
    center: [51.18, 71.45],
    zoom: 13,
    zoomControl: false,
  });

  // зум в правый нижний угол не перекрывает панель
  L.control.zoom({ position: 'bottomright' }).addTo(map);

  // убирает флаг
  map.attributionControl.setPrefix(false);

  //  тайлы 2gis 
  const tiles = {
    // обычная карта 
    osm: L.tileLayer(
      `https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1&ts=online_sd&key=${TWOGIS_KEY}`,
      { subdomains: '0123', attribution: '© 2GIS', maxZoom: 18 }
    ),
    // спутник 
    satellite: L.tileLayer(
      `https://tile{s}.maps.2gis.com/tiles?x={x}&y={y}&z={z}&v=1&ts=satellite&key=${TWOGIS_KEY}`,
      { subdomains: '0123', attribution: '© 2GIS', maxZoom: 18 }
    ),
    // рельеф 
    relief: L.tileLayer(
      `https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png`,
      { attribution: '© OpenTopoMap', maxZoom: 17 }
    ),
  };

  // стартовый тайл 
  let activeTile = tiles.osm;
  activeTile.addTo(map);

  //  бургер 

  const burgerBtn = document.getElementById('map-burger');
  const panel     = document.getElementById('map-panel');

  burgerBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    burgerBtn.classList.toggle('map-burger--active');
    panel.classList.toggle('map-panel--visible');
  });

  // клик вне  бургера 
  document.addEventListener('click', (e) => {
    if (!panel.contains(e.target) && !burgerBtn.contains(e.target)) {
      panel.classList.remove('map-panel--visible');
      burgerBtn.classList.remove('map-burger--active');
    }
  });

  const tabs   = document.querySelectorAll('.map-panel__tab');
  const bodies = document.querySelectorAll('.map-panel__body');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => t.classList.remove('map-panel__tab--active'));
      bodies.forEach(b => b.classList.add('map-panel__body--hidden'));

      tab.classList.add('map-panel__tab--active');
      document.querySelector(`[data-body="${target}"]`)
        .classList.remove('map-panel__body--hidden');
    });
  });

  //  смена тайла 

  document.querySelectorAll('.map-tile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const tileKey = btn.dataset.tile;
      if (!tiles[tileKey]) return;

      map.removeLayer(activeTile);
      activeTile = tiles[tileKey];
      activeTile.addTo(map);

      document.querySelectorAll('.map-tile-btn')
        .forEach(b => b.classList.remove('map-tile-btn--active'));
      btn.classList.add('map-tile-btn--active');
    });
  });

  document.querySelectorAll('[data-layer]').forEach(checkbox => {
    checkbox.addEventListener('change', () => {
      const layer  = checkbox.dataset.layer;
      const active = checkbox.checked;
      console.log(`слой "${layer}" — ${active ? 'включён' : 'выключен'}`);
    });
  });

  //  секторы клик по карте 

  const sectorList  = document.getElementById('sector-list');
  const sectorClear = document.getElementById('sector-clear');
  const sectors     = [];
  let   sectorCounter = 1;

  // маркер сектора 
  const sectorIcon = L.divIcon({
    className: '',
    html: `<div style="
      width: 14px;
      height: 14px;
      background: #9EC27A;
      border: 2px solid #fff;
      border-radius: 50%;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
    "></div>`,
    iconSize:   [14, 14],
    iconAnchor: [7, 7],
  });

  map.on('click', (e) => {
    const { lat, lng } = e.latlng;
    const id    = sectorCounter++;
    const label = `Сектор ${id}`;

    const marker = L.marker([lat, lng], { icon: sectorIcon })
      .addTo(map)
      .bindPopup(label)
      .openPopup();

    sectors.push({ id, lat, lng, marker });
    renderSectorList();
  });

  function renderSectorList() {
    sectorList.innerHTML = '';

    if (sectors.length === 0) {
      sectorList.innerHTML = '<li class="map-sector-list__empty">Секторы не выбраны</li>';
      return;
    }

    sectors.forEach(s => {
      const li = document.createElement('li');
      li.innerHTML = `
        <span>
          Сектор ${s.id}
          <small style="opacity:.5; display:block; font-size:11px">
            ${s.lat.toFixed(4)}, ${s.lng.toFixed(4)}
          </small>
        </span>
        <button data-id="${s.id}" title="Удалить сектор">✕</button>
      `;
      li.querySelector('button').addEventListener('click', () => removeSector(s.id));
      sectorList.appendChild(li);
    });
  }

  function removeSector(id) {
    const idx = sectors.findIndex(s => s.id === id);
    if (idx === -1) return;
    map.removeLayer(sectors[idx].marker);
    sectors.splice(idx, 1);
    renderSectorList();
  }

  // очистить все секторы
  sectorClear.addEventListener('click', () => {
    sectors.forEach(s => map.removeLayer(s.marker));
    sectors.length = 0;
    renderSectorList();
  });

});