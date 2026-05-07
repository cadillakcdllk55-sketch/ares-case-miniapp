const tg = window.Telegram?.WebApp;

if (tg) {
  tg.ready();
  tg.expand();
}

const user = tg?.initDataUnsafe?.user || {
  id: "local_test",
  first_name: "Test User",
  username: "local_user",
  photo_url: ""
};

const caseCards = document.querySelectorAll(".case-card");
const bottomButtons = document.querySelectorAll(".bottom-nav button");

const modal = document.getElementById("dailyModal");
const closeModal = document.getElementById("closeModal");
const goDaily = document.getElementById("goDaily");
const mainScreen = document.querySelector(".main-screen");

let balance = 35;
let tickets = 2;
let inventory = [];

document.getElementById("starBalance").textContent = balance;
document.getElementById("ticketBalance").textContent = tickets;

window.addEventListener("load", () => {
  setTimeout(() => {
    modal.classList.remove("hidden");
  }, 1200);
});

closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
});

goDaily.addEventListener("click", () => {
  modal.classList.add("hidden");
  openDailyReward();
});

caseCards.forEach((card) => {
  card.addEventListener("click", () => {
    openPage(card.dataset.page);
  });
});

bottomButtons.forEach((button) => {
  button.addEventListener("click", () => {
    bottomButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    openPage(button.dataset.page);
  });
});

function openPage(page) {
  if (page === "Cases") {
    renderHome();
    return;
  }

  if (page === "Profile") {
    renderProfile();
    return;
  }

  if (page === "Free Case") {
    openDailyReward();
    return;
  }

  if (page === "Tasks") {
    renderTasks();
    return;
  }

  if (page === "Raffles") {
    renderComingSoon("🎁 Raffles");
    return;
  }

  if (page === "Leaderboard") {
    renderComingSoon("🌐 Leaderboard");
    return;
  }

  renderComingSoon(page);
}

function renderHome() {
  mainScreen.innerHTML = `
    <section class="case-menu">
      <button class="case-card dark" data-page="Free Case">
        <div class="case-icon">🎁</div>
        <div>
          <h3>Free</h3>
          <p>2 cases</p>
        </div>
      </button>

      <button class="case-card blue" data-page="Roulette">
        <div class="case-icon">⭐</div>
        <div>
          <h3>Roulette</h3>
          <p>15 cases</p>
        </div>
      </button>

      <button class="case-card orange" data-page="PvP">
        <div class="case-icon">⚔️</div>
        <div>
          <h3>PvP</h3>
          <p>Online</p>
        </div>
      </button>

      <button class="case-card navy" data-page="Crash">
        <div class="case-icon">🚀</div>
        <div>
          <h3>Crash</h3>
          <p>Online</p>
        </div>
      </button>

      <button class="case-card red" data-page="Slots">
        <div class="case-icon">🎰</div>
        <div>
          <h3>Slots</h3>
          <p>5 cases</p>
        </div>
      </button>

      <button class="case-card green" data-page="Eggs">
        <div class="case-icon">🥚</div>
        <div>
          <h3>Eggs</h3>
          <p>6 cases</p>
        </div>
      </button>

      <button class="case-card purple" data-page="Upgrade">
        <div class="case-icon">🐸</div>
        <div>
          <h3>Upgrade</h3>
          <p>Improve your gifts</p>
        </div>
      </button>

      <button class="about-btn" data-page="About">
        ℹ️ About the game
      </button>
    </section>
  `;

  reconnectCaseCards();
}

function renderProfile() {
  const username = user.username ? `@${user.username}` : "Kullanıcı adı yok";
  const photo = user.photo_url || "";

  mainScreen.innerHTML = `
    <section class="page-screen">
      <div class="profile-card">
        <div class="profile-avatar">
          ${photo ? `<img src="${photo}" alt="profile" />` : "👤"}
        </div>

        <h2>${user.first_name || "Telegram User"}</h2>
        <p>${username}</p>

        <div class="profile-stats">
          <div>
            <span>ID</span>
            <strong>${user.id}</strong>
          </div>

          <div>
            <span>Balance</span>
            <strong>${balance} ⭐</strong>
          </div>

          <div>
            <span>Tickets</span>
            <strong>${tickets} 🎟️</strong>
          </div>

          <div>
            <span>Inventory</span>
            <strong>${inventory.length}</strong>
          </div>
        </div>

        <button class="modal-action" onclick="renderInventory()">
          🎒 Envanteri Aç
        </button>
      </div>
    </section>
  `;
}

function renderInventory() {
  const itemsHtml =
    inventory.length === 0
      ? `<p class="empty-text">Henüz envanterinde item yok.</p>`
      : inventory
          .map(
            (item) => `
              <div class="inventory-item">
                <span>${item.split(" ")[0]}</span>
                <strong>${item}</strong>
              </div>
            `
          )
          .join("");

  mainScreen.innerHTML = `
    <section class="page-screen">
      <div class="profile-card">
        <h2>🎒 Envanter</h2>
        <p>Kazandığın ödüller burada görünür.</p>

        <div class="inventory-list">
          ${itemsHtml}
        </div>

        <button class="modal-action" onclick="renderProfile()">
          Profile Dön
        </button>
      </div>
    </section>
  `;
}

function renderTasks() {
  mainScreen.innerHTML = `
    <section class="page-screen">
      <div class="profile-card">
        <h2>📋 Tasks</h2>
        <p>Görevleri tamamla, yıldız kazan.</p>

        <div class="task-list">
          <button onclick="completeTask(5)">Telegram kanalına katıl +5 ⭐</button>
          <button onclick="completeTask(10)">Arkadaş davet et +10 ⭐</button>
          <button onclick="completeTask(3)">Günlük giriş +3 ⭐</button>
        </div>
      </div>
    </section>
  `;
}

function completeTask(amount) {
  balance += amount;
  document.getElementById("starBalance").textContent = balance;
  showToast(`Görev tamamlandı: +${amount} ⭐`);
}

function renderComingSoon(title) {
  mainScreen.innerHTML = `
    <section class="page-screen">
      <div class="profile-card">
        <h2>${title}</h2>
        <p>Bu bölüm sonraki aşamada aktif edilecek.</p>

        <button class="modal-action" onclick="renderHome()">
          Cases Ana Sayfasına Dön
        </button>
      </div>
    </section>
  `;
}

function openDailyReward() {
  const rewards = [
    "🎁 Gift Box",
    "💎 Diamond",
    "⭐ 5 Stars",
    "🎟️ Ticket",
    "🔥 Rare Item"
  ];

  const reward = rewards[Math.floor(Math.random() * rewards.length)];

  inventory.push(reward);
  balance += 5;

  document.getElementById("starBalance").textContent = balance;

  mainScreen.innerHTML = `
    <section class="page-screen">
      <div class="profile-card">
        <h2>🎁 Daily Reward</h2>
        <p>Günlük ödülün başarıyla açıldı.</p>

        <div class="reward-box">
          <span>${reward.split(" ")[0]}</span>
          <strong>${reward}</strong>
        </div>

        <button class="modal-action" onclick="renderInventory()">
          Envantere Git
        </button>
      </div>
    </section>
  `;
}

function reconnectCaseCards() {
  const newCaseCards = document.querySelectorAll(".case-card");

  newCaseCards.forEach((card) => {
    card.addEventListener("click", () => {
      openPage(card.dataset.page);
    });
  });
}

function showToast(message) {
  alert(message);
}

const liveItems = document.getElementById("liveItems");

let scrollPosition = 0;

setInterval(() => {
  scrollPosition += 1;

  liveItems.scrollTo({
    left: scrollPosition,
    behavior: "smooth"
  });

  if (scrollPosition > liveItems.scrollWidth / 2) {
    scrollPosition = 0;
  }
}, 30);

console.log("Ares Case Mini App Active");
console.log("Telegram User:", user);