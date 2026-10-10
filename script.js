
(() => {
  'use strict';

  const STORAGE_KEY = 'upgraderHalloweenEvent_v1';
  const CATEGORY_LABELS = {
    vehicle: 'МАШИНА',
    business: 'БИЗНЕС',
    property: 'ИМУЩЕСТВО',
    accessory: 'АКСЕССУАР',
    item: 'РЕСУРС',
    resource: 'РЕСУРС',
    money: 'НАЛИЧНЫЕ'
  };

  const CATEGORY_SHORT = {
    vehicle: 'AUTO',
    business: 'BIZ',
    property: 'HOME',
    accessory: 'ITEM',
    item: 'RES',
    resource: 'RES',
    money: 'CASH'
  };

  const CATEGORY_EMOJI = {
    vehicle: '🚘',
    business: '🏢',
    property: '🏠',
    accessory: '⌚',
    item: '📦',
    resource: '📦',
    money: '₽'
  };

  const BALANCE_IMAGE = makeSvgImage('₽', '#4b2f18', '#151116', '#ffb35d');

  const DEFAULT_CATALOG = [
    {
      id: 'lamborghini-svj',
      name: 'Lamborghini Aventador SVJ',
      category: 'vehicle',
      price: 40000000,
      image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=900&q=85',
      description: 'Спортивная легенда',
      featured: true
    },
    {
      id: 'bmw-m5-cs',
      name: 'BMW M5 CS',
      category: 'vehicle',
      price: 60000000,
      image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=85',
      description: 'Элегантная мощь',
      featured: true
    },
    {
      id: 'koenigsegg-jesko',
      name: 'Koenigsegg Jesko',
      category: 'vehicle',
      price: 120000000,
      image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=900&q=85',
      description: 'Гиперкар для коллекции',
      featured: true
    },
    {
      id: 'pagani-huayra',
      name: 'Pagani Huayra',
      category: 'vehicle',
      price: 155000000,
      image: 'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=900&q=85',
      description: 'Редкий гиперкар'
    },
    {
      id: 'bugatti-divo',
      name: 'Bugatti Divo',
      category: 'vehicle',
      price: 300000000,
      image: 'https://images.unsplash.com/photo-1544829099-b9a0c07fad1a?auto=format&fit=crop&w=900&q=85',
      description: 'Вершина автоколлекции',
      featured: true
    },
    {
      id: 'business-gas',
      name: 'АЗС на шоссе',
      category: 'business',
      price: 85000000,
      image: 'https://images.unsplash.com/photo-1545262810-77515befe149?auto=format&fit=crop&w=900&q=85',
      description: 'Пассивный доход'
    },
    {
      id: 'business-club',
      name: 'Ночной клуб',
      category: 'business',
      price: 135000000,
      image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=900&q=85',
      description: 'Бизнес ночного города'
    },
    {
      id: 'business-dealer',
      name: 'Автосалон премиум',
      category: 'business',
      price: 210000000,
      image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=900&q=85',
      description: 'Большой бизнес'
    },
    {
      id: 'property-penthouse',
      name: 'Пентхаус в центре',
      category: 'property',
      price: 28000000,
      image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=900&q=85',
      description: 'Панорамный вид на город'
    },
    {
      id: 'property-mansion',
      name: 'Хэллоуин-особняк',
      category: 'property',
      price: 95000000,
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=900&q=85',
      description: 'Особняк с осенним вайбом',
      featured: true
    },
    {
      id: 'property-villa',
      name: 'Вилла у воды',
      category: 'property',
      price: 170000000,
      image: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=900&q=85',
      description: 'Премиальная недвижимость'
    },
    {
      id: 'accessory-watch',
      name: 'Золотые часы',
      category: 'accessory',
      price: 12000000,
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85',
      description: 'Редкий аксессуар'
    },
    {
      id: 'accessory-ring',
      name: 'Кольцо «Ведьма»',
      category: 'accessory',
      price: 16000000,
      image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=900&q=85',
      description: 'Лимитированный хэллоуин-дроп',
      featured: true
    },
    {
      id: 'accessory-mask',
      name: 'Маска Phantom',
      category: 'accessory',
      price: 22000000,
      image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=900&q=85',
      description: 'Таинственный аксессуар'
    },
    {
      id: 'item-pumpkin',
      name: 'Золотая тыква',
      category: 'item',
      price: 5000000,
      image: 'https://images.unsplash.com/photo-1509557965875-b88c97052f0e?auto=format&fit=crop&w=900&q=85',
      description: 'Хэллоуинский коллекционный предмет'
    },
    {
      id: 'item-crate',
      name: 'Mystery Case',
      category: 'item',
      price: 8000000,
      image: 'https://images.unsplash.com/photo-1606503153255-59d8b8b8219b?auto=format&fit=crop&w=900&q=85',
      description: 'Таинственный кейс'
    }
  ];

  const DEFAULT_INVENTORY = [
    {
      itemId: 'lamborghini-svj',
      name: 'Lamborghini Aventador SVJ',
      category: 'vehicle',
      price: 40000000,
      image: DEFAULT_CATALOG[0].image,
      description: 'Спортивная легенда',
      qty: 1
    },
    {
      itemId: 'bmw-m5-cs',
      name: 'BMW M5 CS',
      category: 'vehicle',
      price: 60000000,
      image: DEFAULT_CATALOG[1].image,
      description: 'Элегантная мощь',
      qty: 1
    },
    {
      itemId: 'accessory-watch',
      name: 'Золотые часы',
      category: 'accessory',
      price: 12000000,
      image: DEFAULT_CATALOG[11].image,
      description: 'Редкий аксессуар',
      qty: 1
    }
  ];

  let state = loadState();
  let sourceMode = 'balance';
  let selectedSourceEntryId = state.inventory[0]?.itemId || '';
  let selectedChance = 35;
  let targetMode = 'cash';
  let manualTargetSelection = false;
  let selectedTargetId = null;
  let selectedCategoryFilter = 'all';
  let pendingUploadedImage = '';
  let editingCurrentImage = '';
  let isSpinning = false;
  let toastTimer = null;

  const $ = (id) => document.getElementById(id);

  const balanceValue = $('balanceValue');
  const stakeAmount = $('stakeAmount');
  const sourceInventorySelect = $('sourceInventorySelect');
  const balanceSourceControls = $('balanceSourceControls');
  const inventorySourceControls = $('inventorySourceControls');
  const upgradeButton = $('upgradeButton');
  const reelTrack = $('reelTrack');
  const reelWrap = $('reelWrap');
  const catalogGrid = $('catalogGrid');
  const inventoryGrid = $('inventoryGrid');

  function makeSvgImage(
    text,
    from = '#25212a',
    to = '#121318',
    accent = '#ffab4d'
  ) {
    const safe = String(text).replace(
      /[&<>"']/g,
      (c) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&apos;'
      }[c])
    );

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${from}"/><stop offset="1" stop-color="${to}"/></linearGradient><radialGradient id="r"><stop stop-color="${accent}" stop-opacity=".25"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="320" cy="170" r="230" fill="url(#r)"/><path d="M0 320 Q120 250 230 320 T600 285 V400 H0Z" fill="#08090d" opacity=".6"/><text x="300" y="220" text-anchor="middle" font-family="Arial,sans-serif" font-size="110" font-weight="800" fill="${accent}" fill-opacity=".88">${safe}</text><text x="300" y="355" text-anchor="middle" font-family="Arial,sans-serif" font-size="18" letter-spacing="6" fill="#d7c7b4" opacity=".65">UPGRADER</text></svg>`;

    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  function createDefaultState() {
    return {
      balance: 4000000,
      catalog: DEFAULT_CATALOG.map((item) => ({ ...item })),
      inventory: DEFAULT_INVENTORY.map((item) => ({ ...item })),
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

  function loadState() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);

      if (!raw) return createDefaultState();

      const saved = JSON.parse(raw);
      const fallback = createDefaultState();

      const catalog = Array.isArray(saved.catalog)
        ? saved.catalog.filter(validItem).map(normalizeItem)
        : fallback.catalog;

      const inventory = Array.isArray(saved.inventory)
        ? saved.inventory
            .filter((item) => item && Number(item.qty) > 0 && Number(item.price) > 0)
            .map(normalizeInventoryItem)
        : fallback.inventory;

      return {
        balance:
          Number.isFinite(Number(saved.balance)) && Number(saved.balance) >= 0
            ? Number(saved.balance)
            : fallback.balance,
        catalog,
        inventory,
        stats: { ...fallback.stats, ...(saved.stats || {}) },
        history: Array.isArray(saved.history) ? saved.history.slice(0, 30) : []
      };
    } catch (error) {
      console.warn('Не удалось прочитать сохранение; запускаются данные по умолчанию.', error);
      return createDefaultState();
    }
  }

  function validItem(item) {
    return item &&
      typeof item.name === 'string' &&
      item.name.trim() &&
      Number(item.price) > 0 &&
      CATEGORY_LABELS[item.category];
  }

  function normalizeItem(item) {
    return {
      id: String(item.id || makeId()),
      name: String(item.name || 'Без названия').trim(),
      category: CATEGORY_LABELS[item.category] ? item.category : 'item',
      price: Math.max(1, Math.round(Number(item.price) || 1)),
      image: typeof item.image === 'string' ? item.image : '',
      description: typeof item.description === 'string' ? item.description : '',
      featured: Boolean(item.featured)
    };
  }

  function normalizeInventoryItem(item) {
    return {
      itemId: String(item.itemId || item.id || makeId()),
      name: String(item.name || 'Предмет'),
      category: CATEGORY_LABELS[item.category] ? item.category : 'item',
      price: Math.max(1, Math.round(Number(item.price) || 1)),
      image: typeof item.image === 'string' ? item.image : '',
      description: typeof item.description === 'string' ? item.description : '',
      qty: Math.max(1, Math.floor(Number(item.qty) || 1))
    };
  }

  function saveState() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Не удалось сохранить данные в браузере.', error);
      showToast('Не удалось сохранить данные. Попробуй фото поменьше или удали старые фото.', 'error');
      return false;
    }
  }

  function makeId() {
    return `item-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  }

  function formatMoney(value, withDollar = true) {
    const num = Math.max(0, Math.round(Number(value) || 0));
    const formatted = num.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
    return withDollar ? `₽ ${formatted}` : formatted;
  }

  function getCatalogItem(id) {
    return state.catalog.find((item) => item.id === id) || null;
  }

  function getInventoryItem(id) {
    return state.inventory.find((item) => item.itemId === id) || null;
  }

  function getSource() {
    if (sourceMode === 'inventory') {
      const item = getInventoryItem(selectedSourceEntryId);

      return item
        ? { ...item, id: item.itemId, sourceType: 'inventory' }
        : null;
    }

    const amount = Math.floor(Number(stakeAmount.value));

    if (!Number.isFinite(amount) || amount < 1) {
      return {
        id: 'balance',
        name: 'Игровой баланс',
        category: 'item',
        price: 0,
        image: BALANCE_IMAGE,
        description: 'Ставка с баланса',
        sourceType: 'balance'
      };
    }

    return {
      id: 'balance',
      name: 'Игровой баланс',
      category: 'item',
      price: amount,
      image: BALANCE_IMAGE,
      description: 'Ставка с баланса',
      sourceType: 'balance'
    };
  }

  function getTarget() {
    if (targetMode === 'cash') {
      const source = getSource();

      if (!source || !(source.price > 0)) return null;

      // Наличный выигрыш задаётся выбранным шансом.
      // Сумма приза рассчитывается от ставки.
      const probability = Math.min(99.99, Math.max(0.01, selectedChance)) / 100;
      const payout = Math.ceil(source.price / probability);

      return {
        id: 'cash-prize',
        name: 'Наличные',
        category: 'money',
        price: payout,
        image: BALANCE_IMAGE,
        description: 'Выигрыш будет зачислен на баланс',
        featured: false,
        isCashPrize: true
      };
    }

    return selectedTargetId ? getCatalogItem(selectedTargetId) : null;
  }

  function actualChance(source, target) {
    if (
      !source ||
      !target ||
      !(source.price > 0) ||
      !(target.price > source.price)
    ) {
      return 0;
    }

    return (source.price / target.price) * 100;
  }

  function chooseTargetForChance() {
    if (targetMode === 'cash' || manualTargetSelection) return;

    const source = getSource();

    if (!source || source.price < 1) {
      selectedTargetId = null;
      return;
    }

    const candidates = state.catalog.filter((item) => item.price > source.price);

    if (!candidates.length) {
      selectedTargetId = null;
      return;
    }

    const idealPrice = source.price / (selectedChance / 100);

    candidates.sort((a, b) => {
      const aDistance = Math.abs(Math.log(a.price / idealPrice));
      const bDistance = Math.abs(Math.log(b.price / idealPrice));

      if (aDistance !== bDistance) return aDistance - bDistance;

      return a.price - b.price;
    });

    selectedTargetId = candidates[0].id;
  }

  function setTargetMode(mode) {
    if (!['cash', 'item'].includes(mode)) return;

    targetMode = mode;

    document.querySelectorAll('[data-target-mode]').forEach((button) => {
      button.classList.toggle('active', button.dataset.targetMode === targetMode);
    });

    if (targetMode === 'item') chooseTargetForChance();

    renderCatalog();
    renderGameDisplay();
  }

  function setSourceMode(mode) {
    if (!['balance', 'inventory'].includes(mode)) return;

    sourceMode = mode;

    document.querySelectorAll('[data-source-mode]').forEach((button) => {
      button.classList.toggle('active', button.dataset.sourceMode === mode);
    });

    balanceSourceControls.classList.toggle('hidden', mode !== 'balance');
    inventorySourceControls.classList.toggle('hidden', mode !== 'inventory');

    if (mode === 'inventory' && !getInventoryItem(selectedSourceEntryId)) {
      selectedSourceEntryId = state.inventory[0]?.itemId || '';
    }

    chooseTargetForChance();
    renderGameDisplay();
    renderInventory();
  }

  function renderSourceSelect() {
    const current = selectedSourceEntryId;

    if (!state.inventory.length) {
      sourceInventorySelect.innerHTML = '<option value="">Инвентарь пуст</option>';
      sourceInventorySelect.disabled = true;
      selectedSourceEntryId = '';
      return;
    }

    sourceInventorySelect.disabled = false;

    sourceInventorySelect.innerHTML = state.inventory.map((item) =>
      `<option value="${escapeHtml(item.itemId)}">${escapeHtml(item.name)} · ${formatMoney(item.price)}${item.qty > 1 ? ` ×${item.qty}` : ''}</option>`
    ).join('');

    if (state.inventory.some((item) => item.itemId === current)) {
      selectedSourceEntryId = current;
    } else {
      selectedSourceEntryId = state.inventory[0].itemId;
    }

    sourceInventorySelect.value = selectedSourceEntryId;
  }

  function renderGameDisplay() {
    renderSourceSelect();

    const source = getSource();
    const target = getTarget();
    const sourceImage = $('sourceImage');

    if (source) {
      setImage(
        sourceImage,
        source.image || (
          source.sourceType === 'balance'
            ? BALANCE_IMAGE
            : makeSvgImage(source.name.slice(0, 2).toUpperCase())
        ),
        source.name
      );

      $('sourceCategory').textContent =
        source.sourceType === 'balance'
          ? 'БАЛАНС'
          : (CATEGORY_LABELS[source.category] || 'ПРЕДМЕТ');

      $('sourceName').textContent = source.name;
      $('sourcePrice').textContent = formatMoney(source.price);
      $('sourceFooterPrice').textContent = formatMoney(source.price);
    } else {
      setImage(sourceImage, makeSvgImage('—'), 'Нет предмета');
      $('sourceCategory').textContent = 'ИНВЕНТАРЬ';
      $('sourceName').textContent = 'Выбери предмет';
      $('sourcePrice').textContent = '—';
      $('sourceFooterPrice').textContent = '—';
    }

    if (target) {
      setImage($('targetImage'), target.image, target.name);
      $('targetCategory').textContent = CATEGORY_LABELS[target.category] || 'ПРИЗ';
      $('targetName').textContent = target.name;
      $('targetPrice').textContent = formatMoney(target.price);
      $('targetFooterPrice').textContent = formatMoney(target.price);
      $('selectedPrizeLabel').textContent = target.name;
    } else {
      setImage(
        $('targetImage'),
        makeSvgImage('?', '#332519', '#111217', '#ffb45d'),
        'Выбери приз'
      );

      $('targetCategory').textContent = 'КАТАЛОГ ПРИЗОВ';
      $('targetName').textContent = 'Нет подходящего приза';
      $('targetPrice').textContent = '—';
      $('targetFooterPrice').textContent = '—';
      $('selectedPrizeLabel').textContent = 'Нет подходящего приза';
    }

    const chance = actualChance(source, target);

    $('chanceValue').textContent =
      target && chance > 0 ? `${chance.toFixed(2)}%` : '—';

    $('chanceMeterFill').style.width =
      `${Math.max(0, Math.min(100, chance || selectedChance))}%`;

    $('desiredChanceLabel').textContent =
      targetMode === 'cash'
        ? `${selectedChance}% (точно)`
        : `${selectedChance}% (ориентир)`;

    $('targetMultiplier').textContent =
      source && target && source.price > 0
        ? `×${(target.price / source.price).toFixed(2)}`
        : '×—';

    $('targetMultiplierCopy').textContent =
      source && target && source.price > 0
        ? (
          target.isCashPrize
            ? `Выигрыш на баланс · шанс ${chance.toFixed(2)}%`
            : `Множитель ${(target.price / source.price).toFixed(2)} · реальный шанс ${chance.toFixed(2)}%`
        )
        : 'Выбери шанс или предмет в каталоге';

    upgradeButton.disabled =
      isSpinning ||
      !source ||
      source.price < 1 ||
      !target ||
      target.price <= source.price ||
      (source.sourceType === 'balance' && source.price > state.balance);

    if (!isSpinning) {
      upgradeButton.querySelector('span:nth-child(2)').textContent = 'ПРОКРУТИТЬ';
    }

    updateBalanceDisplay();
  }

  function renderBalanceDisplay() {
    balanceValue.textContent = formatMoney(state.balance, false);
    balanceValue.parentElement.title = `Игровой баланс: ${formatMoney(state.balance)}`;
  }

  function updateBalanceDisplay() {
    renderBalanceDisplay();
  }

  function renderStats() {
    const stats = state.stats;

    $('winsValue').textContent = stats.wins || 0;
    $('lossesValue').textContent = stats.losses || 0;
    $('attemptsValue').textContent = stats.attempts || 0;

    const rate = stats.attempts ? (stats.wins / stats.attempts) * 100 : 0;

    $('winrateValue').textContent = `${rate.toFixed(1)}%`;
    $('luckLabel').textContent = `${Math.round(rate)}%`;
    $('luckBar').style.width = `${Math.min(100, rate)}%`;

    $('bestPrizeValue').textContent = stats.bestPrizeValue
      ? `${stats.bestPrizeName} · ${formatMoney(stats.bestPrizeValue)}`
      : '—';
  }

  function renderHistory() {
    const list = $('historyList');

    if (!state.history.length) {
      list.innerHTML =
        '<div class="empty-history"><span>◷</span><b>Пока тихо</b><small>Твои апгрейды появятся здесь.</small></div>';

      return;
    }

    list.innerHTML = state.history.slice(0, 8).map((entry) => {
      const result = entry.win ? 'WIN' : 'MISS';

      const right = entry.win
        ? `+${formatMoney(entry.targetPrice, false)}`
        : `−${formatMoney(entry.sourcePrice, false)}`;

      const time = entry.time
        ? new Date(entry.time).toLocaleTimeString('ru-RU', {
          hour: '2-digit',
          minute: '2-digit'
        })
        : '';

      return `
        <div class="history-row">
          <div class="history-thumb">
            <img
              src="${escapeAttribute(entry.targetImage || makeSvgImage('✦'))}"
              alt=""
              onerror="this.onerror=null;this.src='${makeSvgImage('✦')}';"
            />
          </div>
          <div class="history-copy">
            <b>${escapeHtml(entry.targetName || 'Неизвестный приз')}</b>
            <small>${entry.win ? 'Успешный апгрейд' : 'Попытка не удалась'} · ${escapeHtml(time)}</small>
          </div>
          <span class="history-result ${entry.win ? 'win' : 'loss'}">${right}</span>
        </div>
      `;
    }).join('');
  }

  function renderInventory() {
    const query = $('inventorySearch').value.trim().toLowerCase();
    const filter = $('inventoryFilter').value;

    const filtered = state.inventory.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query);

      const matchesFilter = filter === 'all' || item.category === filter;

      return matchesQuery && matchesFilter;
    });

    const totalCount = state.inventory.reduce((sum, item) => sum + item.qty, 0);

    $('inventoryCount').textContent = totalCount;
    $('inventoryEmpty').classList.toggle('hidden', filtered.length > 0);
    inventoryGrid.classList.toggle('hidden', filtered.length === 0);

    if (!filtered.length) {
      inventoryGrid.innerHTML = '';

      $('inventoryEmpty').querySelector('b').textContent =
        state.inventory.length ? 'Ничего не найдено' : 'Инвентарь пуст';

      $('inventoryEmpty').querySelector('small').textContent =
        state.inventory.length
          ? 'Измени поиск или фильтр.'
          : 'Выигранные призы появятся здесь.';

      return;
    }

    $('inventoryEmpty').querySelector('b').textContent = 'Инвентарь пуст';

    inventoryGrid.innerHTML = filtered.map((item) => {
      const isSelected =
        sourceMode === 'inventory' && selectedSourceEntryId === item.itemId;

      const sellButton = item.category === 'property'
        ? `<button class="mini-action sell-action" data-sell-item="${escapeAttribute(item.itemId)}" type="button">Продать</button>`
        : '';

      return `
        <article
          class="inventory-card ${isSelected ? 'selected' : ''}"
          data-select-inventory="${escapeAttribute(item.itemId)}"
          tabindex="0"
          role="button"
          aria-label="Использовать ${escapeAttribute(item.name)} как ставку"
        >
          <div class="card-image">
            <img
              src="${escapeAttribute(item.image || makeSvgImage('✦'))}"
              alt="${escapeAttribute(item.name)}"
              onerror="this.onerror=null;this.src='${makeSvgImage('✦')}';"
            />
            <span class="card-category-icon">${CATEGORY_SHORT[item.category] || 'ITEM'}</span>
            ${item.qty > 1 ? `<span class="card-quantity">×${item.qty}</span>` : ''}
          </div>
          <div class="card-info">
            <h3>${escapeHtml(item.name)}</h3>
            <div class="card-price">${formatMoney(item.price)}</div>
          </div>
          <div class="card-actions">
            <button class="mini-action" data-use-inventory="${escapeAttribute(item.itemId)}" type="button">Играть</button>
            ${sellButton}
          </div>
        </article>
      `;
    }).join('');
  }

  function renderCatalog() {
    const query = $('catalogSearch').value.trim().toLowerCase();
    const sort = $('catalogSort').value;

    let filtered = state.catalog.filter((item) => {
      const matchesQuery =
        !query ||
        item.name.toLowerCase().includes(query) ||
        (item.description || '').toLowerCase().includes(query);

      const matchesCategory =
        selectedCategoryFilter === 'all' ||
        item.category === selectedCategoryFilter;

      return matchesQuery && matchesCategory;
    });

    if (sort === 'price-up') {
      filtered = filtered.slice().sort((a, b) => a.price - b.price);
    } else if (sort === 'price-down') {
      filtered = filtered.slice().sort((a, b) => b.price - a.price);
    } else if (sort === 'name') {
      filtered = filtered.slice().sort((a, b) => a.name.localeCompare(b.name, 'ru'));
    }

    $('catalogCount').textContent = state.catalog.length;
    $('catalogEmpty').classList.toggle('hidden', filtered.length > 0);
    catalogGrid.classList.toggle('hidden', filtered.length === 0);

    if (!filtered.length) {
      catalogGrid.innerHTML = '';

      $('catalogEmpty').querySelector('b').textContent =
        state.catalog.length ? 'Ничего не найдено' : 'Пока нет товаров';

      $('catalogEmpty').querySelector('small').textContent =
        state.catalog.length
          ? 'Попробуй другой запрос или категорию.'
          : 'Добавь свои предметы через кнопку в шапке.';

      return;
    }

    $('catalogEmpty').querySelector('b').textContent = 'Пока нет товаров';

    catalogGrid.innerHTML = filtered.map((item) => {
      const targetSelected = selectedTargetId === item.id;

      return `
        <article
          class="catalog-card ${targetSelected ? 'target-selected' : ''}"
          data-select-target="${escapeAttribute(item.id)}"
          tabindex="0"
          role="button"
          aria-label="Выбрать приз ${escapeAttribute(item.name)}"
        >
          <div class="card-image">
            <img
              src="${escapeAttribute(item.image || makeSvgImage('✦'))}"
              alt="${escapeAttribute(item.name)}"
              onerror="this.onerror=null;this.src='${makeSvgImage('✦')}';"
            />
            <span class="card-category-icon">${CATEGORY_SHORT[item.category] || 'ITEM'}</span>
            ${item.featured ? '<span class="card-quantity">RARE</span>' : ''}
          </div>
          <div class="card-info">
            <h3>${escapeHtml(item.name)}</h3>
            <div class="card-price">${formatMoney(item.price)}</div>
          </div>
          <div class="card-actions">
            <button class="mini-action" type="button" data-edit-item="${escapeAttribute(item.id)}" aria-label="Редактировать ${escapeAttribute(item.name)}">✎ Изменить</button>
            <button class="mini-action delete-action" type="button" data-delete-item="${escapeAttribute(item.id)}" aria-label="Удалить ${escapeAttribute(item.name)}">×</button>
          </div>
        </article>
      `;
    }).join('');
  }

  function renderEverything() {
    renderBalanceDisplay();
    renderSourceSelect();
    renderInventory();
    renderCatalog();
    renderStats();
    renderHistory();
    renderGameDisplay();
  }

  function setImage(img, source, name = '') {
    const fallback = makeSvgImage(
      (name || '✦').trim().slice(0, 2).toUpperCase() || '✦'
    );

    img.onerror = () => {
      img.onerror = null;
      img.src = fallback;
    };

    img.src = source || fallback;
  }

  function escapeHtml(value) {
    return String(value ?? '').replace(
      /[&<>"']/g,
      (char) => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[char])
    );
  }

  function escapeAttribute(value) {
    return escapeHtml(value).replace(/`/g, '&#96;');
  }

  function showToast(message, type = '') {
    const toast = $('toast');

    $('toastMessage').textContent = message;
    toast.className = `toast visible ${type}`.trim();

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.className = 'toast';
    }, 3000);
  }

  function openModal(id) {
    const modal = $(id);

    if (!modal) return;

    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';

    const focusable = modal.querySelector('input:not([type=hidden]),select,button');

    if (focusable) {
      setTimeout(() => focusable.focus(), 80);
    }
  }

  function closeModal(id) {
    const modal = $(id);

    if (!modal) return;

    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');

    if (!document.querySelector('.modal-backdrop.open')) {
      document.body.style.overflow = '';
    }
  }

  function setChance(chance) {
    selectedChance = Number(chance) || 35;
    manualTargetSelection = false;

    document.querySelectorAll('[data-chance]').forEach((button) => {
      button.classList.toggle(
        'selected',
        Number(button.dataset.chance) === selectedChance
      );
    });

    chooseTargetForChance();
    renderCatalog();
    renderGameDisplay();
  }

  function selectTarget(id) {
    const item = getCatalogItem(id);
    const source = getSource();

    if (!item) return;

    if (!source || source.price < 1) {
      showToast('Сначала укажи сумму ставки.', 'error');
      return;
    }

    if (item.price <= source.price) {
      showToast(
        'Приз должен стоить дороже ставки. Выбери шанс поменьше или другой приз.',
        'error'
      );
      return;
    }

    targetMode = 'item';
    manualTargetSelection = true;

    document.querySelectorAll('[data-target-mode]').forEach((button) => {
      button.classList.toggle('active', button.dataset.targetMode === targetMode);
    });

    selectedTargetId = item.id;

    renderCatalog();
    renderGameDisplay();
    showToast(`Выбран приз: ${item.name}`);
  }

  function selectInventorySource(id) {
    const item = getInventoryItem(id);

    if (!item) return;

    selectedSourceEntryId = item.itemId;
    sourceInventorySelect.value = selectedSourceEntryId;

    setSourceMode('inventory');

    $('sourceCard').scrollIntoView({
      behavior: 'smooth',
      block: 'nearest'
    });

    showToast(`Ставка из инвентаря: ${item.name}`);
  }

  function addInventory(item, qty = 1) {
    const existing = state.inventory.find((entry) => entry.itemId === item.id);

    if (existing) {
      existing.qty += qty;
      existing.name = item.name;
      existing.category = item.category;
      existing.price = item.price;
      existing.image = item.image;
      existing.description = item.description || '';
    } else {
      state.inventory.unshift({
        itemId: item.id,
        name: item.name,
        category: item.category,
        price: item.price,
        image: item.image || '',
        description: item.description || '',
        qty
      });
    }
  }

  function consumeInventory(itemId, qty = 1) {
    const entry = getInventoryItem(itemId);

    if (!entry) return;

    entry.qty -= qty;

    if (entry.qty <= 0) {
      state.inventory = state.inventory.filter((item) => item.itemId !== itemId);
    }

    if (!getInventoryItem(selectedSourceEntryId)) {
      selectedSourceEntryId = state.inventory[0]?.itemId || '';
    }
  }

  function renderRollCards(finalItem, win) {
    const list = [];
    const pool = state.catalog.filter((item) => item.id !== finalItem.id);
    const count = 24;

    for (let i = 0; i < count; i++) {
      const source = pool.length
        ? pool[Math.floor(Math.random() * pool.length)]
        : finalItem;

      list.push({ ...source, kind: 'normal' });
    }

    const finalIndex = count - 2;

    list[finalIndex] = win
      ? { ...finalItem, kind: 'target' }
      : {
        id: 'miss-outcome',
        name: 'НЕУДАЧА',
        category: 'item',
        price: 0,
        image: '',
        description: 'Не выпало',
        kind: 'fail'
      };

    reelTrack.innerHTML = list.map((item) => {
      if (item.kind === 'fail') {
        return '<div class="reel-card is-fail"><span class="reel-emoji">☠</span></div>';
      }

      return `
        <div class="reel-card ${item.kind === 'target' ? 'is-target' : ''}">
          ${item.image
            ? `<img src="${escapeAttribute(item.image)}" alt="" onerror="this.onerror=null;this.src='${makeSvgImage('✦')}';" />`
            : '<span class="reel-emoji">✦</span>'}
        </div>
      `;
    }).join('');

    return finalIndex;
  }

  function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function spinReel(finalItem, win) {
    const finalIndex = renderRollCards(finalItem, win);

    reelTrack.style.transition = 'none';
    reelTrack.style.transform = 'translateX(0px)';

    void reelTrack.offsetWidth;

    const cards = reelTrack.querySelectorAll('.reel-card');
    const finalCard = cards[finalIndex];

    const shift =
      finalCard.offsetLeft -
      (reelWrap.clientWidth / 2 - finalCard.offsetWidth / 2);

    requestAnimationFrame(() => {
      reelTrack.style.transition = 'transform 3.25s cubic-bezier(.08,.69,.06,1)';
      reelTrack.style.transform = `translateX(-${Math.max(0, shift)}px)`;
    });

    $('chanceOrbit').classList.add('is-spinning');
    reelWrap.classList.add('reel-spinning');

    await wait(3450);

    $('chanceOrbit').classList.remove('is-spinning');
    reelWrap.classList.remove('reel-spinning');
  }

  async function runUpgrade() {
    if (isSpinning) return;

    const source = getSource();
    const target = getTarget();

    if (!source || source.price < 1) {
      showToast('Введи корректную сумму ставки.', 'error');
      return;
    }

    if (source.sourceType === 'balance' && source.price > state.balance) {
      showToast(
        'На балансе недостаточно денег. Пополни баланс или уменьши ставку.',
        'error'
      );
      return;
    }

    if (source.sourceType === 'inventory' && !getInventoryItem(source.itemId)) {
      showToast('Предмет уже отсутствует в инвентаре.', 'error');
      return;
    }

    if (!target) {
      showToast('Нет подходящего приза. Добавь товар или выбери другой приз.', 'error');
      return;
    }

    if (target.price <= source.price) {
      showToast('Приз должен стоить дороже ставки.', 'error');
      return;
    }

    // Рассчитываем шанс и фиксируем результат один раз до начала анимации.
    const chance = actualChance(source, target);

    if (!(chance > 0 && chance < 100)) {
      showToast('Не удалось рассчитать шанс. Выбери другой приз.', 'error');
      return;
    }

    const roll = new Uint32Array(1);

    const randomPercent =
      (window.crypto && window.crypto.getRandomValues)
        ? (window.crypto.getRandomValues(roll)[0] / 4294967296) * 100
        : Math.random() * 100;

    const win = randomPercent < chance;

    isSpinning = true;
    document.body.classList.add('upgrade-busy');
    upgradeButton.disabled = true;

    upgradeButton.innerHTML =
      '<span class="upgrade-icon">↻</span><span>ИДЁТ ПРОКРУТКА</span><span class="upgrade-arrow">…</span>';

    document.querySelectorAll(
      '[data-chance], [data-source-mode], [data-target-mode], [data-select-target], [data-select-inventory], [data-use-inventory]'
    ).forEach((el) => {
      if (el.tagName === 'BUTTON') el.disabled = true;
    });

    // Ставка списывается сразу при запуске прокрутки.
    if (source.sourceType === 'balance') {
      state.balance = Math.max(0, state.balance - source.price);
    } else {
      consumeInventory(source.itemId, 1);
    }

    saveState();
    renderBalanceDisplay();
    renderInventory();
    renderSourceSelect();

    try {
      await spinReel(target, win);

      state.stats.attempts += 1;

      if (win) {
        state.stats.wins += 1;

        if (target.isCashPrize) {
          state.balance += target.price;
        } else {
          addInventory(target, 1);
        }

        if (target.price > (Number(state.stats.bestPrizeValue) || 0)) {
          state.stats.bestPrizeValue = target.price;
          state.stats.bestPrizeName = target.name;
        }
      } else {
        state.stats.losses += 1;
      }

      state.history.unshift({
        time: Date.now(),
        win,
        sourceName: source.name,
        sourcePrice: source.price,
        targetName: target.name,
        targetPrice: target.price,
        targetImage: target.image || '',
        chance: Number(chance.toFixed(4))
      });

      state.history = state.history.slice(0, 30);

      saveState();

      selectedSourceEntryId = state.inventory[0]?.itemId || '';

      renderEverything();
      showResult(target, win, source, chance);
    } catch (error) {
      console.error('Ошибка прокрутки:', error);

      showToast(
        'Прокрутка завершилась с ошибкой. Ставка уже списана; обнови страницу и проверь результат.',
        'error'
      );

      saveState();
      renderEverything();
    } finally {
      isSpinning = false;
      document.body.classList.remove('upgrade-busy');

      upgradeButton.innerHTML =
        '<span class="upgrade-icon">↗</span><span>ПРОКРУТИТЬ</span><span class="upgrade-arrow">➜</span>';

      document.querySelectorAll(
        '[data-chance], [data-source-mode], [data-target-mode], [data-select-target], [data-select-inventory], [data-use-inventory]'
      ).forEach((el) => {
        if (el.tagName === 'BUTTON') el.disabled = false;
      });

      renderEverything();
    }
  }

  function showResult(target, win, source, chance) {
    const modal = $('resultModal');

    modal.querySelector('.result-modal')?.classList.toggle('is-loss', !win);

    $('resultBurst').textContent = win ? '✦' : '☠';
    $('resultStatus').textContent = win ? 'UPGRADE SUCCESSFUL' : 'UPGRADE FAILED';
    $('resultTitle').textContent = win ? 'ПОБЕДА!' : 'НЕУДАЧА';

    $('resultSubtitle').textContent = win
      ? (
        target.isCashPrize
          ? `Выигрыш ${formatMoney(target.price)} зачислен на баланс.`
          : `Ты выиграл ${target.name}. Приз добавлен в инвентарь.`
      )
      : `Ставка ${formatMoney(source.price)} потеряна. Попробуй ещё раз.`;

    setImage($('resultImage'), target.image, target.name);

    $('resultCategory').textContent =
      `${CATEGORY_LABELS[target.category] || 'ПРИЗ'} · ШАНС ${chance.toFixed(2)}%`;

    $('resultItemName').textContent = target.name;
    $('resultItemPrice').textContent = formatMoney(target.price);

    openModal('resultModal');
  }

  function sellProperty(itemId) {
    const item = getInventoryItem(itemId);

    if (!item) return;

    if (item.category !== 'property') {
      showToast('Продавать можно только предметы категории «Имущество».', 'error');
      return;
    }

    const accepted = window.confirm(
      `Продать «${item.name}» за ${formatMoney(item.price)}?`
    );

    if (!accepted) return;

    state.balance += item.price;
    consumeInventory(itemId, 1);

    saveState();
    renderEverything();

    showToast(`Продано: ${item.name} · +${formatMoney(item.price)}`, 'success');
  }

  function openProductEditor(id = '') {
    const item = id ? getCatalogItem(id) : null;

    $('productForm').reset();
    $('productId').value = item ? item.id : '';

    $('productModalTitle').textContent =
      item ? 'Редактировать товар' : 'Добавить товар';

    $('saveProductButton').innerHTML = item
      ? 'Сохранить изменения <span>↗</span>'
      : 'Сохранить товар <span>↗</span>';

    $('productName').value = item?.name || '';
    $('productCategory').value = item?.category || 'vehicle';
    $('productPrice').value = item?.price || '';

    $('productImageUrl').value =
      item && /^https?:\/\//i.test(item.image || '')
        ? item.image
        : '';

    $('productDescription').value = item?.description || '';

    pendingUploadedImage = '';
    editingCurrentImage = item?.image || '';

    $('productImageFile').value = '';
    $('imageUploadStatus').textContent = '';

    updateProductPreview();
    openModal('productModal');
  }

  function updateProductPreview() {
    const name = $('productName').value.trim() || 'Название товара';
    const price = Number($('productPrice').value) || 0;

    const image =
      pendingUploadedImage ||
      $('productImageUrl').value.trim() ||
      editingCurrentImage ||
      makeSvgImage('✦');

    $('productPreviewName').textContent = name;
    $('productPreviewPrice').textContent = formatMoney(price);

    setImage($('productPreviewImage'), image, name);
  }

  function compressImageFile(file) {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        return reject(new Error('Выбери файл изображения.'));
      }

      if (file.size > 12 * 1024 * 1024) {
        return reject(new Error('Файл больше 12 МБ. Выбери фото поменьше.'));
      }

      const reader = new FileReader();

      reader.onerror = () => reject(new Error('Не удалось прочитать изображение.'));

      reader.onload = () => {
        const img = new Image();

        img.onerror = () => reject(new Error('Файл не удалось обработать как изображение.'));

        img.onload = () => {
          const maxSize = 1000;
          const scale = Math.min(1, maxSize / Math.max(img.width, img.height));

          const canvas = document.createElement('canvas');

          canvas.width = Math.max(1, Math.round(img.width * scale));
          canvas.height = Math.max(1, Math.round(img.height * scale));

          const ctx = canvas.getContext('2d');

          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

          try {
            resolve(canvas.toDataURL('image/jpeg', 0.78));
          } catch (error) {
            reject(new Error('Не получилось сжать фото. Попробуй другое изображение.'));
          }
        };

        img.src = String(reader.result);
      };

      reader.readAsDataURL(file);
    });
  }

  function saveProduct(event) {
    event.preventDefault();

    const editingId = $('productId').value.trim();
    const name = $('productName').value.trim();
    const category = $('productCategory').value;
    const price = Math.round(Number($('productPrice').value));
    const imageUrl = $('productImageUrl').value.trim();
    const description = $('productDescription').value.trim();

    if (
      !name ||
      !CATEGORY_LABELS[category] ||
      !Number.isFinite(price) ||
      price < 1
    ) {
      showToast('Заполни название, категорию и корректную цену.', 'error');
      return;
    }

    const existing = editingId ? getCatalogItem(editingId) : null;

    const image =
      pendingUploadedImage ||
      imageUrl ||
      existing?.image ||
      '';

    const newItem = normalizeItem({
      id: existing ? existing.id : makeId(),
      name,
      category,
      price,
      image,
      description,
      featured: existing?.featured || false
    });

    if (existing) {
      state.catalog = state.catalog.map((item) =>
        item.id === existing.id ? newItem : item
      );

      state.inventory = state.inventory.map((entry) =>
        entry.itemId === existing.id
          ? {
            ...entry,
            name: newItem.name,
            category: newItem.category,
            price: newItem.price,
            image: newItem.image,
            description: newItem.description
          }
          : entry
      );

      showToast(`Изменения сохранены: ${name}`, 'success');
    } else {
      state.catalog.push(newItem);
      showToast(`Добавлен товар: ${name}`, 'success');
    }

    closeModal('productModal');
    saveState();

    if (!selectedTargetId || !getCatalogItem(selectedTargetId)) {
      chooseTargetForChance();
    }

    renderEverything();
  }

  function deleteCatalogItem(id) {
    const item = getCatalogItem(id);

    if (!item) return;

    const accepted = window.confirm(
      `Удалить «${item.name}» из каталога призов? Уже выигранный предмет в инвентаре останется.`
    );

    if (!accepted) return;

    state.catalog = state.catalog.filter((entry) => entry.id !== id);

    if (selectedTargetId === id) {
      selectedTargetId = null;
      manualTargetSelection = false;
    }

    saveState();
    chooseTargetForChance();
    renderEverything();

    showToast(`Товар «${item.name}» удалён из каталога.`);
  }

  function setCategoryFilter(category) {
    selectedCategoryFilter = category;

    document.querySelectorAll('[data-category-filter]').forEach((button) => {
      button.classList.toggle('active', button.dataset.categoryFilter === category);
    });

    renderCatalog();
  }

  function doDeposit() {
    const amount = Math.floor(Number($('depositAmount').value));

    if (!Number.isFinite(amount) || amount < 1) {
      showToast('Введи сумму пополнения больше нуля.', 'error');
      return;
    }

    if (amount > 1000000000000) {
      showToast('Сумма слишком большая.', 'error');
      return;
    }

    state.balance += amount;

    saveState();
    closeModal('depositModal');

    $('depositAmount').value = '';

    if (sourceMode === 'balance' && Number(stakeAmount.value) > state.balance) {
      stakeAmount.value = state.balance;
    }

    renderBalanceDisplay();
    renderGameDisplay();

    showToast(`Баланс пополнен на ${formatMoney(amount)}.`, 'success');
  }

  function resetSession() {
    const accepted = window.confirm(
      'Сбросить статистику и историю апгрейдов? Баланс, товары и инвентарь останутся.'
    );

    if (!accepted) return;

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

    showToast('Статистика и история сброшены.');
  }

  function initializeEvents() {
    $('depositButton').addEventListener('click', () => openModal('depositModal'));
    $('addItemButton').addEventListener('click', () => openProductEditor());
    $('emptyAddItemButton').addEventListener('click', () => openProductEditor());
    $('confirmDepositButton').addEventListener('click', doDeposit);

    $('depositAmount').addEventListener('keydown', (event) => {
      if (event.key === 'Enter') doDeposit();
    });

    document.querySelectorAll('[data-deposit-amount]').forEach((button) => {
      button.addEventListener('click', () => {
        $('depositAmount').value = button.dataset.depositAmount;
      });
    });

    document.querySelectorAll('[data-close-modal]').forEach((button) => {
      button.addEventListener('click', () => closeModal(button.dataset.closeModal));
    });

    document.querySelectorAll('.modal-backdrop').forEach((modal) => {
      modal.addEventListener('mousedown', (event) => {
        if (
          event.target === modal &&
          modal.id !== 'resultModal' &&
          modal.id !== 'productModal'
        ) {
          closeModal(modal.id);
        }
      });
    });

    $('closeResultButton').addEventListener('click', () => closeModal('resultModal'));

    document.querySelectorAll('[data-source-mode]').forEach((button) => {
      button.addEventListener('click', () => setSourceMode(button.dataset.sourceMode));
    });

    document.querySelectorAll('[data-chance]').forEach((button) => {
      button.addEventListener('click', () => setChance(button.dataset.chance));
    });

    document.querySelectorAll('[data-target-mode]').forEach((button) => {
      button.addEventListener('click', () => setTargetMode(button.dataset.targetMode));
    });

    stakeAmount.addEventListener('input', () => {
      chooseTargetForChance();
      renderGameDisplay();
      renderCatalog();
    });

    $('maxStakeButton').addEventListener('click', () => {
      stakeAmount.value = Math.floor(state.balance);
      chooseTargetForChance();
      renderGameDisplay();
      renderCatalog();
    });

    sourceInventorySelect.addEventListener('change', () => {
      selectedSourceEntryId = sourceInventorySelect.value;
      chooseTargetForChance();
      renderGameDisplay();
      renderInventory();
    });

    upgradeButton.addEventListener('click', runUpgrade);

    $('choosePrizeButton').addEventListener('click', () => {
      setTargetMode('item');

      $('catalogSection').scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });

      showToast('Нажми на карточку в каталоге, чтобы выбрать приз.');
    });

    inventoryGrid.addEventListener('click', (event) => {
      const sellButton = event.target.closest('[data-sell-item]');

      if (sellButton) {
        event.stopPropagation();
        sellProperty(sellButton.dataset.sellItem);
        return;
      }

      const useButton = event.target.closest('[data-use-inventory]');

      if (useButton) {
        event.stopPropagation();
        selectInventorySource(useButton.dataset.useInventory);
        return;
      }

      const card = event.target.closest('[data-select-inventory]');

      if (card) {
        selectInventorySource(card.dataset.selectInventory);
      }
    });

    inventoryGrid.addEventListener('keydown', (event) => {
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        event.target.matches('[data-select-inventory]')
      ) {
        event.preventDefault();
        selectInventorySource(event.target.dataset.selectInventory);
      }
    });

    catalogGrid.addEventListener('click', (event) => {
      const editButton = event.target.closest('[data-edit-item]');

      if (editButton) {
        event.stopPropagation();
        openProductEditor(editButton.dataset.editItem);
        return;
      }

      const deleteButton = event.target.closest('[data-delete-item]');

      if (deleteButton) {
        event.stopPropagation();
        deleteCatalogItem(deleteButton.dataset.deleteItem);
        return;
      }

      const card = event.target.closest('[data-select-target]');

      if (card) {
        selectTarget(card.dataset.selectTarget);
      }
    });

    catalogGrid.addEventListener('keydown', (event) => {
      if (
        (event.key === 'Enter' || event.key === ' ') &&
        event.target.matches('[data-select-target]')
      ) {
        event.preventDefault();
        selectTarget(event.target.dataset.selectTarget);
      }
    });

    document.querySelectorAll('[data-category-filter]').forEach((button) => {
      button.addEventListener('click', () => setCategoryFilter(button.dataset.categoryFilter));
    });

    $('inventorySearch').addEventListener('input', renderInventory);
    $('inventoryFilter').addEventListener('change', renderInventory);
    $('catalogSearch').addEventListener('input', renderCatalog);
    $('catalogSort').addEventListener('change', renderCatalog);

    $('clearHistoryButton').addEventListener('click', () => {
      if (!state.history.length) {
        showToast('История уже пустая.');
        return;
      }

      state.history = [];

      saveState();
      renderHistory();

      showToast('История очищена.');
    });

    $('resetSessionButton').addEventListener('click', resetSession);
    $('productForm').addEventListener('submit', saveProduct);

    ['productName', 'productPrice', 'productImageUrl'].forEach((id) => {
      $(id).addEventListener('input', () => {
        if (id === 'productImageUrl' && $('productImageUrl').value.trim()) {
          pendingUploadedImage = '';
        }

        updateProductPreview();
      });
    });

    $('productDescription').addEventListener('input', updateProductPreview);

    $('productImageFile').addEventListener('change', async (event) => {
      const file = event.target.files?.[0];

      if (!file) return;

      $('imageUploadStatus').textContent = 'Обрабатываю фото…';

      try {
        pendingUploadedImage = await compressImageFile(file);
        $('productImageUrl').value = '';

        $('imageUploadStatus').textContent =
          `Фото готово (${Math.max(1, Math.round(pendingUploadedImage.length / 1024))} КБ в данных).`;

        updateProductPreview();
      } catch (error) {
        pendingUploadedImage = '';
        $('imageUploadStatus').textContent =
          error.message || 'Не удалось загрузить фото.';
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape') {
        const opened = document.querySelector('.modal-backdrop.open');

        if (
          opened &&
          opened.id !== 'resultModal' &&
          opened.id !== 'productModal'
        ) {
          closeModal(opened.id);
        } else if (opened?.id === 'resultModal') {
          closeModal('resultModal');
        }
      }
    });
  }

  function bootstrap() {
    if (!localStorage.getItem(STORAGE_KEY)) {
      saveState();
    }

    stakeAmount.value = String(Math.min(state.balance, 4000000) || 4000000);

    document.querySelectorAll('[data-chance]').forEach((button) => {
      button.classList.toggle(
        'selected',
        Number(button.dataset.chance) === selectedChance
      );
    });

    document.querySelectorAll('[data-target-mode]').forEach((button) => {
      button.classList.toggle('active', button.dataset.targetMode === targetMode);
    });

    renderEverything();
    chooseTargetForChance();
    renderGameDisplay();
    initializeEvents();

    // Сохраняем стандартный каталог и изменения пользователя между перезагрузками.
    saveState();
  }

  bootstrap();
})();

