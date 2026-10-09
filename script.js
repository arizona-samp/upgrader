/*
  NOCTURNE GTA Upgrader

  Настройки предметов находятся в массивах INVENTORY и SHOP.
  image — URL изображения.
  emoji — запасной вариант, если фотографии нет.

  Это демо: платежи и серверная защита не подключены.
*/

const START_BALANCE = 25000;

const INVENTORY = [
  {
    id: 'inv1',
    name: 'Тактические перчатки',
    category: 'Аксессуары',
    price: 3200,
    emoji: '🧤',
    rarity: 'RARE'
  },
  {
    id: 'inv2',
    name: 'Золотая цепь',
    category: 'Аксессуары',
    price: 5600,
    emoji: '⛓️',
    rarity: 'EPIC'
  },
  {
    id: 'inv3',
    name: 'Канистра топлива',
    category: 'Ресурсы',
    price: 1800,
    emoji: '⛽',
    rarity: 'COMMON'
  }
];

const SHOP = [
  {
    id: 's1',
    name: 'Кольцо «Ворон»',
    category: 'Аксессуары',
    price: 6400,
    emoji: '💍',
    rarity: 'RARE'
  },
  {
    id: 's2',
    name: 'Маска Ночной охоты',
    category: 'Аксессуары',
    price: 11200,
    emoji: '🎭',
    rarity: 'EPIC'
  },
  {
    id: 's3',
    name: 'Пентхаус Eclipse',
    category: 'Недвижимость',
    price: 125000,
    emoji: '🏙️',
    rarity: 'LEGENDARY'
  },
  {
    id: 's4',
    name: 'Дом на Vinewood',
    category: 'Недвижимость',
    price: 58000,
    emoji: '🏡',
    rarity: 'EPIC'
  },
  {
    id: 's5',
    name: 'Obey 10F',
    category: 'Машины',
    price: 84000,
    emoji: '🏎️',
    rarity: 'LEGENDARY'
  },
  {
    id: 's6',
    name: 'Albany V-STR',
    category: 'Машины',
    price: 47500,
    emoji: '🚘',
    rarity: 'EPIC'
  },
  {
    id: 's7',
    name: 'Ночной клуб',
    category: 'Бизнесы',
    price: 97000,
    emoji: '🌃',
    rarity: 'LEGENDARY'
  },
  {
    id: 's8',
    name: 'Автомастерская',
    category: 'Бизнесы',
    price: 39000,
    emoji: '🔧',
    rarity: 'EPIC'
  },
  {
    id: 's9',
    name: 'Контейнер ресурсов',
    category: 'Ресурсы',
    price: 9500,
    emoji: '📦',
    rarity: 'RARE'
  },
  {
    id: 's10',
    name: 'Редкий металл',
    category: 'Ресурсы',
    price: 22000,
    emoji: '💎',
    rarity: 'EPIC'
  },
  {
    id: 's11',
    name: 'Часы Phantom',
    category: 'Аксессуары',
    price: 18900,
    emoji: '⌚',
    rarity: 'EPIC'
  },
  {
    id: 's12',
    name: 'Мотоцикл Nightblade',
    category: 'Машины',
    price: 26500,
    emoji: '🏍️',
    rarity: 'RARE'
  }
];

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

const money = amount =>
  '₽ ' + Math.round(amount).toLocaleString('ru-RU');

function safeLoad(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

let balance = Number(
  safeLoad('nocturne_balance', START_BALANCE)
);

let inventory = safeLoad(
  'nocturne_inventory',
  INVENTORY.map(item => ({ ...item }))
);

let selectedSource = null;
let selectedTarget = null;
let playMode = 'item';
let chance = 35;
let activeCategory = 'Все';
let busy = false;

function save() {
  localStorage.setItem('nocturne_balance', String(balance));
  localStorage.setItem(
    'nocturne_inventory',
    JSON.stringify(inventory)
  );
}

function showToast(message) {
  const toast = $('#toast');

  toast.textContent = message;
  toast.classList.add('show');

  clearTimeout(showToast.timer);

  showToast.timer = setTimeout(() => {
    toast.classList.remove('show');
  }, 2400);
}

function updateBalance() {
  $('#balance').textContent = money(balance);
}

function imageOrEmoji(item) {
  if (item.image) {
    return `
      <img
        src="${item.image}"
        alt=""
        style="width:72%;height:72%;object-fit:contain"
        onerror="this.remove()"
      >
    `;
  }

  return `<span class="product-emoji">${item.emoji || '✦'}</span>`;
}

function card(item, isInventory) {
  const selected = isInventory
    ? selectedSource?.id === item.id
    : selectedTarget?.id === item.id;

  return `
    <article
      class="product-card"
      style="${
        selected
          ? 'border-color:#f28b45;box-shadow:0 0 0 1px #f28b4520'
          : ''
      }"
    >
      <div class="product-visual">
        ${imageOrEmoji(item)}
        <span class="rarity">${item.rarity || 'RARE'}</span>
      </div>

      <div class="product-category">${item.category}</div>

      <h3 title="${item.name}">${item.name}</h3>

      <div class="product-bottom">
        <span class="product-price">${money(item.price)}</span>

        ${
          isInventory
            ? `
              <button
                class="product-action ${selected ? 'sell' : ''}"
                data-action="${selected ? 'sell' : 'source'}"
                data-id="${item.id}"
              >
                ${selected ? 'Продать' : 'Выбрать'}
              </button>
            `
            : `
              <button
                class="product-action"
                data-action="target"
                data-id="${item.id}"
              >
                ${selected ? 'Выбран ✓' : 'Выбрать'}
              </button>
            `
        }
      </div>
    </article>
  `;
}

function renderInventory() {
  $('#inventoryCount').textContent = inventory.length;

  $('#inventoryGrid').innerHTML = inventory.length
    ? inventory.map(item => card(item, true)).join('')
    : `
      <div class="empty-state">
        Инвентарь пока пуст. Выиграй предмет или выбери его в магазине.
      </div>
    `;
}

function renderShop() {
  const items = activeCategory === 'Все'
    ? SHOP
    : SHOP.filter(item => item.category === activeCategory);

  $('#shopGrid').innerHTML = items
    .map(item => card(item, false))
    .join('');

  $$('#categoryTabs button').forEach(button => {
    button.classList.toggle(
      'active',
      button.dataset.category === activeCategory
    );
  });
}

function updateUpgrade() {
  $('#chanceLabel').textContent = chance + '%';

  $$('#chanceOptions button').forEach(button => {
    button.classList.toggle(
      'active',
      Number(button.dataset.chance) === chance
    );
  });

  const target = selectedTarget;

  const stake = target
    ? Math.ceil(target.price * chance / 100)
    : null;

  $('#stakeValue').textContent =
    stake === null ? '—' : money(stake);

  $('#sourceName').textContent =
    playMode === 'cash'
      ? 'Ставка с баланса'
      : (selectedSource?.name || 'Выбери предмет');

  $('#sourceValue').textContent =
    playMode === 'cash'
      ? money(stake || 0)
      : (selectedSource ? money(selectedSource.price) : 'из инвентаря');

  $('#sourceArt').innerHTML =
    playMode === 'cash'
      ? '<span class="item-emoji">₽</span>'
      : (
          selectedSource
            ? imageOrEmoji(selectedSource).replace(
                'product-emoji',
                'item-emoji'
              )
            : '<span class="item-emoji">⌁</span>'
        );

  $('#toggleMode').textContent =
    playMode === 'item'
      ? 'ИГРАТЬ НА БАЛАНС'
      : 'ИГРАТЬ ПРЕДМЕТОМ';

  $('.source-slot .slot-caption').textContent =
    playMode === 'cash'
      ? 'СТАВКА НАЛИЧНЫМИ'
      : 'ТВОЙ ПРЕДМЕТ';

  $('#targetName').textContent =
    target?.name || 'Выбери приз';

  $('#targetValue').textContent =
    target ? money(target.price) : 'из магазина';

  $('#targetArt').innerHTML =
    target
      ? imageOrEmoji(target).replace(
          'product-emoji',
          'item-emoji'
        )
      : '<span class="item-emoji">♜</span>';

  $('#upgradeBtn').disabled = busy;
  $('#upgradeBtn').style.opacity = busy ? '.65' : '1';
}

function selectSource(id) {
  const item = inventory.find(item => item.id === id);

  if (!item) return;

  selectedSource = item;

  updateUpgrade();
  renderInventory();
}

function selectTarget(id) {
  selectedTarget = SHOP.find(item => item.id === id) || null;

  updateUpgrade();
  renderShop();
}

function sellItem(id) {
  const index = inventory.findIndex(item => item.id === id);

  if (index < 0) return;

  const item = inventory[index];

  inventory.splice(index, 1);
  balance += item.price;

  if (selectedSource?.id === id) {
    selectedSource = null;
  }

  save();
  updateBalance();
  renderInventory();
  updateUpgrade();

  showToast(`${item.name} продан за ${money(item.price)}`);
}

function secureRandom() {
  const values = new Uint32Array(1);

  crypto.getRandomValues(values);

  return values[0] / 4294967296;
}

function startUpgrade() {
  if (busy) return;

  if (playMode === 'item' && !selectedSource) {
    return showToast('Сначала выбери предмет из инвентаря');
  }

  if (!selectedTarget) {
    return showToast('Сначала выбери желаемый приз в магазине');
  }

  const stake = Math.ceil(selectedTarget.price * chance / 100);

  if (playMode === 'item' && selectedSource.price < stake) {
    return showToast(
      `Нужен предмет стоимостью не меньше ${money(stake)} для этого шанса`
    );
  }

  if (playMode === 'cash' && balance < stake) {
    return showToast(
      `На балансе нужно не меньше ${money(stake)}`
    );
  }

  busy = true;

  $('#resultMessage').className = 'result-message';
  $('#resultMessage').textContent = 'Колесо судьбы вращается…';

  $('#reel').classList.remove('spinning');

  void $('#reel').offsetWidth;

  $('#reel').classList.add('spinning');

  const won = secureRandom() < chance / 100;

  const source = selectedSource;
  const target = selectedTarget;

  if (playMode === 'cash') {
    balance -= stake;
  }

  setTimeout(() => {
    busy = false;

    $('#reel').classList.remove('spinning');

    if (playMode === 'item') {
      inventory = inventory.filter(item => item.id !== source.id);
    }

    if (won) {
      inventory.push({
        ...target,
        id: 'won_' + Date.now() + '_' +
          Math.floor(secureRandom() * 9999)
      });

      $('#resultMessage').className = 'result-message success';
      $('#resultMessage').textContent =
        `УСПЕХ! Ты получил: ${target.name}`;

      showToast('Апгрейд успешен — предмет в инвентаре!');
    } else {
      $('#resultMessage').className = 'result-message fail';
      $('#resultMessage').textContent =
        'Не в этот раз. Предмет ставки потерян.';

      showToast('Неудача. Попробуй ещё раз.');
    }

    if (playMode === 'item') {
      selectedSource = null;
    }

    save();
    updateBalance();
    renderInventory();
    updateUpgrade();
  }, 1350);
}

function openModal(id) {
  const element = document.getElementById(id);

  element.classList.add('open');
  element.setAttribute('aria-hidden', 'false');
}

function closeModal(id) {
  const element = document.getElementById(id);

  element.classList.remove('open');
  element.setAttribute('aria-hidden', 'true');
}

$('#openDeposit').addEventListener('click', () => {
  openModal('depositModal');
});

$$('[data-close]').forEach(button => {
  button.addEventListener('click', () => {
    closeModal(button.dataset.close);
  });
});

$$('.modal-backdrop').forEach(modal => {
  modal.addEventListener('click', event => {
    if (event.target === modal) {
      closeModal(modal.id);
    }
  });
});

$('#depositBtn').addEventListener('click', () => {
  const amount = Number($('#depositAmount').value);

  if (
    !Number.isFinite(amount) ||
    amount <= 0 ||
    amount > 10000000
  ) {
    return showToast('Введи сумму от 1 до 10 000 000 ₽');
  }

  balance += Math.floor(amount);

  save();
  updateBalance();
  closeModal('depositModal');

  $('#depositAmount').value = '';

  showToast(`Зачислено ${money(amount)} (демо)`);
});

$('#chanceOptions').addEventListener('click', event => {
  const button = event.target.closest('button[data-chance]');

  if (!button) return;

  chance = Number(button.dataset.chance);

  updateUpgrade();
});

$('#upgradeBtn').addEventListener('click', startUpgrade);

$('#toggleMode').addEventListener('click', () => {
  playMode = playMode === 'item' ? 'cash' : 'item';

  updateUpgrade();

  showToast(
    playMode === 'cash'
      ? 'Режим ставки с баланса включён'
      : 'Режим ставки предметом включён'
  );
});

$('#chooseSource').addEventListener('click', () => {
  $('#inventorySection').scrollIntoView({
    behavior: 'smooth'
  });
});

$('#chooseTarget').addEventListener('click', () => {
  $('#shopSection').scrollIntoView({
    behavior: 'smooth'
  });
});

$('#inventoryGrid').addEventListener('click', event => {
  const button = event.target.closest('button[data-action]');

  if (!button) return;

  if (button.dataset.action === 'sell') {
    sellItem(button.dataset.id);
  } else {
    selectSource(button.dataset.id);
  }
});

$('#shopGrid').addEventListener('click', event => {
  const button = event.target.closest('button[data-action="target"]');

  if (button) {
    selectTarget(button.dataset.id);
  }
});

$('#categoryTabs').addEventListener('click', event => {
  const button = event.target.closest('button[data-category]');

  if (!button) return;

  activeCategory = button.dataset.category;

  renderShop();
});

updateBalance();
renderInventory();
renderShop();
updateUpgrade();
