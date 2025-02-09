const urlBase = 'http://cop4331-team26.xyz/LAMPAPI/';
const extension = '.php';

document.getElementById('search-contact-button').addEventListener('click', performSearch);

document.getElementById('search-query').addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        event.preventDefault(); // Prevents form submission if inside a form
        performSearch();
    }
});

function performSearch() {
    const data = {
        search: document.getElementById('search-query').value,
        userId: localStorage.getItem('userId'),
    };

    makeRequest('SearchContacts', data, (response) => {
        if (response.error) {
            showToast("No records found. Please add a contact");
        } else {
            displayResults(response.results);
        }
    });
}
const container = document.querySelector('.container');

setInterval(createFish, 1000);


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

function displayResults(results) {
    const resultsBody = document.getElementById('results-body');
    resultsBody.innerHTML = '';
    results.forEach(result => {
        const row = document.createElement('tr');
        const contactRow = document.createElement('td');
        contactRow.classList.add('contact-row');
        const contactInfo = document.createElement('div');
        contactInfo.classList.add('contact-info');
        contactInfo.innerHTML = `${result.FirstName} ${result.LastName}<br>${result.Phone}<br>${result.Email}`;
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

            const data = {
                phone: phoneDelete,
                userId: localStorage.getItem('userId'),
            };

            makeRequest('DeleteContact', data, (response) => {
                //alert(response.error ? response.error : 'Contact deleted successfully.');
                showToast("Contact deleted seccessfully");
                resultsBody.removeChild(row);
            });
        });

        actionButtons.appendChild(editButton);
        actionButtons.appendChild(deleteButton);
        contactRow.appendChild(actionButtons);

        row.appendChild(contactRow);
        resultsBody.appendChild(row);
    });

    document.querySelector('.results-table').classList.remove('hidden');
}


