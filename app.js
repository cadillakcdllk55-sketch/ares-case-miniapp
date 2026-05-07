const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
    tg.setHeaderColor("#071124");
    tg.setBackgroundColor("#071124");
}

const user = tg?.initDataUnsafe?.user || {
    id: 458291,
    first_name: "Ares",
    username: "areszers"
};

const navButtons = document.querySelectorAll(".nav-btn");
const screens = document.querySelectorAll(".screen");

let balance = 35;
let tickets = 2;
let inventory = [];
let demoMode = true;
let currentCaseName = "Free Case";
let currentCaseOpening = false;

const prizes = [
    { icon: "🐒", name: "Monkey", value: 19044, rarity: "Mythic", weight: 1 },
    { icon: "🦾", name: "Robot Arm", value: 17969, rarity: "Mythic", weight: 1 },
    { icon: "👜", name: "Luxury Bag", value: 15536, rarity: "Legendary", weight: 2 },
    { icon: "💼", name: "Blue Case", value: 3727, rarity: "Epic", weight: 5 },
    { icon: "💍", name: "Green Ring", value: 3153, rarity: "Epic", weight: 5 },
    { icon: "📣", name: "Megaphone", value: 1876, rarity: "Rare", weight: 10 },
    { icon: "🎃", name: "Pumpkin", value: 1288, rarity: "Rare", weight: 10 },
    { icon: "🌼", name: "White Flower", value: 1154, rarity: "Rare", weight: 10 },
    { icon: "🎨", name: "Painter", value: 966, rarity: "Rare", weight: 10 },
    { icon: "🧪", name: "Laser Sword", value: 593, rarity: "Common", weight: 18 },
    { icon: "💸", name: "Money Bag", value: 576, rarity: "Common", weight: 18 },
    { icon: "🎈", name: "Balloon", value: 432, rarity: "Common", weight: 20 },
    { icon: "🐟", name: "Fish Tank", value: 347, rarity: "Common", weight: 22 },
    { icon: "🥭", name: "Jungle Case", value: 343, rarity: "Common", weight: 22 },
    { icon: "🍌", name: "Banana", value: 339, rarity: "Common", weight: 22 },
    { icon: "🌀", name: "Magic Portal", value: 327, rarity: "Common", weight: 22 },
    { icon: "🦊", name: "Fox Toy", value: 322, rarity: "Common", weight: 22 },
    { icon: "⭐", name: "100 Stars", value: 100, rarity: "Bonus", weight: 14 },
    { icon: "⭐", name: "75 Stars", value: 75, rarity: "Bonus", weight: 16 },
    { icon: "⭐", name: "50 Stars", value: 50, rarity: "Bonus", weight: 18 },
    { icon: "⭐", name: "25 Stars", value: 25, rarity: "Bonus", weight: 20 },
    { icon: "⭐", name: "15 Stars", value: 15, rarity: "Bonus", weight: 22 },
    { icon: "⭐", name: "10 Stars", value: 10, rarity: "Bonus", weight: 25 },
    { icon: "⭐", name: "5 Stars", value: 5, rarity: "Bonus", weight: 30 }
];

const cases = [
    { name: "Free Case", title: "Free", subtitle: "2 cases", icon: "🎁", className: "gray", price: 0 },
    { name: "Roulette", title: "Roulette", subtitle: "15 cases", icon: "⭐", className: "blue", price: 15 },
    { name: "PvP", title: "PvP", subtitle: "Online", icon: "⚔️", className: "orange", price: 20 },
    { name: "Crash", title: "Crash", subtitle: "Online", icon: "🚀", className: "dark", price: 25 },
    { name: "Slots", title: "Slots", subtitle: "5 cases", icon: "🎰", className: "red", price: 10 },
    { name: "Eggs", title: "Eggs", subtitle: "6 cases", icon: "🥚", className: "green", price: 8 },
    { name: "Upgrade", title: "Upgrade", subtitle: "Improve your gifts", icon: "⬆️", className: "purple", price: 0 }
];

startApp();

function startApp() {
    renderHome();
    renderTasks();
    renderRaffles();
    renderLeaderboard();
    updateProfile();
    updateBalance();
    bindNavigation();
    startLiveScroll();
    fakeToast("Ares Mini App Loaded");
}

function bindNavigation() {
    navButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const target = button.dataset.screen;

            navButtons.forEach((btn) => btn.classList.remove("active"));
            button.classList.add("active");

            screens.forEach((screen) => screen.classList.remove("active"));
            document.getElementById(target).classList.add("active");

            if (target === "home-screen") {
                renderHome();
            }

            if (target === "profile-screen") {
                updateProfile();
            }
        });
    });
}

function renderHome() {
    const homeScreen = document.getElementById("home-screen");

    homeScreen.innerHTML = `
        <div class="game-list">
            ${cases
                .map(
                    (caseItem) => `
                        <div class="game-card ${caseItem.className}" data-case="${caseItem.name}">
                            <div class="game-icon">${caseItem.icon}</div>

                            <div class="game-info">
                                <h3>${caseItem.title}</h3>
                                <p>${caseItem.subtitle}</p>
                            </div>
                        </div>
                    `
                )
                .join("")}
        </div>
    `;

    document.querySelectorAll(".game-card").forEach((card) => {
        card.addEventListener("click", () => {
            renderCasePage(card.dataset.case);
        });
    });
}

function renderCasePage(caseName) {
    currentCaseName = caseName;

    const selectedCase = cases.find((caseItem) => caseItem.name === caseName) || cases[0];
    const homeScreen = document.getElementById("home-screen");
    const previewItems = [...prizes].sort((a, b) => b.value - a.value).slice(0, 10);

    homeScreen.innerHTML = `
        <div class="case-page">
            <div class="case-header">
                <button class="back-btn" id="backToCasesBtn">← Cases</button>

                <div class="case-title">
                    <h2>${selectedCase.title}</h2>
                    <p>${selectedCase.price === 0 ? "Free spin available" : `Spin price: ⭐ ${selectedCase.price}`}</p>
                </div>
            </div>

            <div class="case-arrows">⌄</div>

            <div class="case-prize-row">
                ${previewItems
                    .map(
                        (item) => `
                            <div class="case-preview-item">
                                <div class="case-preview-icon">${item.icon}</div>
                                <div class="case-preview-price">⭐ ${item.value.toLocaleString()}</div>
                            </div>
                        `
                    )
                    .join("")}
            </div>

            <div class="case-arrows">⌃</div>

            <div class="case-action-row">
                <button class="case-mini-btn" id="settingsBtn">⚙️ Settings</button>
                <button class="case-mini-btn" id="prizesBtn">🎁 Prizes</button>
            </div>

            <button class="spin-btn" id="spinBtn">
                ${demoMode ? "Spin Demo" : selectedCase.price === 0 ? "Spin Free" : `Spin • ⭐ ${selectedCase.price}`}
            </button>

            <div class="demo-note">
                ${demoMode ? "Demo mode is active. Prizes will not be credited." : "Real mode active. Rewards will be added to inventory."}
            </div>
        </div>
    `;

    document.getElementById("backToCasesBtn").addEventListener("click", renderHome);
    document.getElementById("settingsBtn").addEventListener("click", openSettingsModal);
    document.getElementById("prizesBtn").addEventListener("click", openPrizesModal);
    document.getElementById("spinBtn").addEventListener("click", () => openCase(caseName));
}

function openCase(caseName) {
    if (currentCaseOpening) return;

    const selectedCase = cases.find((caseItem) => caseItem.name === caseName) || cases[0];

    if (!demoMode && selectedCase.price > 0 && balance < selectedCase.price) {
        fakeToast("Insufficient stars.");
        return;
    }

    if (!demoMode && selectedCase.price > 0) {
        balance -= selectedCase.price;
        updateBalance();
    }

    currentCaseOpening = true;

    const reward = getWeightedPrize();
    const reelItems = buildReelItems(reward);
    const homeScreen = document.getElementById("home-screen");

    homeScreen.innerHTML = `
        <div class="case-opening-screen">
            <div class="spinner-area">
                <div class="spinner-track">
                    ${reelItems.map((item) => `<div class="spinner-item">${item.icon}</div>`).join("")}
                </div>
            </div>

            <div class="opening-status">Opening ${caseName}...</div>
        </div>
    `;

    setTimeout(() => {
        if (!demoMode) {
            if (reward.rarity === "Bonus") {
                balance += reward.value;
            } else {
                inventory.unshift(reward);
            }
        }

        updateBalance();
        updateProfile();

        homeScreen.innerHTML = `
            <div class="reward-screen">
                <div class="reward-icon">${reward.icon}</div>
                <h2>${reward.name}</h2>
                <p>${reward.rarity} • ⭐ ${reward.value.toLocaleString()}</p>
                <button class="claim-btn" id="claimRewardBtn">
                    ${demoMode ? "BACK" : "CLAIM"}
                </button>
            </div>
        `;

        document.getElementById("claimRewardBtn").addEventListener("click", () => {
            renderCasePage(caseName);
        });

        currentCaseOpening = false;
    }, 3900);
}

function getWeightedPrize() {
    const totalWeight = prizes.reduce((sum, prize) => sum + prize.weight, 0);
    let random = Math.random() * totalWeight;

    for (const prize of prizes) {
        random -= prize.weight;

        if (random <= 0) {
            return prize;
        }
    }

    return prizes[prizes.length - 1];
}

function buildReelItems(finalPrize) {
    const reel = [];

    for (let i = 0; i < 20; i++) {
        reel.push(prizes[Math.floor(Math.random() * prizes.length)]);
    }

    reel.push(finalPrize);

    return reel;
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
                    <p>All cases are free, but prizes won't be credited.</p>
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
        renderCasePage(currentCaseName);
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
                                <div class="prize-icon">${item.icon}</div>
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
    document.getElementById("tasks-screen").innerHTML = `
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
    balance += amount;
    updateBalance();
    updateProfile();
    fakeToast(`+${amount} stars added.`);
}

function renderRaffles() {
    document.getElementById("raffles-screen").innerHTML = `
        <div class="page-title">Raffles</div>

        <div class="raffle-card">
            <div class="raffle-top">
                <span>🔥 Premium Case</span>
                <span>2h left</span>
            </div>

            <div class="raffle-progress">
                <div class="raffle-fill"></div>
            </div>

            <button class="join-btn" onclick="fakeToast('Raffle joined.')">JOIN NOW</button>
        </div>
    `;
}

function renderLeaderboard() {
    document.getElementById("leaderboard-screen").innerHTML = `
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

function updateProfile() {
    const profileScreen = document.getElementById("profile-screen");
    const displayName = user.username ? `@${user.username}` : user.first_name;

    profileScreen.innerHTML = `
        <div class="profile-card">
            <div class="profile-avatar">${user.first_name.charAt(0)}</div>
            <h2>${displayName}</h2>
            <p>ID: ${user.id}</p>

            <div class="profile-stats">
                <div class="stat-box">
                    <h3>${balance}</h3>
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
                                            <span>${item.icon}</span>
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

function updateBalance() {
    document.getElementById("starBalance").innerHTML = `⭐ ${balance.toLocaleString()}`;
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

    setTimeout(() => toast.classList.add("show"), 50);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => toast.remove(), 300);
    }, 2200);
}

function startLiveScroll() {
    const liveItems = document.getElementById("liveItems");

    if (!liveItems) return;

    let scrollPos = 0;

    setInterval(() => {
        scrollPos += 1;

        liveItems.scrollTo({
            left: scrollPos,
            behavior: "smooth"
        });

        if (scrollPos > liveItems.scrollWidth / 2) {
            scrollPos = 0;
        }
    }, 35);
}