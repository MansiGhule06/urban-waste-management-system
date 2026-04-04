let selectedId = null;

window.onload = () => {

  // ✅ GET DATA SAFELY
  const data = localStorage.getItem("staff");

  if (!data || data === "undefined") {
    window.location.href = "../index.html";
    return;
  }

  const staff = JSON.parse(data);

  if (!staff || !staff.fullname) {
    window.location.href = "../index.html";
    return;
  }

  // 👤 Show name
  document.getElementById("user").innerText = staff.fullname;

  // 🆔 Show ID (better)
  document.getElementById("status").innerText =
    "Online • ID: " + (staff._id || "N/A");

  loadData();
};

// TAB SWITCH
function showTab(tab, element) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");

  document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));
  if (element) element.classList.add("active");
}
let pickupsData = [];
// LOAD DATA
async function loadData() {
  try {
    const res = await fetch("http://localhost:3000/api/pickup/all");
    const data = await res.json(); // store globally
    pickupsData = data; // 👈 store globally
    const table = document.getElementById("table");
    table.innerHTML = "";

    let todayCount = 0;
    let pendingCount = 0;

    if (!data || data.length === 0) {
      table.innerHTML = "<tr><td colspan='5'>No data found</td></tr>";
      return;
    }

    data.forEach(p => {
      if (p.status === "pending") pendingCount++;
      todayCount++;

      table.innerHTML += `
        <tr>
          <td>${p.userEmail}</td>
          <td>${p.address}</td>
          <td>${p.wasteType}</td>
          <td>${p.status}</td>
          <td>
            <button onclick='selectPickup(${JSON.stringify(p)})'>
              Select
            </button>
          </td>
        </tr>
      `;
    });

    document.getElementById("todayCount").innerText = todayCount;
    document.getElementById("pendingCount").innerText = pendingCount;

  } catch (err) {
    alert("Error fetching data ❌");
  }
}

// SELECT PICKUP
function selectPickup(p) {
  selectedId = p._id;
    console.log("Selected:", p);   // 👈 ADD THIS


  // DETAILS TAB
  document.getElementById("d_name").innerText = p.userEmail;
  document.getElementById("d_address").innerText = p.address;
  document.getElementById("d_type").innerText = p.wasteType;
  document.getElementById("d_qty").innerText = p.quantity || "N/A";

  // TRANSIT TAB
  document.getElementById("pickupId").innerText = p._id;

  showTabDirect("details");
}

// DIRECT TAB SWITCH
function showTabDirect(tab) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");

  document.querySelectorAll(".tabs button").forEach(btn => {
    btn.classList.remove("active");

    if (btn.innerText.toLowerCase() === tab) {
      btn.classList.add("active");
    }
  });
}
function updateStatusSafe(newStatus) {
  if (!selectedId) {
    alert("Select pickup first ❌");
    return;
  }

  // Use already loaded data to find current pickup
  const currentPickup = pickupsData.find(p => p._id === selectedId);
  if (!currentPickup) {
    alert("Pickup not found ❌");
    return;
  }
const p = pickupsData.find(pickup => pickup._id === selectedId);
  if (!p) {
    alert("Pickup not found ❌");
    return;
  }

  // 🔹 Prevent marking In Transit if already In Transit
  if (p.status === "In Transit") {
    alert("Pickup is already In Transit ❌");
    return;
  }
   // 🔹 Prevent marking In Transit if already In Transit
  if (p.status === "collected") {
    alert("Pickup is already In Collected ❌");
    return;
  }
  if (p.status === "Recycled" || p.status === "Disposed") {
    alert("Pickup is already In Recycled ❌");
    return;
  }

  // Block Completed/Confirmed if already In Transit
  if (currentPickup.status === "In Transit" &&
      (newStatus.toLowerCase() === "collected" || newStatus.toLowerCase() === "confirmed")) {
    alert("Cannot mark Collected or Confirmed while status is In Transit ❌");
    return;
  }

  // Otherwise, proceed with original update
  updateStatus(newStatus);
}
// UPDATE STATUS
async function updateStatus(status) {
  if (!selectedId) {
    alert("Select pickup first ❌");
    return;
  }
  

  try {
    const res = await fetch(`http://localhost:3000/api/pickup/update/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    
    const data = await res.json();
    console.log("Response:", data);  // 👈 IMPORTANT

    alert("Updated to " + status + " ✅");

    loadData();

  } catch (err) {
    console.error(err);
    alert("Update failed ❌");
  }
}
// TRANSIT COMPLETE
function completeTransit() {
  if (!selectedId) {
    alert("Select pickup first ❌");
    return;
  }

  const seg = document.getElementById("seg").checked;
  const haz = document.getElementById("haz").checked;
  const pack = document.getElementById("pack").checked;

  if (!seg || !haz || !pack) {
    alert("Complete checklist ❌");
    return;
  }

  // 🔹 Find the selected pickup in already loaded data
  const p = pickupsData.find(pickup => pickup._id === selectedId);
  if (!p) {
    alert("Pickup not found ❌");
    return;
  }

  // 🔹 Prevent marking In Transit if already In Transit
  if (p.status === "In Transit") {
    alert("Pickup is already In Transit ❌");
    return;
  }

  // 🔹 Otherwise, update to In Transit
  updateStatus("In Transit");
}
async function loadAllReports() {
  const res = await fetch("http://localhost:3000/api/reports");
  const reports = await res.json();

  const container = document.getElementById("reportList");
  container.innerHTML = "";

  reports.forEach(report => {
    const date = new Date(report.date).toLocaleDateString();

    container.innerHTML += `
      <div class="issue-item">
        <div class="left">
          <div>
            <h4>${report.issuetype}</h4>
            <p>${report.address}</p>
            <span>${report.email}</span><br>
            <span>${date}</span>
          </div>
        </div>

        <select onchange="updateReportStatus('${report._id}', this.value)">
          <option ${report.status === "Pending" ? "selected" : ""}>Pending</option>
          <option ${report.status === "In-progress" ? "selected" : ""}>In-progress</option>
          <option ${report.status === "Resolved" ? "selected" : ""}>Resolved</option>
        </select>
      </div>
    `;
  });
}
document.addEventListener("DOMContentLoaded", () => {
  loadAllReports();
});// LOGOUT
function logout() {
  localStorage.removeItem("staff");
  window.location.href = "../index.html";
}
async function updateReportStatus(id, status) {
  try {
    await fetch(`http://localhost:3000/api/reports/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ status })
    });

    alert("Report updated to " + status + " ✅");

    loadAllReports(); // refresh list
  } catch (err) {
    console.error(err);
    alert("Update failed ❌");
  }
}