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
    const phoneInput = document.querySelector('#update-phone');
    phoneInput.addEventListener('keydown', disallowNonNumericInput);
    phoneInput.addEventListener('keyup', formatToPhone);
  });
  
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

document.addEventListener('DOMContentLoaded', () => {
    const userId = localStorage.getItem('userId');
    const phone = localStorage.getItem('tempPhone'); 

    if (!phone) {
        console.warn("No contact phone number found in localStorage. Cannot pre-fill form.");
        return;
    }

    const searchData = {
        search: phone,
        userId: userId
    };

    makeRequest('SearchContacts', searchData, (response) => {
        if (response.error && response.error !== "No Records Found") {
            console.error("Error searching contacts: " + response.error);
            return;
        }

        let foundContact = null;
        if (!response.error && response.results && response.results.length > 0) {
            for (let contact of response.results) {
                if (contact.Phone === phone) {
                    foundContact = contact;
                    break;
                }
            }
        }

        if (foundContact) {
            document.getElementById('update-first-name').value = foundContact.FirstName;
            document.getElementById('update-last-name').value = foundContact.LastName;
            document.getElementById('update-phone').value = foundContact.Phone;
            document.getElementById('update-email').value = foundContact.Email;
        } else {
            console.warn("Contact not found for phone: " + phone);
        }
    });
});


document.getElementById('update-email').addEventListener('input', function () {
    const emailInput = this.value;
    const emailError = document.getElementById('email-error');

    if (!validateEmail(emailInput)) {
        emailError.textContent = 'Invalid email format.';
        emailError.style.display = 'block';
    } else {
        emailError.style.display = 'none';
    }
});

document.getElementById('update-contact-button').addEventListener('click', () => {
    const data = {
        firstName: document.getElementById('update-first-name').value,
        lastName: document.getElementById('update-last-name').value,
        email: document.getElementById('update-email').value,
        phoneNew : document.getElementById('update-phone').value,
        userId: localStorage.getItem('userId'),
        phone: localStorage.getItem('tempPhone')
    };

    //make sure phone number is valid before saving
    if (!validatePhoneNumber(data.phoneNew)) {
        alert('Invalid phone number format. Use (123) 456 - 7890.');
        return;
    }

    const searchData = {
        search: data.phoneNew,
        userId: data.userId
    };

    makeRequest('SearchContacts', searchData, (response) => {
        let duplicateFound = false;
        if (!response.error && response.results && response.results.length > 0) {
            for (let contact of response.results) {
                if (contact.Phone == data.phoneNew) {
                    duplicateFound = true;
                    break;
                }
            }
        }

        if (duplicateFound) {
            alert("A contact with this phone number already exists. Please use a different phone number.");
        }
        else {
            makeRequest('UpdateContact', data, (response) => {
                alert(response.error ? response.error : 'Contact updated successfully.');
            });
        }
    });
});

// function createFish() {
//     const fish = document.createElement('img');
//     fish.src = 'https://i.ibb.co/7rL6Nnq/fish.png';
//     fish.className = 'fish';

//     const topPosition = Math.random() * window.innerHeight;
//     fish.style.top = `${topPosition}px`;

//     const zIndex = Math.random() < 0.5 ? 2 : 5;
//     fish.style.zIndex = zIndex;

//     const duration = Math.random() * 5 + 5;
//     fish.style.animationDuration = `${duration}s`;

//     container.appendChild(fish);

//     fish.addEventListener('animationend', () => {
//         fish.remove();
//     });
// }

// setInterval(createFish, 1000);


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