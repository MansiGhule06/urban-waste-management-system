

let chart;
window.onload = () => {
  const data = localStorage.getItem("recycler_user");

  if (!data || data === "undefined") {
    window.location.href = "index.html";
    return;
  }

  const user = JSON.parse(data);

  document.getElementById("user").innerText = user.fullname;
  document.getElementById("userid").innerText ="ID:" + user._id;
};
function logout() {
  localStorage.removeItem("recycler_user");
  window.location.href = "index.html";
}

function render(){
    
    let tbody = document.getElementById("tbody");
    tbody.innerHTML = "";

    if (!data || data.length === 0) {
        tbody.innerHTML = "<tr><td colspan='5'>No data</td></tr>";
        return;
    }

    data.forEach(item => {

        let action = "";

        if(item.status==="In Transit"){
            action = `<button class="mark-received" onclick="markReceived(this)">Mark Received</button>`;
        }
        else if(item.status==="Received"){
            action = `
            <button onclick="updateStatus('${item._id}', 'Recycled')">Recycle</button>
            <button onclick="updateStatus('${item._id}', 'Disposed')">Dispose</button>`;
        }
        else{
            action = "Completed";
        }

        tbody.innerHTML += `
<tr>
  <td>${item._id}</td>
    <td>${item.wasteType}</td>
    <td>${new Date(item.updatedAt).toISOString().split("T")[0]}</td>
  <td>${item.weight || 0} kg</td>
  <td>
    <span class="status ${getStatusClass(item.status)}">
      ${item.status}
    </span>
  </td>
  <td>${action}</td>
</tr>
`;
    });
    
}
let data = [];
function getStatusClass(status){
  if(status === "Recycled") return "green";
  if(status === "Disposed") return "red";
  if(status === "Received") return "blue";
  return "gray";
}
async function loadData() {
  try {
    const res = await fetch("http://localhost:3000/api/recycle"); // ✅ FIXED

    if (!res.ok) throw new Error("Fetch failed");

    data = await res.json();

    // optional filters
    const inTransit = data.filter(d => d.status === "In Transit");
    const recycled = data.filter(d => d.status === "Recycled");
    const disposed = data.filter(d => d.status === "Disposed");

    console.log(inTransit, recycled, disposed);

    render();

  } catch (err) {
    console.error(err);
  }
}


async function updateStatus(id, status){
  try {
    await fetch(`http://localhost:3000/api/recycle/update/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    loadData(); // 🔥 refresh UI after update

  } catch(err){
    console.error(err);
  }
}
function markReceived(btn){

  const row = btn.closest("tr");

  // ✅ FIX 1: get correct status span
  const statusSpan = row.children[4].querySelector(".status");

  statusSpan.innerText = "Received";
  statusSpan.className = "status blue"; // optional styling

  // ✅ FIX 2: update buttons
  const actionCell = row.children[5];

  const id = row.children[0].innerText;

  actionCell.innerHTML = `
    <button onclick="updateStatus('${id}', 'Recycled')">Recycle</button>
    <button onclick="updateStatus('${id}', 'Disposed')">Dispose</button>
  `;
}
// UPDATE STATUS
function update(index, status){
    data[index].status = status;
    render();
}

document.addEventListener("DOMContentLoaded", () => {
  //getInTransit();
  loadData();
});
// SEARCH
function searchTable(value){
    let rows = document.querySelectorAll("#tbody tr");
    value = value.toLowerCase();

    rows.forEach(row=>{
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
}

// TABS
function showTab(id, el){
    document.getElementById("tableSection").style.display="none";
    document.getElementById("reportSection").style.display="none";

    document.getElementById(id).style.display="block";

    document.querySelectorAll(".tab").forEach(t=>t.classList.remove("active"));
    el.classList.add("active");
}

// CHART
function renderChart(){
    let summary = {};

    data.forEach(d=>{
        if(d.status==="Recycled"){
            summary[d.type] = (summary[d.type] || 0) + d.qty;
        }
    });

    let labels = Object.keys(summary);
    let values = Object.values(summary);

    if(chart) chart.destroy();

    chart = new Chart(document.getElementById("chart"), {
        type: "doughnut",
        data: {
            labels: labels,
            datasets: [{
                data: values,
                backgroundColor: [
                    "#3b82f6","#10b981","#8b5cf6","#f59e0b","#ef4444"
                ]
            }]
        },
        options: {
            cutout: "60%",
            plugins: {
                legend: { position: "bottom" }
            }
        }
    });
}
async function loadStats() {
  try {
    const res = await fetch("http://localhost:3000/api/recycle/stats");
    const data = await res.json();

    document.getElementById("incoming").innerText = data.incoming;
    document.getElementById("pending").innerText = data.pending;
    document.getElementById("processing").innerText = data.processing;

  } catch (err) {
    console.error(err);
  }
}

document.addEventListener("DOMContentLoaded", loadStats);
async function loadMaterialChart() {
  const res = await fetch("http://localhost:3000/api/recycle/material-stats");
  const data = await res.json();

  console.log("Material Data:", data);

  // 🔹 Convert DB → chart format
  const labels = data.map(item => item._id);
  const values = data.map(item => item.count);

  new Chart(document.getElementById("materialChart"), {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [{
        data: values,
        backgroundColor: [
          "#3b82f6",
          "#10b981",
          "#8b5cf6",
          "#ef4444"
        ]
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%"
    }
  });

}
async function loadBarChart() {
  const res = await fetch("http://localhost:3000/api/recycle/weekly-stats");
  const data = await res.json();

  console.log("Weekly Data:", data);

  // Days mapping
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  // Initialize arrays
  const recycledData = [0, 0, 0, 0, 0, 0, 0];
  const disposedData = [0, 0, 0, 0, 0, 0, 0];

  // Fill data
  data.forEach(item => {
    const dayIndex = item._id.day - 1; // Mongo gives 1-7
    const status = item._id.status;

    if (status === "Recycled") {
      recycledData[dayIndex] = item.total;
    } else if (status === "Disposed") {
      disposedData[dayIndex] = item.total;
    }
  });

  // Create chart
  new Chart(document.getElementById("efficiencyChart"), {
    type: "bar",
    data: {
      labels: days,
      datasets: [
        {
          label: "Recycled",
          data: recycledData,
          backgroundColor: "#10b981"
        },
        {
          label: "Disposed",
          data: disposedData,
          backgroundColor: "#ef4444"
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "top"
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}
loadBarChart();
loadMaterialChart();

async function loadDashboard() {
  const res = await fetch("http://localhost:3000/api/recycle/dashboard-stats");
  const data = await res.json();

  console.log(data); // use to map into charts
}


// load on page
