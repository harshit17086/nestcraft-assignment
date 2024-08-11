const sortableList = document.querySelector(".menu ul");

const updateDraggableItems = () => {
    const items = sortableList.querySelectorAll("li");

    items.forEach(item => {
        item.setAttribute('draggable', true);
        item.addEventListener("dragstart", () => {
            setTimeout(() => item.classList.add("dragging"), 0);
        });
        item.addEventListener("dragend", () => item.classList.remove("dragging"));
    });
};

const initSortableList = (e) => {
    e.preventDefault();
    const draggingItem = document.querySelector(".dragging");
    let siblings = [...sortableList.querySelectorAll("li:not(.dragging)")];

    let nextSibling = siblings.find(sibling => {
        return e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2;
    });
    sortableList.insertBefore(draggingItem, nextSibling);
}

sortableList.addEventListener("dragover", initSortableList);
sortableList.addEventListener("dragenter", e => e.preventDefault());


const tabs = document.querySelectorAll('.menu a');
const tabContents = document.querySelectorAll('.tab-content');

tabs.forEach(tab => {
    tab.addEventListener('click', (event) => {
        event.preventDefault();
        const targetId = tab.getAttribute('data-target');
        tabContents.forEach(content => {
            if (content.id === targetId.substring(1)) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });
    });
});


function sendDataToServer(data) {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'add_service.php', true);
    xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                console.log('Data sent successfully');
                console.log(xhr.responseText); 
            } else {
                console.error('Failed to send data');
            }
        }
    };
    xhr.send(data);
}


function addRow(button) {
    const form = button.closest('.add-service-form');
    const table = form.previousElementSibling;
    const name = form.querySelector('.name-input').value;
    const regular = form.querySelector('.regular-input').value;
    const basic = form.querySelector('.basic-input').value;
    const advance = form.querySelector('.advance-input').value;
    const duration = form.querySelector('.duration-input').value;
    const gender = form.querySelector('.gender-select').value;

    if (name && regular && basic && advance && duration && gender) {
        const newRow = table.insertRow();
        newRow.innerHTML = `
            <td>${name}</td>
            <td>${regular}</td>
            <td>${basic}</td>
            <td>${advance}</td>
            <td>${duration}</td>
            <td>${gender}</td>
        `;
        const data = `service_name=${encodeURIComponent(name)}&regular_amount=${encodeURIComponent(regular)}&basic_amount=${encodeURIComponent(basic)}&advance_amount=${encodeURIComponent(advance)}&duration=${encodeURIComponent(duration)}&gender=${encodeURIComponent(gender)}`;
        sendDataToServer(data);
        form.querySelector('.name-input').value = '';
        form.querySelector('.regular-input').value = '';
        form.querySelector('.basic-input').value = '';
        form.querySelector('.advance-input').value = '';
        form.querySelector('.duration-input').value = '';
        form.querySelector('.gender-select').value = 'Male';
    } else {
        alert('Please fill in all fields.');
    }
}

document.querySelectorAll('.add-row-btn').forEach(button => {
    button.addEventListener('click', () => addRow(button));
});


document.querySelector('.add-category-btn').addEventListener('click', () => {
    const newServiceName = document.querySelector('.new-category-input').value.trim();
    if (newServiceName) {
        const newTabId = newServiceName.toLowerCase().replace(/\s+/g, '-');
        const menu = document.querySelector('.menu ul');
        const newTab = document.createElement('li');
        const newTabLink = document.createElement('a');
        newTabLink.setAttribute('href', '#');
        newTabLink.setAttribute('data-target', `#${newTabId}`);
        newTabLink.textContent = newServiceName;
        newTab.appendChild(newTabLink);
        menu.appendChild(newTab);

        const contentSection = document.createElement('div');
        contentSection.classList.add('tab-content');
        contentSection.id = newTabId;
        contentSection.innerHTML = `
            <table class="service-table">
                <tr>
                    <th>Name</th>
                    <th>Regular</th>
                    <th>Basic</th>
                    <th>Advance</th>
                    <th>Duration</th>
                    <th>Gender</th>
                </tr>
            </table>
            <div class="add-service-form">
                <input type="text" placeholder="Enter Service Name" class="name-input">
                <input type="text" placeholder="Enter Regular Amount" class="regular-input">
                <input type="text" placeholder="Enter Basic Amount" class="basic-input">
                <input type="text" placeholder="Enter Advance Amount" class="advance-input">
                <input type="text" placeholder="Enter Duration" class="duration-input">
                <select class="gender-select">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Both">Both</option>
                </select>
                <button class="add-row-btn">Add</button>
            </div>
        `;
        document.querySelector('.services-section').appendChild(contentSection);
        document.querySelector('.new-category-input').value = '';

        newTabLink.addEventListener('click', (event) => {
            event.preventDefault();
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            contentSection.classList.add('active');
        });

        contentSection.querySelector('.add-row-btn').addEventListener('click', function () {
            addRow(this);
        });

        
        updateDraggableItems();
    }
});

document.addEventListener("DOMContentLoaded", function() {
    const sidebarButtons = document.querySelectorAll('.menu ul li');
    const addCategoryButton = document.querySelector('.add-category-btn');
    const categoryModal = document.getElementById('category-modal');
    const closeModalButton = document.querySelector('.close-btn');
    const categoryForm = document.getElementById('category-form');
    const menuList = document.querySelector('.menu ul');
    const uploadPanel = document.getElementById('upload-panel');
    const uploadInput = document.getElementById('upload-image');

    function handleDragStart(e) {
        e.dataTransfer.setData('text/plain', e.target.dataset.index);
        e.target.classList.add('dragging');
    }

    function handleDragOver(e) {
        e.preventDefault();
    }

    function handleDrop(e) {
        e.preventDefault();
        const draggingElement = document.querySelector('.dragging');
        const targetElement = e.target.closest('li');
        if (draggingElement && targetElement) {
            menuList.insertBefore(draggingElement, targetElement.nextSibling);
            draggingElement.classList.remove('dragging');
        }
    }

    
    updateDraggableItems();

    
    addCategoryButton.addEventListener('click', function() {
        categoryModal.style.display = 'block';
    });

    
    closeModalButton.addEventListener('click', function() {
        categoryModal.style.display = 'none';
    });


    categoryForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const categoryName = categoryForm.querySelector('.popup-category-input').value;
        const imageFile = uploadInput.files[0];

        if (categoryName && imageFile) {
            const reader = new FileReader();
            reader.onload = function(event) {
                const imgSrc = event.target.result;
                const newCategory = document.createElement('li');
                newCategory.draggable = true;
                newCategory.innerHTML = `
                    <img src="${imgSrc}" class="icon" alt="${categoryName}">
                    <a href="#" data-target="#${categoryName.toLowerCase().replace(/\s+/g, '')}">${categoryName}</a>
                `;
                newCategory.addEventListener('dragstart', handleDragStart);
                newCategory.addEventListener('dragover', handleDragOver);
                newCategory.addEventListener('drop', handleDrop);
                menuList.appendChild(newCategory);
                categoryModal.style.display = 'none';
                uploadInput.value = ''; 
            };
            reader.readAsDataURL(imageFile);
        }
    });

    
    uploadPanel.addEventListener('click', () => {
        uploadInput.click();
    });
});
