const urlBase = 'http://cop4331-team26.xyz/LAMPAPI/';
const extension = '.php';

document.getElementById('update-contact-button').addEventListener('click', () => {
    const data = {
        firstName: document.getElementById('update-first-name').value,
        lastName: document.getElementById('update-last-name').value,
        email: document.getElementById('update-email').value,
        userId: localStorage.getItem('userId'),
        phone: localStorage.getItem('tempPhone')
    };


    makeRequest('UpdateContact', data, (response) => {
        alert(response.error ? response.error : 'Contact updated successfully.');
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