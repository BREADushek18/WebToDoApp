document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('add-note');
    const taskContainer = document.getElementById('task-container');
    const noTasksMessage = document.getElementById('no-tasks');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    let taskToDelete = null; // Переменная для хранения задачи, которую нужно удалить

    // Загрузка задач из локального хранилища
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => createTaskElement(task.title, task.body));
    };


    // Создание элемента задачи
    const createTaskElement = (title, body) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';

        const taskContent = document.createElement('div');
        const truncatedBody = body.length > 28 ? body.slice(0, 28) + '...' : body;
        taskContent.innerHTML = `<strong>${title}</strong><br>${truncatedBody}`; // Ограничение по длине

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '×';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = () => {
            taskToDelete = taskDiv; // Сохраняем задачу для удаления
            deleteModal.style.display = 'block'; // Показываем модальное окно
        };

        taskDiv.appendChild(taskContent);
        taskDiv.appendChild(deleteButton);
        taskContainer.prepend(taskDiv); // Добавляем задачу в начало списка

        checkNoTasks();
    };


    // Проверка наличия задач
    const checkNoTasks = () => {
        if (taskContainer.children.length > 0) {
            noTasksMessage.style.display = 'none';
            document.querySelectorAll('.divider').forEach(div => div.style.display = 'none');
        } else {
            noTasksMessage.style.display = 'block';
            document.querySelectorAll('.divider').forEach(div => div.style.display = 'block');
        }
    };

    // Обновление локального хранилища
    const updateLocalStorage = () => {
        const tasks = [];
        document.querySelectorAll('.task').forEach(task => {
            const title = task.querySelector('strong').innerText;
            const body = task.innerText.replace(title, '').trim();
            tasks.push({ title, body });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Добавление новой задачи
    addNoteButton.addEventListener('click', () => {
        const titleInput = document.getElementById('title');
        const aboutInput = document.getElementById('about');

        if (titleInput.value && aboutInput.value) {
            createTaskElement(titleInput.value, aboutInput.value);
            titleInput.value = '';
            aboutInput.value = '';
            updateLocalStorage();
        }
    });

    // Подтверждение удаления
    confirmDeleteButton.addEventListener('click', () => {
        if (taskToDelete) {
            taskContainer.removeChild(taskToDelete);
            updateLocalStorage();
            checkNoTasks();
            taskToDelete = null; // Сбрасываем переменную
        }
        deleteModal.style.display = 'none'; // Скрываем модальное окно
    });

    // Отмена удаления
    cancelDeleteButton.addEventListener('click', () => {
        deleteModal.style.display = 'none'; // Скрываем модальное окно
        taskToDelete = null; // Сбрасываем переменную
    });


    
    // Загрузка задач при загрузке страницы
    loadTasks();
});
