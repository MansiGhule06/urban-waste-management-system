let selectedId = null;

window.onload = () => {

  // USER INFO
  const staff = JSON.parse(localStorage.getItem("staff"));

  if (!staff || !staff.fullname) {
    window.location.href = "../index.html";
    return;
  }

  document.getElementById("user").innerText = staff.fullname;

  loadData();
};

// TAB SWITCH
function showTab(tab, element) {
  document.querySelectorAll(".tab-content").forEach(t => t.classList.remove("active"));
  document.getElementById(tab).classList.add("active");

  document.querySelectorAll(".tabs button").forEach(btn => btn.classList.remove("active"));
  if (element) element.classList.add("active");
}

// LOAD DATA
async function loadData() {
  try {
    const res = await fetch("http://localhost:3000/api/pickups");
    const data = await res.json();

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
          <td>${p.residentName}</td>
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

  // DETAILS TAB
  document.getElementById("d_name").innerText = p.residentName;
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

// UPDATE STATUS
async function updateStatus(status) {
  if (!selectedId) {
    alert("Select pickup first ❌");
    return;
  }

  try {
    await fetch(`http://localhost:3000/api/pickups/${selectedId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    alert("Updated to " + status + " ✅");

    if (status === "collected") {
      showTabDirect("transit");
    }

    loadData();

  } catch (err) {
    alert("Update failed ❌");
  }
}

// TRANSIT COMPLETE
function completeTransit() {
  const seg = document.getElementById("seg").checked;
  const haz = document.getElementById("haz").checked;
  const pack = document.getElementById("pack").checked;

  if (!seg || !haz || !pack) {
    alert("Complete checklist ❌");
    return;
  }

  updateStatus("completed");
}

// LOGOUT
function logout() {
  localStorage.removeItem("staff");
  window.location.href = "../index.html";
}