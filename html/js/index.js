const urlBase = 'http://cop4331-team26.xyz/';
const extension = 'php';

const loginPage = document.getElementById('login-page');
const signupPage = document.getElementById('signup-page');
const showSignup = document.getElementById('show-signup');
const showLogin = document.getElementById('show-login');
const loginBttn = document.getElementById('login-button');
const signupBttn = document.getElementById('signup-button');
const loginUserInput = document.getElementById('login-username');
const loginPassInput = document.getElementById('login-password');

setInterval(createFish, 1000);

// Toggle between login and signup pages
showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginPage.classList.add('hidden');
    signupPage.classList.remove('hidden');
});

showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupPage.classList.add('hidden');
    loginPage.classList.remove('hidden');
});

const container = document.querySelector('.container');

function createFish() {
    const fish = document.createElement('img');
    fish.src = 'https://i.ibb.co/7rL6Nnq/fish.png';
    fish.className = 'fish';

    const topPosition = Math.random() * window.innerHeight;
    fish.style.top = `${topPosition}px`;

    const zIndex = Math.random() < 0.5 ? 2 : 5;
    fish.style.zIndex = zIndex;

    const duration = Math.random() * 5 + 5;
    fish.style.animationDuration = `${duration}s`;

    container.appendChild(fish);

    fish.addEventListener('animationend', () => {
        fish.remove();
    });
}

function makeRequest(endpoint, payload, callback) {
    const url = urlBase + endpoint + extension;
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            const response = JSON.parse(xhr.responseText);
            callback(response);
        }
    };

    xhr.send(JSON.stringify(payload));
}

document.getElementById('login-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        login: document.getElementById('login-username').value,
        password: document.getElementById('login-password').value,
    };

    makeRequest('Login.', data, (response) => {
        if (response.error)
        {
        }
        else
        {
            const { id, firstName, lastName } = response;
            localStorage.setItem('userId', id);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);

            // Redirect to main page
            window.location.href = 'main.html';
        }
    });
});

document.getElementById('signup-form').addEventListener('submit', (e) => {
    e.preventDefault();

    const data = {
        login: document.getElementById('signup-username').value,
        password: document.getElementById('signup-password').value,
        firstName: document.getElementById('signup-firstname').value,
        lastName: document.getElementById('signup-lastname').value,
    };

    makeRequest('Signup.', data, (response) => {
        if (response.error)
        {
            alert(response.error);
        }
        else
        {
            // If successful, store user data or simply alert
            const { id, firstName, lastName } = response;
            localStorage.setItem('userId', id);
            localStorage.setItem('firstName', firstName);
            localStorage.setItem('lastName', lastName);

            // Optionally redirect or let them log in automatically
            alert("Signup successful! You are now logged in.");
            window.location.href = 'main.html';
        }
    });
});