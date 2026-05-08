const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#060b16");
    tg.setBackgroundColor("#060b16");
}

const user = tg?.initDataUnsafe?.user || {
    id: 458291,
    first_name: "Ares",
    username: "areszers"
};

const screens = document.querySelectorAll(".screen");
const navButtons = document.querySelectorAll(".nav-btn");

let stars = 3500;
let tickets = 20;
let inventory = [];
let currentMode = null;
let demoMode = true;
let isBusy = false;
let selectedSlotBet = 49;
let selectedEggTier = null;

const liveIcons = ["⚔️", "🔥", "🏛️", "🎁", "💎", "🛡️", "👑", "⚡", "🧿", "🗡️", "🥚", "🎰", "🚀", "🧨", "🪙"];

const modes = [
    { id: "free", title: "Free", subtitle: "10 tickets", art: "free", cardClass: "free-card" },
    { id: "roulette", title: "Roulette", subtitle: "15 cases", art: "roulette", cardClass: "roulette-card" },
    { id: "pvp", title: "PvP", subtitle: "Arena battle", art: "pvp", cardClass: "pvp-card" },
    { id: "crash", title: "Crash", subtitle: "Ares spear run", art: "crash", cardClass: "crash-card" },
    { id: "slots", title: "Slots", subtitle: "Olympus reels", art: "slots", cardClass: "slots-card" },
    { id: "eggs", title: "Eggs", subtitle: "Relic chests", art: "eggs", cardClass: "eggs-card" },
    { id: "upgrade", title: "Upgrade", subtitle: "Improve your gifts", art: "upgrade", cardClass: "upgrade-card" }
];

const mainPrizes = [
    { id: "p1", name: "Jolly Cat", value: 18684, rarity: "Mythic", emoji: "🐱", weight: 1 },
    { id: "p2", name: "Muscle Arm", value: 17306, rarity: "Mythic", emoji: "💪", weight: 1 },
    { id: "p3", name: "Luxury Bag", value: 15933, rarity: "Legendary", emoji: "👜", weight: 2 },
    { id: "p4", name: "Blue Safe", value: 8526, rarity: "Epic", emoji: "🔐", weight: 4 },
    { id: "p5", name: "Green Ring", value: 3659, rarity: "Epic", emoji: "💍", weight: 6 },
    { id: "p6", name: "Megaphone", value: 1956, rarity: "Rare", emoji: "📣", weight: 10 },
    { id: "p7", name: "Painter", value: 972, rarity: "Rare", emoji: "🎨", weight: 12 },
    { id: "p8", name: "Light Sword", value: 642, rarity: "Common", emoji: "🗡️", weight: 20 },
    { id: "p9", name: "Angel Box", value: 591, rarity: "Common", emoji: "🎁", weight: 22 },
    { id: "p10", name: "Banana", value: 358, rarity: "Common", emoji: "🍌", weight: 24 },
    { id: "p11", name: "100 Stars", value: 100, rarity: "Bonus", emoji: "⭐", weight: 18 },
    { id: "p12", name: "50 Stars", value: 50, rarity: "Bonus", emoji: "⭐", weight: 24 },
    { id: "p13", name: "10 Stars", value: 10, rarity: "Bonus", emoji: "⭐", weight: 32 },
    { id: "p14", name: "5 Stars", value: 5, rarity: "Bonus", emoji: "⭐", weight: 38 }
];

const slotPools = {
    49: [
        { name: "Happy Cake", value: 504, emoji: "🎂" },
        { name: "Balloon", value: 483, emoji: "🎈" },
        { name: "Fish Tank", value: 362, emoji: "🐟" },
        { name: "Nothing", value: 0, emoji: "❌" }
    ],
    129: [
        { name: "Green Ring", value: 3659, emoji: "💍" },
        { name: "Skull Flower", value: 1226, emoji: "💀" },
        { name: "Dark Orb", value: 887, emoji: "🧿" },
        { name: "Angel Box", value: 591, emoji: "🎁" },
        { name: "Banana", value: 358, emoji: "🍌" },
        { name: "Nothing", value: 0, emoji: "❌" }
    ],
    299: [
        { name: "Diamond Ring", value: 8526, emoji: "💎" },
        { name: "Rolex Watch", value: 7441, emoji: "⌚" },
        { name: "Vintage Car", value: 5773, emoji: "🚗" },
        { name: "Painter", value: 972, emoji: "🎨" },
        { name: "Nothing", value: 0, emoji: "❌" }
    ],
    599: [
        { name: "Muscle Arm", value: 17306, emoji: "💪" },
        { name: "Luxury Bag", value: 15933, emoji: "👜" },
        { name: "Kiss Frog", value: 6831, emoji: "🐸" },
        { name: "Purple Bear", value: 4290, emoji: "🧸" },
        { name: "Nothing", value: 0, emoji: "❌" }
    ],
    1099: [
        { name: "Crystal Diamond", value: 23107, emoji: "💠" },
        { name: "Purple Crystal", value: 9796, emoji: "🔮" },
        { name: "Lucky Cat", value: 8948, emoji: "🐱" },
        { name: "Vintage Car", value: 5773, emoji: "🚗" },
        { name: "Nothing", value: 0, emoji: "❌" }
    ]
};

const eggTiers = [
    { id: "egg249a", label: "3 Eggs", price: 249, rtp: 5, icon: "🔥" },
    { id: "egg249b", label: "3 Eggs", price: 249, rtp: 5, icon: "🧿" },
    { id: "egg349", label: "4 Eggs", price: 349, rtp: 5, icon: "💎" },
    { id: "egg599", label: "5 Eggs", price: 599, rtp: 6, icon: "🏛️" },
    { id: "egg999", label: "5 Eggs", price: 999, rtp: 4, icon: "👑" },
    { id: "egg2999", label: "5 Eggs", price: 2999, rtp: 0.5, icon: "⚡" }
];

startApp();

function startApp() {
    renderLive();
    renderHome();
    renderTasks();
    renderArenaRankings();
    renderRaffles();
    renderProfile();
    updateBalances();
    bindNavigation();
    startLiveScroll();
    fakeToast("Ares Case loaded");
}

function bindNavigation() {
    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.screen;

            navButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            screens.forEach((screen) => screen.classList.remove("active"));
            document.getElementById(target).classList.add("active");

            if (target === "home-screen") renderHome();
            if (target === "leaderboard-screen") renderArenaRankings();
            if (target === "profile-screen") renderProfile();
        });
    });
}

function renderLive() {
    document.getElementById("liveTrack").innerHTML = liveIcons
        .map((icon) => `<div class="live-item">${icon}</div>`)
        .join("");
}

function renderHome() {
    const homeScreen = document.getElementById("home-screen");

    homeScreen.innerHTML = `
        <div class="page-shell">
            <div class="game-list">
                ${modes.map(renderModeCard).join("")}
            </div>
        </div>
    `;

    document.querySelectorAll(".game-card").forEach((card) => {
        card.addEventListener("click", () => openMode(card.dataset.mode));
    });
}

function renderModeCard(mode) {
    return `
        <button class="game-card ${mode.cardClass}" data-mode="${mode.id}">
            <div class="game-card-inner">
                <div class="game-card-text">
                    <h2>${mode.title}</h2>
                    <p>${mode.subtitle}</p>
                </div>

                <div class="game-art">
                    ${renderCardArt(mode.art)}
                </div>
            </div>
        </button>
    `;
}

function renderCardArt(type) {
    if (type === "free") {
        return `<div class="chest-fire"></div><div class="ares-chest"></div>`;
    }

    if (type === "roulette") {
        return `<div class="roulette-wheel"></div><div class="roulette-ball"></div>`;
    }

    if (type === "pvp") {
        return `
            <div class="warrior-left">
                <div class="warrior-head"></div>
                <div class="warrior-body"></div>
                <div class="sword"></div>
            </div>
            <div class="warrior-right">
                <div class="warrior-head"></div>
                <div class="warrior-body"></div>
                <div class="sword"></div>
            </div>
        `;
    }

    if (type === "crash") {
        return `
            <div class="crash-ares">
                <div class="ares-helmet"></div>
                <div class="ares-body"></div>
                <div class="spear"></div>
            </div>
            <div class="crash-curve"></div>
        `;
    }

    if (type === "slots") {
        return `
            <div class="zeus-bolt">⚡</div>
            <div class="olympus-logo">GATES</div>
            <div class="olympus-gate"></div>
        `;
    }

    if (type === "eggs") {
        return `<div class="fire-egg"></div>`;
    }

    if (type === "upgrade") {
        return `<div class="penguin"></div><div class="portal"></div>`;
    }

    return `<span>🎁</span>`;
}

function openMode(modeId) {
    currentMode = modeId;

    if (modeId === "free") renderFreeCase();
    if (modeId === "roulette") renderRoulette();
    if (modeId === "pvp") renderPvP();
    if (modeId === "crash") renderCrash();
    if (modeId === "slots") renderSlots();
    if (modeId === "eggs") renderEggs();
    if (modeId === "upgrade") renderUpgrade();
}

function modeHeader(title, subtitle) {
    return `
        <div class="mode-top">
            <button class="back-btn" onclick="renderHome()">←</button>
            <div class="mode-title">
                <h2>${title}</h2>
                <p>${subtitle}</p>
            </div>
            <button class="mode-btn" onclick="openPrizesModal()">🎁</button>
        </div>
    `;
}

function renderFreeCase() {
    document.getElementById("home-screen").innerHTML = `
        <div class="page-shell">
            ${modeHeader("Free Case", "10 tickets • RTP 5%")}

            <div class="roulette-window">
                <div class="roulette-pointer"></div>
                <div class="roulette-track" id="rouletteTrack">
                    ${buildReel(mainPrizes, 14).map(renderRouletteItem).join("")}
                </div>
            </div>

            <div class="case-preview-grid">
                ${mainPrizes.slice(0, 9).map(renderPreviewCard).join("")}
            </div>

            <button class="primary-btn" onclick="spinFreeCase()">Open • 🎟️ 10</button>
        </div>
    `;
}

function renderRoulette() {
    document.getElementById("home-screen").innerHTML = `
        <div class="page-shell">
            ${modeHeader("Roulette", "Classic Ares spin")}

            <div class="roulette-window">
                <div class="roulette-pointer"></div>
                <div class="roulette-track" id="rouletteTrack">
                    ${buildReel(mainPrizes, 14).map(renderRouletteItem).join("")}
                </div>
            </div>

            <div class="secondary-row">
                <button class="secondary-btn" onclick="toggleDemo()">Demo: ${demoMode ? "ON" : "OFF"}</button>
                <button class="secondary-btn" onclick="openPrizesModal()">Prizes</button>
            </div>

            <button class="primary-btn" onclick="spinRoulette()">Spin • ⭐ 15</button>
        </div>
    `;
}

function renderPvP() {
    document.getElementById("home-screen").innerHTML = `
        <div class="page-shell">
            ${modeHeader("PvP Arena", "Wheel battle")}

            <div class="mode-card">
                <div class="pvp-pointer"></div>
                <div class="pvp-wheel" id="pvpWheel"></div>

                <div class="pvp-player-list">
                    ${["Areszer", "Titan", "Ghost"].map((name, index) => `
                        <div class="pvp-player">
                            <div class="avatar">${name[0]}</div>
                            <div>
                                <div class="player-name">${name}</div>
                                <div class="player-meta">${index === 0 ? "46%" : index === 1 ? "30%" : "24%"} chance</div>
                            </div>
                            <div class="player-prize">⭐ ${(index + 1) * 450}</div>
                        </div>
                    `).join("")}
                </div>
            </div>

            <button class="primary-btn" onclick="startPvP()">Start Battle • ⭐ 20</button>
        </div>
    `;
}

function renderCrash() {
    document.getElementById("home-screen").innerHTML = `
        <div class="page-shell">
            ${modeHeader("Crash", "Ares spear multiplier")}

            <div class="crash-scene">
                <div class="crash-stars"></div>
                <div class="crash-character">
                    <div class="ares-helmet"></div>
                    <div class="ares-body"></div>
                    <div class="spear"></div>
                </div>
                <div class="crash-main-value" id="crashValue">1.00x</div>
            </div>

            <div class="multiplier-row" id="multiplierRow">
                ${["1.20x", "1.54x", "2.10x", "3.40x", "5.60x"].map((x) => `<div class="multiplier-pill">${x}</div>`).join("")}
            </div>

            <div class="crash-bet-list">
                ${["areszers", "warrior", "sparta", "ghost"].map((name, i) => `
                    <div class="crash-player">
                        <div class="avatar">${name[0].toUpperCase()}</div>
                        <div>
                            <div class="player-name">${name}</div>
                            <div class="player-meta">Bet ⭐ ${(i + 1) * 25}</div>
                        </div>
                        <div class="player-prize">x${(1.2 + i / 2).toFixed(2)}</div>
                    </div>
                `).join("")}
            </div>

            <div class="secondary-row">
                <button class="secondary-btn" onclick="cashoutCrash()">Cashout</button>
                <button class="secondary-btn" onclick="fakeToast('Auto cashout set')">Auto</button>
            </div>

            <button class="primary-btn" onclick="startCrash()">Launch Spear • ⭐ 25</button>
        </div>
    `;
}

function renderSlots() {
    const bets = [49, 129, 299, 599, 1099];

    document.getElementById("home-screen").innerHTML = `
        <div class="page-shell">
            ${modeHeader("Slots", "Olympus reels • RTP 10%")}

            <div class="slots-machine">
                <div class="slot-reels">
                    ${[0, 1, 2].map((i) => `
                        <div class="slot-reel">
                            <div class="slot-strip" id="slotStrip${i}">
                                ${buildSlotStrip().map((x) => `<div class="slot-symbol">${x.emoji}</div>`).join("")}
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>

            <div class="bet-row">
                ${bets.map((bet) => `
                    <button class="bet-pill ${bet === selectedSlotBet ? "active" : ""}" onclick="selectSlotBet(${bet})">⭐ ${bet}</button>
                `).join("")}
            </div>

            <button class="primary-btn" onclick="spinSlots()">Spin • ⭐ ${selectedSlotBet}</button>
        </div>
    `;
}

function renderEggs() {
    document.getElementById("home-screen").innerHTML = `
        <div class="page-shell">
            ${modeHeader("Eggs", "Ares relic chests")}

            <div class="egg-grid">
                ${eggTiers.map((egg) => `
                    <button class="egg-card" onclick="selectEgg('${egg.id}')">
                        <div class="egg-art">
                            <div class="fire-egg"></div>
                        </div>
                        <div class="egg-info">
                            <h3>${egg.icon} ${egg.label}</h3>
                            <span class="winwin">RTP ${egg.rtp}%</span>
                            <p>⭐ ${egg.price.toLocaleString()}</p>
                        </div>
                    </button>
                `).join("")}
            </div>
        </div>
    `;
}

function renderUpgrade() {
    document.getElementById("home-screen").innerHTML = `
        <div class="page-shell">
            ${modeHeader("Forge of Ares", "Upgrade RTP 10%")}

            <div class="mode-card">
                <div class="upgrade-panel">
                    <div class="upgrade-box">
                        <div class="add-box">
                            <strong>+</strong>
                            <small>Your gifts</small>
                        </div>
                    </div>

                    <div class="upgrade-box">
                        <div class="add-box">
                            <strong>?</strong>
                            <small>Desired gift</small>
                        </div>
                    </div>
                </div>
            </div>

            <button class="primary-btn" onclick="startUpgrade()">Forge Upgrade</button>
        </div>
    `;
}

function spinFreeCase() {
    if (tickets < 10) return fakeToast("Not enough tickets");
    tickets -= 10;
    updateBalances();
    spinGeneric(mainPrizes, "Free Case", 5);
}

function spinRoulette() {
    if (!demoMode && stars < 15) return fakeToast("Not enough stars");
    if (!demoMode) stars -= 15;
    updateBalances();
    spinGeneric(mainPrizes, "Roulette", 10);
}

function spinGeneric(pool, title, rtp) {
    if (isBusy) return;
    isBusy = true;

    const prize = pickPrizeByRtp(pool, rtp);
    const reel = buildReel(pool, 24);
    reel.push(prize);

    const track = document.getElementById("rouletteTrack");
    track.style.transition = "none";
    track.style.transform = "translateX(0)";
    track.innerHTML = reel.map(renderRouletteItem).join("");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            track.style.transition = "transform 3.8s cubic-bezier(0.12, 0.82, 0.22, 1)";
            track.style.transform = "translateX(-2320px)";
        });
    });

    setTimeout(() => showReward(prize, title), 3900);
}

function startPvP() {
    if (isBusy) return;
    isBusy = true;

    const wheel = document.getElementById("pvpWheel");
    wheel.style.transform = `rotate(${1440 + Math.floor(Math.random() * 360)}deg)`;

    setTimeout(() => {
        isBusy = false;
        fakeToast("Arena winner: areszers");
    }, 3700);
}

let crashTimer = null;
let crashCurrent = 1;

function startCrash() {
    if (isBusy) return;
    if (stars < 25) return fakeToast("Not enough stars");

    stars -= 25;
    updateBalances();

    isBusy = true;
    crashCurrent = 1;

    const crashPoint = 1.3 + Math.random() * 5.8;
    const valueEl = document.getElementById("crashValue");

    crashTimer = setInterval(() => {
        crashCurrent += 0.03 + crashCurrent * 0.018;
        valueEl.innerText = `${crashCurrent.toFixed(2)}x`;

        if (crashCurrent >= crashPoint) {
            clearInterval(crashTimer);
            valueEl.innerText = `CRASH ${crashCurrent.toFixed(2)}x`;
            fakeToast("Spear exploded");
            isBusy = false;
        }
    }, 80);
}

function cashoutCrash() {
    if (!isBusy || !crashTimer) return fakeToast("No active crash");
    clearInterval(crashTimer);
    const win = Math.floor(25 * crashCurrent);
    stars += win;
    updateBalances();
    isBusy = false;
    fakeToast(`Cashed out +${win} stars`);
}

function selectSlotBet(bet) {
    selectedSlotBet = bet;
    renderSlots();
}

function spinSlots() {
    if (isBusy) return;
    if (stars < selectedSlotBet) return fakeToast("Not enough stars");

    stars -= selectedSlotBet;
    updateBalances();
    isBusy = true;

    for (let i = 0; i < 3; i++) {
        const strip = document.getElementById(`slotStrip${i}`);
        strip.style.transition = "none";
        strip.style.transform = "translateY(0)";
        strip.innerHTML = buildSlotStrip().map((x) => `<div class="slot-symbol">${x.emoji}</div>`).join("");

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                strip.style.transition = `transform ${2.4 + i * 0.25}s cubic-bezier(0.12, 0.82, 0.22, 1)`;
                strip.style.transform = `translateY(-${760 + i * 94}px)`;
            });
        });
    }

    setTimeout(() => {
        const result = Math.random() <= 0.10
            ? randomFrom(slotPools[selectedSlotBet].filter((x) => x.value > 0))
            : { name: "Nothing", value: 0, emoji: "❌" };

        if (result.value > 0) {
            stars += result.value;
            inventory.unshift({ ...result, rarity: "Slot Prize" });
            fakeToast(`Won ⭐ ${result.value.toLocaleString()}`);
        } else {
            fakeToast("Nothing won");
        }

        updateBalances();
        renderProfile();
        isBusy = false;
    }, 3300);
}

function selectEgg(id) {
    selectedEggTier = eggTiers.find((x) => x.id === id);
    if (!selectedEggTier) return;

    if (stars < selectedEggTier.price) return fakeToast("Not enough stars");

    stars -= selectedEggTier.price;
    updateBalances();

    const prize = Math.random() <= selectedEggTier.rtp / 100
        ? randomFrom(mainPrizes.filter((x) => x.value > 300))
        : { name: "Ash Relic", value: 0, rarity: "Nothing", emoji: "🪨" };

    showReward(prize, `Eggs • ${selectedEggTier.label}`);
}

function startUpgrade() {
    if (inventory.length === 0) return fakeToast("No gifts to upgrade");

    const success = Math.random() <= 0.10;

    if (success) {
        const prize = randomFrom(mainPrizes.slice(0, 5));
        inventory.unshift(prize);
        fakeToast("Forge success");
        showReward(prize, "Forge of Ares");
    } else {
        inventory.shift();
        renderProfile();
        fakeToast("Forge failed. Gift burned.");
    }
}

function showReward(prize, title) {
    isBusy = false;

    if (prize.value > 0 && prize.rarity !== "Bonus" && prize.name !== "Nothing" && !demoMode) {
        inventory.unshift(prize);
    }

    if (prize.rarity === "Bonus" && !demoMode) {
        stars += prize.value;
    }

    updateBalances();
    renderProfile();

    document.getElementById("home-screen").innerHTML = `
        <div class="page-shell">
            <div class="reward-screen">
                <div class="reward-card">
                    <div class="reward-art">
                        <span>${prize.emoji || "🎁"}</span>
                    </div>

                    <h2>${prize.name}</h2>
                    <p>${title} • ⭐ ${prize.value.toLocaleString()}</p>

                    <button class="claim-btn primary-btn" onclick="openMode('${currentMode || "free"}')">Back</button>
                </div>
            </div>
        </div>
    `;
}

function renderRouletteItem(item) {
    return `
        <div class="roulette-item">
            <span>${item.emoji || "🎁"}</span>
            <small>${item.name}</small>
        </div>
    `;
}

function renderPreviewCard(item) {
    return `
        <div class="preview-card">
            <span>${item.emoji || "🎁"}</span>
            <strong>⭐ ${item.value.toLocaleString()}</strong>
            <small>${item.name}</small>
        </div>
    `;
}

function buildReel(pool, count) {
    const reel = [];
    for (let i = 0; i < count; i++) reel.push(randomFrom(pool));
    return reel;
}

function buildSlotStrip() {
    const pool = slotPools[selectedSlotBet] || slotPools[49];
    const strip = [];
    for (let i = 0; i < 18; i++) strip.push(randomFrom(pool));
    return strip;
}

function pickPrizeByRtp(pool, rtp) {
    const hit = Math.random() <= rtp / 100;

    if (!hit) {
        return randomFrom(pool.filter((x) => x.rarity === "Bonus" || x.value <= 50));
    }

    return randomFrom(pool.filter((x) => x.value > 50));
}

function randomFrom(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function toggleDemo() {
    demoMode = !demoMode;
    fakeToast(demoMode ? "Demo mode enabled" : "Demo mode disabled");
    renderRoulette();
}

function renderTasks() {
    document.getElementById("tasks-screen").innerHTML = `
        <div class="page-title">War Missions</div>

        <div class="task-list">
            <div class="task-card">
                <div>
                    <h3>Share Invite Link</h3>
                    <p>Reward: 🎟️ 5 tickets</p>
                </div>
                <button onclick="claimTask('link')">GO</button>
            </div>

            <div class="task-card">
                <div>
                    <h3>Share Story</h3>
                    <p>Reward: 🎟️ 10 tickets</p>
                </div>
                <button onclick="claimTask('story')">GO</button>
            </div>

            <div class="task-card">
                <div>
                    <h3>Ares Chat Activity</h3>
                    <p>Send at least 5 messages</p>
                </div>
                <button onclick="claimTask('chat')">CLAIM</button>
            </div>
        </div>
    `;
}

function claimTask(type) {
    if (type === "link") tickets += 5;
    if (type === "story") tickets += 10;
    if (type === "chat") tickets += 15;

    updateBalances();
    fakeToast("Mission reward claimed");
}

function renderRaffles() {
    document.getElementById("raffles-screen").innerHTML = `
        <div class="page-title">Daily Free Prizes</div>

        <div class="raffle-card">
            <div class="raffle-top">
                <span>🎁 Free spin requirements</span>
                <span>RTP 3%</span>
            </div>

            <p style="opacity:.75;line-height:1.5;margin-bottom:16px;">
                Send invite message to friends, share story, and send at least 5 messages in Ares Chat.
            </p>

            <button class="join-btn" onclick="fakeToast('Daily free spin check started')">CHECK TASKS</button>
        </div>
    `;
}

function renderArenaRankings() {
    document.getElementById("leaderboard-screen").innerHTML = `
        <div class="page-title">Arena Rankings</div>

        <div class="leaderboard-list">
            ${[
                ["#1", "areszers", "125.000"],
                ["#2", "spartan", "98.400"],
                ["#3", "titanlord", "77.210"],
                ["#4", "ghost", "61.550"],
                ["#5", "apollo", "48.900"]
            ].map((row) => `
                <div class="leaderboard-item">
                    <span>${row[0]}</span>
                    <span>${row[1]}</span>
                    <span>⭐ ${row[2]}</span>
                </div>
            `).join("")}
        </div>
    `;
}

function renderProfile() {
    const displayName = user.username ? `@${user.username}` : user.first_name;

    document.getElementById("profile-screen").innerHTML = `
        <div class="profile-card">
            <div class="referral-box">
                <h2>Recruit Warriors <span>25%</span></h2>
                <p style="opacity:.7;margin-top:8px;">Earn 25% from invited warriors.</p>

                <div class="ref-row">
                    <div class="ref-stat">
                        <h3>12</h3>
                        <p>Invited</p>
                    </div>

                    <div class="ref-stat">
                        <h3>⭐ 2,450</h3>
                        <p>Earned</p>
                    </div>
                </div>

                <button class="primary-btn" onclick="copyInvite()">Invite</button>
            </div>

            <div class="profile-avatar">${user.first_name.charAt(0)}</div>
            <h2>${displayName}</h2>
            <p>ID: ${user.id}</p>

            <div class="profile-stats">
                <div class="stat-box">
                    <h3>${stars.toLocaleString()}</h3>
                    <p>Stars</p>
                </div>

                <div class="stat-box">
                    <h3>${tickets}</h3>
                    <p>Tickets</p>
                </div>

                <div class="stat-box">
                    <h3>${inventory.length}</h3>
                    <p>Gifts</p>
                </div>

                <div class="stat-box">
                    <h3>${demoMode ? "ON" : "OFF"}</h3>
                    <p>Demo</p>
                </div>
            </div>

            <div class="inventory-section">
                <h3 class="inventory-title">Your Gifts</h3>

                <div class="inventory-list">
                    ${
                        inventory.length === 0
                            ? `<div class="empty-inventory">No gifts yet.</div>`
                            : inventory.map((item) => `
                                <div class="inventory-item">
                                    <span>${item.emoji || "🎁"}</span>
                                    <div>
                                        <h4>${item.name}</h4>
                                        <small>${item.rarity || "Gift"} • ⭐ ${item.value.toLocaleString()}</small>
                                    </div>
                                </div>
                            `).join("")
                    }
                </div>
            </div>
        </div>
    `;
}

function copyInvite() {
    const link = `https://t.me/ares_case_bot?start=${user.id}`;

    navigator.clipboard?.writeText(link);
    fakeToast("Invite link copied");
}

function updateBalances() {
    document.getElementById("starBalance").innerHTML = `⭐ ${stars.toLocaleString()}`;
    document.getElementById("ticketBalance").innerHTML = `🎟️ ${tickets}`;
}

function openPrizesModal() {
    closeModal();

    const modal = document.createElement("div");
    modal.className = "modal-backdrop";

    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" onclick="closeModal()">×</button>
            <div class="modal-title">Possible Prizes</div>

            <div class="prize-grid">
                ${mainPrizes.map((item) => `
                    <div class="prize-card">
                        <div class="prize-icon">
                            <span>${item.emoji || "🎁"}</span>
                        </div>
                        <div class="prize-price">⭐ ${item.value.toLocaleString()}</div>
                        <div class="prize-name">${item.name}</div>
                    </div>
                `).join("")}
            </div>

            <button class="modal-bottom-btn" onclick="closeModal()">Close</button>
        </div>
    `;

    document.body.appendChild(modal);
}

function closeModal() {
    document.querySelector(".modal-backdrop")?.remove();
}

function fakeToast(message) {
    document.querySelector(".toast")?.remove();

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("show"), 50);

    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

function startLiveScroll() {
    const liveTrack = document.getElementById("liveTrack");

    if (!liveTrack) return;

    let scrollPos = 0;

    setInterval(() => {
        scrollPos += 1;

        liveTrack.scrollTo({
            left: scrollPos,
            behavior: "smooth"
        });

        if (scrollPos > liveTrack.scrollWidth / 2) {
            scrollPos = 0;
        }
    }, 35);
}