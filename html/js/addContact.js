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

    if (!validatePhoneNumber(phoneInput)) {
        phoneError.textContent = 'Invalid phone number format. Use 123-456-7890.';
        phoneError.style.display = 'block';
    } else {
        phoneError.style.display = 'none';
    }
});

document.getElementById('add-email').addEventListener('input', function () {
    const emailInput = this.value;
    const emailError = document.getElementById('email-error');

    if (!validateEmail(emailInput)) {
        emailError.textContent = 'Invalid email format.';
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});

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