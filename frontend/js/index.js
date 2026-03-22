function showMunicipalPortal() {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('municipalPortal').style.display = 'flex';
}

function backToHome() {
    document.getElementById('municipalPortal').style.display = 'none';
    document.getElementById('homePage').style.display = 'flex';
}

function switchTab(tabName) {
    document.getElementById('loginTab').style.display = 'none';
    document.getElementById('registerTab').style.display = 'none';

    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
    });

    if (tabName === 'login') {
        document.getElementById('loginTab').style.display = 'block';
        document.querySelectorAll('.tab-button')[0].classList.add('active');
    } else {
        document.getElementById('registerTab').style.display = 'block';
        document.querySelectorAll('.tab-button')[1].classList.add('active');
    }
}