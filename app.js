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
let currentCaseOpening = false;

/* NAVIGATION */

navButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const target = button.dataset.screen;

        navButtons.forEach((btn) => {
            btn.classList.remove("active");
        });

        button.classList.add("active");

        screens.forEach((screen) => {
            screen.classList.remove("active");
        });

        document.getElementById(target).classList.add("active");

    });

});

/* PROFILE */

updateProfile();

function updateProfile() {

    const profileScreen = document.getElementById("profile-screen");

    profileScreen.innerHTML = `

        <div class="profile-card">

            <div class="profile-avatar">
                ${user.first_name.charAt(0)}
            </div>

            <h2>${user.username}</h2>

            <p>ID: ${user.id}</p>

            <div class="profile-stats">

                <div class="stat-box">
                    <h3>${balance}</h3>
                    <p>Coins</p>
                </div>

                <div class="stat-box">
                    <h3>${inventory.length}</h3>
                    <p>Items</p>
                </div>

            </div>

            <div class="inventory-section">

                <h3 class="inventory-title">
                    Inventory
                </h3>

                <div class="inventory-list">

                    ${
                        inventory.length === 0
                        ?
                        `
                        <div class="empty-inventory">
                            No items yet.
                        </div>
                        `
                        :
                        inventory.map(item => `
                            <div class="inventory-item">

                                <span>${item.icon}</span>

                                <div>
                                    <h4>${item.name}</h4>
                                    <p>${item.rarity}</p>
                                </div>

                            </div>
                        `).join("")
                    }

                </div>

            </div>

        </div>

    `;

}

/* CASE SYSTEM */

const gameCards = document.querySelectorAll(".game-card");

gameCards.forEach((card) => {

    card.addEventListener("click", () => {

        const gameName = card.querySelector("h3").innerText;

        if (gameName === "Free") {
            openCase("Free Case");
        }

        else if (gameName === "Roulette") {
            fakeToast("Roulette system coming soon.");
        }

        else if (gameName === "PvP") {
            fakeToast("PvP battles coming soon.");
        }

        else if (gameName === "Crash") {
            fakeToast("Crash system coming soon.");
        }

        else if (gameName === "Slots") {
            fakeToast("Slots system coming soon.");
        }

        else if (gameName === "Eggs") {
            fakeToast("Egg opening system coming soon.");
        }

        else if (gameName === "Upgrade") {
            fakeToast("Upgrade system coming soon.");
        }

    });

});

function openCase(caseName) {

    if (currentCaseOpening) return;

    currentCaseOpening = true;

    const rewards = [

        {
            icon: "💎",
            name: "Diamond",
            rarity: "Legendary"
        },

        {
            icon: "🔥",
            name: "Fire Blade",
            rarity: "Epic"
        },

        {
            icon: "🎟️",
            name: "Ticket",
            rarity: "Rare"
        },

        {
            icon: "🪙",
            name: "Golden Coin",
            rarity: "Common"
        },

        {
            icon: "👑",
            name: "King Crown",
            rarity: "Mythic"
        }

    ];

    const reward = rewards[
        Math.floor(Math.random() * rewards.length)
    ];

    const homeScreen = document.getElementById("home-screen");

    homeScreen.innerHTML = `

        <div class="case-opening-screen">

            <div class="spinner-area">

                <div class="spinner-track">

                    <div class="spinner-item">💎</div>
                    <div class="spinner-item">🔥</div>
                    <div class="spinner-item">🎟️</div>
                    <div class="spinner-item">👑</div>
                    <div class="spinner-item">🪙</div>
                    <div class="spinner-item">💣</div>
                    <div class="spinner-item">⚔️</div>
                    <div class="spinner-item">🚀</div>

                </div>

            </div>

            <div class="opening-status">
                Opening ${caseName}...
            </div>

        </div>

    `;

    setTimeout(() => {

        inventory.push(reward);

        balance += 5;

        updateBalance();
        updateProfile();

        homeScreen.innerHTML = `

            <div class="reward-screen">

                <div class="reward-icon">
                    ${reward.icon}
                </div>

                <h2>${reward.name}</h2>

                <p>${reward.rarity}</p>

                <button class="claim-btn" id="claimRewardBtn">
                    CLAIM
                </button>

            </div>

        `;

        document
            .getElementById("claimRewardBtn")
            .addEventListener("click", () => {

                renderHome();

            });

        currentCaseOpening = false;

    }, 3500);

}

/* HOME RENDER */

function renderHome() {

    const homeScreen = document.getElementById("home-screen");

    homeScreen.innerHTML = `

        <div class="game-list">

            <div class="game-card gray">
                <div class="game-icon">🎁</div>

                <div class="game-info">
                    <h3>Free</h3>
                    <p>2 cases</p>
                </div>
            </div>

            <div class="game-card blue">
                <div class="game-icon">⭐</div>

                <div class="game-info">
                    <h3>Roulette</h3>
                    <p>15 cases</p>
                </div>
            </div>

            <div class="game-card orange">
                <div class="game-icon">⚔️</div>

                <div class="game-info">
                    <h3>PvP</h3>
                    <p>Online</p>
                </div>
            </div>

            <div class="game-card dark">
                <div class="game-icon">🚀</div>

                <div class="game-info">
                    <h3>Crash</h3>
                    <p>Online</p>
                </div>
            </div>

            <div class="game-card red">
                <div class="game-icon">🎰</div>

                <div class="game-info">
                    <h3>Slots</h3>
                    <p>5 cases</p>
                </div>
            </div>

            <div class="game-card green">
                <div class="game-icon">🥚</div>

                <div class="game-info">
                    <h3>Eggs</h3>
                    <p>6 cases</p>
                </div>
            </div>

            <div class="game-card purple">
                <div class="game-icon">⬆️</div>

                <div class="game-info">
                    <h3>Upgrade</h3>
                    <p>Improve your gifts</p>
                </div>
            </div>

        </div>

    `;

    reconnectGameCards();

}

function reconnectGameCards() {

    const cards = document.querySelectorAll(".game-card");

    cards.forEach((card) => {

        card.addEventListener("click", () => {

            const gameName = card.querySelector("h3").innerText;

            if (gameName === "Free") {
                openCase("Free Case");
            }

            else {
                fakeToast(`${gameName} system coming soon.`);
            }

        });

    });

}

/* BALANCE */

function updateBalance() {

    const pills = document.querySelectorAll(".balance-pill");

    pills[0].innerHTML = `⭐ ${balance}`;
    pills[1].innerHTML = `🎟️ ${tickets}`;

}

/* TOAST */

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

    }, 2400);

}

/* LIVE ITEMS AUTO SCROLL */

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

/* START */

fakeToast("Ares Mini App Loaded");