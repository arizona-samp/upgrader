
(() => {
  'use strict';

  const STORAGE_KEY = 'upgrader_reference_v2';

  const CATEGORIES = {
    vehicle: { label: 'МАШИНА', short: 'AUTO' },
    business: { label: 'БИЗНЕС', short: 'BIZ' },
    property: { label: 'НЕДВИЖИМОСТЬ', short: 'HOME' },
    accessory: { label: 'АКСЕССУАР', short: 'ITEM' },
    resource: { label: 'РЕСУРС', short: 'DROP' }
  };

  const image = (tag, from = '#29221b', to = '#111114', accent = '#f3a34a') => {
    const t = String(tag).replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&apos;'
    }[c]));

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient><radialGradient id="r"><stop stop-color="${accent}" stop-opacity=".23"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="300" cy="165" r="240" fill="url(#r)"/><path d="M0 330 Q150 260 280 330 T600 310 V400 H0Z" fill="#08080a" opacity=".65"/><text x="300" y="218" font-family="Arial,sans-serif" font-size="95" font-weight="700" text-anchor="middle" fill="${accent}">${t}</text><text x="300" y="356" font-family="Arial,sans-serif" font-size="20" letter-spacing="5" text-anchor="middle" fill="#b9aaa0" opacity=".65">UPGRADER</text></svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  };

  const BALANCE_IMAGE = image('₽', '#49301c', '#121114');

  const DEFAULT_CATALOG = [
    { id: 'car-bmw-m5', name: 'BMW M5 CS', category: 'vehicle', price: 30000000, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85', description: 'Спортивный седан', featured: true },
    { id: 'car-lambo', name: 'Lamborghini Aventador SVJ', category: 'vehicle', price: 45000000, image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=85', description: 'Суперкар' },
    { id: 'car-koenigsegg', name: 'Koenigsegg Jesko', category: 'vehicle', price: 90000000, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85', description: 'Гиперкар', featured: true },
    { id: 'car-pagani', name: 'Pagani Huayra', category: 'vehicle', price: 125000000, image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85', description: 'Редкий гиперкар' },
    { id: 'car-bugatti', name: 'Bugatti Divo', category: 'vehicle', price: 200000000, image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=900&q=85', description: 'Премиальный дроп', featured: true },
    { id: 'biz-gas', name: 'Автозаправка', category: 'business', price: 52000000, image: 'https://images.unsplash.com/photo-1545262810-77515befe149?auto=format&fit=crop&w=900&q=85', description: 'Готовый бизнес' },
    { id: 'biz-club', name: 'Ночной клуб', category: 'business', price: 85000000, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85', description: 'Бизнес в центре' },
    { id: 'biz-dealer', name: 'Автосалон', category: 'business', price: 150000000, image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85', description: 'Крупный бизнес' },
    { id: 'property-flat', name: 'Квартира в центре', category: 'property', price: 12000000, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85', description: 'Городская недвижимость' },
    { id: 'property-mansion', name: 'Хэллоуин-особняк', category: 'property', price: 65000000, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85', description: 'Особняк к хэллоуину', featured: true },
    { id: 'property-villa', name: 'Вилла у озера', category: 'property', price: 110000000, image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85', description: 'Премиальная недвижимость' },
    { id: 'accessory-watch', name: 'Золотые часы', category: 'accessory', price: 8000000, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85', description: 'Коллекционный аксессуар' },
    { id: 'accessory-ring', name: 'Кольцо «Ведьма»', category: 'accessory', price: 15000000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85', description: 'Хэллоуинская коллекция' },
    { id: 'accessory-mask', name: 'Маска Phantom', category: 'accessory', price: 22000000, image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=900&q=85', description: 'Редкий аксессуар' },
    { id: 'resource-crate', name: 'Mystery Case', category: 'resource', price: 5000000, image: image('CASE', '#34271b', '#151317'), description: 'Таинственный кейс' },
    { id: 'resource-pumpkin', name: 'Тыква-сокровище', category: 'resource', price: 10000000, image: image('✦', '#463019', '#151114'), description: 'Сезонный ресурс', featured: true }
  ];

  const DEFAULT_INVENTORY = [
    { itemId: 'car-bmw-m5', name: 'BMW M5 CS', category: 'vehicle', price: 30000000, image: DEFAULT_CATALOG[0].image, description: 'Спортивный седан', qty: 1 },
    { itemId: 'accessory-watch', name: 'Золотые часы', category: 'accessory', price: 8000000, image: DEFAULT_CATALOG[11].image, description: 'Коллекционный аксессуар', qty: 1 }
  ];

  const $ = id => document.getElementById(id);

  // Ссылки на элементы страницы.
  const upgradeButton = $('upgradeButton');
  const inventoryGrid = $('inventoryGrid');
  const catalogGrid = $('catalogGrid');
  const reelTrack = $('reelTrack');
  const reelWrap = $('reelWrap');

  let state = loadState();
  let sourceMode = 'balance';
  let sourceInventoryId = state.inventory[0]?.itemId || '';
  let selectedChance = 15;
  let selectedTargetId = null;
  let selectedCategory = 'all';
  let manualTarget = false;
  let uploadedImageData = '';
  let editingImage = '';
  let spinning = false;
  let toastTimer = null;

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultState();

      const s = JSON.parse(raw);

      return {
        balance: Math.max(0, Number(s.balance ?? 4000000)),
        catalog: Array.isArray(s.catalog)
          ? s.catalog.filter(validItem).map(normalizeItem)
          : DEFAULT_CATALOG.map(x => ({ ...x })),
        inventory: Array.isArray(s.inventory)
          ? s.inventory.filter(x => x && Number(x.qty) > 0 && Number(x.price) > 0).map(normalizeInventoryItem)
          : DEFAULT_INVENTORY.map(x => ({ ...x })),
        stats: {
          attempts: 0,
          wins: 0,
          losses: 0,
          bestPrizeValue: 0,
          bestPrizeName: '',
          ...(s.stats || {})
        },
        history: Array.isArray(s.history) ? s.history.slice(0, 30) : []
      };
    } catch (e) {
      console.warn(e);
      return defaultState();
    }
  }

  function defaultState() {
    return {
      balance: 4000000,
      catalog: DEFAULT_CATALOG.map(x => ({ ...x })),
      inventory: DEFAULT_INVENTORY.map(x => ({ ...x })),
      stats: {
        attempts: 0,
        wins: 0,
        losses: 0,
        bestPrizeValue: 0,
        bestPrizeName: ''
      },
      history: []
    };
  }

  function validItem(x) {
    return x &&
      typeof x.name === 'string' &&
      x.name.trim() &&
      CATEGORIES[x.category] &&
      Number(x.price) > 0;
  }

  function normalizeItem(x) {
    return {
      id: String(x.id || makeId()),
      name: String(x.name).trim(),
      category: CATEGORIES[x.category] ? x.category : 'resource',
      price: Math.max(1, Math.round(Number(x.price) || 1)),
      image: typeof x.image === 'string' ? x.image : '',
      description: typeof x.description === 'string' ? x.description : '',
      featured: Boolean(x.featured)
    };
  }

  function normalizeInventoryItem(x) {
    return {
      itemId: String(x.itemId || x.id || makeId()),
      name: String(x.name || 'Предмет'),
      category: CATEGORIES[x.category] ? x.category : 'resource',
      price: Math.max(1, Math.round(Number(x.price) || 1)),
      image: typeof x.image === 'string' ? x.image : '',
      description: typeof x.description === 'string' ? x.description : '',
      qty: Math.max(1, Math.floor(Number(x.qty) || 1))
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (e) {
      toast('Не удалось сохранить данные. Фото слишком большое — попробуй уменьшить его.', 'error');
      return false;
    }
  }

  function makeId() {
    return `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function money(n, symbol = true) {
    const value = Math.max(0, Math.round(Number(n) || 0))
      .toLocaleString('ru-RU')
      .replace(/\u00a0/g, ' ');

    return symbol ? `₽ ${value}` : value;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }

  function getProduct(id) {
    return state.catalog.find(x => x.id === id) || null;
  }

  function getInventory(id) {
    return state.inventory.find(x => x.itemId === id) || null;
  }

  function getSource() {
    if (sourceMode === 'inventory') {
      const item = getInventory(sourceInventoryId);
      return item ? { ...item, id: item.itemId, sourceType: 'inventory' } : null;
    }

    const amount = Math.floor(Number($('stakeAmount').value));

    return {
      id: 'balance',
      name: 'Игровой баланс',
      category: 'resource',
      price: Number.isFinite(amount) && amount > 0 ? amount : 0,
      image: BALANCE_IMAGE,
      description: 'Ставка с баланса',
      sourceType: 'balance'
    };
  }

  function getTarget() {
    return getProduct(selectedTargetId);
  }

  // Реальная вероятность: ставка / цена приза × 100%.
  function realChance(source, target) {
    return source && target &&
      source.price > 0 &&
      target.price > source.price
      ? source.price / target.price * 100
      : 0;
  }

  function pickTargetForPreset() {
    const source = getSource();

    if (!source || source.price <= 0) {
      selectedTargetId = null;
      return;
    }

    const options = state.catalog.filter(x => x.price > source.price);

    if (!options.length) {
      selectedTargetId = null;
      return;
    }

    const desiredPrice = source.price / (selectedChance / 100);

    options.sort((a, b) =>
      Math.abs(Math.log(a.price / desiredPrice)) -
      Math.abs(Math.log(b.price / desiredPrice))
    );

    selectedTargetId = options[0].id;
    manualTarget = false;
  }

  function fmtImage(img, src, title = '') {
    const fallback = image((title || '✦').slice(0, 4).toUpperCase());

    img.onerror = () => {
      img.onerror = null;
      img.src = fallback;
    };

    img.src = src || fallback;
  }

  function renderSourceOptions() {
    const select = $('sourceInventorySelect');

    if (!state.inventory.length) {
      select.innerHTML = '<option value="">Инвентарь пуст</option>';
      select.disabled = true;
      sourceInventoryId = '';
      return;
    }

    select.disabled = false;

    select.innerHTML = state.inventory.map(x =>
      `<option value="${esc(x.itemId)}">${esc(x.name)} · ${money(x.price)}${x.qty > 1 ? ` ×${x.qty}` : ''}</option>`
    ).join('');

    if (!getInventory(sourceInventoryId)) {
      sourceInventoryId = state.inventory[0].itemId;
    }

    select.value = sourceInventoryId;
  }

  function renderBalance() {
    $('balanceValue').textContent = money(state.balance, false);
  }

  function renderGame() {
    renderSourceOptions();

    const source = getSource();
    const target = getTarget();

    if (source) {
      fmtImage($('sourceImage'), source.image || BALANCE_IMAGE, source.name);
      $('sourceCategory').textContent =
        source.sourceType === 'balance'
          ? 'БАЛАНС'
          : CATEGORIES[source.category]?.label || 'ПРЕДМЕТ';

      $('sourceName').textContent = source.name;
      $('sourcePrice').textContent = money(source.price);
      $('sourceFooterPrice').textContent = money(source.price);
    }

    if (target) {
      fmtImage($('targetImage'), target.image, target.name);
      $('targetCategory').textContent = CATEGORIES[target.category]?.label || 'ПРИЗ';
      $('targetName').textContent = target.name;
      $('targetPrice').textContent = money(target.price);
      $('targetFooterPrice').textContent = money(target.price);
      $('selectedPrizeLabel').textContent = target.name;
    } else {
      fmtImage($('targetImage'), image('?'), 'Выбери приз');
      $('targetCategory').textContent = 'КАТАЛОГ ПРИЗОВ';
      $('targetName').textContent = 'Нет подходящего приза';
      $('targetPrice').textContent = '—';
      $('targetFooterPrice').textContent = '—';
      $('selectedPrizeLabel').textContent = 'Нет подходящего приза';
    }

    const chance = realChance(source, target);

    $('chanceValue').textContent =
      target && chance > 0 ? `${chance.toFixed(2)}%` : '—';

    $('chanceRing')?.style.setProperty(
      '--chance-angle',
      `${Math.min(chance, 100) * 3.6}deg`
    );

    $('desiredChanceLabel').textContent = `${selectedChance}%`;

    document.querySelectorAll('[data-chance]').forEach(button => {
      button.classList.toggle(
        'selected',
        Number(button.dataset.chance) === selectedChance
      );
    });

    $('targetMultiplier').textContent =
      source && target && source.price > 0
        ? `×${(target.price / source.price).toFixed(2)}`
        : '×—';

    $('targetMultiplierCopy').textContent =
      source && target && source.price > 0
        ? `Множитель ${(target.price / source.price).toFixed(2)} · реальный шанс ${chance.toFixed(2)}%`
        : 'Выбери шанс для подбора приза.';

    $('headerAttempts').textContent = state.stats.attempts;
    $('headerWins').textContent = state.stats.wins;

    upgradeButton.disabled =
      spinning ||
      !source ||
      source.price < 1 ||
      !target ||
      target.price <= source.price ||
      (source.sourceType === 'balance' && source.price > state.balance);

    renderBalance();
  }

  function renderStats() {
    const stats = state.stats;
    const attempts = Number(stats.attempts) || 0;
    const wins = Number(stats.wins) || 0;
    const rate = attempts ? wins / attempts * 100 : 0;

    $('winsValue').textContent = wins;
    $('lossesValue').textContent = stats.losses || 0;
    $('attemptsValue').textContent = attempts;
    $('winrateValue').textContent = `${rate.toFixed(1)}%`;
    $('luckLabel').textContent = `${Math.round(rate)}%`;
    $('luckBar').style.width = `${Math.min(rate, 100)}%`;

    $('bestPrizeValue').textContent = stats.bestPrizeValue
      ? `${stats.bestPrizeName} · ${money(stats.bestPrizeValue)}`
      : '—';

    $('headerAttempts').textContent = attempts;
    $('headerWins').textContent = wins;
  }

  function renderHistory() {
    const list = $('historyList');

    if (!state.history.length) {
      list.innerHTML = '<div class="empty-history">Пока нет попыток.</div>';
      return;
    }

    list.innerHTML = state.history.slice(0, 8).map(x =>
      `<div class="history-row">
        <div class="history-thumb"><img src="${esc(x.targetImage || image('✦'))}" alt=""></div>
        <div class="history-copy">
          <b>${esc(x.targetName)}</b>
          <small>${x.win ? 'Выигрыш' : 'Неудача'} · ${new Date(x.time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}</small>
        </div>
        <span class="history-result ${x.win ? 'win' : 'loss'}">${x.win ? '+' : '−'}${money(x.win ? x.targetPrice : x.sourcePrice, false)}</span>
      </div>`
    ).join('');

    list.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.onerror = null;
        img.src = image('✦');
      });
    });
  }

  function renderInventory() {
    const query = $('inventorySearch').value.trim().toLowerCase();
    const category = $('inventoryFilter').value;

    const items = state.inventory.filter(x =>
      (category === 'all' || x.category === category) &&
      (!query ||
        x.name.toLowerCase().includes(query) ||
        (x.description || '').toLowerCase().includes(query))
    );

    $('inventoryCount').textContent =
      state.inventory.reduce((sum, x) => sum + x.qty, 0);

    $('inventoryEmpty').classList.toggle('hidden', items.length > 0);
    inventoryGrid.classList.toggle('hidden', !items.length);

    if (!items.length) {
      inventoryGrid.innerHTML = '';
      $('inventoryEmpty').querySelector('b').textContent =
        state.inventory.length ? 'Ничего не найдено' : 'Инвентарь пуст';
      return;
    }

    inventoryGrid.innerHTML = items.map(x =>
      `<article class="inventory-card ${sourceMode === 'inventory' && sourceInventoryId === x.itemId ? 'selected' : ''}" data-inv-card="${esc(x.itemId)}">
        <div class="card-image">
          <img src="${esc(x.image || image('✦'))}" alt="${esc(x.name)}">
          <span class="category-tag">${CATEGORIES[x.category].short}</span>
          ${x.qty > 1 ? `<span class="rare-tag">×${x.qty}</span>` : ''}
        </div>
        <div class="card-info">
          <h3>${esc(x.name)}</h3>
          <div class="card-price">${money(x.price)}</div>
        </div>
        <div class="card-actions">
          <button class="mini-action" data-use="${esc(x.itemId)}">Играть</button>
          <button class="mini-action sell-action" data-sell="${esc(x.itemId)}">Продать</button>
        </div>
      </article>`
    ).join('');

    inventoryGrid.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.onerror = null;
        img.src = image('✦');
      });
    });
  }

  function renderCatalog() {
    const query = $('catalogSearch').value.trim().toLowerCase();
    const sort = $('catalogSort').value;

    let items = state.catalog.filter(x =>
      (selectedCategory === 'all' || x.category === selectedCategory) &&
      (!query ||
        x.name.toLowerCase().includes(query) ||
        (x.description || '').toLowerCase().includes(query))
    );

    if (sort === 'price-up') {
      items.sort((a, b) => a.price - b.price);
    } else if (sort === 'price-down') {
      items.sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      items.sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    } else {
      items.sort((a, b) => Number(b.featured) - Number(a.featured));
    }

    $('catalogCount').textContent = state.catalog.length;
    $('catalogEmpty').classList.toggle('hidden', items.length > 0);
    catalogGrid.classList.toggle('hidden', !items.length);

    if (!items.length) {
      catalogGrid.innerHTML = '';
      $('catalogEmpty').querySelector('b').textContent =
        state.catalog.length ? 'Ничего не найдено' : 'Товаров пока нет';
      return;
    }

    catalogGrid.innerHTML = items.map(x =>
      `<article class="catalog-card ${selectedTargetId === x.id ? 'target-selected' : ''}" data-target-card="${esc(x.id)}">
        <div class="card-image">
          <img src="${esc(x.image || image('✦'))}" alt="${esc(x.name)}">
          <span class="category-tag">${CATEGORIES[x.category].short}</span>
          ${x.featured ? '<span class="rare-tag">RARE</span>' : ''}
        </div>
        <div class="card-info">
          <h3>${esc(x.name)}</h3>
          <div class="card-price">${money(x.price)}</div>
        </div>
        <div class="card-actions">
          <button class="mini-action" data-edit="${esc(x.id)}">Изменить</button>
          <button class="mini-action delete-action" data-delete="${esc(x.id)}" aria-label="Удалить">×</button>
        </div>
      </article>`
    ).join('');

    catalogGrid.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.onerror = null;
        img.src = image('✦');
      });
    });
  }

  function renderAll() {
    renderBalance();
    renderGame();
    renderStats();
    renderHistory();
    renderInventory();
    renderCatalog();
  }

  function toast(text, type = '') {
    const t = $('toast');
    $('toastMessage').textContent = text;
    t.className = `toast visible ${type}`.trim();

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      t.className = 'toast';
    }, 2800);
  }

  function openModal(id) {
    const modal = $(id);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    const modal = $(id);
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    if (!document.querySelector('.modal-backdrop.open')) {
      document.body.style.overflow = '';
    }
  }

  function setSourceMode(mode) {
    sourceMode = mode;

    document.querySelectorAll('[data-source-mode]').forEach(button => {
      button.classList.toggle('active', button.dataset.sourceMode === mode);
    });

    $('balanceSourceControls').classList.toggle('hidden', mode !== 'balance');
    $('inventorySourceControls').classList.toggle('hidden', mode !== 'inventory');

    if (!getInventory(sourceInventoryId)) {
      sourceInventoryId = state.inventory[0]?.itemId || '';
    }

    pickTargetForPreset();
    renderAll();
  }

  function chooseTarget(id) {
    const target = getProduct(id);
    const source = getSource();

    if (!target) return;

    if (!source || source.price <= 0) {
      toast('Сначала введи сумму ставки.', 'error');
      return;
    }

    if (target.price <= source.price) {
      toast('Приз должен стоить дороже ставки.', 'error');
      return;
    }

    selectedTargetId = id;
    manualTarget = true;

    renderGame();
    renderCatalog();

    toast(`Выбран приз: ${target.name}`);
  }

  function addInventory(item) {
    const old = state.inventory.find(x => x.itemId === item.id);

    if (old) {
      old.qty++;
      old.name = item.name;
      old.category = item.category;
      old.price = item.price;
      old.image = item.image;
      old.description = item.description;
    } else {
      state.inventory.unshift({
        itemId: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image || '',
        description: item.description || '',
        qty: 1
      });
    }
  }

  function consumeInventory(id) {
    const item = getInventory(id);
    if (!item) return;

    item.qty--;

    if (item.qty <= 0) {
      state.inventory = state.inventory.filter(x => x.itemId !== id);
    }

    if (!getInventory(sourceInventoryId)) {
      sourceInventoryId = state.inventory[0]?.itemId || '';
    }
  }

  function renderReel(target, won) {
    const pool = state.catalog.filter(x => x.id !== target.id);
    const cards = [];

    for (let i = 0; i < 25; i++) {
      const item = pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : target;

      cards.push({ ...item, kind: 'normal' });
    }

    const finalIndex = 23;

    cards[finalIndex] = won
      ? { ...target, kind: 'target' }
      : {
          id: 'fail',
          name: 'Неудача',
          image: image('×', '#391c20', '#151114', '#ee7078'),
          kind: 'fail'
        };

    reelTrack.innerHTML = cards.map(x =>
      `<div class="reel-card ${x.kind === 'target' ? 'is-target' : ''} ${x.kind === 'fail' ? 'is-fail' : ''}">
        <img src="${esc(x.image || image('✦'))}" alt="">
      </div>`
    ).join('');

    reelTrack.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => {
        img.onerror = null;
        img.src = image('✦');
      });
    });

    return finalIndex;
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function animateReel(target, won) {
    const finalIndex = renderReel(target, won);
    const cards = reelTrack.querySelectorAll('.reel-card');
    const card = cards[finalIndex];

    reelTrack.style.transition = 'none';
    reelTrack.style.transform = 'translateX(0px)';

    void reelTrack.offsetWidth;

    const shift = card.offsetLeft -
      (reelWrap.clientWidth / 2 - card.offsetWidth / 2);

    requestAnimationFrame(() => {
      reelTrack.style.transition = 'transform 3.1s cubic-bezier(.08,.68,.08,1)';
      reelTrack.style.transform = `translateX(-${Math.max(0, shift)}px)`;
    });

    await wait(3300);
  }

  async function upgrade() {
    if (spinning) return;

    const source = getSource();
    const target = getTarget();

    if (!source || source.price < 1) {
      toast('Введи корректную сумму ставки.', 'error');
      return;
    }

    if (source.sourceType === 'balance' && source.price > state.balance) {
      toast('Недостаточно денег на балансе.', 'error');
      return;
    }

    if (source.sourceType === 'inventory' && !getInventory(source.itemId)) {
      toast('Выбранного предмета больше нет.', 'error');
      return;
    }

    if (!target) {
      toast('Нет подходящего приза. Добавь товар или измени сумму.', 'error');
      return;
    }

    if (target.price <= source.price) {
      toast('Приз должен стоить дороже ставки.', 'error');
      return;
    }

    const chance = realChance(source, target);

    if (!(chance > 0 && chance < 100)) {
      toast('Проверь сумму ставки и цену приза.', 'error');
      return;
    }

    // Результат определяется реальным шансом, который показан на экране.
    const won = Math.random() * 100 < chance;

    spinning = true;
    document.body.classList.add('upgrade-busy');
    upgradeButton.disabled = true;
    upgradeButton.innerHTML = '<span>↻</span> ПРОКРУТКА…';

    try {
      await animateReel(target, won);

      if (source.sourceType === 'balance') {
        state.balance -= source.price;
      } else {
        consumeInventory(source.itemId);
      }

      state.stats.attempts++;

      if (won) {
        state.stats.wins++;
        addInventory(target);

        if (target.price > (Number(state.stats.bestPrizeValue) || 0)) {
          state.stats.bestPrizeValue = target.price;
          state.stats.bestPrizeName = target.name;
        }
      } else {
        state.stats.losses++;
      }

      state.history.unshift({
        time: Date.now(),
        win: won,
        sourcePrice: source.price,
        targetName: target.name,
        targetPrice: target.price,
        targetImage: target.image || ''
      });

      state.history = state.history.slice(0, 30);

      saveState();
      renderAll();
      showResult(target, won, source, chance);
    } catch (e) {
      console.error(e);
      toast('Ошибка прокрутки. Обнови страницу и попробуй снова.', 'error');
    } finally {
      spinning = false;
      document.body.classList.remove('upgrade-busy');
      upgradeButton.innerHTML = '<span>↻</span> ПРОКРУТИТЬ <b>→</b>';
      renderGame();
    }
  }

  function showResult(target, won, source, chance) {
    $('resultModal').firstElementChild?.classList.toggle('is-loss', !won);
    $('resultMark').textContent = won ? '✦' : '×';
    $('resultTitle').textContent = won ? 'ПОБЕДА!' : 'НЕУДАЧА';
    $('resultKicker').textContent = won ? 'UPGRADE SUCCESSFUL' : 'UPGRADE FAILED';

    $('resultSubtitle').textContent = won
      ? `${target.name} добавлен в инвентарь.`
      : `Ставка ${money(source.price)} потеряна. Реальный шанс был ${chance.toFixed(2)}%.`;

    $('resultCategory').textContent =
      `${CATEGORIES[target.category].label} · ${chance.toFixed(2)}%`;

    $('resultItemName').textContent = target.name;
    $('resultItemPrice').textContent = money(target.price);

    const img = $('resultImage');

    img.onerror = () => {
      img.onerror = null;
      img.src = image('✦');
    };

    img.src = target.image || image('✦');

    openModal('resultModal');
  }

  function sellItem(id) {
    const item = getInventory(id);
    if (!item) return;

    if (!confirm(`Продать «${item.name}» за ${money(item.price)}?`)) return;

    state.balance += item.price;
    consumeInventory(id);

    saveState();
    renderAll();

    toast(`Продано: ${item.name} · +${money(item.price)}`, 'success');
  }

  function openEditor(id = '') {
    const item = id ? getProduct(id) : null;

    $('productForm').reset();
    $('productId').value = item ? item.id : '';
    $('productTitle').textContent = item ? 'Редактировать товар' : 'Добавить товар';
    $('saveProductButton').textContent = item ? 'Сохранить изменения' : 'Сохранить товар';
    $('productName').value = item?.name || '';
    $('productCategory').value = item?.category || 'vehicle';
    $('productPrice').value = item?.price || '';
    $('productImageUrl').value = item && /^https?:/i.test(item.image || '') ? item.image : '';
    $('productDescription').value = item?.description || '';
    $('productImageFile').value = '';
    $('imageUploadStatus').textContent = '';

    uploadedImageData = '';
    editingImage = item?.image || '';

    updatePreview();
    openModal('productModal');
  }

  function updatePreview() {
    const name = $('productName').value.trim() || 'Название товара';

    $('productPreviewName').textContent = name;
    $('productPreviewPrice').textContent = money($('productPrice').value);

    const src =
      uploadedImageData ||
      $('productImageUrl').value.trim() ||
      editingImage ||
      image('✦');

    const img = $('productPreviewImage');

    img.onerror = () => {
      img.onerror = null;
      img.src = image('✦');
    };

    img.src = src;
  }

  function compressImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Выбери файл изображения.'));
      }

      if (file.size > 12 * 1024 * 1024) {
        return reject(new Error('Фото больше 12 МБ. Выбери фото поменьше.'));
      }

      const reader = new FileReader();

      reader.onerror = () => reject(new Error('Не удалось прочитать файл.'));

      reader.onload = () => {
        const img = new Image();

        img.onerror = () => reject(new Error('Файл не является изображением.'));

        img.onload = () => {
          const scale = Math.min(1, 1000 / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');

          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));

          canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);

          try {
            resolve(canvas.toDataURL('image/jpeg', 0.76));
          } catch (e) {
            reject(new Error('Не получилось обработать фото.'));
          }
        };

        img.src = reader.result;
      };

      reader.readAsDataURL(file);
    });
  }

  function saveProduct(event) {
    event.preventDefault();

    const id = $('productId').value.trim();
    const name = $('productName').value.trim();
    const category = $('productCategory').value;
    const price = Math.round(Number($('productPrice').value));
    const description = $('productDescription').value.trim();

    if (!name || !CATEGORIES[category] || !Number.isFinite(price) || price < 1) {
      toast('Заполни название, категорию и цену.', 'error');
      return;
    }

    const old = id ? getProduct(id) : null;
    const photo =
      uploadedImageData ||
      $('productImageUrl').value.trim() ||
      old?.image ||
      '';

    const item = {
      id: old ? old.id : makeId(),
      name,
      category,
      price,
      image: photo,
      description,
      featured: old?.featured || false
    };

    if (old) {
      state.catalog = state.catalog.map(x => x.id === old.id ? item : x);

      state.inventory = state.inventory.map(x =>
        x.itemId === old.id
          ? { ...x, name, category, price, image: photo, description }
          : x
      );
    } else {
      state.catalog.push(item);
    }

    if (selectedTargetId === id) selectedTargetId = id;

    saveState();
    closeModal('productModal');
    pickTargetForPresetIfNeeded();
    renderAll();

    toast(old ? 'Товар обновлён.' : 'Товар добавлен.', 'success');
  }

  function pickTargetForPresetIfNeeded() {
    if (!getTarget() || !manualTarget) pickTargetForPreset();
  }

  function deleteProduct(id) {
    const item = getProduct(id);
    if (!item) return;

    if (!confirm(`Удалить «${item.name}» из магазина? Выигранные копии останутся в инвентаре.`)) {
      return;
    }

    state.catalog = state.catalog.filter(x => x.id !== id);

    if (selectedTargetId === id) {
      selectedTargetId = null;
      manualTarget = false;
      pickTargetForPreset();
    }

    saveState();
    renderAll();

    toast('Товар удалён из магазина.');
  }

  function deposit() {
    const amount = Math.floor(Number($('depositAmount').value));

    if (!Number.isFinite(amount) || amount < 1) {
      toast('Введи сумму больше нуля.', 'error');
      return;
    }

    if (amount > 1e12) {
      toast('Слишком большая сумма.', 'error');
      return;
    }

    state.balance += amount;

    saveState();
    closeModal('depositModal');
    $('depositAmount').value = '';

    if (
      sourceMode === 'balance' &&
      Number($('stakeAmount').value) > state.balance
    ) {
      $('stakeAmount').value = state.balance;
    }

    renderAll();

    toast(`Баланс пополнен на ${money(amount)}.`, 'success');
  }

  function init() {
    if (!localStorage.getItem(STORAGE_KEY)) saveState();

    $('stakeAmount').value = '4000000';

    $('depositButton').addEventListener('click', () => openModal('depositModal'));
    $('addItemButton').addEventListener('click', () => openEditor());
    $('emptyAddItemButton').addEventListener('click', () => openEditor());
    $('confirmDepositButton').addEventListener('click', deposit);

    $('depositAmount').addEventListener('keydown', e => {
      if (e.key === 'Enter') deposit();
    });

    document.querySelectorAll('[data-deposit-amount]').forEach(button => {
      button.addEventListener('click', () => {
        $('depositAmount').value = button.dataset.depositAmount;
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach(button => {
      button.addEventListener('click', () => closeModal(button.dataset.closeModal));
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('mousedown', event => {
        if (event.target === modal) closeModal(modal.id);
      });
    });

    $('closeResultButton').addEventListener('click', () => closeModal('resultModal'));

    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') {
        const modal = document.querySelector('.modal-backdrop.open');
        if (modal) closeModal(modal.id);
      }
    });

    document.querySelectorAll('[data-source-mode]').forEach(button => {
      button.addEventListener('click', () => setSourceMode(button.dataset.sourceMode));
    });

    document.querySelectorAll('[data-chance]').forEach(button => {
      button.addEventListener('click', () => {
        selectedChance = Number(button.dataset.chance);
        manualTarget = false;
        pickTargetForPreset();
        renderAll();
      });
    });

    $('stakeAmount').addEventListener('input', () => {
      if (!manualTarget) pickTargetForPreset();
      renderGame();
      renderCatalog();
    });

    $('maxStakeButton').addEventListener('click', () => {
      $('stakeAmount').value = state.balance;
      if (!manualTarget) pickTargetForPreset();
      renderAll();
    });

    $('clearSourceButton').addEventListener('click', () => {
      if (sourceMode === 'balance') {
        $('stakeAmount').value = '';
      } else {
        sourceInventoryId = '';
        $('sourceInventorySelect').value = '';
      }

      selectedTargetId = null;
      manualTarget = false;
      renderGame();
    });

    $('sourceInventorySelect').addEventListener('change', () => {
      sourceInventoryId = $('sourceInventorySelect').value;

      if (!manualTarget) pickTargetForPreset();

      renderGame();
      renderCatalog();
    });

    upgradeButton.addEventListener('click', upgrade);

    $('choosePrizeButton').addEventListener('click', () => {
      $('catalogSection').scrollIntoView({ behavior: 'smooth', block: 'start' });
      toast('Нажми на карточку в магазине, чтобы выбрать приз.');
    });

    inventoryGrid.addEventListener('click', event => {
      const sell = event.target.closest('[data-sell]');

      if (sell) {
        event.stopPropagation();
        sellItem(sell.dataset.sell);
        return;
      }

      const use = event.target.closest('[data-use]');

      if (use) {
        event.stopPropagation();
        sourceInventoryId = use.dataset.use;
        setSourceMode('inventory');
        return;
      }

      const card = event.target.closest('[data-inv-card]');

      if (card) {
        sourceInventoryId = card.dataset.invCard;
        setSourceMode('inventory');
      }
    });

    catalogGrid.addEventListener('click', event => {
      const edit = event.target.closest('[data-edit]');

      if (edit) {
        event.stopPropagation();
        openEditor(edit.dataset.edit);
        return;
      }

      const del = event.target.closest('[data-delete]');

      if (del) {
        event.stopPropagation();
        deleteProduct(del.dataset.delete);
        return;
      }

      const card = event.target.closest('[data-target-card]');

      if (card) chooseTarget(card.dataset.targetCard);
    });

    document.querySelectorAll('[data-category-filter]').forEach(button => {
      button.addEventListener('click', () => {
        selectedCategory = button.dataset.categoryFilter;

        document.querySelectorAll('[data-category-filter]').forEach(other => {
          other.classList.toggle('active', other === button);
        });

        renderCatalog();
      });
    });

    $('inventorySearch').addEventListener('input', renderInventory);
    $('inventoryFilter').addEventListener('change', renderInventory);
    $('catalogSearch').addEventListener('input', renderCatalog);
    $('catalogSort').addEventListener('change', renderCatalog);

    $('clearHistoryButton').addEventListener('click', () => {
      state.history = [];
      saveState();
      renderHistory();
      toast('История очищена.');
    });

    $('resetSessionButton').addEventListener('click', () => {
      if (!confirm('Сбросить только статистику и историю? Баланс, каталог и инвентарь останутся.')) {
        return;
      }

      state.stats = {
        attempts: 0,
        wins: 0,
        losses: 0,
        bestPrizeValue: 0,
        bestPrizeName: ''
      };

      state.history = [];

      saveState();
      renderStats();
      renderHistory();

      toast('Статистика сброшена.');
    });

    $('productForm').addEventListener('submit', saveProduct);

    ['productName', 'productPrice', 'productImageUrl', 'productDescription'].forEach(id => {
      $(id).addEventListener('input', () => {
        if (id === 'productImageUrl' && $(id).value.trim()) {
          uploadedImageData = '';
        }

        updatePreview();
      });
    });

    $('productImageFile').addEventListener('change', async event => {
      const file = event.target.files?.[0];
      if (!file) return;

      $('imageUploadStatus').textContent = 'Обрабатываю фото…';

      try {
        uploadedImageData = await compressImage(file);
        $('productImageUrl').value = '';
        $('imageUploadStatus').textContent = 'Фото загружено и сжато.';
        updatePreview();
      } catch (error) {
        uploadedImageData = '';
        $('imageUploadStatus').textContent = error.message;
      }
    });

    renderAll();

    if (!getTarget()) pickTargetForPreset();

    renderAll();
  }

  init();
})();

