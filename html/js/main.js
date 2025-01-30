const urlBase = 'http://cop4331-team26.xyz/LAMPAPI/';
const extension = '.php';

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

document.getElementById('delete-contact-button').addEventListener('click', () => {
    const data = {
        phone: document.getElementById('delete-phone').value,
        userId: localStorage.getItem('userId'),
    };

    makeRequest('DeleteContact', data, (response) => {
        alert(response.error ? response.error : 'Contact deleted successfully.');
    });
});

document.getElementById('search-contact-button').addEventListener('click', () => {
    const data = {
        search: document.getElementById('search-query').value,
        userId: localStorage.getItem('userId'),
    };

    makeRequest('SearchContacts', data, (response) => {
        const resultsContainer = document.getElementById('search-results');
        resultsContainer.innerHTML = ''; 

        if (response.error) {
            alert(response.error);
        }
        else
        {
            displayResults(response.results);
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
        if (xhr.readyState === 4 && xhr.status === 200)
        {
            const response = JSON.parse(xhr.responseText);
            callback(response);
        }
    };

    xhr.send(JSON.stringify(payload));
}

function displayResults(results) {
    const resultsBody = document.getElementById('results-body');
    resultsBody.innerHTML = '';
    results.forEach(result => {
        const row = document.createElement('tr');
        const contactRow = document.createElement('td');
        contactRow.classList.add('contact-row');
        const contactInfo = document.createElement('div');
        contactInfo.classList.add('contact-info');
        contactInfo.innerHTML = `${result.name}<br>${result.phone}<br>${result.email}`;
        contactRow.appendChild(contactInfo);

        const actionButtons = document.createElement('div');
        actionButtons.classList.add('action-buttons');

        const editButton = document.createElement('a');
        editButton.href = "update-contact.html";
        const editIcon = document.createElement('img');
        editIcon.src = "https://i.ibb.co/0y53H7VG/edit.png";
        editIcon.alt = "Edit";
        editIcon.classList.add('icon-btn-small');
        editButton.appendChild(editIcon);

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.onclick = deleteContact;
        const deleteIcon = document.createElement('img');
        deleteIcon.src = "https://i.ibb.co/nqnjzJqz/delete.png";
        deleteIcon.alt = "Delete";
        deleteIcon.classList.add('icon-btn-small');
        deleteButton.appendChild(deleteIcon);

        actionButtons.appendChild(editButton);
        actionButtons.appendChild(deleteButton);
        contactRow.appendChild(actionButtons);

        row.appendChild(contactRow);
        resultsBody.appendChild(row);
    });

    document.querySelector('.results-table').classList.remove('hidden');
}

function deleteContact(event) {
    const row = event.target.closest('tr');
    row.remove();
}