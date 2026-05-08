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

let stars = 35;
let tickets = 2;
let demoMode = true;
let inventory = [];
let currentCase = null;
let isSpinning = false;

const liveItems = [
    "https://storage.portal-market.com/portals-market/gifts/faithamulet/models/png/bronzetower.png",
    "https://storage.portal-market.com/portals-market/gifts/hangingstar/models/png/advicedog.png",
    "https://storage.portal-market.com/portals-market/gifts/ionicdryer/models/png/barbiecore.png",
    "https://storage.portal-market.com/portals-market/gifts/vicecream/models/png/pumpkinspice.png",
    "https://storage.portal-market.com/portals-market/gifts/nekohelmet/models/png/acidpunch.png",
    "https://storage.portal-market.com/portals-market/gifts/restlessjar/models/png/aquarium.png",
    "https://storage.portal-market.com/portals-market/gifts/berrybox/models/png/alpha.png",
    "https://storage.portal-market.com/portals-market/gifts/victorymedal/models/png/aegis.png",
    "https://storage.portal-market.com/portals-market/gifts/bunnymuffin/models/png/airysouffle.png",
    "https://storage.portal-market.com/portals-market/gifts/lolpop/models/png/andromeda.png",
    "https://storage.portal-market.com/portals-market/gifts/moussecake/models/png/butterflies.png",
    "https://storage.portal-market.com/portals-market/gifts/cookieheart/models/png/affection.png",
    "https://storage.portal-market.com/portals-market/gifts/cupidcharm/models/png/bloodgem.png",
    "https://storage.portal-market.com/portals-market/gifts/jollychimp/models/png/artist.png",
    "https://storage.portal-market.com/portals-market/gifts/toybear/models/png/alterego.png",
    "https://storage.portal-market.com/portals-market/gifts/bowtie/models/png/babyyoda.png",
    "https://storage.portal-market.com/portals-market/gifts/lovecandle/models/png/afterglow.png",
    "https://storage.portal-market.com/portals-market/gifts/instantramen/models/png/arcanebowl.png",
    "https://storage.portal-market.com/portals-market/gifts/lushbouquet/models/png/artichoke.png",
    "https://storage.portal-market.com/portals-market/gifts/westsidesign/models/png/allin.png"
];

const prizes = [
    {
        id: "p1",
        name: "Jolly Chimp",
        rarity: "Mythic",
        value: 19044,
        weight: 1,
        image: "https://storage.portal-market.com/portals-market/gifts/jollychimp/models/png/artist.png"
    },
    {
        id: "p2",
        name: "Ion Dryer",
        rarity: "Mythic",
        value: 17969,
        weight: 1,
        image: "https://storage.portal-market.com/portals-market/gifts/ionicdryer/models/png/barbiecore.png"
    },
    {
        id: "p3",
        name: "Luxury Bag",
        rarity: "Legendary",
        value: 15536,
        weight: 2,
        image: "https://storage.portal-market.com/portals-market/gifts/berrybox/models/png/alpha.png"
    },
    {
        id: "p4",
        name: "Blue Case",
        rarity: "Epic",
        value: 3727,
        weight: 5,
        image: "https://storage.portal-market.com/portals-market/gifts/restlessjar/models/png/aquarium.png"
    },
    {
        id: "p5",
        name: "Green Ring",
        rarity: "Epic",
        value: 3153,
        weight: 5,
        image: "https://storage.portal-market.com/portals-market/gifts/moonpendant/models/png/azurite.png"
    },
    {
        id: "p6",
        name: "Megaphone",
        rarity: "Rare",
        value: 1876,
        weight: 10,
        image: "https://storage.portal-market.com/portals-market/gifts/faithamulet/models/png/bronzetower.png"
    },
    {
        id: "p7",
        name: "Pumpkin Spice",
        rarity: "Rare",
        value: 1288,
        weight: 10,
        image: "https://storage.portal-market.com/portals-market/gifts/vicecream/models/png/pumpkinspice.png"
    },
    {
        id: "p8",
        name: "White Flower",
        rarity: "Rare",
        value: 1154,
        weight: 10,
        image: "https://storage.portal-market.com/portals-market/gifts/lushbouquet/models/png/artichoke.png"
    },
    {
        id: "p9",
        name: "Painter",
        rarity: "Rare",
        value: 966,
        weight: 10,
        image: "https://storage.portal-market.com/portals-market/gifts/hangingstar/models/png/advicedog.png"
    },
    {
        id: "p10",
        name: "Light Sword",
        rarity: "Common",
        value: 593,
        weight: 18,
        image: "https://storage.portal-market.com/portals-market/gifts/lightsword/models/png/absinthe.png"
    },
    {
        id: "p11",
        name: "Money Bag",
        rarity: "Common",
        value: 576,
        weight: 18,
        image: "https://storage.portal-market.com/portals-market/gifts/westsidesign/models/png/allin.png"
    },
    {
        id: "p12",
        name: "Balloon",
        rarity: "Common",
        value: 432,
        weight: 20,
        image: "https://storage.portal-market.com/portals-market/gifts/candycane/models/png/amberglitter.png"
    },
    {
        id: "p13",
        name: "Fish Tank",
        rarity: "Common",
        value: 347,
        weight: 22,
        image: "https://storage.portal-market.com/portals-market/gifts/petsnake/models/png/albino.png"
    },
    {
        id: "p14",
        name: "Jungle Case",
        rarity: "Common",
        value: 343,
        weight: 22,
        image: "https://storage.portal-market.com/portals-market/gifts/nekohelmet/models/png/acidpunch.png"
    },
    {
        id: "p15",
        name: "Banana",
        rarity: "Common",
        value: 339,
        weight: 22,
        image: "https://storage.portal-market.com/portals-market/gifts/bunnymuffin/models/png/airysouffle.png"
    },
    {
        id: "p16",
        name: "Magic Portal",
        rarity: "Common",
        value: 327,
        weight: 22,
        image: "https://storage.portal-market.com/portals-market/gifts/cupidcharm/models/png/bloodgem.png"
    },
    {
        id: "p17",
        name: "Fox Toy",
        rarity: "Common",
        value: 322,
        weight: 22,
        image: "https://storage.portal-market.com/portals-market/gifts/toybear/models/png/alterego.png"
    },
    {
        id: "p18",
        name: "100 Stars",
        rarity: "Bonus",
        value: 100,
        weight: 14,
        emoji: "⭐"
    },
    {
        id: "p19",
        name: "75 Stars",
        rarity: "Bonus",
        value: 75,
        weight: 16,
        emoji: "⭐"
    },
    {
        id: "p20",
        name: "50 Stars",
        rarity: "Bonus",
        value: 50,
        weight: 18,
        emoji: "⭐"
    },
    {
        id: "p21",
        name: "25 Stars",
        rarity: "Bonus",
        value: 25,
        weight: 20,
        emoji: "⭐"
    },
    {
        id: "p22",
        name: "15 Stars",
        rarity: "Bonus",
        value: 15,
        weight: 22,
        emoji: "⭐"
    },
    {
        id: "p23",
        name: "10 Stars",
        rarity: "Bonus",
        value: 10,
        weight: 25,
        emoji: "⭐"
    },
    {
        id: "p24",
        name: "5 Stars",
        rarity: "Bonus",
        value: 5,
        weight: 30,
        emoji: "⭐"
    }
];

const cases = [
    {
        id: "free",
        title: "Free",
        subtitle: "2 cases",
        price: 0,
        css: "card-free",
        art: "🎁"
    },
    {
        id: "roulette",
        title: "Roulette",
        subtitle: "15 cases",
        price: 15,
        css: "card-roulette",
        art: "🎡"
    },
    {
        id: "pvp",
        title: "PvP",
        subtitle: "Online",
        price: 20,
        css: "card-pvp",
        art: "⚔️"
    },
    {
        id: "crash",
        title: "Crash",
        subtitle: "Online",
        price: 25,
        css: "card-crash",
        art: "🚀"
    },
    {
        id: "slots",
        title: "Slots",
        subtitle: "5 cases",
        price: 10,
        css: "card-slots",
        art: "🎰"
    },
    {
        id: "eggs",
        title: "Eggs",
        subtitle: "6 cases",
        price: 8,
        css: "card-eggs",
        art: "🥚"
    },
    {
        id: "upgrade",
        title: "Upgrade",
        subtitle: "Improve your gifts",
        price: 0,
        css: "card-upgrade",
        art: "⬆️"
    }
];

startApp();

function startApp() {
    renderLive();
    renderHome();
    renderTasks();
    renderRaffles();
    renderLeaderboard();
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
            if (target === "profile-screen") renderProfile();
        });
    });
}

function renderLive() {
    const liveTrack = document.getElementById("liveTrack");

    liveTrack.innerHTML = liveItems
        .map((src) => {
            return `
                <div class="live-item">
                    <img src="${src}" alt="">
                </div>
            `;
        })
        .join("");
}

function renderHome() {
    const homeScreen = document.getElementById("home-screen");

    homeScreen.innerHTML = `
        <div class="page-shell">
            <div class="game-list">
                ${cases
                    .map(
                        (caseItem) => `
                            <button class="game-card ${caseItem.css}" data-case="${caseItem.id}">
                                <div class="game-card-content">
                                    <h2>${caseItem.title}</h2>
                                    <p>${caseItem.subtitle}</p>
                                </div>

                                <div class="game-card-art">
                                    <span>${caseItem.art}</span>
                                </div>
                            </button>
                        `
                    )
                    .join("")}
            </div>
        </div>
    `;

    document.querySelectorAll(".game-card").forEach((card) => {
        card.addEventListener("click", () => {
            const caseItem = cases.find((item) => item.id === card.dataset.case);
            currentCase = caseItem;
            renderCasePage(caseItem);
        });
    });
}

function renderCasePage(caseItem) {
    currentCase = caseItem;

    const homeScreen = document.getElementById("home-screen");
    const topPrizes = [...prizes].sort((a, b) => b.value - a.value).slice(0, 9);

    homeScreen.innerHTML = `
        <div class="page-shell">
            <div class="case-page">
                <div class="case-top">
                    <button class="back-btn" id="backBtn">←</button>

                    <div class="case-title">
                        <h2>${caseItem.title}</h2>
                        <p>${caseItem.price === 0 ? "Free case" : `Spin price: ⭐ ${caseItem.price}`}</p>
                    </div>

                    <button class="case-top-btn" id="settingsBtn">⚙️</button>
                </div>

                <div class="roulette-window">
                    <div class="roulette-pointer"></div>
                    <div class="roulette-track" id="rouletteTrack">
                        ${buildIdleReel()
                            .map((item) => renderRouletteItem(item))
                            .join("")}
                    </div>
                </div>

                <div class="case-preview-grid">
                    ${topPrizes.map((item) => renderPreviewCard(item)).join("")}
                </div>

                <div class="case-action-row">
                    <button class="case-mini-btn" id="prizesBtn">🎁 Prizes</button>
                    <button class="case-mini-btn" id="demoBtn">${demoMode ? "🟢 Demo ON" : "⚪ Demo OFF"}</button>
                </div>

                <button class="spin-btn" id="spinBtn">
                    ${demoMode ? "Spin Demo" : caseItem.price === 0 ? "Spin Free" : `Spin • ⭐ ${caseItem.price}`}
                </button>

                <div class="demo-note">
                    ${demoMode ? "Demo mode active. Prize preview only." : "Real mode active. Rewards go to inventory."}
                </div>
            </div>
        </div>
    `;

    document.getElementById("backBtn").addEventListener("click", renderHome);
    document.getElementById("settingsBtn").addEventListener("click", openSettingsModal);
    document.getElementById("prizesBtn").addEventListener("click", openPrizesModal);
    document.getElementById("demoBtn").addEventListener("click", toggleDemoMode);
    document.getElementById("spinBtn").addEventListener("click", () => spinCase(caseItem));
}

function buildIdleReel() {
    const reel = [];

    for (let i = 0; i < 14; i++) {
        reel.push(prizes[i % prizes.length]);
    }

    return reel;
}

function buildSpinReel(finalPrize) {
    const reel = [];

    for (let i = 0; i < 24; i++) {
        reel.push(prizes[Math.floor(Math.random() * prizes.length)]);
    }

    reel.push(finalPrize);

    return reel;
}

function renderRouletteItem(item) {
    return `
        <div class="roulette-item">
            ${item.image ? `<img src="${item.image}" alt="">` : `<span>${item.emoji || "🎁"}</span>`}
            <small>${item.name}</small>
        </div>
    `;
}

function renderPreviewCard(item) {
    return `
        <div class="preview-card">
            ${item.image ? `<img src="${item.image}" alt="">` : `<span>${item.emoji || "🎁"}</span>`}
            <strong>⭐ ${item.value.toLocaleString()}</strong>
            <small>${item.name}</small>
        </div>
    `;
}

function spinCase(caseItem) {
    if (isSpinning) return;

    if (!demoMode && caseItem.price > 0 && stars < caseItem.price) {
        fakeToast("Not enough stars");
        return;
    }

    if (!demoMode && caseItem.price > 0) {
        stars -= caseItem.price;
        updateBalances();
    }

    isSpinning = true;

    const finalPrize = getWeightedPrize();
    const fakeResponse = createFakeSpinResponse(finalPrize);
    const reel = buildSpinReel(finalPrize);
    const rouletteTrack = document.getElementById("rouletteTrack");

    rouletteTrack.style.transition = "none";
    rouletteTrack.style.transform = "translateX(0px)";
    rouletteTrack.innerHTML = reel.map((item) => renderRouletteItem(item)).join("");

    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            rouletteTrack.style.transition = "transform 3.8s cubic-bezier(0.12, 0.82, 0.22, 1)";
            rouletteTrack.style.transform = "translateX(-2320px)";
        });
    });

    setTimeout(() => {
        handleSpinResult(fakeResponse, finalPrize, caseItem);
    }, 3900);
}

function createFakeSpinResponse(prize) {
    return {
        status: "ok",
        payload: {
            prizeId: prize.id,
            inventoryId: demoMode ? null : crypto.randomUUID()
        }
    };
}

function handleSpinResult(response, prize, caseItem) {
    if (response.status !== "ok") {
        fakeToast("Spin failed");
        isSpinning = false;
        return;
    }

    if (!demoMode) {
        if (prize.rarity === "Bonus") {
            stars += prize.value;
        } else {
            inventory.unshift({
                ...prize,
                inventoryId: response.payload.inventoryId
            });
        }
    }

    updateBalances();
    renderProfile();

    const homeScreen = document.getElementById("home-screen");

    homeScreen.innerHTML = `
        <div class="page-shell">
            <div class="reward-screen">
                <div class="reward-card">
                    <div class="reward-art">
                        ${prize.image ? `<img src="${prize.image}" alt="">` : `<span>${prize.emoji || "🎁"}</span>`}
                    </div>

                    <h2>${prize.name}</h2>
                    <p>${prize.rarity} • ⭐ ${prize.value.toLocaleString()}</p>

                    <button class="claim-btn" id="claimBtn">
                        ${demoMode ? "Back" : "Claim"}
                    </button>
                </div>
            </div>
        </div>
    `;

    document.getElementById("claimBtn").addEventListener("click", () => {
        isSpinning = false;
        renderCasePage(caseItem);
    });
}

function getWeightedPrize() {
    const totalWeight = prizes.reduce((sum, item) => sum + item.weight, 0);
    let random = Math.random() * totalWeight;

    for (const item of prizes) {
        random -= item.weight;

        if (random <= 0) {
            return item;
        }
    }

    return prizes[prizes.length - 1];
}

function toggleDemoMode() {
    demoMode = !demoMode;
    fakeToast(demoMode ? "Demo mode enabled" : "Demo mode disabled");

    if (currentCase) {
        renderCasePage(currentCase);
    }
}

function openSettingsModal() {
    closeModal();

    const modal = document.createElement("div");
    modal.className = "modal-backdrop";

    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" id="modalCloseBtn">×</button>

            <div class="modal-title">Case settings</div>

            <div class="settings-row">
                <div>
                    <h3>Demo mode</h3>
                    <p>All cases are free, but prizes will not be credited.</p>
                </div>

                <button class="switch ${demoMode ? "active" : ""}" id="demoSwitch">
                    <span></span>
                </button>
            </div>

            <button class="modal-bottom-btn" id="modalBottomCloseBtn">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
    document.getElementById("modalBottomCloseBtn").addEventListener("click", closeModal);

    document.getElementById("demoSwitch").addEventListener("click", () => {
        demoMode = !demoMode;
        document.getElementById("demoSwitch").classList.toggle("active", demoMode);
        fakeToast(demoMode ? "Demo mode enabled" : "Demo mode disabled");

        if (currentCase) {
            renderCasePage(currentCase);
        }
    });
}

function openPrizesModal() {
    closeModal();

    const sortedPrizes = [...prizes].sort((a, b) => b.value - a.value);

    const modal = document.createElement("div");
    modal.className = "modal-backdrop";

    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" id="modalCloseBtn">×</button>

            <div class="modal-title">Possible prizes</div>

            <div class="prize-grid">
                ${sortedPrizes
                    .map(
                        (item) => `
                            <div class="prize-card">
                                <div class="prize-icon">
                                    ${item.image ? `<img src="${item.image}" alt="">` : `<span>${item.emoji || "🎁"}</span>`}
                                </div>
                                <div class="prize-price">⭐ ${item.value.toLocaleString()}</div>
                                <div class="prize-name">${item.name}</div>
                            </div>
                        `
                    )
                    .join("")}
            </div>

            <button class="modal-bottom-btn" id="modalBottomCloseBtn">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("modalCloseBtn").addEventListener("click", closeModal);
    document.getElementById("modalBottomCloseBtn").addEventListener("click", closeModal);
}

function closeModal() {
    const modal = document.querySelector(".modal-backdrop");

    if (modal) {
        modal.remove();
    }
}

function renderTasks() {
    const tasksScreen = document.getElementById("tasks-screen");

    tasksScreen.innerHTML = `
        <div class="page-title">Tasks</div>

        <div class="task-list">
            <div class="task-card">
                <div>
                    <h3>Join Telegram Channel</h3>
                    <p>+500 stars</p>
                </div>
                <button onclick="completeTask(500)">GO</button>
            </div>

            <div class="task-card">
                <div>
                    <h3>Invite 3 Friends</h3>
                    <p>+1500 stars</p>
                </div>
                <button onclick="completeTask(1500)">GO</button>
            </div>

            <div class="task-card">
                <div>
                    <h3>Daily Login</h3>
                    <p>+250 stars</p>
                </div>
                <button onclick="completeTask(250)">CLAIM</button>
            </div>
        </div>
    `;
}

function completeTask(amount) {
    stars += amount;
    updateBalances();
    renderProfile();
    fakeToast(`+${amount} stars added`);
}

function renderRaffles() {
    const rafflesScreen = document.getElementById("raffles-screen");

    rafflesScreen.innerHTML = `
        <div class="page-title">Raffles</div>

        <div class="raffle-card">
            <div class="raffle-top">
                <span>🔥 Premium Case</span>
                <span>2h left</span>
            </div>

            <div class="raffle-progress">
                <div class="raffle-fill"></div>
            </div>

            <button class="join-btn" onclick="fakeToast('Raffle joined')">JOIN NOW</button>
        </div>
    `;
}

function renderLeaderboard() {
    const leaderboardScreen = document.getElementById("leaderboard-screen");

    leaderboardScreen.innerHTML = `
        <div class="page-title">Leaderboard</div>

        <div class="leaderboard-list">
            <div class="leaderboard-item">
                <span>#1</span>
                <span>areszers</span>
                <span>125.000</span>
            </div>

            <div class="leaderboard-item">
                <span>#2</span>
                <span>ghost</span>
                <span>98.400</span>
            </div>

            <div class="leaderboard-item">
                <span>#3</span>
                <span>darkking</span>
                <span>77.210</span>
            </div>
        </div>
    `;
}

function renderProfile() {
    const profileScreen = document.getElementById("profile-screen");
    const displayName = user.username ? `@${user.username}` : user.first_name;

    profileScreen.innerHTML = `
        <div class="profile-card">
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
                    <p>Items</p>
                </div>

                <div class="stat-box">
                    <h3>${demoMode ? "ON" : "OFF"}</h3>
                    <p>Demo</p>
                </div>
            </div>

            <div class="inventory-section">
                <h3 class="inventory-title">Inventory</h3>

                <div class="inventory-list">
                    ${
                        inventory.length === 0
                            ? `<div class="empty-inventory">No items yet.</div>`
                            : inventory
                                  .map(
                                      (item) => `
                                        <div class="inventory-item">
                                            ${item.image ? `<img src="${item.image}" alt="">` : `<span>${item.emoji || "🎁"}</span>`}

                                            <div>
                                                <h4>${item.name}</h4>
                                                <small>${item.rarity} • ⭐ ${item.value.toLocaleString()}</small>
                                            </div>
                                        </div>
                                      `
                                  )
                                  .join("")
                    }
                </div>
            </div>
        </div>
    `;
}

function updateBalances() {
    document.getElementById("starBalance").innerHTML = `⭐ ${stars.toLocaleString()}`;
    document.getElementById("ticketBalance").innerHTML = `🎟️ ${tickets}`;
}

function fakeToast(message) {
    const oldToast = document.querySelector(".toast");

    if (oldToast) {
        oldToast.remove();
    }

    const toast = document.createElement("div");
    toast.className = "toast";
    toast.innerText = message;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);
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