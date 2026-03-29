// ================= STAFF PORTAL =================
function showStaffPortal() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('staffPortal').style.display = 'flex';
}

function switchStaffTab(tabName) {
    document.getElementById('staffLoginTab').style.display = 'none';
    document.getElementById('staffRegisterTab').style.display = 'none';

    document.querySelectorAll('#staffPortal .tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    if (tabName === 'login') {
        document.getElementById('staffLoginTab').style.display = 'block';
        document.querySelectorAll('#staffPortal .tab-button')[0].classList.add('active');
    } else {
        document.getElementById('staffRegisterTab').style.display = 'block';
        document.querySelectorAll('#staffPortal .tab-button')[1].classList.add('active');
    }
}


// ================= STAFF REGISTER =================
document.getElementById('staffRegisterBtn').addEventListener('click', async () => {

    const fullname = document.getElementById('staffFullname').value.trim();
    const email = document.getElementById('staffEmail').value.trim();
    const mobile = document.getElementById('staffMobile').value.trim();
    const password = document.getElementById('staffPassword').value;
    const confirm = document.getElementById('staffConfirm').value;

    const message = document.getElementById('staffMessage');

    // 🚨 VALIDATION
    if (!fullname || !email || !mobile || !password || !confirm) {
        message.style.color = "red";
        message.textContent = "All fields are required ❌";
        return;
    }

    if (password !== confirm) {
        message.style.color = "red";
        message.textContent = "Passwords do not match ❌";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/staff/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                fullname,
                email,
                mobile_number: mobile,
                pass: password
            })
        });

        const result = await response.json();
        message.textContent = result.message;

        if (response.ok) {
            message.style.color = "green";

            // clear form
            document.getElementById('staffFullname').value = '';
            document.getElementById('staffEmail').value = '';
            document.getElementById('staffMobile').value = '';
            document.getElementById('staffPassword').value = '';
            document.getElementById('staffConfirm').value = '';
        } else {
            message.style.color = "red";
        }

    } catch (err) {
        message.style.color = "red";
        message.textContent = "Error connecting to backend ❌";
    }
});


// ================= STAFF LOGIN =================
document.getElementById('staffLoginBtn').addEventListener('click', async () => {

    const email = document.getElementById('staffLoginEmail').value.trim();
    const pass = document.getElementById('staffLoginPassword').value;

    const message = document.getElementById('staffLoginMessage');

    // 🚨 VALIDATION
    if (!email || !pass) {
        message.style.color = "red";
        message.textContent = "Please enter email and password ❌";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/staff/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pass })
        });

        const result = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = result.message;

            alert("STAFF LOGIN SUCCESSFUL ✅");

             // ✅ SAVE USER (IMPORTANT)
    localStorage.setItem("staff", JSON.stringify({
        fullname: result.user?.fullname || email
    }));

            // optional redirect
            window.location.href = "staff/dashboard.html";

        } else {
            message.style.color = "red";
            message.textContent = result.message;
        }

    } catch (err) {
        message.style.color = "red";
        message.textContent = "Error connecting to backend ❌";
    }
});