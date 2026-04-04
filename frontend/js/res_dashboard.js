let data = [];   // ✅ ADD THIS LINE
let chart;
window.onload = () => {

  // USER INFO
  const res = JSON.parse(localStorage.getItem("resident"));

  if (!res || !res.fullname) {
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("user").innerText = res.fullname;

};

async function fetchNotifications() {
  const user = JSON.parse(localStorage.getItem("resident"));

  if (!user || !user.email) {
    console.error("Email not found in localStorage");
    return;
  }

  try {
const res = await fetch("http://localhost:3000/api/notify?email=" + user.email);

const data = await res.json();

    console.log("Notifications data:", data); // DEBUG

    showNotifications(data);

  } catch (err) {
    console.error("Fetch error:", err);
  }
}

function showNotifications(pickups) {
  const list = document.getElementById("notificationList");
  const badge = document.getElementById("badge");

  list.innerHTML = "";

  if (!Array.isArray(pickups)) {
    list.innerHTML = "<p>No notifications</p>";
    return;
  }

  // 🔥 GET READ IDS
  const read = JSON.parse(localStorage.getItem("readNotifs")) || [];

  let count = 0;

  pickups.forEach(p => {

    // ❌ SKIP already read
const key = `${p._id}-${p.status}`;

if (read.includes(key)) return;
    let message = "";

    if (p.status === "pending") {
      message = `🕒 Your pickup request is pending Approval`;
    } 
    else if (p.status === "confirmed") {
      message = `✅ Request TRK-${p._id} Confirmed`;
    } 
    else if (p.status === "collected") {
      message = `📅 Pickup scheduled`;
    } 
    else if (p.status === "In Transit") {
      message = `🚚 Pickup team is on the way`;
    } 
    else if (p.status === "Recycled") {
      message = `♻️ Pickup TRK-${p._id} Recycled`;
    }
    else if (p.status === "Disposed") {
      message = `🗑️ Pickup TRK-${p._id} Disposed`;
    }

    count++;

    list.innerHTML += `
      <div class="notification" id="notif-${p._id}">
        <div>
          <p>${message}</p>
          <p class="small">ID: ${p._id}</p>
        </div>
        <button class="mark-read" onclick="markAsRead('${p._id}', '${p.status}')">
          Mark as Read
        </button>
      </div>
    `;
  });

  // ✅ UPDATE BADGE
  if (count > 0) {
    badge.innerText = count + " New";
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
    list.innerHTML = "<p>No notifications</p>";
  }
}
function markAsRead(id, status) {
  let read = JSON.parse(localStorage.getItem("readNotifs")) || [];

  const key = `${id}-${status}`;

  if (!read.includes(key)) {
    read.push(key);
    localStorage.setItem("readNotifs", JSON.stringify(read));
  }

  fetchNotifications();
}

function updateBadge() {
  const badge = document.getElementById("badge");
  const total = document.querySelectorAll(".notification").length;

  if (total > 0) {
    badge.innerText = total + " New";
    badge.style.display = "inline-block";
  } else {
    badge.style.display = "none";
  }
}
// RUN
fetchNotifications();
setInterval(fetchNotifications, 5000);
function logout() {
  localStorage.removeItem("resident");
  window.location.href = "frontend/index.html";
}

// ================= MODAL =================
function openModal() {
  const modal = document.getElementById("issueModal");
  if (modal) modal.style.display = "flex";
}

function submitreport() {
  const issuetype = document.getElementById("issuetype").value;
  const address = document.getElementById("address").value;
  const description = document.getElementById("description").value;

  if (!issuetype || !address || !description) {
    alert("Fill all fields ❌");
    return;
  }
  const user = JSON.parse(localStorage.getItem("resident"));
  if (!user || !user.email) {
    alert("Please login first ❌");
    window.location.href = "index.html";
    return;
  } 
  const email = user.email;

  const report = { issuetype, address, description, email };

  fetch("http://localhost:3000/api/reports", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(report)
  })
  .then(res => res.json())
  .then(data => {
    alert("Report submitted successfully!");
    closeModal();
  })
  .catch(err => {
    console.error(err);
    alert("Error submitting report ❌");
  });
}


function closeModal() {
  const modal = document.getElementById("issueModal");
  if (modal) modal.style.display = "none";
}

// ================= MODAL CLICK OUTSIDE =================
const modal = document.getElementById("issueModal");
if (modal) {
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

document.addEventListener("DOMContentLoaded", function () {
  // Tabs
  const navButtons = document.querySelectorAll(".nav-buttons button");
  const tabContents = document.querySelectorAll(".tab-content");

  navButtons.forEach(button => {
    button.addEventListener("click", () => {
      navButtons.forEach(btn => btn.classList.remove("active"));
      button.classList.add("active");

      const tabId = button.dataset.tab;
      tabContents.forEach(tab => {
        tab.style.display = tab.id === tabId ? "block" : "none";
      });
    });
  });

  // Load pickup history after DOM ready
  loadPickupHistory();
});

// Waste type selection
let selectedWasteType = null;
function selectCard(card) {
  document.querySelectorAll(".card_a").forEach(c => {
    c.classList.remove("active-card");
  });
  card.classList.add("active-card");
  selectedWasteType = card.dataset.value;
  console.log("Selected:", selectedWasteType);
}

// Submit pickup request
async function submitpickup() {
  const user = JSON.parse(localStorage.getItem("resident"));
  if (!user) {
    alert("Please login first ❌");
    window.location.href = "index.html";
    return;
  }

  const wasteType = selectedWasteType;
  const quantity = document.getElementById("items").value;
  const date = document.getElementById("date").value;
  const address = document.getElementById("resaddress").value;
  const city = document.getElementById("city").value;
  console.log("Address value:", document.getElementById("address").value);
console.log({ wasteType, quantity, date, address, city });
  if (!quantity || !date || !address || !city || !wasteType) {
    alert("Fill all fields ❌");
    return;
  }
const weight = parseInt(quantity); // "2BAGS" → 2
  const data = {
    userEmail: user.email,
    residentName: user.fullname,
    wasteType,
    weight: weight,
    date,
    address,
    city,
    status: "pending"
  };

  console.log("Sending:", data);

  try {
    const res = await fetch("http://localhost:3000/api/pickup/create", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });

    const result = await res.json();
    alert("Pickup Scheduled ✅");
    // reload history after new pickup
    loadPickupHistory();
  } catch (err) {
    console.error(err);
    alert("Error saving pickup ❌");
  }
}
async function updateStatus(id, status){
  try {
    await fetch(`http://localhost:3000/api/pickup/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    loadData(); // refresh table

  } catch(err){
    console.error(err);
  }
}

// Points system
let points = 120;
function updatePoints() {
  document.getElementById("points").innerText = points;
}
function redeem(cost) {
  if (points >= cost) {
    points -= cost;
    updatePoints();
    alert("🎉 Reward Redeemed!");
  } else {
    alert("❌ Not enough points");
  }
}
function addPoints(amount) {
  points += amount;
  updatePoints();
}

// ================== Pickup History ==================
let pickupsData = [];

async function loadPickupHistory() {
  const user = JSON.parse(localStorage.getItem("resident"));
  if (!user || !user.email) return;

  try {
    const res = await fetch(`http://localhost:3000/api/pickup?email=${user.email}`);
    pickupsData = await res.json(); // ✅ assign to global variable
    console.log("Pickups loaded:", pickupsData);
    renderPickups(pickupsData);
  } catch (err) {
    console.error("Fetch error:", err);
    document.getElementById("historyContainer").innerHTML =
      "<p style='color:red;'>Failed to load pickups.</p>";
  }
}

function renderTimeline(pickup) {
const status = String(pickup.status)
  .toLowerCase()
  .replace(/\s+/g, '')
  .trim();

console.log("CLEAN STATUS:", status);
  const stages = [
    { key: "confirmed", label: "Confirmed" },
    { key: "collected", label: "Collected" },
    { key: "intransit", label: "In Transit" },
    { key: "recycled", label: "Recycled" }
  ];

  const container = document.getElementById("timelineContainer");

  // ADD progress bar BACK (you removed it accidentally before)
  container.innerHTML = '<div class="timeline-progress" id="timelineProgress"></div>';

const statusIndex = stages.findIndex(s => status.includes(s.key));
  stages.forEach((s, index) => {
    let className = "";

    if (index < statusIndex) className = "completed";
    else if (index === statusIndex) className = "in-progress";

    container.innerHTML += `
      <div class="timeline-step ${className}">
        <i class="fa-solid ${getIcon(s.key)}"></i>
        <h4>${s.label}</h4>
        <p>${pickup.address || "-"}</p>
        <span>${formatTime(pickup.date)}</span>
      </div>
    `;
  });

  // VERY IMPORTANT 👇
  setTimeout(updateProgress, 100);
}

// Filter pickups
function filterPickups() {
  const monthValue = document.getElementById("monthFilter").value;
  const typeValue = document.getElementById("typeFilter").value;

  let filtered = pickupsData;

  // Filter by month
  if (monthValue) {
    filtered = filtered.filter(p => {
      if (!p.date) return false;
      const pickupMonth = new Date(p.date).getMonth() + 1; // JS months 0-11
      return pickupMonth.toString().padStart(2, "0") === monthValue;
    });
  }

  // Filter by type
  if (typeValue) {
    filtered = filtered.filter(p => p.wasteType.toLowerCase() === typeValue.toLowerCase());
  }

  renderPickups(filtered);
}
function clearFilters() {
  document.getElementById("monthFilter").value = "";
  document.getElementById("typeFilter").value = "";
  renderPickups(pickupsData);
}

// Filter event listeners
document.addEventListener("DOMContentLoaded", () => {
  const monthFilter = document.getElementById("monthFilter");
  const typeFilter = document.getElementById("typeFilter");
  const clearBtn = document.querySelector(".clear-btn");

 document.getElementById("monthFilter").addEventListener("change", filterPickups);
document.getElementById("typeFilter").addEventListener("change", filterPickups);
  renderPickups(pickupsData);

  if (clearBtn) clearBtn.addEventListener("click", clearFilters);
});


// ✅ FETCH USING OBJECT ID
async function trackWaste() {
  const id = document.getElementById("trackId").value.trim();

  const res = await fetch(`http://localhost:3000/api/pickup/track/${id}`);
  const data = await res.json();

  if (data.message) {
    alert("Tracking ID not found ❌");
    return;
  }

  renderTimeline(data);
}

// ✅ MAIN TIMELINE LOGIC (FIXED FOR YOUR STATUS)
function renderTimeline(pickup) {

  const stages = [
    { key: "confirmed", label: "Confirmed" },
    { key: "collected", label: "Collected" },
    { key: "in transit", label: "In Transit" },
    { key: "recycled", label: "Recycled" },
        { key: "disposed", label: "Disposed" }

  ];

  const icons = {
    "confirmed": "fa-clock",
    "collected": "fa-trash",
    "in transit": "fa-truck-fast",
    "recycled": "fa-recycle",
        "disposed": "fa-solid fa-dumpster"

  };
  const container = document.getElementById("timelineContainer");

  // RESET + ADD BLUE LINE
  container.innerHTML = '<div class="timeline-progress" id="timelineProgress"></div>';

  const currentIndex = stages.findIndex(s => s.key === pickup.status.toLowerCase());

  stages.forEach((stage, index) => {

    let className = "";

    if (index < currentIndex) className = "completed";
    else if (index === currentIndex) className = "in-progress";

    container.innerHTML += `
      <div class="timeline-step ${className}">
        <i class="fa-solid ${icons[stage.key]}"></i>
        <h4>${stage.label}</h4>
       
      </div>
    `;
  });

  // IMPORTANT: CALL AFTER RENDER
  setTimeout(updateProgress, 100);
}

// ✅ DATE FORMAT
function formatDate(date) {
  if (!date) return "-";
  return new Date(date).toLocaleString();
}

// ✅ BLUE LINE FIX
function updateProgress() {
  const steps = document.querySelectorAll('.timeline-step');
  const progressBar = document.getElementById('timelineProgress');

  let lastCompleted = -1;

  steps.forEach((step, index) => {
    if (step.classList.contains('completed')) {
      lastCompleted = index;
    }
  });
  
  if (lastCompleted >= 0 && steps.length > 0) {
    const stepHeight = steps[1].offsetHeight + 30;
    const height = (lastCompleted + 1.5) * stepHeight - 20;
    progressBar.style.height = height + "px";
  }
}



window.addEventListener('DOMContentLoaded', updateProgress);
// If "In Transit" is the current step (index 2)
function renderPickups(pickups) {
  const container = document.getElementById("historyContainer");

  if (!container) return;

  container.innerHTML = "";

  if (!Array.isArray(pickups) || pickups.length === 0) {
    container.innerHTML = "<p>No pickups found</p>";
    return;
  }

  pickups.forEach(p => {
    let statusText = "";
    let icon = "";
    if (p.status === "confirmed") {
      statusText = "Confirmed";
      icon = "fa-solid fa-circle-check";
    } 
    else if (p.status === "collected") {
      statusText = "Collected";
      icon = "fa-solid fa-trash";
    } 
    else if (p.status === "In Transit") {
      statusText = "In Transit";
      icon = "fa-solid fa-truck-fast";
    } 
    else if (p.status === "recycle") {
      statusText = "Recycled";
      icon = "fa-solid fa-recycle";
    } 
    else {
      statusText = p.status;
      icon = "fa-solid fa-clock";
    }

    container.innerHTML += `
      <div class="notification gray">
        <div>
          <p>
            <i class="fa-solid ${icon}" style="margin-right:6px;"></i>
            <b>${p.wasteType || "Waste"}</b> - ${statusText}<br><br>ID: ${p._id}
          </p>
          <p class="small">${new Date(p.date || p.updatedAt).toLocaleString()}</p>
        </div>
      </div>
    `;
  });
}

async function loadReports() {
  const user = JSON.parse(localStorage.getItem("resident"));

  if (!user || !user.email) return;

  const res = await fetch(
    `http://localhost:3000/api/reports?email=${user.email}`
  );

  const reports = await res.json();

  const container = document.getElementById("reportList");
  container.innerHTML = "";

  reports.forEach(report => {
    let badgeClass = "";
    let badgeText = "";

    if (report.status === "Resolved") {
      badgeClass = "resolved";
      badgeText = "✔ Resolved";
    } else if (report.status === "In-progress") {
      badgeClass = "progress";
      badgeText = "⏱ In-progress";
    } else {
      badgeClass = "pending";
      badgeText = "⚠ Pending";
    }

    const date = new Date(report.date).toLocaleDateString();

    container.innerHTML += `
      <div class="issue-item">
        <div class="left">
          <i class="fa-solid fa-location-dot icon"></i>
          <div>
            <h4>${report.issuetype}</h4>
            <p>${report.address}</p>
            <span>Reported on ${date}</span>
          </div>
        </div>
        <div class="badge ${badgeClass}">${badgeText}</div>
      </div>
    `;
  });
}
async function loadCounts() {
  const user = JSON.parse(localStorage.getItem("resident"));

  if (!user || !user.email) return;

  try {
    // 📦 Pickup Count
    const pickupRes = await fetch(
      `http://localhost:3000/api/pickup/count?email=${user.email}`
    );
    const pickupData = await pickupRes.json();

    document.getElementById("pickupCount").innerText = pickupData.count;

    // ⚠ Report Count
    const reportRes = await fetch(
      `http://localhost:3000/api/reports/count?email=${user.email}`
    );
    const reportData = await reportRes.json();

    document.getElementById("reportCount").innerText = reportData.count;

  } catch (err) {
    console.error(err);
  }
}

loadCounts();
loadReports();

async function redeemReward(points, rewardName) {
  const user = JSON.parse(localStorage.getItem("resident"));

  try {
    const res = await fetch("http://localhost:3000/api/rewards/redeem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        pointsRequired: points,
        rewardName
      })
    });

    const data = await res.json();

    alert(data.message);

  } catch (err) {
    console.error(err);
    alert("Redeem failed ❌");
  }
}
async function loadPoints() {
  const user = JSON.parse(localStorage.getItem("resident"));

  if (!user || !user.email) return;

  try {
    const res = await fetch(
      `http://localhost:3000/api/rewards/points?email=${user.email}`
    );

    const data = await res.json();

    document.getElementById("points").innerText = data.points;

  } catch (err) {
    console.error(err);
  }
}
document.addEventListener("DOMContentLoaded", () => {
  loadPoints();
});