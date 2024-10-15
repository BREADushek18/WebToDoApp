document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('add-note');
    const taskContainer = document.getElementById('task-container');
    const noTasksMessage = document.getElementById('no-tasks');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    let activeTask = null; // Переменная для хранения активной задачи
    let taskToDelete = null; // Переменная для хранения задачи, которую нужно удалить

    // Функция для создания кнопок
    function createSpecButtons() {
        let specButtons = document.createElement('div');
        specButtons.classList.add('button-container'); 

        // Кнопка Поделиться
        let shareButton = document.createElement('button');
        shareButton.innerHTML = '<img src="/src/assets/icons/share.svg" class="icon">';
        shareButton.classList.add('task-button');
        specButtons.appendChild(shareButton);

        // Кнопка Информация
        let infoButton = document.createElement('button');
        infoButton.innerHTML = '<span>i</span>';
        infoButton.classList.add('task-button');
        specButtons.appendChild(infoButton);

        // Кнопка Редактировать
        let editButton = document.createElement('button');
        editButton.innerHTML = '<img src="/src/assets/icons/edit.svg" class="icon">';
        editButton.classList.add('task-button');
        specButtons.appendChild(editButton);

        return specButtons;
    }

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
        taskContent.innerHTML = `<strong>${title}</strong><br>${truncatedBody}`;

        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = '×';
        deleteButton.className = 'delete-button';
        deleteButton.onclick = (e) => {
            e.stopPropagation(); // Останавливаем всплытие события
            taskToDelete = taskDiv; // Сохраняем задачу для удаления
            deleteModal.style.display = 'block'; // Показываем модальное окно
        };

        // Создаем контейнер для кнопок
        const buttonContainer = createSpecButtons(); 
        buttonContainer.style.display = 'none'; 

        taskDiv.appendChild(taskContent);
        taskDiv.appendChild(deleteButton);
        taskDiv.appendChild(buttonContainer); 
        taskContainer.prepend(taskDiv); 

        // Логика показа кнопок
        taskDiv.onclick = (event) => {
            if (event.target.className !== 'delete-button') {
                const buttonsVisible = buttonContainer.style.display === 'block';

                // Скрываем кнопки, если они уже видимы
                if (buttonsVisible) {
                    buttonContainer.style.display = 'none';
                    activeTask = null; // Убираем активную задачу
                    adjustTaskMargins(taskDiv, 0); 
                } else {
                    
                    if (activeTask) {
                        const previousButtonContainer = activeTask.querySelector('.button-container');
                        if (previousButtonContainer) {
                            previousButtonContainer.style.display = 'none';
                        }
                        adjustTaskMargins(activeTask, 0); // Убираем отступ у предыдущей задачи
                    }

                    // Отображаем кнопки под текущей задачей
                    buttonContainer.style.display = 'block';
                    activeTask = taskDiv; // Устанавливаем текущую задачу как активную
                    adjustTaskMargins(taskDiv, 70); // Устанавливаем отступ для активной задачи
                }
            }
        };

        checkNoTasks();
    };

    // Функция для настройки отступов между задачами
    function adjustTaskMargins(currentTask, additionalMargin) {
        const tasks = document.querySelectorAll(".task");
        let currentTaskFound = false;

        tasks.forEach(task => {
            if (currentTaskFound) {
                task.style.marginTop = `${additionalMargin}px`; // Устанавливаем отступ только для следующей задачи
                currentTaskFound = false; // Прекращаем поиск после первой найденной задачи
            } else {
                task.style.marginTop = '2px'; // Возвращаем стандартный отступ для всех остальных
            }

            if (task === currentTask) {
                currentTaskFound = true; // Найдена активная задача
            }
        });
    }

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
    checkNoTasks();
});
