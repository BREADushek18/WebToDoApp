function loadTasks(taskContainer, createTaskElement) {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(task => createTaskElement(task.title, task.body, taskContainer));
}

function updateLocalStorage() {
    const tasks = [];
    document.querySelectorAll('.task').forEach(task => {
        const title = task.dataset.fullTitle; // Получаем полное название из атрибута
        const body = task.dataset.fullDesc; // Получаем полное описание из атрибута
        tasks.push({ title, body });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}
