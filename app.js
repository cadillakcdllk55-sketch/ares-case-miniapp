const tg = window.Telegram?.WebApp;

if (tg) {
    tg.ready();
    tg.expand();
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
let currentCaseOpening = false;

const prizes = [
    { icon: "🐒", name: "Monkey", value: 19044, rarity: "Mythic" },
    { icon: "🦾", name: "Robot Arm", value: 17969, rarity: "Mythic" },
    { icon: "👜", name: "Luxury Bag", value: 15536, rarity: "Legendary" },
    { icon: "💼", name: "Blue Case", value: 3727, rarity: "Epic" },
    { icon: "💍", name: "Green Ring", value: 3153, rarity: "Epic" },
    { icon: "📣", name: "Megaphone", value: 1876, rarity: "Rare" },
    { icon: "🎃", name: "Pumpkin", value: 1288, rarity: "Rare" },
    { icon: "🌼", name: "White Flower", value: 1154, rarity: "Rare" },
    { icon: "🎨", name: "Painter", value: 966, rarity: "Rare" },
    { icon: "🧪", name: "Laser Sword", value: 593, rarity: "Common" },
    { icon: "💸", name: "Money Bag", value: 576, rarity: "Common" },
    { icon: "🎈", name: "Balloon", value: 432, rarity: "Common" },
    { icon: "🐟", name: "Fish Tank", value: 347, rarity: "Common" },
    { icon: "🥭", name: "Jungle Case", value: 343, rarity: "Common" },
    { icon: "🍌", name: "Banana", value: 339, rarity: "Common" },
    { icon: "🌀", name: "Magic Portal", value: 327, rarity: "Common" },
    { icon: "🦊", name: "Fox Toy", value: 322, rarity: "Common" },
    { icon: "⭐", name: "100 Stars", value: 100, rarity: "Bonus" },
    { icon: "⭐", name: "75 Stars", value: 75, rarity: "Bonus" },
    { icon: "⭐", name: "50 Stars", value: 50, rarity: "Bonus" },
    { icon: "⭐", name: "25 Stars", value: 25, rarity: "Bonus" },
    { icon: "⭐", name: "15 Stars", value: 15, rarity: "Bonus" },
    { icon: "⭐", name: "10 Stars", value: 10, rarity: "Bonus" },
    { icon: "⭐", name: "5 Stars", value: 5, rarity: "Bonus" }
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
        });
    });
}

function renderHome() {
    const homeScreen = document.getElementById("home-screen");

    homeScreen.innerHTML = `
        <div class="game-list">
            <div class="game-card gray" data-case="Free Case">
                <div class="game-icon">🎁</div>
                <div class="game-info">
                    <h3>Free</h3>
                    <p>2 cases</p>
                </div>
            </div>

            <div class="game-card blue" data-case="Roulette">
                <div class="game-icon">⭐</div>
                <div class="game-info">
                    <h3>Roulette</h3>
                    <p>15 cases</p>
                </div>
            </div>

            <div class="game-card orange" data-case="PvP">
                <div class="game-icon">⚔️</div>
                <div class="game-info">
                    <h3>PvP</h3>
                    <p>Online</p>
                </div>
            </div>

            <div class="game-card dark" data-case="Crash">
                <div class="game-icon">🚀</div>
                <div class="game-info">
                    <h3>Crash</h3>
                    <p>Online</p>
                </div>
            </div>

            <div class="game-card red" data-case="Slots">
                <div class="game-icon">🎰</div>
                <div class="game-info">
                    <h3>Slots</h3>
                    <p>5 cases</p>
                </div>
            </div>

            <div class="game-card green" data-case="Eggs">
                <div class="game-icon">🥚</div>
                <div class="game-info">
                    <h3>Eggs</h3>
                    <p>6 cases</p>
                </div>
            </div>

            <div class="game-card purple" data-case="Upgrade">
                <div class="game-icon">⬆️</div>
                <div class="game-info">
                    <h3>Upgrade</h3>
                    <p>Improve your gifts</p>
                </div>
            </div>
        </div>
    `;

    document.querySelectorAll(".game-card").forEach((card) => {
        card.addEventListener("click", () => {
            renderCasePage(card.dataset.case);
        });
    });
}

function renderCasePage(caseName) {
    const homeScreen = document.getElementById("home-screen");
    const previewItems = prizes.slice(3, 9);

    homeScreen.innerHTML = `
        <div class="case-page">
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

            <button class="spin-btn" id="spinBtn">Spin</button>
        </div>
    `;

    document.getElementById("settingsBtn").addEventListener("click", openSettingsModal);
    document.getElementById("prizesBtn").addEventListener("click", openPrizesModal);
    document.getElementById("spinBtn").addEventListener("click", () => openCase(caseName));
}

function openCase(caseName) {
    if (currentCaseOpening) return;

    currentCaseOpening = true;

    const reward = prizes[Math.floor(Math.random() * prizes.length)];
    const homeScreen = document.getElementById("home-screen");

    homeScreen.innerHTML = `
        <div class="case-opening-screen">
            <div class="spinner-area">
                <div class="spinner-track">
                    ${prizes
                        .slice(0, 8)
                        .map((item) => `<div class="spinner-item">${item.icon}</div>`)
                        .join("")}
                    <div class="spinner-item">${reward.icon}</div>
                </div>
            </div>

            <div class="opening-status">Opening ${caseName}...</div>
        </div>
    `;

    setTimeout(() => {
        if (!demoMode) {
            inventory.push(reward);
        }

        if (reward.rarity === "Bonus") {
            balance += reward.value;
        } else {
            balance += 5;
        }

        updateBalance();
        updateProfile();

        homeScreen.innerHTML = `
            <div class="reward-screen">
                <div class="reward-icon">${reward.icon}</div>
                <h2>${reward.name}</h2>
                <p>${reward.rarity} • ⭐ ${reward.value.toLocaleString()}</p>
                <button class="claim-btn" id="claimRewardBtn">CLAIM</button>
            </div>
        `;

        document.getElementById("claimRewardBtn").addEventListener("click", () => {
            renderCasePage(caseName);
        });

        currentCaseOpening = false;
    }, 3500);
}

function openSettingsModal() {
    closeModal();

    const modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" onclick="closeModal()">×</button>
            <div class="modal-title">Case settings</div>

            <div class="settings-row">
                <div>
                    <h3>Demo mode</h3>
                    <p>All cases are free, but prizes won't be credited</p>
                </div>

                <button class="switch ${demoMode ? "active" : ""}" id="demoSwitch">
                    <span></span>
                </button>
            </div>

            <button class="modal-bottom-btn" onclick="closeModal()">Close</button>
        </div>
    `;

    document.body.appendChild(modal);

    document.getElementById("demoSwitch").addEventListener("click", () => {
        demoMode = !demoMode;
        document.getElementById("demoSwitch").classList.toggle("active", demoMode);
        fakeToast(demoMode ? "Demo mode enabled" : "Demo mode disabled");
    });
}

function openPrizesModal() {
    closeModal();

    const modal = document.createElement("div");
    modal.className = "modal-backdrop";
    modal.innerHTML = `
        <div class="modal-box">
            <button class="modal-close" onclick="closeModal()">×</button>
            <div class="modal-title">Possible prizes</div>

            <div class="prize-grid">
                ${prizes
                    .map(
                        (item) => `
                            <div class="prize-card">
                                <div class="prize-icon">${item.icon}</div>
                                <div class="prize-price">⭐ ${item.value.toLocaleString()}</div>
                            </div>
                        `
                    )
                    .join("")}
            </div>

            <button class="modal-bottom-btn" onclick="closeModal()">Close</button>
        </div>
    `;

    document.body.appendChild(modal);
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
                    <p>+500 coins</p>
                </div>
                <button>GO</button>
            </div>

            <div class="task-card">
                <div>
                    <h3>Invite 3 Friends</h3>
                    <p>+1500 coins</p>
                </div>
                <button>GO</button>
            </div>

            <div class="task-card">
                <div>
                    <h3>Daily Login</h3>
                    <p>+250 coins</p>
                </div>
                <button>CLAIM</button>
            </div>
        </div>
    `;
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

            <button class="join-btn">JOIN NOW</button>
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

    profileScreen.innerHTML = `
        <div class="profile-card">
            <div class="profile-avatar">${user.first_name.charAt(0)}</div>
            <h2>${user.username || user.first_name}</h2>
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
                    <h3>1</h3>
                    <p>Level</p>
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
                                                <p>${item.rarity}</p>
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
    document.getElementById("starBalance").innerHTML = `⭐ ${balance}`;
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

const liveItems = document.querySelector(".live-items");
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