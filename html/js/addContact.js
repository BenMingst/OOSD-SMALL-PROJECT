const urlBase = 'http://cop4331-team26.xyz/LAMPAPI/';
const extension = '.php';

function validatePhoneNumber(phone) {
    const phoneRegex = /^\(\d{3}\) \d{3} - \d{4}$/; // Example format: 123-456-7890
    return phoneRegex.test(phone);
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Basic email format
    return emailRegex.test(email);
}

window.addEventListener('load', () => {
    const phoneInput = document.querySelector('#add-phone');
    phoneInput.addEventListener('keydown', disallowNonNumericInput);
    phoneInput.addEventListener('keyup', formatToPhone);
  });

const container = document.querySelector('.container');

const disallowNonNumericInput = (evt) => {
    if (evt.ctrlKey) { return; }
    if (evt.key.length > 1) { return; }
    if (/[0-9.]/.test(evt.key)) { return; }
    evt.preventDefault();
}
  
const formatToPhone = (evt) => {
    const digits = evt.target.value.replace(/\D/g,'').substring(0,10);
    const areaCode = digits.substring(0,3);
    const prefix = digits.substring(3,6);
    const suffix = digits.substring(6,10);
  
    if(digits.length > 6) {evt.target.value = `(${areaCode}) ${prefix} - ${suffix}`;}
    else if(digits.length > 3) {evt.target.value = `(${areaCode}) ${prefix}`;}
    else if(digits.length > 0) {evt.target.value = `(${areaCode}`;}
};

document.getElementById('add-email').addEventListener('input', function () {
    const emailInput = this.value;
    const emailError = document.getElementById('email-error');

    if (!validateEmail(emailInput)) {
        emailError.textContent = '*Invalid email format.';
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});

document.getElementById('add-phone').addEventListener('input', function () {
    const phoneInput = this.value;
    const phoneError = document.getElementById('phone-error');

    if (!validatePhoneNumber(phoneInput)) {
        phoneError.textContent = '*Invalid phone number format.';
        phoneError.style.display = 'block';
    } else {
        phoneError.style.display = 'none';
    }
});

 setInterval(createFish, 1000);



 function createFish() {
     const fish = document.createElement('img');
     fish.src = 'https://i.ibb.co/7rL6Nnq/fish.png';
     fish.className = 'fish';
     fish.alt = "Fish";

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
// Function to show the toast
function showToast(message) {
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toast-message');

    // Set the message
    toastMessage.textContent = message;

    // Show the toast
    toast.style.display = 'block';
    toast.classList.add('show');

    // Hide the toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        toast.style.display = 'none';
    }, 3000);
}

document.getElementById('add-contact-button').addEventListener('click', () => {
    const data = {
            firstName: document.getElementById('add-first-name').value,
            lastName: document.getElementById('add-last-name').value,
            phone: document.getElementById('add-phone').value,
            email: document.getElementById('add-email').value,
            userId: localStorage.getItem('userId'),
    };

    if (!validatePhoneNumber(data.phone) || !validateEmail(data.email))
        return;

    const searchData = {
        search: data.phone,
        userId: data.userId
    };

    makeRequest('SearchContacts', searchData, (response) => {
        let duplicateFound = false;
        if (!response.error && response.results && response.results.length > 0) {
            for (let contact of response.results) {
                if (contact.Phone == data.phone) {
                    duplicateFound = true;
                    break;
                }
            }
        }

        if (duplicateFound) {
            showToast("A contact with this phone number already exists. Please use a different phone number.");
        }
        else {
            makeRequest('AddContact', data, (response) => {
                window.location.href = 'main.html'; 
            });
        }
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