// Sign Up Function
function signup() {
    let user = document.getElementById('newUser').value.trim();
    let pass = document.getElementById('newPass').value.trim();

    if(user === '' || pass === ''){
        alert('Please fill in both username and password.');
        return;
    }

    const userData = { username: user, password: pass };
    localStorage.setItem('userData', JSON.stringify(userData));

    alert('Account successfully registered! You can now login.');
    window.location.href = 'Login.html';
}

// Login Function
function login() {
    let user = document.getElementById('loginUser').value.trim();
    let pass = document.getElementById('loginPass').value.trim();
    let btn = document.getElementById('loginBtn');

    const storedData = JSON.parse(localStorage.getItem('userData'));

    if (!storedData) {
        alert('No account found. Please sign up first.');
        window.location.href = 'signup.html';
        return;
    }

    if (user === storedData.username && pass === storedData.password) {
        sessionStorage.setItem('loggedIn', 'true');
        alert('Login successful!');
        window.location.href = 'MainPage.html';
    } else {
        btn.classList.add('shake');
        setTimeout(() => btn.classList.remove('shake'), 400);
        alert('Incorrect username or password. Please try again.');
    }
}