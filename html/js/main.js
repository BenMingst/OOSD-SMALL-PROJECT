const urlBase = 'http://cop4331-team26.xyz/LAMPAPI/';
const extension = '.php';


deleteActive = false;
var phoneDelete;

if (deleteActive) {
    document.getElementById('delete-contact-button').addEventListener('click', () => {
        const data = {
            phone: phoneDelete,
            userId: localStorage.getItem('userId'),
        };

        makeRequest('DeleteContact', data, (response) => {
            alert(response.error ? response.error : 'Contact deleted successfully.');
        });
    });
}

document.getElementById('search-contact-button').addEventListener('click', () => {
    const data = {
        search: document.getElementById('search-query').value,
        userId: localStorage.getItem('userId'),
    };

    makeRequest('SearchContacts', data, (response) => {
        if (response.error)
        {
            alert(response.error);
        }
        else
        {
            displayResults(response.results);
        }
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
        contactInfo.innerHTML = `${result.FirstName}<br>${result.Phone}<br>${result.Email}`;
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
        editIcon.addEventListener('click', () => {
            localStorage.setItem("tempPhone", result.Phone);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('delete-btn');
        deleteButton.id = "delete-contact-button";
        const deleteIcon = document.createElement('img');
        deleteIcon.src = "https://i.ibb.co/nqnjzJqz/delete.png";
        deleteIcon.alt = "Delete";
        deleteIcon.classList.add('icon-btn-small');
        deleteButton.appendChild(deleteIcon);
        deleteActive = true; 
        deleteButton.addEventListener('click', () => {
            phoneDelete = result.Phone;
        });

        actionButtons.appendChild(editButton);
        actionButtons.appendChild(deleteButton);
        contactRow.appendChild(actionButtons);

        row.appendChild(contactRow);
        resultsBody.appendChild(row);
    });

    document.querySelector('.results-table').classList.remove('hidden');
}


