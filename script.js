
/*
  UPGRADER — DEMO
  Редактируй цены, названия и картинки в CATALOG.
  Для реальной игры перенеси баланс и случайный результат на сервер.
*/

const START_BALANCE = 4000000;

/* ===== НАСТРОЙКА ПРЕДМЕТОВ =====
   image: прямая ссылка на изображение.
   emoji: запасная иконка, если image пустой.
   price: стоимость в виртуальных рублях.
*/
const DEFAULT_GARAGE = [
  {
    id: "g1",
    name: "Lamborghini Aventador SVJ",
    category: "Машины",
    price: 40000000,
    emoji: "🏎️",
    rarity: "Легендарная",
    image: ""
  },
  {
    id: "g2",
    name: "BMW M5 CS",
    category: "Машины",
    price: 60000000,
    emoji: "🚘",
    rarity: "Легендарная",
    image: ""
  }
];

const CATALOG = [
  {
    id: "c1", name: "Koenigsegg Jesko",
    category: "Машины", price: 120000000,
    emoji: "🏎️", rarity: "Легендарная", image: ""
  },
  {
    id: "c2", name: "Pagani Huayra",
    category: "Машины", price: 155000000,
    emoji: "🚙", rarity: "Эпическая", image: ""
  },
  {
    id: "c3", name: "Bugatti Divo",
    category: "Машины", price: 300000000,
    emoji: "🏎️", rarity: "Легендарная", image: ""
  },
  {
    id: "c4", name: "BMW M5 CS",
    category: "Машины", price: 60000000,
    emoji: "🚘", rarity: "Легендарная", image: ""
  },
  {
    id: "c5", name: "Lamborghini Aventador SVJ",
    category: "Машины", price: 40000000,
    emoji: "🏎️", rarity: "Легендарная", image: ""
  },
  {
    id: "c6", name: "Золотая цепь",
    category: "Аксессуары", price: 1200000,
    emoji: "⛓️", rarity: "Редкая", image: ""
  },
  {
    id: "c7", name: "Маска «Призрак»",
    category: "Аксессуары", price: 2500000,
    emoji: "🎭", rarity: "Эпическая", image: ""
  },
  {
    id: "c8", name: "Пентхаус Eclipse",
    category: "Недвижимость", price: 180000000,
    emoji: "🏙️", rarity: "Легендарная", image: ""
  },
  {
    id: "c9", name: "Дом на Vinewood",
    category: "Недвижимость", price: 85000000,
    emoji: "🏡", rarity: "Эпическая", image: ""
  },
  {
    id: "c10", name: "Ночной клуб",
    category: "Бизнесы", price: 95000000,
    emoji: "🌃", rarity: "Легендарная", image: ""
  },
  {
    id: "c11", name: "Автомастерская",
    category: "Бизнесы", price: 28000000,
    emoji: "🔧", rarity: "Редкая", image: ""
  },
  {
    id: "c12", name: "Контейнер ресурсов",
    category: "Ресурсы", price: 7500000,
    emoji: "📦", rarity: "Редкая", image: ""
  },
  {
    id: "c13", name: "Редкий металл",
    category: "Ресурсы", price: 14000000,
    emoji: "💎", rarity: "Эпическая", image: ""
  }
];

/* ===== СОСТОЯНИЕ ===== */

const $ = selector => document.querySelector(selector);
const $$ = selector => [...document.querySelectorAll(selector)];

function load(key, fallback) {
  try {
    const value = JSON.parse(localStorage.getItem(key));
    return value ?? fallback;
  } catch {
    return fallback;
  }
}

const formatMoney = value =>
  Math.round(value).toLocaleString("ru-RU") + " ₽";

let balance = Number(load("upg_balance", START_BALANCE));
let garage = load("upg_garage", DEFAULT_GARAGE.map(x => ({...x})));
let history = load("upg_history", []);
let spins = Number(load("upg_spins", 0));

let stake = null;
let prize = null;
let chance = 35;
let cashMode = false;
let activeTab = "garage";
let activeCategory = "Все";
let wins = 0;
let losses = 0;
let bestPrize = 0;
let busy = false;

/* ===== СОХРАНЕНИЕ ===== */

function save() {
  localStorage.setItem("upg_balance", balance);
  localStorage.setItem("upg_garage", JSON.stringify(garage));
  localStorage.setItem("upg_history", JSON.stringify(history));
  localStorage.setItem("upg_spins", spins);
}

function notify(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("show");

  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}

function picture(item) {
  if (item?.image) {
    return `<img src="${item.image}" alt=""
      onerror="this.style.display='none'">`;
  }
  return `<span>${item?.emoji || "🎁"}</span>`;
}

/* ===== ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ===== */

function update() {
  $("#balance").textContent =
    Math.round(balance).toLocaleString("ru-RU");

  $("#garageCount").textContent = garage.length;
  $("#spinCount").textContent = spins;

  const wager = cashMode
    ? Number($("#cashStake").value) || 0
    : stake?.price || 0;

  $("#stakePhoto").innerHTML = picture(
    cashMode ? {emoji: "₽"} : stake
  );

  $("#stakeName").textContent = cashMode
    ? "Ставка наличными"
    : stake?.name || "Выбери предмет";

  $("#stakePrice").textContent =
    cashMode ? formatMoney(wager) :
    stake ? formatMoney(stake.price) : "—";

  $("#stakeTags").textContent = cashMode
    ? "Наличный баланс"
    : stake ? `${stake.category} · ${stake.rarity}` : "Твой гараж";

  $("#stakeFoot").textContent =
    cashMode || stake ? formatMoney(wager) : "—";

  $("#prizePhoto").innerHTML = picture(prize);
  $("#prizeName").textContent = prize?.name || "Выбери приз";
  $("#prizePrice").textContent =
    prize ? formatMoney(prize.price) : "—";

  $("#multiplier").textContent =
    prize && wager > 0
      ? "x" + (prize.price / wager).toFixed(2)
      : "";

  $("#chanceText").textContent = `${chance}%`;

  const circumference = 2 * Math.PI * 87;
  $("#progress").style.strokeDasharray = circumference;
  $("#progress").style.strokeDashoffset =
    circumference * (1 - chance / 100);

  $("#cashStake").disabled = !cashMode;
  $("#spin").disabled = busy;

  $$("[data-chance]").forEach(button => {
    button.classList.toggle(
      "chosen",
      Number(button.dataset.chance) === chance
    );
  });

  $("#wins").textContent = wins;
  $("#losses").textContent = losses;

  $("#rate").textContent = wins + losses
    ? Math.round(wins / (wins + losses) * 100) + "%"
    : "—";

  $("#best").textContent = formatMoney(bestPrize);

  const garageValue = garage.reduce(
    (sum, item) => sum + Number(item.price), 0
  );

  $("#garageValue").textContent = formatMoney(garageValue);
  $("#bar").style.width =
    Math.min(100, garageValue / 1000000000 * 100) + "%";

  renderGarage();
  renderShop();
  renderHistory();
}

/* ===== ИНВЕНТАРЬ ===== */

function renderGarage() {
  const query = $("#garageSearch").value.toLowerCase();

  const items = garage.filter(item =>
    item.name.toLowerCase().includes(query)
  );

  $("#garage").innerHTML = items.length
    ? items.map(item => `
      <div class="item ${stake?.id === item.id ? "selected" : ""}">
        <div class="photo" data-pick="${item.id}">
          ${picture(item)}
        </div>
        <div class="name">${item.name}</div>
        <div class="meta">${item.category} · ${item.rarity}</div>
        <div class="item-foot">
          <b class="item-price">${formatMoney(item.price)}</b>
          <button data-act="${activeTab === "sell" ? "sell" : "stake"}"
                  data-id="${item.id}">
            ${activeTab === "sell" ? "Продать" : "Выбрать"}
          </button>
        </div>
      </div>
    `).join("")
    : '<p class="empty">В инвентаре пока пусто</p>';

  $("#garageHint").textContent = activeTab === "sell"
    ? "Нажми «Продать», чтобы получить деньги"
    : "Выбери предмет для ставки";
}

function chooseStake(id) {
  stake = garage.find(item => item.id === id) || null;
  cashMode = false;
  $("#cashMode").checked = false;
  update();
}

/* ===== МАГАЗИН ===== */

function renderShop() {
  const query = $("#search").value.toLowerCase();

  let items = CATALOG.filter(item =>
    (activeCategory === "Все" ||
      item.category === activeCategory) &&
    item.name.toLowerCase().includes(query)
  );

  items.sort((a, b) =>
    $("#sort").value === "down"
      ? b.price - a.price
      : a.price - b.price
  );

  $("#shop").innerHTML = items.map(item => `
    <div class="item ${prize?.id === item.id ? "selected" : ""}">
      <div class="photo" data-prize="${item.id}">
        ${picture(item)}
      </div>
      <div class="name">${item.name}</div>
      <div class="meta">${item.category} · ${item.rarity}</div>
      <div class="item-foot">
        <b class="item-price">${formatMoney(item.price)}</b>
        <button data-act="buy" data-id="${item.id}">Купить</button>
      </div>
    </div>
  `).join("");

  $("#catalogFoot").textContent = `Предметов: ${items.length}`;

  $$("[data-cat]").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.cat === activeCategory
    );
  });
}

function buyItem(id) {
  const item = CATALOG.find(x => x.id === id);
  if (!item) return;

  if (balance < item.price) {
    return notify("Недостаточно средств на балансе");
  }

  balance -= item.price;

  const ownedItem = {
    ...item,
    id: "owned_" + Date.now() + "_" +
      Math.random().toString(36).slice(2, 7)
  };

  garage.unshift(ownedItem);
  stake = ownedItem;
  cashMode = false;
  $("#cashMode").checked = false;

  save();
  update();
  notify("Предмет куплен и добавлен в инвентарь");
}

/* ===== ПРОДАЖА ===== */

function sellItem(id) {
  const index = garage.findIndex(item => item.id === id);
  if (index === -1) return;

  const item = garage[index];

  if (!confirm(
    `Продать «${item.name}» за ${formatMoney(item.price)}?`
  )) return;

  garage.splice(index, 1);
  balance += Number(item.price);

  if (stake?.id === id) stake = null;

  save();
  update();
  notify("Предмет продан: +" + formatMoney(item.price));
}

/* ===== АПГРЕЙД ===== */

/*
  В демоверсии шанс задаётся выбранным процентом.
  Минимальная стоимость ставки проверяется по формуле:
  ставка >= цена приза × шанс / 100.

  Это только учебная модель экономики, а не гарантия
  математической честности реальной игры.
*/

function randomResult() {
  const bytes = new Uint32Array(1);
  crypto.getRandomValues(bytes);
  return bytes[0] / 4294967296;
}

function spin() {
  if (busy) return;

  if (!prize) {
    return notify("Сначала выбери желаемый приз");
  }

  let wager;

  if (cashMode) {
    wager = Number($("#cashStake").value);

    if (!Number.isSafeInteger(wager) || wager <= 0) {
      return notify("Введи целую сумму ставки в рублях");
    }

    if (wager > balance) {
      return notify("Недостаточно денег на балансе");
    }
  } else {
    if (!stake) {
      return notify("Выбери предмет в инвентаре");
    }

    wager = Number(stake.price);

    const minimum = Math.ceil(prize.price * chance / 100);

    if (wager < minimum) {
      return notify(
        "Для этого шанса нужна ставка от " + formatMoney(minimum)
      );
    }
  }

  const selectedStake = stake;
  const selectedPrize = prize;
  const isCash = cashMode;

  // Результат выбирается один раз на каждую попытку.
  const won = randomResult() < chance / 100;

  busy = true;
  $("#status").textContent = "Прокрутка...";
  $("#spin").disabled = true;

  // Ставка списывается сразу.
  if (isCash) {
    balance -= wager;
  } else {
    garage = garage.filter(item => item.id !== selectedStake.id);
  }

  spins++;
  save();
  update();

  setTimeout(() => {
    busy = false;

    const timestamp = new Date().toLocaleTimeString("ru-RU", {
      hour: "2-digit",
      minute: "2-digit"
    });

    if (won) {
      garage.unshift({
        ...selectedPrize,
        id: "won_" + Date.now()
      });

      wins++;
      bestPrize = Math.max(bestPrize, selectedPrize.price);

      history.unshift({
        item: selectedPrize,
        win: true,
        value: selectedPrize.price,
        chance,
        time: timestamp
      });

      $("#status").textContent = "Успех! Приз добавлен в инвентарь";
      notify("Выигрыш: " + selectedPrize.name);
    } else {
      losses++;

      history.unshift({
        item: isCash
          ? {name: "Ставка наличными", emoji: "₽"}
          : selectedStake,
        win: false,
        value: wager,
        chance,
        time: timestamp
      });

      $("#status").textContent = "Неудача. Ставка потеряна";
      notify("Неудача — ставка потеряна");
    }

    // Предмет ставки расходуется в обоих исходах.
    if (!isCash) stake = null;

    history = history.slice(0, 30);

    save();
    update();
  }, 1100);
}

/* ===== ОБРАБОТЧИКИ ===== */

$("#spin").addEventListener("click", spin);

$("#chances").addEventListener("click", event => {
  const button = event.target.closest("[data-chance]");
  if (!button || busy) return;

  chance = Number(button.dataset.chance);
  update();
});

$("#cashMode").addEventListener("change", event => {
  cashMode = event.target.checked;
  update();

  if (cashMode) $("#cashStake").focus();
});

$("#cashStake").addEventListener("input", update);

$("#garage").addEventListener("click", event => {
  const button = event.target.closest("[data-act]");
  const photo = event.target.closest("[data-pick]");

  if (button) {
    if (button.dataset.act === "sell") {
      sellItem(button.dataset.id);
    } else if (button.dataset.act === "stake") {
      chooseStake(button.dataset.id);
    }
  } else if (photo) {
    chooseStake(photo.dataset.pick);
  }
});

$("#shop").addEventListener("click", event => {
  const button = event.target.closest("[data-act]");
  const photo = event.target.closest("[data-prize]");

  if (button?.dataset.act === "buy") {
    buyItem(button.dataset.id);
    return;
  }

  if (photo) {
    prize = CATALOG.find(item => item.id === photo.dataset.prize);
    update();
    notify("Приз выбран");
  }
});

$("#categories").addEventListener("click", event => {
  const button = event.target.closest("[data-cat]");
  if (!button) return;

  activeCategory = button.dataset.cat;
  renderShop();
});

$("#search").addEventListener("input", renderShop);
$("#garageSearch").addEventListener("input", renderGarage);
$("#sort").addEventListener("change", renderShop);

$$("[data-tab]").forEach(button => {
  button.addEventListener("click", () => {
    activeTab = button.dataset.tab;

    $$("[data-tab]").forEach(tab => {
      tab.classList.toggle("active", tab === button);
    });

    renderGarage();
  });
});

$("#clearStake").addEventListener("click", () => {
  stake = null;
  update();
});

$("#choosePrize").addEventListener("click", () => {
  $("#catalog").scrollIntoView({
    behavior: "smooth",
    block: "center"
  });

  $("#search").focus({preventScroll: true});
});

$("#clearHistory").addEventListener("click", () => {
  history = [];
  save();
  renderHistory();
});

/* ===== ПОПОЛНЕНИЕ ДЕМО-БАЛАНСА ===== */

$("#openDeposit").addEventListener("click", () => {
  $("#modal").classList.add("open");
});

$("#closeModal").addEventListener("click", () => {
  $("#modal").classList.remove("open");
});

$("#modal").addEventListener("click", event => {
  if (event.target.id === "modal") {
    $("#modal").classList.remove("open");
  }
});

$("#deposit").addEventListener("click", () => {
  const amount = Number($("#depositAmount").value);

  if (!Number.isSafeInteger(amount) || amount <= 0) {
    return notify("Введи корректную целую сумму");
  }

  if (!Number.isSafeInteger(balance + amount)) {
    return notify("Слишком большая сумма");
  }

  balance += amount;
  $("#depositAmount").value = "";
  $("#modal").classList.remove("open");

  save();
  update();

  notify("Демо-баланс пополнен на " + formatMoney(amount));
});

$$("[data-amount]").forEach(button => {
  button.addEventListener("click", () => {
    $("#depositAmount").value = button.dataset.amount;
  });
});

/* ===== СБРОС ДЕМО ===== */

$("#reset").addEventListener("click", () => {
  if (!confirm("Сбросить демо-баланс, гараж и историю?")) return;

  balance = START_BALANCE;
  garage = DEFAULT_GARAGE.map(item => ({...item}));
  history = [];
  spins = 0;

  stake = null;
  prize = null;
  chance = 35;
  cashMode = false;
  wins = 0;
  losses = 0;
  bestPrize = 0;

  $("#cashMode").checked = false;
  $("#cashStake").value = "";
  $("#status").textContent = "Выбери ставку и желаемый приз";

  save();
  update();
  notify("Демо сброшено");
});

$("#sound").addEventListener("click", () => {
  notify("Звуковые эффекты пока не подключены");
});

$("#help").addEventListener("click", () => {
  notify("Выбери ставку, приз и шанс. Для наличных введи сумму.");
});

/* ===== ИСТОРИЯ ===== */

function renderHistory() {
  $("#history").innerHTML = history.length
    ? history.slice(0, 8).map(entry => `
      <div class="entry">
        <div class="thumb">${picture(entry.item)}</div>
        <div>
          <div class="entry-name">${entry.item.name}</div>
          <div class="entry-out ${entry.win ? "win" : "loss"}">
            ${entry.win ? "Выигрыш" : "Поражение"}
            · ${entry.win ? "+" : "−"}${formatMoney(entry.value)}
          </div>
          <div class="time">
            ${entry.time} · шанс ${entry.chance}%
          </div>
        </div>
      </div>
    `).join("")
    : '<p class="empty">Пока нет попыток</p>';
}

/* ===== ЗАПУСК ===== */

update();

