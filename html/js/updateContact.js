const urlBase = 'http://cop4331-team26.xyz/LAMPAPI/';
const extension = '.php';


setInterval(createFish, 1000);

document.getElementById('update-contact-button').addEventListener('click', () => {
    const data = {
        firstName: document.getElementById('update-first-name').value,
        lastName: document.getElementById('update-last-name').value,
        email: document.getElementById('update-email').value,
        phoneNew : document.getElementById('update-phone').value,
        userId: localStorage.getItem('userId'),
        phone: localStorage.getItem('tempPhone')
    };


    makeRequest('UpdateContact', data, (response) => {
        alert(response.error ? response.error : 'Contact updated successfully.');
    });
});

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
        if (xhr.readyState === 4 && xhr.status === 200) {
            const response = JSON.parse(xhr.responseText);
            callback(response);
        }
    };

    xhr.send(JSON.stringify(payload));
}