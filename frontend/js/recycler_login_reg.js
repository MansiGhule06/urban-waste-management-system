// ================= SHOW PORTAL =================
function showRecyclerPortal() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('recyclerPortal').style.display = 'flex';
}

// ================= SWITCH TABS =================
function switchRecyclerTab(tabName) {
    document.getElementById('recyclerLoginTab').style.display = 'none';
    document.getElementById('recyclerRegisterTab').style.display = 'none';

    document.querySelectorAll('#recyclerPortal .tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    if (tabName === 'login') {
        document.getElementById('recyclerLoginTab').style.display = 'block';
        document.querySelectorAll('#recyclerPortal .tab-button')[0].classList.add('active');
    } else {
        document.getElementById('recyclerRegisterTab').style.display = 'block';
        document.querySelectorAll('#recyclerPortal .tab-button')[1].classList.add('active');
    }
}

// ================= REGISTER =================
document.getElementById('recyclerRegisterBtn').addEventListener('click', async () => {

    const fullname = document.getElementById('recyclerFullname').value.trim();
    const email = document.getElementById('recyclerEmail').value.trim();
    const mobile = document.getElementById('recyclerMobile').value.trim();
    const password = document.getElementById('recyclerPassword').value;
    const confirm = document.getElementById('recyclerConfirm').value;

    const message = document.getElementById('recyclerMessage');

    // ✅ VALIDATION
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

    const data = {
        fullname,
        email,
        mobile_number: mobile,
        pass: password
    };

    try {
        const response = await fetch('http://localhost:3000/api/recycler/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });

        const result = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = result.message;

            // clear form
            document.getElementById('recyclerFullname').value = '';
            document.getElementById('recyclerEmail').value = '';
            document.getElementById('recyclerMobile').value = '';
            document.getElementById('recyclerPassword').value = '';
            document.getElementById('recyclerConfirm').value = '';
        } else {
            message.style.color = "red";
            message.textContent = result.message;
        }

    } catch (err) {
        message.style.color = "red";
        message.textContent = 'Error connecting to backend ❌';
    }
});

// ================= LOGIN =================
document.getElementById('recyclerLoginBtn').addEventListener('click', async () => {

    console.log("Recycler Login clicked ✅");

    const email = document.getElementById('recyclerLoginEmail').value.trim();
    const pass = document.getElementById('recyclerLoginPassword').value;

    const message = document.getElementById('recyclerLoginMessage');

    // ✅ VALIDATION
    if (!email || !pass) {
        message.style.color = "red";
        message.textContent = "Please enter email and password ❌";
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/api/recycler/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, pass })
        });

        const result = await response.json();

        if (response.ok) {
            message.style.color = "green";
            message.textContent = result.message;

            alert("LOGIN SUCCESSFUL ✅");

            // redirect if needed
            // window.location.href = "recycler/dashboard.html";

        } else {
            message.style.color = "red";
            message.textContent = result.message;
        }

    } catch (err) {
        message.style.color = "red";
        message.textContent = 'Error connecting to backend ❌';
    }
});