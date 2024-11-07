function showEditModal(fullTitle, fullDesc, onSave) {
    const taskTitleInput = document.getElementById('edit-title');
    const taskDescriptionInput = document.getElementById('edit-desc');
    const editModal = document.getElementById('edit-modal');

    taskTitleInput.value = fullTitle; 
    taskDescriptionInput.value = fullDesc; 
    editModal.style.display = 'flex'; 
    editModal.addEventListener('click', function(event) {
        if (event.target === editModal) {
            editModal.style.display = 'none';
        }
    });

    document.getElementById('save-edit').onclick = () => {
        const newTitle = taskTitleInput.value;
        const newDesc = taskDescriptionInput.value;
        onSave(newTitle, newDesc); 
        editModal.style.display = 'none'; 
    };

    document.getElementById('cancel-edit').onclick = () => {
        editModal.style.display = 'none'; 
    };
}

function setupShareModal(shareButton, shareModal, copyButton, fullTitle, fullDescription) {
    shareButton.addEventListener('click', (event) => {
        event.stopPropagation(); 

        shareModal.style.display = 'flex';

        copyButton.onclick = () => {
            const textToCopy = `Задача: ${fullTitle}\nОписание задачи: 
            ${fullDescription}\nЗадача была создана в самом лучшем To Do приложении 
            разработчиком BREADushek <3`;
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    alert('Текст скопирован в буфер обмена!');
                    shareModal.style.display = 'none'; 
                })
                .catch(err => {
                    console.error('Ошибка копирования: ', err);
                });
        };

        shareModal.addEventListener('click', (event) => {
            if (event.target === shareModal) {
                shareModal.style.display = 'none'; 
            }
        });
    });
}

function setupInfoModal(infoButton, infoModal, infoGif, gifs) {
    infoButton.addEventListener('click', (event) => {
        event.stopPropagation(); 

        const randomIndex = Math.floor(Math.random() * gifs.length);
        infoGif.src = gifs[randomIndex]; 

        infoModal.style.display = 'flex'; 
    });

    infoModal.addEventListener('click', (event) => {
        if (event.target === infoModal) {
            infoModal.style.display = 'none'; 
        }
    });
}
