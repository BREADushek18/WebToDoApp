document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('add-note');
    const taskContainer = document.getElementById('task-container');
    const noTasksMessage = document.getElementById('no-tasks');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    const shareModal = document.getElementById('share-modal'); 
    const copyButton = document.getElementById('copy-button'); 
    const infoModal = document.getElementById('info-modal');
    const infoGif = document.querySelector('.info-gif'); 
    const gifs = [
        '../assets/images/cat1.gif',
        '../assets/images/cat2.gif',
        '../assets/images/cat3.gif',
        '../assets/images/cat4.gif',
        '../assets/images/cat5.gif'
    ];
    let activeTask = null; 
    let taskToDelete = null; 

    function createSpecButtons() {
        let specButtons = document.createElement('div');
        specButtons.classList.add('button-container');

        let shareButton = document.createElement('button');
        shareButton.innerHTML = '<img src="../assets/icons/share.svg" class="icon">';
        shareButton.classList.add('task-button');
        specButtons.appendChild(shareButton);

        let infoButton = document.createElement('button');
        infoButton.innerHTML = '<span>i</span>';
        infoButton.classList.add('task-button');
        specButtons.appendChild(infoButton);

        let editButton = document.createElement('button');
        editButton.innerHTML = '<img src="../assets/icons/edit.svg" class="icon">';
        editButton.classList.add('task-button');
        specButtons.appendChild(editButton);

        editButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            const currentTask = editButton.closest('.task'); 
            const fullTitle = currentTask.dataset.fullTitle; 
            const fullDescription = currentTask.dataset.fullDesc; 

            showEditModal(fullTitle, fullDescription, (newTitle, newDesc) => {
                currentTask.dataset.fullTitle = newTitle;
                currentTask.dataset.fullDesc = newDesc;

                currentTask.querySelector('.task-title').innerText = newTitle.length > 28 ? newTitle.slice(0, 28) + '...' : newTitle; // Обновляем заголовок
                currentTask.querySelector('.task-body').innerText = newDesc.length > 28 ? newDesc.slice(0, 28) + '...' : newDesc; // Обновляем описание
                updateLocalStorage(); 
            });
        });

        setupShareModal(shareButton, shareModal, copyButton, '', '');
        setupInfoModal(infoButton, infoModal, infoGif, gifs);

        return specButtons;
    }

    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => createTaskElement(task.title, task.body));
    };

    const createTaskElement = (fullTitle, fullBody) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.dataset.fullTitle = fullTitle; 
        taskDiv.dataset.fullDesc = fullBody; 

        const taskContent = document.createElement('div');

        const truncatedTitle = fullTitle.length > 28 ? fullTitle.slice(0, 28) + '...' : fullTitle;
        const titleElement = document.createElement('strong');
        titleElement.className = 'task-title';
        titleElement.textContent = truncatedTitle;

        const truncatedBody = fullBody.length > 28 ? fullBody.slice(0, 28) + '...' : fullBody;
        const bodyElement = document.createElement('span');
        bodyElement.className = 'task-body';
        bodyElement.textContent = truncatedBody;

        taskContent.appendChild(titleElement);
        taskContent.appendChild(document.createElement('br'));
        taskContent.appendChild(bodyElement);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×'; 
        deleteButton.className = 'delete-button';
        deleteButton.onclick = (e) => {
            e.stopPropagation(); 
            taskToDelete = taskDiv; 
            deleteModal.style.display = 'block'; 
        };

        const buttonContainer = createSpecButtons();
        buttonContainer.style.display = 'none';

        taskDiv.appendChild(taskContent);
        taskDiv.appendChild(deleteButton);
        taskDiv.appendChild(buttonContainer);
        taskContainer.prepend(taskDiv);

        taskDiv.onclick = (event) => {
            if (event.target.className !== 'delete-button') {
                const buttonsVisible = buttonContainer.style.display === 'block';

                if (buttonsVisible) {
                    buttonContainer.style.display = 'none';
                    activeTask = null; 
                    adjustTaskMargins(taskDiv, 0);
                } else {
                    if (activeTask) {
                        const previousButtonContainer = activeTask.querySelector('.button-container');
                        if (previousButtonContainer) {
                            previousButtonContainer.style.display = 'none';
                        }
                        adjustTaskMargins(activeTask, 0); 
                    }

                    buttonContainer.style.display = 'block';
                    activeTask = taskDiv; 
                    adjustTaskMargins(taskDiv, 70); 
                }
            }
        };
        checkNoTasks();
    };

    function adjustTaskMargins(currentTask, additionalMargin) {
        const tasks = document.querySelectorAll(".task");
        let currentTaskFound = false;

        tasks.forEach(task => {
            if (currentTaskFound) {
                task.style.marginTop = `${additionalMargin}px`; 
                currentTaskFound = false; 
            } else {
                task.style.marginTop = '2px'; 
            }

            if (task === currentTask) {
                currentTaskFound = true; 
            }
        });
    }

    const checkNoTasks = (tasks) => {
        if (tasks.length > 0) {
            noTasksMessage.style.display = 'none';
            document.querySelectorAll('.divider').forEach(div => div.style.display = 'none');
        } else {
            noTasksMessage.style.display = 'block';
            document.querySelectorAll('.divider').forEach(div => div.style.display = 'block');
        }
    };

    addNoteButton.addEventListener('click', () => {
        const titleInput = document.getElementById('title');
        const aboutInput = document.getElementById('about');

        if (titleInput.value && aboutInput.value) {
            createTaskElement(titleInput.value, aboutInput.value);
            titleInput.value = '';
            aboutInput.value = '';
            updateLocalStorage();
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            checkNoTasks(tasks);
        }
    });

    confirmDeleteButton.addEventListener('click', () => {
        if (taskToDelete) {
            taskContainer.removeChild(taskToDelete);
            updateLocalStorage();
            const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
            checkNoTasks(tasks);
            taskToDelete = null; 
        }
        deleteModal.style.display = 'none'; 
    });

    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.style.display = 'none'; 
        taskToDelete = null; 
    });

    loadTasks();
    checkNoTasks();
});
