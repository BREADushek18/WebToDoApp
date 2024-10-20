document.addEventListener('DOMContentLoaded', () => {
    const addNoteButton = document.getElementById('add-note');
    const taskContainer = document.getElementById('task-container');
    const noTasksMessage = document.getElementById('no-tasks');
    const deleteModal = document.getElementById('delete-modal');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    const editModal = document.getElementById('edit-modal'); 
    const taskTitleInput = document.getElementById('edit-title'); 
    const taskDescriptionInput = document.getElementById('edit-desc'); 
    const shareModal = document.getElementById('share-modal'); 
    const copyButton = document.getElementById('copy-button'); 
    const closeShareModalButton = document.getElementById('close-share-modal'); 
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

        // Добавляем обработчик нажатия на кнопку "Редактировать"
        editButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Останавливаем всплытие события
            const currentTask = editButton.closest('.task'); // Получаем родительский элемент задачи
            const fullTitle = currentTask.dataset.fullTitle; // Получаем полное название из атрибута
            const fullDescription = currentTask.dataset.fullDesc; // Получаем полное описание из атрибута

            // Передаем полные значения в модальное окно
            showEditModal(fullTitle, fullDescription, (newTitle, newDesc) => {
                // Обновляем полные значения в атрибутах
                currentTask.dataset.fullTitle = newTitle;
                currentTask.dataset.fullDesc = newDesc;

                // Обновляем заголовок и описание в задаче
                currentTask.querySelector('.task-title').innerText = newTitle.length > 28 ? newTitle.slice(0, 28) + '...' : newTitle; // Обновляем заголовок
                currentTask.querySelector('.task-body').innerText = newDesc.length > 28 ? newDesc.slice(0, 28) + '...' : newDesc; // Обновляем описание
                updateLocalStorage(); // Обновляем локальное хранилище
            });
        });

        // Обработчик для кнопки "Поделиться"
        shareButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Останавливаем всплытие события
            const currentTask = shareButton.closest('.task');
            const fullTitle = currentTask.dataset.fullTitle;
            const fullDescription = currentTask.dataset.fullDesc;

            // Открываем модальное окно
            shareModal.style.display = 'flex';

            // Обработчик для кнопки копирования
            copyButton.onclick = () => {
                const textToCopy = `Задача: ${fullTitle}\nОписание задачи: 
                ${fullDescription}\nЗадача была создана в самом лучшем To Do приложении 
                разработчиком BREADushek <3`;
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                        alert('Текст скопирован в буфер обмена!');
                        shareModal.style.display = 'none'; // Закрываем модальное окно
                    })
                    .catch(err => {
                        console.error('Ошибка копирования: ', err);
                    });
            };

            // Обработчик для остальных кнопок
            const iconButtons = document.querySelectorAll('.icon-button');
            iconButtons.forEach(button => {
                button.onclick = () => {
                    // Здесь можно добавить функционал для каждой кнопки
                    shareModal.style.display = 'none'; // Закрываем модальное окно
                };
            });

            // Закрытие модального окна при нажатии вне его
            shareModal.addEventListener('click', (event) => {
                if (event.target === shareModal) {
                    shareModal.style.display = 'none'; // Скрываем модальное окно
                }
            });
        });

        return specButtons;
    }

    function showEditModal(fullTitle, fullDesc, onSave) {
        taskTitleInput.value = fullTitle; // Устанавливаем полный заголовок
        taskDescriptionInput.value = fullDesc; // Устанавливаем полное описание
    
        editModal.style.display = 'flex'; // Показываем модальное окно
    
        editModal.addEventListener('click', function(event) {
            if (event.target === editModal) {
                editModal.style.display = 'none';
            }
        });
    
        document.getElementById('save-edit').onclick = () => {
            const newTitle = taskTitleInput.value;
            const newDesc = taskDescriptionInput.value;
            onSave(newTitle, newDesc); // Вызываем обновление задачи
            editModal.style.display = 'none'; // Скрываем модальное окно
        };
    
        document.getElementById('cancel-edit').onclick = () => {
            editModal.style.display = 'none'; // Скрываем модальное окно
        };
    }          

    // Загрузка задач из локального хранилища
    const loadTasks = () => {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => createTaskElement(task.title, task.body));
    };

    // Создание элемента задачи
    const createTaskElement = (fullTitle, fullBody) => {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        taskDiv.dataset.fullTitle = fullTitle; // Сохраняем полное название
        taskDiv.dataset.fullDesc = fullBody; // Сохраняем полное описание

        const taskContent = document.createElement('div');

        // Ограничиваем заголовок до 28 символов для отображения
        const truncatedTitle = fullTitle.length > 28 ? fullTitle.slice(0, 28) + '...' : fullTitle;
        const titleElement = document.createElement('strong');
        titleElement.className = 'task-title';
        titleElement.textContent = truncatedTitle;

        // Ограничиваем описание до 28 символов для отображения
        const truncatedBody = fullBody.length > 28 ? fullBody.slice(0, 28) + '...' : fullBody;
        const bodyElement = document.createElement('span');
        bodyElement.className = 'task-body';
        bodyElement.textContent = truncatedBody;

        taskContent.appendChild(titleElement);
        taskContent.appendChild(document.createElement('br'));
        taskContent.appendChild(bodyElement);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = '×'; // Используем textContent
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
            const title = task.dataset.fullTitle; // Получаем полное название из атрибута
            const body = task.dataset.fullDesc; // Получаем полное описание из атрибута
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
