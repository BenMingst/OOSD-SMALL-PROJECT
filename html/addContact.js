const urlBase = 'http://cop4331-team26.xyz/LAMPAPI/';
const extension = '.php';

function validatePhoneNumber(phone) {
    const phoneRegex = /^\d{3}-\d{3}-\d{4}$/; // Example format: 123-456-7890
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    return emailRegex.test(email);
}

document.getElementById('add-phone').addEventListener('input', function () {
    const phoneInput = this.value;
    const phoneError = document.getElementById('phone-error');
    const phoneIcon = document.getElementById('phone-icon');

    if (!validatePhoneNumber(phoneInput)) {
        phoneError.style.display = 'block';
        phoneIcon.className = 'validation-icon invalid';
        this.classList.add('invalid');
        this.classList.remove('valid');
    } else {
        phoneError.style.display = 'none';
        phoneIcon.className = 'validation-icon valid';
        this.classList.add('valid');
        this.classList.remove('invalid');
    }
});

document.getElementById('add-email').addEventListener('input', function () {
    const emailInput = this.value;
    const emailError = document.getElementById('email-error');
    const emailIcon = document.getElementById('email-icon');

    if (!validateEmail(emailInput)) {
        emailError.style.display = 'block';
        emailIcon.className = 'validation-icon invalid';
        this.classList.add('invalid');
        this.classList.remove('valid');
    } else {
        emailError.style.display = 'none';
        emailIcon.className = 'validation-icon valid';
        this.classList.add('valid');
        this.classList.remove('invalid');
    }
});

setInterval(createFish, 1000);



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

document.getElementById('add-contact-button').addEventListener('click', () => {
    const data = {
        firstName: document.getElementById('add-first-name').value,
        lastName: document.getElementById('add-last-name').value,
        phone: document.getElementById('add-phone').value,
        email: document.getElementById('add-email').value,
        userId: localStorage.getItem('userId'),
    };

    makeRequest('AddContact', data, (response) => {
        alert(response.error ? response.error : 'Contact added successfully.');
    });
});

function makeRequest(endpoint, payload, callback) {
    const url = urlBase + endpoint + extension;
    const xhr = new XMLHttpRequest();

    xhr.open('POST', url, true);
    xhr.setRequestHeader('Content-type', 'application/json; charset=UTF-8');
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            callback(response);
        }
    };

    xhr.send(JSON.stringify(payload));
}