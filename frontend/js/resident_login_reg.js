function showResidentPortal() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('residentPortal').style.display = 'flex';
}

function switchResidentTab(tabName) {
    document.getElementById('residentLoginTab').style.display = 'none';
    document.getElementById('residentRegisterTab').style.display = 'none';

    document.querySelectorAll('#residentPortal .tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    if (tabName === 'login') {
        document.getElementById('residentLoginTab').style.display = 'block';
        document.querySelectorAll('#residentPortal .tab-button')[0].classList.add('active');
    } else {
        document.getElementById('residentRegisterTab').style.display = 'block';
        document.querySelectorAll('#residentPortal .tab-button')[1].classList.add('active');
    }
}



 // ================= REGISTER =================
    document.getElementById('residentRegisterBtn').addEventListener('click', async () => {

        const fullname = document.getElementById('residentFullname').value.trim();
        const email = document.getElementById('residentEmail').value.trim();
        const mobile = document.getElementById('residentMobile').value.trim();
        const password = document.getElementById('registerPassword').value;
        const confirm = document.getElementById('resConfirm').value;

        const message = document.getElementById('residentMessage');

        // 🚨 VALIDATION
        if (!fullname || !email || !mobile || !password || !confirm) {
            message.style.color = "red";
            message.textContent = "All fields are required ❌";
            return;
        }
        else if (password.length < 6 ) {
            message.style.color = "red";
            message.textContent = "Password must be at least 6 characters ❌";
            return;
        }
        else if (!/^\S+@\S+\.\S+$/.test(email)) {   
            message.style.color = "red";
            message.textContent = "Invalid email format ❌";
            return;
        }
        else if (!/^\d{10}$/.test(mobile)) {
            message.style.color = "red";
            message.textContent = "Mobile number must be 10 digits ❌";
            return;
        }
        else if (password !== confirm) {
            message.style.color = "red";
            message.textContent = "Passwords do not match ❌";
            return;
        }
        else if (password !== confirm) {
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
            const response = await fetch('http://localhost:3000/api/resident/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            const result = await response.json();
            message.textContent = result.message;

            if (response.ok) {
                message.style.color = "green";

                // clear form
                document.getElementById('residentFullname').value = '';
                document.getElementById('residentEmail').value = '';
                document.getElementById('residentMobile').value = '';
                document.getElementById('registerPassword').value = '';
                document.getElementById('resConfirm').value = '';
            } else {
                message.style.color = "red";
            }

        } catch (err) {
            message.textContent = 'Error connecting to backend ❌';
        }
    });

    // ================= LOGIN =================
    document.getElementById('residentLoginBtn').addEventListener('click', async () => {

        console.log("Login button clicked ✅");

        const email = document.getElementById('residentLoginEmail').value.trim();
        const pass = document.getElementById('residentLoginPassword').value;

        const message = document.getElementById('loginMessage');

        // 🚨 VALIDATION
        if (!email || !pass) {
            message.style.color = "red";
            message.textContent = "Please enter email and password ❌";
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/api/resident/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email,pass })            });

            const result = await response.json();
console.log("Email:", email);
console.log("Password:", pass);
            if (response.ok) {
                message.style.color = "green";
                message.textContent = result.message;
                    localStorage.setItem("resident", JSON.stringify(result.user));
                alert("LOGIN SUCCESSFUL ✅");

                // redirect (optional)
                 window.location.href = "res.html";

            } else {
                message.style.color = "red";
                message.textContent = result.message; // wrong email/pass
            }

        } catch (err) {
            message.style.color = "red";
            message.textContent = 'Error connecting to backend ❌';
        }
    });
