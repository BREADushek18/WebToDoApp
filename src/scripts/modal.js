function showEditModal(fullTitle, fullDesc, onSave) {
    const taskTitleInput = document.getElementById('edit-title');
    const taskDescriptionInput = document.getElementById('edit-desc');
    const editModal = document.getElementById('edit-modal');

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

function setupShareModal(shareButton, shareModal, copyButton, fullTitle, fullDescription) {
    shareButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Останавливаем всплытие события

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

        // Закрытие модального окна при нажатии вне его
        shareModal.addEventListener('click', (event) => {
            if (event.target === shareModal) {
                shareModal.style.display = 'none'; // Скрываем модальное окно
            }
        });
    });
}

function setupInfoModal(infoButton, infoModal, infoGif, gifs) {
    infoButton.addEventListener('click', (event) => {
        event.stopPropagation(); // Останавливаем всплытие события

        // Выбираем случайный GIF из массива
        const randomIndex = Math.floor(Math.random() * gifs.length);
        infoGif.src = gifs[randomIndex]; // Устанавливаем источник изображения

        infoModal.style.display = 'flex'; // Показываем модальное окно
    });

    // Закрытие модального окна при нажатии вне его
    infoModal.addEventListener('click', (event) => {
        if (event.target === infoModal) {
            infoModal.style.display = 'none'; // Скрываем модальное окно
        }
    });
}
