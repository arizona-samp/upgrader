
(() => {
  'use strict';

  const KEY = 'gta_upgrader_halloween_v1';

  const CATEGORIES = {
    vehicle: { name: 'Машины', short: 'АВТО' },
    accessory: { name: 'Аксессуары', short: 'ITEM' },
    resource: { name: 'Ресурсы', short: 'DROP' },
    property: { name: 'Недвижимость', short: 'HOME' },
    business: { name: 'Бизнесы', short: 'BIZ' }
  };

  const $ = id => document.getElementById(id);

  function placeholder(text = '✦', accent = '#f3a34a') {
    const safe = String(text).replace(/[&<>"']/g, '');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 400"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="#34271c"/><stop offset="1" stop-color="#111114"/></linearGradient></defs><rect width="600" height="400" fill="url(#g)"/><circle cx="300" cy="170" r="190" fill="${accent}" opacity=".08"/><text x="300" y="220" text-anchor="middle" font-family="Arial" font-size="90" font-weight="bold" fill="${accent}">${safe}</text><text x="300" y="350" text-anchor="middle" font-family="Arial" font-size="20" letter-spacing="5" fill="#c9b7a3">UPGRADER</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  const DEFAULT_CATALOG = [
    { id: 'bmw-m5', name: 'BMW M5 CS', category: 'vehicle', price: 30000000, image: 'https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=800&q=80', featured: true },
    { id: 'lambo', name: 'Lamborghini Aventador', category: 'vehicle', price: 50000000, image: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&w=800&q=80' },
    { id: 'bugatti', name: 'Bugatti Divo', category: 'vehicle', price: 120000000, image: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80', featured: true },
    { id: 'gold-watch', name: 'Золотые часы', category: 'accessory', price: 5000000, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80' },
    { id: 'witch-ring', name: 'Кольцо «Ведьма»', category: 'accessory', price: 10000000, image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80', featured: true },
    { id: 'mystery-case', name: 'Mystery Case', category: 'resource', price: 2000000, image: placeholder('CASE') },
    { id: 'pumpkin', name: 'Тыква-сокровище', category: 'resource', price: 8000000, image: placeholder('✦'), featured: true },
    { id: 'flat', name: 'Квартира в центре', category: 'property', price: 15000000, image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=800&q=80' },
    { id: 'mansion', name: 'Хэллоуин-особняк', category: 'property', price: 70000000, image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80', featured: true },
    { id: 'gas-station', name: 'Автозаправка', category: 'business', price: 45000000, image: 'https://images.unsplash.com/photo-1545262810-77515befe149?auto=format&fit=crop&w=800&q=80' },
    { id: 'club', name: 'Ночной клуб', category: 'business', price: 85000000, image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80' }
  ];

  function initialState() {
    return {
      balance: 4000000,
      catalog: DEFAULT_CATALOG.map(item => ({ ...item })),
      inventory: [],
      stats: { attempts: 0, wins: 0, losses: 0 },
      history: []
    };
  }

  function load() {
    try {
      const data = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (!data) return initialState();

      const fallback = initialState();

      return {
        balance: Math.max(0, Number(data.balance) || 0),
        catalog: Array.isArray(data.catalog) ? data.catalog.filter(validProduct).map(normalizeProduct) : fallback.catalog,
        inventory: Array.isArray(data.inventory) ? data.inventory.filter(x => x && Number(x.qty) > 0).map(normalizeInventory) : [],
        stats: { ...fallback.stats, ...(data.stats || {}) },
        history: Array.isArray(data.history) ? data.history.slice(0, 30) : []
      };
    } catch (error) {
      console.warn('Не удалось прочитать сохранение:', error);
      return initialState();
    }
  }

  let state = load();
  let mode = 'cash';
  let selectedCategory = 'all';
  let selectedTargetId = null;
  let spinning = false;
  let toastTimer = null;

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      return true;
    } catch (error) {
      notify('Не удалось сохранить данные. Попробуй фото меньшего размера.', 'error');
      return false;
    }
  }

  function validProduct(item) {
    return item && typeof item.name === 'string' && item.name.trim() &&
      CATEGORIES[item.category] && Number(item.price) > 0;
  }

  function normalizeProduct(item) {
    return {
      id: String(item.id || makeId()),
      name: String(item.name || 'Предмет').trim(),
      category: CATEGORIES[item.category] ? item.category : 'resource',
      price: Math.max(1, Math.round(Number(item.price) || 1)),
      image: typeof item.image === 'string' ? item.image : '',
      description: String(item.description || ''),
      featured: Boolean(item.featured)
    };
  }

  function normalizeInventory(item) {
    return {
      id: String(item.id || makeId()),
      name: String(item.name || 'Предмет'),
      category: CATEGORIES[item.category] ? item.category : 'resource',
      price: Math.max(1, Number(item.price) || 1),
      image: String(item.image || ''),
      qty: Math.max(1, Math.floor(Number(item.qty) || 1))
    };
  }

  function makeId() {
    return 'p-' + Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
  }

  function money(value, symbol = true) {
    const n = Math.max(0, Math.round(Number(value) || 0));
    const formatted = n.toLocaleString('ru-RU').replace(/\u00a0/g, ' ');
    return symbol ? `₽ ${formatted}` : formatted;
  }

  function esc(value) {
    return String(value ?? '').replace(/[&<>"']/g, c => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
  }

  function productById(id) {
    return state.catalog.find(item => item.id === id) || null;
  }

  function chance() {
    const stake = Math.floor(Number($('stakeAmount').value));
    let prize = 0;

    if (mode === 'cash') {
      prize = Math.floor(Number($('cashTargetAmount').value));
    } else {
      prize = productById(selectedTargetId)?.price || 0;
    }

    if (!Number.isFinite(stake) || !Number.isFinite(prize) || stake <= 0 || prize <= stake) {
      return 0;
    }

    return Math.min(100, stake / prize * 100);
  }

  function targetInfo() {
    if (mode === 'cash') {
      const amount = Math.floor(Number($('cashTargetAmount').value));
      return {
        id: 'cash-prize',
        name: 'Наличные',
        category: 'resource',
        price: amount,
        image: placeholder('₽'),
        isCash: true
      };
    }

    return productById(selectedTargetId);
  }

  function updateGame() {
    const stake = Math.floor(Number($('stakeAmount').value)) || 0;
    const target = targetInfo();
    const winChance = chance();
    const valid = stake > 0 && stake <= state.balance && target && target.price > stake;

    $('balanceValue').textContent = money(state.balance, false);
    $('sourcePrice').textContent = money(stake);
    $('mathStake').textContent = money(stake);

    $('chanceValue').textContent = winChance ? winChance.toFixed(2) + '%' : '—';
    $('chanceCaption').textContent = winChance ? winChance.toFixed(2) + '%' : '—';
    $('chanceCircle').style.setProperty('--chance', winChance + '%');

    if (target) {
      $('targetName').textContent = target.name;
      $('targetCategory').textContent = target.isCash ? 'НАЛИЧНЫЕ' : CATEGORIES[target.category].name.toUpperCase();
      $('targetPrice').textContent = target.price > 0 ? money(target.price) : '—';
      $('targetFooterPrice').textContent = target.price > 0 ? money(target.price) : '—';
      $('targetDetails').textContent = target.isCash ? 'Будет зачислено на баланс' : 'Будет добавлен в инвентарь';
      $('chosenTargetName').textContent = target.name;
      $('chosenTargetPrice').textContent = money(target.price);
      setImage($('targetImage'), target.image || placeholder('✦'));
    } else {
      $('targetName').textContent = 'Выбери предмет';
      $('targetCategory').textContent = 'КАТАЛОГ ПРИЗОВ';
      $('targetPrice').textContent = '—';
      $('targetFooterPrice').textContent = '—';
      $('targetDetails').textContent = 'Выбери подходящий предмет в магазине';
      $('chosenTargetName').textContent = 'Выбери предмет в магазине';
      $('chosenTargetPrice').textContent = '—';
      setImage($('targetImage'), placeholder('?'));
    }

    const multiplier = stake > 0 && target && target.price > 0 ? target.price / stake : 0;
    $('multiplier').textContent = multiplier ? '×' + multiplier.toFixed(2) : '×—';
    $('mathMultiplier').textContent = multiplier ? '×' + multiplier.toFixed(2) : '×—';
    $('mathChance').textContent = winChance ? winChance.toFixed(2) + '%' : '—';

    $('upgradeButton').disabled = spinning || !valid;
    renderBalanceAndCounts();
  }

  function setImage(img, src) {
    img.onerror = () => {
      img.onerror = null;
      img.src = placeholder('✦');
    };
    img.src = src || placeholder('✦');
  }

  function renderBalanceAndCounts() {
    $('balanceValue').textContent = money(state.balance, false);
    $('inventoryCount').textContent = state.inventory.reduce((sum, item) => sum + item.qty, 0);
    $('catalogCount').textContent = state.catalog.length;
  }

  function renderInventory() {
    const query = $('inventorySearch').value.trim().toLowerCase();
    const items = state.inventory.filter(item => !query || item.name.toLowerCase().includes(query));

    $('inventoryEmpty').classList.toggle('hidden', items.length > 0);
    $('inventoryGrid').classList.toggle('hidden', items.length === 0);

    $('inventoryGrid').innerHTML = items.map(item => `
      <article class="item-card">
        <div class="card-image">
          <img src="${esc(item.image || placeholder('✦'))}" alt="${esc(item.name)}">
          <span class="card-tag">${CATEGORIES[item.category]?.short || 'DROP'}</span>
        </div>
        <div class="card-info">
          <h3>${esc(item.name)}${item.qty > 1 ? ' ×' + item.qty : ''}</h3>
          <div class="card-price">${money(item.price)}</div>
        </div>
        <div class="card-actions">
          <button class="mini-btn" data-sell="${esc(item.id)}">Продать</button>
        </div>
      </article>
    `).join('');

    $('inventoryGrid').querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
      img.onerror = null;
      img.src = placeholder('✦');
    }));
  }

  function renderShop() {
    const query = $('shopSearch').value.trim().toLowerCase();
    const items = state.catalog.filter(item =>
      (selectedCategory === 'all' || item.category === selectedCategory) &&
      (!query || item.name.toLowerCase().includes(query) || item.description.toLowerCase().includes(query))
    );

    $('shopEmpty').classList.toggle('hidden', items.length > 0);
    $('shopGrid').classList.toggle('hidden', items.length === 0);

    $('shopGrid').innerHTML = items.map(item => `
      <article class="item-card ${mode === 'item' && selectedTargetId === item.id ? 'chosen' : ''}">
        <div class="card-image">
          <img src="${esc(item.image || placeholder('✦'))}" alt="${esc(item.name)}">
          <span class="card-tag">${CATEGORIES[item.category].short}</span>
        </div>
        <div class="card-info">
          <h3>${esc(item.name)}</h3>
          <div class="card-price">${money(item.price)}</div>
        </div>
        <div class="card-actions">
          <button class="mini-btn" data-select="${esc(item.id)}">Выбрать</button>
          <button class="mini-btn" data-edit="${esc(item.id)}">✎</button>
          <button class="mini-btn delete" data-delete="${esc(item.id)}">×</button>
        </div>
      </article>
    `).join('');

    $('shopGrid').querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
      img.onerror = null;
      img.src = placeholder('✦');
    }));

    $('categoryFilters').querySelectorAll('[data-category]').forEach(button => {
      button.classList.toggle('active', button.dataset.category === selectedCategory);
    });
  }

  function renderStats() {
    const s = state.stats;
    $('winsValue') && ($('winsValue').textContent = s.wins);
    $('lossesValue') && ($('lossesValue').textContent = s.losses);
  }

  function renderAll() {
    renderBalanceAndCounts();
    renderInventory();
    renderShop();
    renderHistory();
    updateGame();
  }

  function renderHistory() {
    $('historyList') && ($('historyList').innerHTML = state.history.length
      ? state.history.slice(0, 8).map(item => `<div class="history-row">${esc(item.name)} — ${item.win ? 'Успех' : 'Неудача'}</div>`).join('')
      : '<div class="empty-history">История пока пуста.</div>');
  }

  function toast(message, type = '') {
    const el = $('toast');
    el.textContent = message;
    el.className = `toast show ${type}`.trim();

    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.className = 'toast', 2600);
  }

  function notify(message, type = '') {
    toast(message, type);
  }

  function openModal(id) {
    $(id).classList.add('open');
    $(id).setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal(id) {
    $(id).classList.remove('open');
    $(id).setAttribute('aria-hidden', 'true');
    if (!document.querySelector('.modal-backdrop.open')) document.body.style.overflow = '';
  }

  function chooseMode(newMode) {
    mode = newMode;

    document.querySelectorAll('[data-mode]').forEach(button => {
      button.classList.toggle('active', button.dataset.mode === mode);
    });

    $('cashTargetControls').classList.toggle('hidden', mode !== 'cash');
    $('itemTargetControls').classList.toggle('hidden', mode !== 'item');

    updateGame();
    renderShop();
  }

  function chooseProduct(id) {
    const item = productById(id);
    if (!item) return;

    selectedTargetId = id;
    chooseMode('item');
    updateGame();
    renderShop();
    toast('Выбран приз: ' + item.name);
  }

  function sellItem(id) {
    const item = state.inventory.find(x => x.id === id);
    if (!item) return;

    if (!confirm(`Продать «${item.name}» за ${money(item.price)}?`)) return;

    state.balance += item.price;
    item.qty--;

    if (item.qty <= 0) state.inventory = state.inventory.filter(x => x.id !== id);

    save();
    renderAll();
    toast('Предмет продан. Баланс пополнен.', 'success');
  }

  function renderReel(target, won) {
    const pool = state.catalog.length ? state.catalog : [];
    const cards = [];

    for (let i = 0; i < 24; i++) {
      const item = pool.length ? pool[Math.floor(Math.random() * pool.length)] : target;
      cards.push(item);
    }

    const finalIndex = 22;
    cards[finalIndex] = won ? target : null;

    $('reelTrack').innerHTML = cards.map(item => item
      ? `<div class="reel-card"><img src="${esc(item.image || placeholder('✦'))}" alt=""></div>`
      : '<div class="reel-card is-fail">×</div>'
    ).join('');

    $('reelTrack').querySelectorAll('img').forEach(img => img.addEventListener('error', () => {
      img.onerror = null;
      img.src = placeholder('✦');
    }));

    if (cards[finalIndex]) {
      $('reelTrack').children[finalIndex].classList.add('is-target');
    }

    return finalIndex;
  }

  function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function spin(target, won) {
    const index = renderReel(target, won);
    const track = $('reelTrack');
    const card = track.children[index];

    track.style.transition = 'none';
    track.style.transform = 'translateX(0px)';
    void track.offsetWidth;

    const shift = card.offsetLeft - ($('reelWrap').clientWidth / 2 - card.offsetWidth / 2);

    requestAnimationFrame(() => {
      track.style.transition = 'transform 3.1s cubic-bezier(.08,.68,.08,1)';
      track.style.transform = `translateX(-${Math.max(0, shift)}px)`;
    });

    await wait(3250);
  }

  async function upgrade() {
    if (spinning) return;

    const stake = Math.floor(Number($('stakeAmount').value));
    const target = targetInfo();

    if (!Number.isFinite(stake) || stake < 1) return toast('Введи корректную сумму ставки.', 'error');
    if (stake > state.balance) return toast('Недостаточно денег на балансе.', 'error');
    if (!target || !Number.isFinite(target.price) || target.price <= stake) {
      return toast('Приз должен стоить дороже ставки.', 'error');
    }

    const p = chance();
    if (!(p > 0 && p < 100)) return toast('Не удалось рассчитать шанс.', 'error');

    // Реальный шанс не подменяется: используется отображаемая вероятность.
    const won = Math.random() * 100 < p;

    spinning = true;
    $('upgradeButton').disabled = true;
    $('upgradeButton').innerHTML = '↻ ПРОКРУТКА…';

    try {
      await spin(target, won);

      state.balance -= stake;

      if (won) {
        if (mode === 'cash') {
          state.balance += target.price;
        } else {
          const existing = state.inventory.find(x => x.id === target.id);

          if (existing) {
            existing.qty++;
          } else {
            state.inventory.unshift({
              id: target.id,
              name: target.name,
              category: target.category,
              price: target.price,
              image: target.image || '',
              qty: 1
            });
          }
        }

        state.stats.wins++;
      } else {
        state.stats.losses++;
      }

      state.stats.attempts++;
      state.history.unshift({
        time: Date.now(),
        name: target.name,
        win: won
      });
      state.history = state.history.slice(0, 30);

      save();
      renderAll();
      showResult(target, won, p);
    } finally {
      spinning = false;
      $('upgradeButton').innerHTML = '<span>↻</span> ПРОКРУТИТЬ <b>→</b>';
      updateGame();
    }
  }

  function showResult(target, won, p) {
    $('resultModal').querySelector('.result-modal')?.classList.toggle('is-loss', !won);
    $('resultIcon').textContent = won ? '✦' : '×';
    $('resultTitle').textContent = won ? 'ПОБЕДА!' : 'НЕУДАЧА';
    $('resultKicker').textContent = won ? 'UPGRADE SUCCESSFUL' : 'UPGRADE FAILED';
    $('resultDescription').textContent = won
      ? (mode === 'cash' ? 'Выигрыш зачислен на баланс.' : 'Предмет добавлен в инвентарь.')
      : `Ставка потеряна. Реальный шанс был ${p.toFixed(2)}%.`;

    $('resultName').textContent = target.name;
    $('resultPrice').textContent = money(target.price);
    setImageForResult(target.image || placeholder('✦'));
    openModal('resultModal');
  }

  function setImageForResult(src) {
    const img = $('resultImage');
    img.onerror = () => {
      img.onerror = null;
      img.src = placeholder('✦');
    };
    img.src = src;
  }

  function openEditor(id = '') {
    const item = id ? productById(id) : null;

    $('productForm').reset();
    $('productId').value = item?.id || '';
    $('productModalTitle').textContent = item ? 'Изменить товар' : 'Добавить товар';
    $('productName').value = item?.name || '';
    $('productCategory').value = item?.category || 'vehicle';
    $('productPrice').value = item?.price || '';
    $('productImage').value = item?.image && item.image.startsWith('http') ? item.image : '';
    $('productDescription').value = item?.description || '';

    openModal('productModal');
  }

  function saveProduct(event) {
    event.preventDefault();

    const id = $('productId').value;
    const name = $('productName').value.trim();
    const category = $('productCategory').value;
    const price = Math.floor(Number($('productPrice').value));
    const photo = $('productImage').value.trim();
    const description = $('productDescription').value.trim();

    if (!name || !CATEGORIES[category] || !Number.isFinite(price) || price < 1) {
      return toast('Заполни название, категорию и цену.', 'error');
    }

    const product = {
      id: id || makeId(),
      name,
      category,
      price,
      image: photo || placeholder(name.slice(0, 2).toUpperCase()),
      description,
      featured: false
    };

    if (id) {
      state.catalog = state.catalog.map(x => x.id === id ? product : x);
      state.inventory = state.inventory.map(x =>
        x.id === id ? { ...x, name, category, price, image: product.image } : x
      );
    } else {
      state.catalog.push(product);
    }

    save();
    closeModal('productModal');
    renderAll();
    toast(id ? 'Товар обновлён.' : 'Товар добавлен.', 'success');
  }

  function deleteProduct(id) {
    const item = productById(id);
    if (!item) return;

    if (!confirm(`Удалить «${item.name}» из магазина? Выигранные предметы останутся в инвентаре.`)) return;

    state.catalog = state.catalog.filter(x => x.id !== id);
    if (selectedTargetId === id) selectedTargetId = null;

    save();
    renderAll();
    toast('Товар удалён из магазина.');
  }

  function deposit() {
    const amount = Math.floor(Number($('depositAmount').value));

    if (!Number.isFinite(amount) || amount < 1) return toast('Введи сумму больше нуля.', 'error');
    if (amount > 1e12) return toast('Слишком большая сумма.', 'error');

    state.balance += amount;
    save();
    closeModal('depositModal');
    $('depositAmount').value = '';
    renderAll();
    toast('Баланс пополнен на ' + money(amount), 'success');
  }

  function initEvents() {
    $('depositButton').addEventListener('click', () => openModal('depositModal'));
    $('addItemButton').addEventListener('click', () => openEditor());
    $('confirmDeposit').addEventListener('click', deposit);
    $('upgradeButton').addEventListener('click', upgrade);
    $('productForm').addEventListener('submit', saveProduct);

    $('maxStake').addEventListener('click', () => {
      $('stakeAmount').value = state.balance;
      updateGame();
    });

    $('stakeAmount').addEventListener('input', updateGame);
    $('cashTargetAmount').addEventListener('input', updateGame);
    $('goToShop').addEventListener('click', () => $('shopSection').scrollIntoView({ behavior: 'smooth' }));

    document.querySelectorAll('[data-mode]').forEach(button => {
      button.addEventListener('click', () => {
        mode = button.dataset.mode;

        document.querySelectorAll('[data-mode]').forEach(other => {
          other.classList.toggle('active', other === button);
        });

        $('cashTargetControls').classList.toggle('hidden', mode !== 'cash');
        $('itemTargetControls').classList.toggle('hidden', mode !== 'item');

        updateGame();
        renderShop();
      });
    });

    document.querySelectorAll('[data-amount]').forEach(button => {
      button.addEventListener('click', () => $('depositAmount').value = button.dataset.amount);
    });

    document.querySelectorAll('[data-close]').forEach(button => {
      button.addEventListener('click', () => closeModal(button.dataset.close));
    });

    document.querySelectorAll('.modal-backdrop').forEach(modal => {
      modal.addEventListener('mousedown', event => {
        if (event.target === modal) closeModal(modal.id);
      });
    });

    $('shopGrid').addEventListener('click', event => {
      const select = event.target.closest('[data-select]');
      const edit = event.target.closest('[data-edit]');
      const del = event.target.closest('[data-delete]');

      if (select) {
        selectedTargetId = select.dataset.select;
        mode = 'item';

        document.querySelectorAll('[data-mode]').forEach(button => {
          button.classList.toggle('active', button.dataset.mode === 'item');
        });

        $('cashTargetControls').classList.add('hidden');
        $('itemTargetControls').classList.remove('hidden');

        renderShop();
        updateGame();
        toast('Предмет выбран.');
        return;
      }

      if (edit) return openEditor(edit.dataset.edit);
      if (del) return deleteProduct(del.dataset.delete);
    });

    $('inventoryGrid').addEventListener('click', event => {
      const button = event.target.closest('[data-sell]');
      if (button) sellItem(button.dataset.sell);
    });

    document.querySelectorAll('[data-category]').forEach(button => {
      button.addEventListener('click', () => {
        selectedCategory = button.dataset.category;
        document.querySelectorAll('[data-category]').forEach(other => {
          other.classList.toggle('active', other === button);
        });
        renderShop();
      });
    });

    $('shopSearch').addEventListener('input', renderShop);
    $('inventorySearch').addEventListener('input', renderInventory);
  }

  function init() {
    if (!localStorage.getItem(KEY)) save();

    $('sourcePrice').textContent = money($('stakeAmount').value);
    $('cashTargetAmount').value = '4000000';

    initEvents();
    renderAll();
  }

  init();
})();

