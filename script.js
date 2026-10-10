
(() => {
  'use strict';

  const STORAGE_KEY = 'arizonaUpgraderFair_v3_empty_start';
  const $ = (id) => document.getElementById(id);

  const CATEGORIES = {
    vehicle: { label: 'МАШИНА🎃', short: 'АВТО🎃', plural: 'Машины🎃' },
    resource: { label: 'РЕСУРС⛏️', short: 'DROP⛏️', plural: 'Ресурсы⛏️' },
    business: { label: 'БИЗНЕС🕸️', short: 'BIZ🕸️', plural: 'Бизнесы🕸️' },
    accessory: { label: 'АКСЕССУАР🍁', short: 'ITEM🍁', plural: 'Аксессуары🍁' }
  };

  const DEFAULT_CATALOG = [
    { id: 'm5', type: 'vehicle', name: 'BMW M5 F90', value: 2500000, icon: '🚗' },
    { id: 'e63', type: 'vehicle', name: 'BMW i12', value: 3500000, icon: '🚘' },
    { id: 'supra', type: 'vehicle', name: 'BMW M5 E60', value: 4500000, icon: '🏎️' },
    { id: 'gtr', type: 'vehicle', name: 'BMW M5 F10', value: 5500000, icon: '🏎️' },
    { id: 'x6', type: 'vehicle', name: 'Mersedes AMG W205', value: 7000000, icon: '🚙' },
    { id: 'g63', type: 'vehicle', name: 'Mercedes E63 W212', value: 10000000, icon: '🚙' },
    { id: 'lambo', type: 'vehicle', name: 'Mersedes-Benz G63 W464', value: 18000000, icon: '🏎️' },
    { id: 'rolls', type: 'vehicle', name: 'Mersedes-Benz Sprinter', value: 4500000, icon: '🚘' },

    { id: 's650', type: 'vehicle', name: 'Mersedes-Benz S650', value: 150000, icon: '🏎️' },
    { id: 'case', type: 'resource', name: 'Премиум кейс', value: 2500000, icon: '📦' },
    { id: 'gold-resource', type: 'resource', name: 'Золотой ресурс', value: 5000000, icon: '🏆' },
    { id: 'rare-resource', type: 'resource', name: 'Редкий ресурс', value: 10000000, icon: '💎' },
    { id: 'legendary-resource', type: 'resource', name: 'Легендарный ресурс', value: 25000000, icon: '👑' },

    { id: 'garage', type: 'business', name: 'Гараж', value: 1500000, icon: '🅿️' },
    { id: 'business-small', type: 'business', name: 'Небольшой бизнес', value: 7000000, icon: '🏪' },
    { id: 'business-gas', type: 'business', name: 'Автозаправка', value: 20000000, icon: '⛽' },
    { id: 'restaurant', type: 'business', name: 'Ресторан', value: 35000000, icon: '🍽️' },
    { id: 'club', type: 'business', name: 'Ночной клуб', value: 50000000, icon: '🌃' },
    { id: 'casino', type: 'business', name: 'Казино', value: 100000000, icon: '🎰' },

    { id: 'crown', type: 'accessory', name: 'Корона', value: 2500000, icon: '👑' },
    { id: 'chain', type: 'accessory', name: 'Золотая цепь', value: 1500000, icon: '📿' },
    { id: 'glasses', type: 'accessory', name: 'Очки Luxury', value: 750000, icon: '🕶️' },
    { id: 'halloween-mask', type: 'accessory', name: 'Маска Хэллоуин', value: 500000, icon: '🎭' },
    { id: 'hat', type: 'accessory', name: 'Шляпа', value: 300000, icon: '🎩' },
    { id: 'horns', type: 'accessory', name: 'Рога', value: 1000000, icon: '😈' },
    { id: 'wings', type: 'accessory', name: 'Крылья', value: 3500000, icon: '🪽' },
    { id: 'aura', type: 'accessory', name: 'Аура', value: 5000000, icon: '✨' },
    { id: 'gold-skull', type: 'accessory', name: 'Золотой череп', value: 2000000, icon: '💀' },
    { id: 'pumpkin-item', type: 'accessory', name: 'Тыквенный аксессуар', value: 900000, icon: '🎃' },
    { id: 'neon-mask', type: 'accessory', name: 'Неоновая маска', value: 1800000, icon: '😎' },
    { id: 'vip-crown', type: 'accessory', name: 'VIP корона', value: 10000000, icon: '👑' },
    { id: 'watch', type: 'accessory', name: 'Rolex', value: 500000, icon: '⌚' }
  ];

  function initialState() {
    return {
      balance: 0,
      inventory: [],
      images: {},
      stats: { attempts: 0, wins: 0, losses: 0 },
      history: []
    };
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
      if (!saved || typeof saved !== 'object') return initialState();

      const validImages = {};
      if (saved.images && typeof saved.images === 'object') {
        for (const [id, src] of Object.entries(saved.images)) {
          if (typeof src === 'string' && src.startsWith('data:image/')) {
            validImages[id] = src;
          }
        }
      }

      const inventory = Array.isArray(saved.inventory)
        ? saved.inventory.filter(item =>
            item &&
            typeof item.name === 'string' &&
            CATEGORIES[item.type] &&
            Number(item.value) > 0 &&
            Number(item.qty) > 0
          ).map(item => ({
            ...item,
            id: String(item.id || makeId()),
            value: Math.max(1, Math.round(Number(item.value))),
            qty: Math.max(1, Math.floor(Number(item.qty)))
          }))
        : [];

      return {
        balance: Number.isFinite(Number(saved.balance)) && Number(saved.balance) >= 0
          ? Math.floor(Number(saved.balance))
          : 0,
        inventory,
        images: validImages,
        stats: {
          attempts: Number(saved.stats?.attempts) || 0,
          wins: Number(saved.stats?.wins) || 0,
          losses: Number(saved.stats?.losses) || 0
        },
        history: Array.isArray(saved.history) ? saved.history.slice(0, 30) : []
      };
    } catch (error) {
      console.warn('Не удалось загрузить сохранение.', error);
      return initialState();
    }
  }

  let state = loadState();
  let sourceMode = 'cash';
  let selectedSourceId = '';
  let selectedChance = 50;
  let targetMode = 'cash';
  let cashTargetValue = 0;
  let cashTargetPreset = true;
  let targetItem = null;
  let selectedCategory = 'all';
  let selectedDepositMethod = 'virtual';
  let rolling = false;
  let toastTimer = null;
  let pendingImageItemId = null;

  const typeButtons = [...document.querySelectorAll('.type[data-type]')];
  const chanceButtons = [...document.querySelectorAll('.chance-btn[data-chance]')];
  const categoryButtons = [...document.querySelectorAll('[data-category-filter]')];
  const selectionModal = $('selectionModal');
  const modalList = $('modalList');

  // Создаём поле выбора файла программно — править HTML не нужно.
  const imageInput = document.createElement('input');
  imageInput.type = 'file';
  imageInput.accept = 'image/*';
  imageInput.hidden = true;
  imageInput.id = 'catalogImageUpload';
  document.body.appendChild(imageInput);

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Не удалось сохранить данные.', error);
      showToast('Не получилось сохранить фото. Попробуй изображение поменьше.', true);
      return false;
    }
  }

  function makeId() {
    return `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
  }

  function formatNumber(value) {
    return Math.round(Number(value) || 0)
      .toLocaleString('ru-RU')
      .replace(/\u00A0/g, ' ');
  }

  function formatMoney(value) {
    return `${formatNumber(value)} ₽`;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, char => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[char]));
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function categoryOf(type) {
    return CATEGORIES[type] || CATEGORIES.resource;
  }

  function getInventoryItem(id) {
    return state.inventory.find(item => item.id === id) || null;
  }

  function getProduct(id) {
    return DEFAULT_CATALOG.find(item => item.id === id) || null;
  }

  // Загруженное фото имеет приоритет над стандартной иконкой.
  function getItemImage(item) {
    if (!item) return '';
    return state.images[item.id] || item.image || '';
  }

  function imageMarkup(item, className = 'uploaded-item-image') {
    const src = getItemImage(item);

    if (!src) return escapeHtml(item?.icon || '✦');

    return `<img class="${className}" src="${escapeAttribute(src)}" alt="${escapeAttribute(item?.name || 'Предмет')}">`;
  }

  function setItemFace(element, item) {
    if (!element) return;

    const image = getItemImage(item);

    if (image) {
      element.classList.add('has-item-image');
      element.innerHTML = `<img class="uploaded-item-image" src="${escapeAttribute(image)}" alt="${escapeAttribute(item?.name || 'Предмет')}">`;
      const img = element.querySelector('img');
      img.addEventListener('error', () => {
        element.classList.remove('has-item-image');
        element.textContent = item?.icon || '✦';
      }, { once: true });
    } else {
      element.classList.remove('has-item-image');
      element.textContent = item?.icon || '✦';
    }
  }

  function getSource() {
    if (sourceMode === 'inventory') {
      const item = getInventoryItem(selectedSourceId);
      return item ? { ...item, sourceType: 'inventory' } : null;
    }

    const value = Math.floor(Number($('virtualAmount').value));

    return {
      id: 'cash',
      type: 'cash',
      name: 'Наличные',
      value: Number.isFinite(value) && value > 0 ? value : 0,
      icon: '₽',
      sourceType: 'cash'
    };
  }

  function getTarget() {
    if (targetMode === 'item') {
      if (!targetItem) return null;
      return { ...targetItem, image: getItemImage(targetItem) };
    }

    return {
      id: 'cash-target',
      type: 'cash',
      name: 'Наличные',
      value: Math.max(0, Math.round(Number(cashTargetValue) || 0)),
      icon: '₽',
      sourceType: 'cash'
    };
  }

  function actualChance(source = getSource(), target = getTarget()) {
    if (!source || !target || source.value <= 0 || target.value <= source.value) {
      return 0;
    }

    if (targetMode === 'cash' && cashTargetPreset) {
      return Math.max(0, Math.min(100, selectedChance));
    }

    return Math.min(100, source.value / target.value * 100);
  }

  function secureRoll(percent) {
    const probability = Math.max(0, Math.min(100, Number(percent) || 0)) / 100;

    // Каждый раунд — отдельный независимый бросок.
    if (window.crypto && typeof window.crypto.getRandomValues === 'function') {
      const random = new Uint32Array(1);
      window.crypto.getRandomValues(random);
      return random[0] / 4294967296 < probability;
    }

    return Math.random() < probability;
  }

  function updateCashTargetFromChance() {
    if (targetMode !== 'cash' || !cashTargetPreset) return;

    const source = getSource();
    if (!source || source.value < 1) return;

    cashTargetValue = Math.max(
      source.value + 1,
      Math.round(source.value / (selectedChance / 100))
    );
  }

  function renderSourceAndTarget() {
    const source = getSource();
    const target = getTarget();

    $('virtualBox').classList.toggle('hidden', sourceMode !== 'cash');
    $('inventorySourceInfo').classList.toggle('hidden', sourceMode === 'cash');

    $('sourceHelp').textContent = sourceMode === 'cash'
      ? 'Ставка списывается с баланса до начала анимации.'
      : 'Предмет будет снят с инвентаря до начала анимации.';

    if (source) {
      setItemFace($('sourceIcon'), source);
      $('sourceName').textContent = source.name;
      $('sourcePrice').textContent = formatMoney(source.value);
      $('inventorySourceName').textContent = source.name;
    } else {
      setItemFace($('sourceIcon'), null);
      $('sourceName').textContent = 'Выбери предмет';
      $('sourcePrice').textContent = '—';
      $('inventorySourceName').textContent = 'Выбери предмет';
    }

    if (target) {
      setItemFace($('targetIcon'), target);
      $('targetName').textContent = target.name;
      $('targetPrice').textContent = formatMoney(target.value);
    } else {
      setItemFace($('targetIcon'), null);
      $('targetName').textContent = 'Выбери приз';
      $('targetPrice').textContent = '—';
    }

    $('targetModeLabel').textContent = targetMode === 'cash'
      ? 'Зачисление на баланс'
      : 'Предмет попадёт в инвентарь';

    $('targetInfoHint').textContent = targetMode === 'cash'
      ? 'Сумма и шанс указаны ниже.'
      : `Категория: ${categoryOf(target?.type).plural}. Шанс зависит от стоимости предмета.`;

    const chance = actualChance(source, target);
    const multiplier = source && target && source.value > 0
      ? target.value / source.value
      : 0;

    $('chance').textContent = chance ? `Шанс ${chance.toFixed(2)}%` : 'Невозможно улучшить';
    $('multiplier').textContent = multiplier ? `×${multiplier.toFixed(2)}` : '×—';

    $('oddsNote').textContent = targetMode === 'item'
      ? 'Шанс предмета рассчитан по стоимости ставки и приза.'
      : `Выбранный шанс: ${selectedChance}%. При успехе: ${formatMoney(target?.value || 0)}.`;

    chanceButtons.forEach(button => {
      button.classList.toggle(
        'active',
        targetMode === 'cash' && Number(button.dataset.chance) === selectedChance
      );
    });

    const validSource = source && source.value > 0;
    const enoughBalance = sourceMode !== 'cash' || (source && source.value <= state.balance);
    const validTarget = target && target.value > (source?.value || 0);

    $('upgradeButton').disabled =
      rolling || !validSource || !enoughBalance || !validTarget;

    $('upgradeButton').querySelector('span:first-child').textContent =
      rolling ? 'КРУТИМ…' : 'УЛУЧШИТЬ';

    $('balanceValue').textContent = `${formatNumber(state.balance)} ₽`;
    $('withdrawBalance').textContent = formatMoney(state.balance);
  }

  function renderInventory() {
    const query = $('inventorySearch').value.trim().toLowerCase();

    const items = state.inventory.filter(item =>
      !query ||
      item.name.toLowerCase().includes(query) ||
      categoryOf(item.type).plural.toLowerCase().includes(query)
    );

    $('inventoryCount').textContent =
      state.inventory.reduce((sum, item) => sum + item.qty, 0);

    $('inventoryEmpty').classList.toggle('hidden', items.length > 0);
    $('inventoryGrid').classList.toggle('hidden', items.length === 0);

    $('inventoryGrid').innerHTML = items.map(item => {
      const selected = sourceMode === 'inventory' && item.id === selectedSourceId;

      return `
        <article class="inventory-card ${selected ? 'selected' : ''}">
          <div class="card-image">
            ${imageMarkup(item)}
            <span class="card-category-icon">${escapeHtml(categoryOf(item.type).short)}</span>
            ${item.qty > 1 ? `<span class="card-quantity">×${item.qty}</span>` : ''}
          </div>
          <div class="card-info">
            <h3>${escapeHtml(item.name)}</h3>
            <div class="card-price">${formatMoney(item.value)}</div>
          </div>
          <div class="card-actions">
            <button type="button" class="mini-action primary" data-play-id="${escapeAttribute(item.id)}">Играть</button>
            <button type="button" class="mini-action sell" data-sell-id="${escapeAttribute(item.id)}">Продать</button>
          </div>
        </article>
      `;
    }).join('');

    inventoryGrid.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => img.remove(), { once: true });
    });
  }

  function renderCatalog() {
    const query = $('catalogSearch').value.trim().toLowerCase();

    const items = DEFAULT_CATALOG.filter(item =>
      (selectedCategory === 'all' || item.type === selectedCategory) &&
      (!query ||
        item.name.toLowerCase().includes(query) ||
        categoryOf(item.type).plural.toLowerCase().includes(query))
    );

    $('catalogCount').textContent = DEFAULT_CATALOG.length;
    $('catalogEmpty').classList.toggle('hidden', items.length > 0);
    $('catalogGrid').classList.toggle('hidden', items.length === 0);

    const source = getSource();

    $('catalogGrid').innerHTML = items.map(item => {
      const alreadySelected = targetMode === 'item' && targetItem?.id === item.id;
      const canWin = source && item.value > source.value;
      const supportsImage = ['vehicle', 'resource', 'accessory'].includes(item.type);
      const hasImage = Boolean(state.images[item.id]);

      return `
        <article class="catalog-card ${alreadySelected ? 'target-selected' : ''}">
          <div class="card-image">
            ${imageMarkup(item)}
            <span class="card-category-icon">${escapeHtml(categoryOf(item.type).short)}</span>
          </div>
          <div class="card-info">
            <h3>${escapeHtml(item.name)}</h3>
            <div class="card-price">${formatMoney(item.value)}</div>
          </div>
          <div class="card-actions">
            <button
              type="button"
              class="mini-action primary"
              data-target-id="${escapeAttribute(item.id)}"
              ${canWin ? '' : 'disabled title="Приз должен стоить дороже ставки"'}
            >${alreadySelected ? 'Выбрано ✓' : (canWin ? 'Выбрать' : 'Дешевле')}</button>
            ${supportsImage ? `
              <button
                type="button"
                class="mini-action image-upload-action"
                data-image-upload="${escapeAttribute(item.id)}"
                title="${hasImage ? 'Заменить фото' : 'Загрузить фото'}"
              >${hasImage ? '📷 Фото' : '＋ Фото'}</button>
            ` : ''}
          </div>
        </article>
      `;
    }).join('');

    $('categoryFilters').querySelectorAll('[data-category-filter]').forEach(button => {
      button.classList.toggle('active', button.dataset.categoryFilter === selectedCategory);
    });

    catalogGrid.querySelectorAll('img').forEach(img => {
      img.addEventListener('error', () => img.remove(), { once: true });
    });
  }

  function renderStats() {
    $('attempts').textContent = state.stats.attempts || 0;
    $('wins').textContent = state.stats.wins || 0;
    $('losses').textContent = state.stats.losses || 0;

    const winRate = state.stats.attempts
      ? state.stats.wins / state.stats.attempts * 100
      : 0;

    $('winrate').textContent = `${winRate.toFixed(1)}%`;
  }

  function renderEverything() {
    renderSourceAndTarget();
    renderInventory();
    renderCatalog();
    renderStats();
  }

  function showToast(message, error = false) {
    clearTimeout(toastTimer);
    $('toast').textContent = message;
    $('toast').classList.remove('hidden', 'error');
    $('toast').classList.add('show');

    if (error) $('toast').classList.add('error');

    toastTimer = setTimeout(() => $('toast').classList.add('hidden'), 2800);
  }

  function openModal(id) {
    $(id).classList.remove('hidden');
    $(id).setAttribute('aria-hidden', 'false');
  }

  function closeModal(id) {
    $(id).classList.add('hidden');
    $(id).setAttribute('aria-hidden', 'true');
  }

  function setSourceMode(mode) {
    if (rolling) return;

    sourceMode = mode === 'inventory' ? 'inventory' : 'cash';

    if (sourceMode === 'inventory') {
      if (!state.inventory.length) {
        sourceMode = 'cash';
        showToast('Инвентарь пуст. Сначала выиграй предмет или выбери наличные.', true);
      } else if (!getInventoryItem(selectedSourceId)) {
        selectedSourceId = state.inventory[0].id;
      }
    }

    typeButtons.forEach(button => {
      button.classList.toggle('active', button.dataset.type === sourceMode);
    });

    updateCashTargetFromChance();
    renderEverything();
  }

  function makeModalItem(item, onClick, disabled = false, badge = '') {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'modal-item';
    button.disabled = disabled;

    button.innerHTML = `
      <span class="modal-item-icon ${getItemImage(item) ? 'has-item-image' : ''}">
        ${imageMarkup(item)}
      </span>
      <span class="modal-item-info">
        <span class="modal-item-name">${escapeHtml(item.name)}</span>
        <span class="modal-item-price">${formatMoney(item.value)}${badge ? ` · ${escapeHtml(badge)}` : ''}</span>
      </span>
    `;

    button.addEventListener('click', onClick);
    modalList.appendChild(button);
  }

  function openSourceSelection() {
    if (rolling) return;

    if (sourceMode === 'cash') {
      $('virtualAmount').focus();
      $('virtualAmount').select();
      return;
    }

    $('modalTitle').textContent = 'ВЫБЕРИТЕ ПРЕДМЕТ ДЛЯ СТАВКИ';
    modalList.innerHTML = '';

    if (!state.inventory.length) {
      modalList.innerHTML = '<div class="empty-state"><span>🎒</span><b>Инвентарь пуст</b><small>Выиграй предмет, чтобы поставить его.</small></div>';
    } else {
      state.inventory.forEach(item => makeModalItem(
        { ...item, image: getItemImage(item) },
        () => {
          selectedSourceId = item.id;
          updateCashTargetFromChance();
          closeModal('selectionModal');
          renderEverything();
        },
        false,
        item.qty > 1 ? `×${item.qty}` : ''
      ));
    }

    openModal('selectionModal');
  }

  function setCashTarget(amount, preset = false) {
    const value = Math.floor(Number(amount));
    const source = getSource();

    if (!Number.isFinite(value) || value < 1) {
      showToast('Введи сумму выигрыша больше нуля.', true);
      return false;
    }

    if (source && value <= source.value) {
      showToast('Цель должна стоить дороже ставки.', true);
      return false;
    }

    targetMode = 'cash';
    targetItem = null;
    cashTargetValue = value;
    cashTargetPreset = preset;

    closeModal('selectionModal');
    renderEverything();
    return true;
  }

  function selectTargetItem(id) {
    const item = getProduct(id);
    const source = getSource();

    if (!item) return;

    if (!source || item.value <= source.value) {
      showToast('Этот приз дешевле ставки. Выбери предмет дороже.', true);
      return;
    }

    targetMode = 'item';
    targetItem = { ...item, image: getItemImage(item) };
    cashTargetPreset = false;

    closeModal('selectionModal');
    renderEverything();
    showToast(`Цель выбрана: ${item.name}. Шанс пересчитан.`);
  }

  function openTargetSelection() {
    if (rolling) return;

    $('modalTitle').textContent = 'ВЫБЕРИТЕ ЖЕЛАЕМЫЙ ПРИЗ';
    modalList.innerHTML = '';

    const source = getSource();
    const suggestedCash = source && source.value > 0
      ? Math.max(source.value + 1, Math.round(source.value / (selectedChance / 100)))
      : cashTargetValue;

    const cashBox = document.createElement('div');
    cashBox.className = 'target-money-box';
    cashBox.innerHTML = `
      <div class="target-money-title">НАЛИЧНЫЕ НА БАЛАНС</div>
      <div class="target-money-row">
        <div class="target-money-input-wrap">
          <span>₽</span>
          <input id="targetVirtualAmount" type="number" min="1" step="1" value="${suggestedCash}" placeholder="Сумма выигрыша">
        </div>
        <button type="button" id="targetVirtualApply">ВЫБРАТЬ</button>
      </div>
    `;

    modalList.appendChild(cashBox);

    $('targetVirtualApply').addEventListener('click', () => {
      setCashTarget($('targetVirtualAmount').value, false);
    });

    $('targetVirtualAmount').addEventListener('keydown', event => {
      if (event.key === 'Enter') setCashTarget($('targetVirtualAmount').value, false);
    });

    ['vehicle', 'resource', 'business', 'accessory'].forEach(type => {
      const matching = DEFAULT_CATALOG.filter(item => item.type === type);
      const title = document.createElement('div');

      title.className = 'modal-section-title';
      title.textContent = categoryOf(type).plural.toUpperCase();
      modalList.appendChild(title);

      matching.forEach(item => makeModalItem(
        { ...item, image: getItemImage(item) },
        () => selectTargetItem(item.id),
        !source || item.value <= source.value,
        item.value <= (source?.value || 0) ? 'ДЕШЕВЛЕ СТАВКИ' : 'ЦЕЛЬ'
      ));
    });

    openModal('selectionModal');
  }

  function setChance(chance) {
    if (rolling) return;

    selectedChance = Number(chance);
    targetMode = 'cash';
    targetItem = null;
    cashTargetPreset = true;

    updateCashTargetFromChance();
    renderEverything();
  }

  function addInventory(item, qty = 1) {
    const existing = state.inventory.find(entry => entry.id === item.id);

    if (existing) {
      existing.qty += qty;
      existing.name = item.name;
      existing.type = item.type;
      existing.value = item.value;
      existing.icon = item.icon;
    } else {
      state.inventory.unshift({ ...item, qty });
    }
  }

  function consumeInventory(id, qty = 1) {
    const entry = getInventoryItem(id);
    if (!entry) return;

    entry.qty -= qty;

    if (entry.qty <= 0) {
      state.inventory = state.inventory.filter(item => item.id !== id);
    }

    if (!getInventoryItem(selectedSourceId)) {
      selectedSourceId = state.inventory[0]?.id || '';
    }
  }

  // Прокрутка показывает только ПОБЕДУ и ПОРАЖЕНИЕ.
  // Исход фиксируется отдельно и не зависит от анимации.
  function createRollCard(won, isFinal = false) {
    const element = document.createElement('div');
    const isWin = isFinal ? won : Math.random() < 0.5;

    element.className = `roll-card ${isWin ? 'roll-win' : 'roll-loss'}`;

    element.innerHTML = `
      <div class="roll-card-icon">${isWin ? '✓' : '×'}</div>
      <div class="roll-card-text">${isWin ? 'ПОБЕДА' : 'ПОРАЖЕНИЕ'}</div>
    `;

    return element;
  }

  async function runRollAnimation(target, won) {
    const rollScreen = $('rollScreen');
    const track = $('rollTrack');

    track.innerHTML = '';
    track.style.transition = 'none';
    track.style.transform = 'translateX(0px)';

    const total = 30;
    const finalIndex = total - 3;

    for (let index = 0; index < total; index++) {
      track.appendChild(createRollCard(won, index === finalIndex));
    }

    const finalCard = track.children[finalIndex];
    rollScreen.classList.remove('hidden');

    void track.offsetWidth;

    const shift = finalCard.offsetLeft -
      (rollScreen.querySelector('.roll-window').clientWidth / 2 - finalCard.offsetWidth / 2);

    requestAnimationFrame(() => {
      track.style.transition = 'transform 3s cubic-bezier(.08,.72,.08,1)';
      track.style.transform = `translateX(-${Math.max(0, shift)}px)`;
    });

    await new Promise(resolve => setTimeout(resolve, 3150));
    rollScreen.classList.add('hidden');
  }

  async function runUpgrade() {
    if (rolling) return;

    const source = getSource();
    const target = getTarget();

    if (!source || source.value < 1) {
      showToast('Введи корректную сумму ставки.', true);
      return;
    }

    if (sourceMode === 'cash' && source.value > state.balance) {
      showToast('Недостаточно денег на балансе. Пополни счёт или уменьши ставку.', true);
      return;
    }

    if (sourceMode === 'inventory' && !getInventoryItem(source.id)) {
      showToast('Предмет больше не найден в инвентаре.', true);
      return;
    }

    if (!target || target.value <= source.value) {
      showToast('Приз должен стоить дороже ставки.', true);
      return;
    }

    const chance = actualChance(source, target);

    if (!(chance > 0 && chance < 100)) {
      showToast('Не удалось рассчитать шанс. Выбери другую цель.', true);
      return;
    }

    const won = secureRoll(chance);
    const targetWasCash = targetMode === 'cash';

    rolling = true;

    // Обновляем баланс/инвентарь и сохраняем результат сразу.
    if (sourceMode === 'cash') {
      state.balance = Math.max(0, state.balance - source.value);
    } else {
      consumeInventory(source.id, 1);
    }

    if (won) {
      if (targetWasCash) {
        state.balance += target.value;
      } else {
        addInventory(target, 1);
      }

      state.stats.wins += 1;
    } else {
      state.stats.losses += 1;
    }

    state.stats.attempts += 1;
    state.history.unshift({
      time: Date.now(),
      won,
      chance: Number(chance.toFixed(4)),
      sourceName: source.name,
      sourceValue: source.value,
      targetName: target.name,
      targetValue: target.value
    });
    state.history = state.history.slice(0, 30);

    saveState();
    renderEverything();

    $('upgradeButton').disabled = true;
    $('virtualAmount').disabled = true;
    $('maxBalanceButton').disabled = true;

    [...typeButtons, ...chanceButtons, $('sourceButton'), $('targetButton')].forEach(button => {
      button.disabled = true;
    });

    try {
      await runRollAnimation(target, won);
    } finally {
      rolling = false;
      $('virtualAmount').disabled = false;
      $('maxBalanceButton').disabled = false;

      [...typeButtons, ...chanceButtons, $('sourceButton'), $('targetButton')].forEach(button => {
        button.disabled = false;
      });

      renderEverything();
      showResult(won, source, target, chance, targetWasCash);
    }
  }

  function showResult(won, source, target, chance, targetWasCash) {
    $('resultIcon').textContent = won ? (targetWasCash ? '₽' : target.icon) : '💀';
    $('resultTitle').textContent = won ? 'ПОБЕДА!' : 'НЕУДАЧА';
    $('resultTitle').style.color = won ? '#39df86' : '#ff5252';

    if (won) {
      $('resultText').innerHTML = targetWasCash
        ? `Ты выиграл <strong>${formatMoney(target.value)}</strong>. Баланс уже обновлён.`
        : `Ты выиграл <strong>${escapeHtml(target.name)}</strong>. Предмет уже в инвентаре.`;
    } else {
      $('resultText').innerHTML =
        `Ставка <strong>${formatMoney(source.value)}</strong> потеряна. Реальный шанс победы был <strong>${chance.toFixed(2)}%</strong>.`;
    }

    $('result').classList.remove('hidden');
  }

  function sellInventoryItem(id) {
    const item = getInventoryItem(id);
    if (!item) return;

    if (!window.confirm(`Продать «${item.name}» за ${formatMoney(item.value)}?`)) return;

    state.balance += item.value;
    consumeInventory(id, 1);

    saveState();
    renderEverything();
    showToast(`Продано: ${item.name} · +${formatMoney(item.value)}`);
  }

  function renderDepositContent(method) {
    selectedDepositMethod = method;

    document.querySelectorAll('[data-method]').forEach(button => {
      button.classList.toggle('active', button.dataset.method === method);
    });

    if (method === 'virtual') {
      $('depositContent').innerHTML = `
        <div class="deposit-panel">
          <label class="deposit-label" for="depositVirtualAmount">Сумма виртуального пополнения</label>
          <input class="deposit-input" id="depositVirtualAmount" type="number" min="1" step="1" placeholder="Например, 10000000">
          <button type="button" class="modal-action-button" id="depositVirtualApply">ЗАЧИСЛИТЬ ₽</button>
          <small class="field-help">Тестовое пополнение: реальная оплата не проводится.</small>
        </div>
      `;

      $('depositVirtualApply').addEventListener('click', () => {
        const amount = Math.floor(Number($('depositVirtualAmount').value));

        if (!Number.isFinite(amount) || amount < 1 || amount > 1000000000000) {
          showToast('Введи корректную сумму пополнения.', true);
          return;
        }

        state.balance += amount;

        saveState();
        renderEverything();
        closeModal('depositModal');
        showToast(`Баланс пополнен на ${formatMoney(amount)}.`);
      });

      $('depositVirtualAmount').addEventListener('keydown', event => {
        if (event.key === 'Enter') $('depositVirtualApply').click();
      });

      return;
    }

    const accessories = state.inventory.filter(item => item.type === 'accessory');

    $('depositContent').innerHTML = `
      <div class="deposit-panel">
        <div class="deposit-label">Продай аксессуар из своего инвентаря</div>
        <div class="inventory-deposit-list" id="depositAccessoryList"></div>
        ${accessories.length ? '' : '<small class="field-help">В инвентаре пока нет аксессуаров. Выиграй аксессуар в апгрейдере.</small>'}
      </div>
    `;

    const list = $('depositAccessoryList');
    if (!list) return;

    list.innerHTML = accessories.map(item => `
      <div class="inventory-deposit-row">
        <span class="item-emoji">${escapeHtml(item.icon)}</span>
        <span class="item-text">
          <b>${escapeHtml(item.name)}${item.qty > 1 ? ` ×${item.qty}` : ''}</b>
          <small>${formatMoney(item.value)}</small>
        </span>
        <button type="button" class="deposit-sell-button" data-deposit-sell="${escapeHtml(item.id)}">Продать</button>
      </div>
    `).join('');

    list.querySelectorAll('[data-deposit-sell]').forEach(button => {
      button.addEventListener('click', () => {
        const item = getInventoryItem(button.dataset.depositSell);
        if (!item) return;

        state.balance += item.value;
        consumeInventory(item.id, 1);

        saveState();
        renderEverything();
        renderDepositContent('accessories');
        showToast(`Аксессуар продан за ${formatMoney(item.value)}.`);
      });
    });
  }

  function deposit() {
    renderDepositContent(selectedDepositMethod);
    openModal('depositModal');
  }

  function submitWithdraw() {
    const nickname = $('withdrawNick').value.trim();
    const amount = Math.floor(Number($('withdrawAmount').value));
    const server = $('withdrawServer').value;

    if (nickname.length < 2) return showToast('Введи корректный NickName.', true);
    if (!Number.isFinite(amount) || amount < 1) return showToast('Введи сумму вывода больше нуля.', true);
    if (!server) return showToast('Выбери сервер.', true);
    if (amount > state.balance) return showToast('Недостаточно средств на балансе.', true);

    if (!window.confirm(
      `Создать демо-заявку на вывод ${formatMoney(amount)} для ${nickname} (${server})? Реального перевода не будет.`
    )) return;

    state.balance -= amount;

    saveState();
    renderEverything();
    closeModal('withdrawModal');

    $('withdrawNick').value = '';
    $('withdrawAmount').value = '';
    $('withdrawServer').value = '';

    showToast(`Демо-заявка создана: ${formatMoney(amount)} · ${server}. Реальный вывод не подключён.`);
  }

  // Сжатие фотографии: помогает избежать переполнения localStorage.
  function compressImage(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Выбери файл изображения.'));
        return;
      }

      if (file.size > 12 * 1024 * 1024) {
        reject(new Error('Файл больше 12 МБ. Выбери фото поменьше.'));
        return;
      }

      const reader = new FileReader();

      reader.onerror = () => reject(new Error('Не удалось прочитать файл.'));
      reader.onload = () => {
        const img = new Image();

        img.onerror = () => reject(new Error('Не удалось открыть это изображение.'));
        img.onload = () => {
          const maxDimension = 800;
          const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
          const canvas = document.createElement('canvas');

          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));

          const context = canvas.getContext('2d');
          if (!context) {
            reject(new Error('Браузер не смог обработать изображение.'));
            return;
          }

          context.drawImage(img, 0, 0, canvas.width, canvas.height);

          try {
            resolve(canvas.toDataURL('image/jpeg', 0.72));
          } catch (error) {
            reject(new Error('Не удалось подготовить изображение.'));
          }
        };

        img.src = String(reader.result);
      };

      reader.readAsDataURL(file);
    });
  }

  function startImageUpload(id) {
    if (rolling) return;

    const item = getProduct(id);
    if (!item) return;

    if (!['vehicle', 'resource', 'accessory'].includes(item.type)) {
      showToast('Фото здесь доступны для машин, ресурсов и аксессуаров.', true);
      return;
    }

    pendingImageItemId = id;
    imageInput.value = '';
    imageInput.click();
  }

  imageInput.addEventListener('change', async () => {
    const file = imageInput.files?.[0];
    const id = pendingImageItemId;

    pendingImageItemId = null;
    if (!file || !id) return;

    try {
      showToast('Обрабатываю изображение…');

      const compressed = await compressImage(file);
      const previous = state.images[id];

      state.images[id] = compressed;

      if (!saveState()) {
        if (previous) state.images[id] = previous;
        else delete state.images[id];

        renderEverything();
        return;
      }

      // Если этот предмет уже в инвентаре или выбран целью, обновим и его.
      state.inventory.forEach(item => {
        if (item.id === id) item.image = compressed;
      });

      if (targetItem?.id === id) targetItem.image = compressed;

      saveState();
      renderEverything();

      showToast(`Фото добавлено: ${getProduct(id).name}`);
    } catch (error) {
      showToast(error.message || 'Не получилось загрузить изображение.', true);
    }
  });

  function initLeaves() {
    const container = $('fallingLeaves');
    const symbols = ['🍂', '🍁', '✦'];

    for (let i = 0; i < 18; i++) {
      const leaf = document.createElement('span');

      leaf.className = 'leaf';
      leaf.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.animationDelay = `${-Math.random() * 14}s`;
      leaf.style.animationDuration = `${8 + Math.random() * 9}s`;
      leaf.style.fontSize = `${10 + Math.random() * 10}px`;

      container.appendChild(leaf);
    }
  }

  function initEvents() {
    typeButtons.forEach(button => {
      button.addEventListener('click', () => setSourceMode(button.dataset.type));
    });

    chanceButtons.forEach(button => {
      button.addEventListener('click', () => setChance(button.dataset.chance));
    });

    $('virtualAmount').addEventListener('input', () => {
      updateCashTargetFromChance();
      renderSourceAndTarget();
      renderCatalog();
    });

    $('virtualAmount').addEventListener('change', () => {
      const value = Math.floor(Number($('virtualAmount').value));

      if (!Number.isFinite(value) || value < 1) {
        $('virtualAmount').value = '1';
      }

      updateCashTargetFromChance();
      renderEverything();
    });

    $('maxBalanceButton').addEventListener('click', () => {
      if (rolling) return;

      $('virtualAmount').value = Math.floor(state.balance);
      updateCashTargetFromChance();
      renderEverything();
    });

    $('sourceButton').addEventListener('click', openSourceSelection);
    $('sourceCard').addEventListener('click', openSourceSelection);
    $('sourceCard').addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') openSourceSelection();
    });

    $('targetButton').addEventListener('click', openTargetSelection);
    $('targetCard').addEventListener('click', openTargetSelection);
    $('targetCard').addEventListener('keydown', event => {
      if (event.key === 'Enter' || event.key === ' ') openTargetSelection();
    });

    $('upgradeButton').addEventListener('click', runUpgrade);

    $('inventorySearch').addEventListener('input', renderInventory);
    $('catalogSearch').addEventListener('input', renderCatalog);

    categoryButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (rolling) return;
        selectedCategory = button.dataset.categoryFilter;
        renderCatalog();
      });
    });

    $('inventoryGrid').addEventListener('click', event => {
      if (rolling) return;

      const play = event.target.closest('[data-play-id]');
      const sell = event.target.closest('[data-sell-id]');

      if (play) {
        selectedSourceId = play.dataset.playId;
        setSourceMode('inventory');

        $('sourceCard').scrollIntoView({ behavior: 'smooth', block: 'center' });
        showToast('Предмет выбран как ставка. Теперь выбери цель.');
      } else if (sell) {
        sellInventoryItem(sell.dataset.sellId);
      }
    });

    $('catalogGrid').addEventListener('click', event => {
      if (rolling) return;

      const imageButton = event.target.closest('[data-image-upload]');
      if (imageButton) {
        event.stopPropagation();
        startImageUpload(imageButton.dataset.imageUpload);
        return;
      }

      const select = event.target.closest('[data-target-id]');
      if (select && !select.disabled) {
        event.stopPropagation();
        selectTargetItem(select.dataset.targetId);
      }
    });

    $('modalList').addEventListener('click', event => {
      const item = event.target.closest('.modal-item');
      if (item && item.disabled) event.preventDefault();
    });

    $('depositButton').addEventListener('click', deposit);
    document.querySelectorAll('[data-method]').forEach(button => {
      button.addEventListener('click', () => renderDepositContent(button.dataset.method));
    });

    $('withdrawButton').addEventListener('click', () => {
      $('withdrawBalance').textContent = formatMoney(state.balance);
      openModal('withdrawModal');
    });

    $('withdrawSubmit').addEventListener('click', submitWithdraw);

    $('modalClose').addEventListener('click', () => closeModal('selectionModal'));
    $('modalOverlay').addEventListener('click', () => closeModal('selectionModal'));
    $('depositClose').addEventListener('click', () => closeModal('depositModal'));
    $('depositOverlay').addEventListener('click', () => closeModal('depositModal'));
    $('withdrawClose').addEventListener('click', () => closeModal('withdrawModal'));
    $('withdrawOverlay').addEventListener('click', () => closeModal('withdrawModal'));
    $('closeResult').addEventListener('click', () => $('result').classList.add('hidden'));

    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;

      if (!$('selectionModal').classList.contains('hidden')) closeModal('selectionModal');
      if (!$('depositModal').classList.contains('hidden')) closeModal('depositModal');
      if (!$('withdrawModal').classList.contains('hidden')) closeModal('withdrawModal');
      if (!$('result').classList.contains('hidden')) $('result').classList.add('hidden');
    });
  }

  function init() {
    if (!localStorage.getItem(STORAGE_KEY)) saveState();

    $('virtualAmount').value = '0';

    targetMode = 'cash';
    cashTargetValue = 0;
    cashTargetPreset = true;

    updateCashTargetFromChance();
    initLeaves();
    initEvents();
    renderEverything();
  }

  init();
})();

