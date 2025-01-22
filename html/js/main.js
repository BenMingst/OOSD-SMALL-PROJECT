const urlBase = 'http://cop4331-team26.xyz/LAMPAPI/';
const extension = 'php';

document.getElementById('add-contact-button').addEventListener('click', () => {
    const data = {
        firstName: document.getElementById('add-first-name').value,
        lastName: document.getElementById('add-last-name').value,
        phone: document.getElementById('add-phone').value,
        email: document.getElementById('add-email').value,
        userId: localStorage.getItem('userId'),
    };

    makeRequest('AddContact.', data, (response) => {
        alert(response.error ? response.error : 'Contact added successfully.');
    });
});

document.getElementById('delete-contact-button').addEventListener('click', () => {
    const data = {
        phone: document.getElementById('delete-phone').value,
        userId: localStorage.getItem('userId'),
    };

    makeRequest('DeleteContact.', data, (response) => {
        alert(response.error ? response.error : 'Contact deleted successfully.');
    });
});

document.getElementById('search-contact-button').addEventListener('click', () => {
    const data = {
        search: document.getElementById('search-query').value,
        userId: localStorage.getItem('userId'),
    };

    makeRequest('SearchContacts.', data, (response) => {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = ''; 

        if (response.error)
        {
            alert(response.error);
        }
        else
        {
            response.results.forEach((contact) => {
                const div = document.createElement('div');
                div.textContent = `${contact.FirstName} ${contact.LastName} - ${contact.Phone} - ${contact.Email}`;
                resultsContainer.appendChild(div);
            });
        }
    });
});

document.getElementById('update-contact-button').addEventListener('click', () => {
    const data = {
        firstName: document.getElementById('update-first-name').value,
        lastName: document.getElementById('update-last-name').value,
        phone: document.getElementById('update-phone').value,
        email: document.getElementById('update-email').value,
        userId: localStorage.getItem('userId'),
    };

    makeRequest('UpdateContact.', data, (response) => {
        alert(response.error ? response.error : 'Contact updated successfully.');
    });
});

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
