// TV To-Do App for Tizen TV

var todoListEl = document.getElementById('todo-list');
var addTaskBtn = document.getElementById('add-task-btn');
var modal = document.getElementById('modal');
var taskInput = document.getElementById('task-input');
var saveTaskBtn = document.getElementById('save-task-btn');
var cancelTaskBtn = document.getElementById('cancel-task-btn');
var filterBar = document.getElementById('filter-bar');
var filterAll = document.getElementById('filter-all');
var filterActive = document.getElementById('filter-active');
var filterCompleted = document.getElementById('filter-completed');
var confirmModal = document.getElementById('confirm-modal');
var confirmYesBtn = document.getElementById('confirm-yes-btn');
var confirmNoBtn = document.getElementById('confirm-no-btn');

var tasks = [];
var selectedIdx = 0;
var filter = 'all'; // 'all', 'active', 'completed'
var confirmDeleteIdx = null;
var filterOptions = ['all', 'active', 'completed'];
var filterIdx = 0;
var confirmSelected = 0; // 0: Yes, 1: No
var focusMode = 'list'; // 'filter' or 'list'
var editingTaskIdx = null; // Track which task is being edited

function loadTasks() {
    var data = localStorage.getItem('tv_todo_tasks');
    tasks = data ? JSON.parse(data) : [];
}

function saveTasks() {
    localStorage.setItem('tv_todo_tasks', JSON.stringify(tasks));
}

function getFilteredTasks() {
    if (filter === 'all') return tasks;
    if (filter === 'active') return tasks.filter(function(t) { return !t.done; });
    if (filter === 'completed') return tasks.filter(function(t) { return t.done; });
}

function renderFilterBar() {
    filterAll.classList.toggle('selected', filter === 'all');
    filterActive.classList.toggle('selected', filter === 'active');
    filterCompleted.classList.toggle('selected', filter === 'completed');
    if (focusMode === 'filter') {
        filterBar.classList.add('focused');
    } else {
        filterBar.classList.remove('focused');
    }
}

function renderTasks() {
    todoListEl.innerHTML = '';
    var filtered = getFilteredTasks();
    if (filtered.length === 0) {
        var li = document.createElement('li');
        li.textContent = 'No tasks yet. Add one!';
        li.className = 'empty';
        todoListEl.appendChild(li);
        selectedIdx = 0;
        return;
    }
    if (selectedIdx >= filtered.length) selectedIdx = filtered.length - 1;
    filtered.forEach(function(task, idx) {
        var li = document.createElement('li');
        li.textContent = task.text;
        if (task.done) li.classList.add('done');
        if (idx === selectedIdx) li.classList.add('selected');
        // Add Edit Button
        var editBtn = document.createElement('button');
        editBtn.className = 'edit-btn';
        editBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4 12.5-12.5z"/></svg>';
        editBtn.onclick = function(e) {
            e.stopPropagation();
            var realIdx = tasks.indexOf(task);
            showModal(realIdx);
        };
        li.appendChild(editBtn);
        // Add Delete Button
        var delBtn = document.createElement('button');
        delBtn.className = 'delete-btn';
        delBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>';
        delBtn.onclick = function(e) {
            e.stopPropagation();
            var realIdx = tasks.indexOf(task);
            showConfirmModal(realIdx);
        };
        li.appendChild(delBtn);
        todoListEl.appendChild(li);
    });
}

function showModal(editIdx) {
    console.log('Opening modal');
    modal.classList.remove('hidden');
    if (typeof editIdx === 'number') {
        taskInput.value = tasks[editIdx].text;
        editingTaskIdx = editIdx;
    } else {
        taskInput.value = '';
        editingTaskIdx = null;
    }
    setTimeout(function() {
        taskInput.focus();
        console.log('Input focused');
    }, 100);
}

function hideModal() {
    modal.classList.add('hidden');
}

function showConfirmModal(idx) {
    confirmModal.classList.remove('hidden');
    confirmDeleteIdx = idx;
    confirmSelected = 0;
    updateConfirmButtons();
}

function hideConfirmModal() {
    confirmModal.classList.add('hidden');
    confirmDeleteIdx = null;
}

function updateConfirmButtons() {
    confirmYesBtn.classList.toggle('selected', confirmSelected === 0);
    confirmNoBtn.classList.toggle('selected', confirmSelected === 1);
}

function addTask(text) {
    if (!text.trim()) return;
    if (editingTaskIdx !== null) {
        tasks[editingTaskIdx].text = text;
        editingTaskIdx = null;
    } else {
        tasks.push({ text: text, done: false });
    }
    saveTasks();
    // If filter is not 'completed', select the new/edited task
    if (filter !== 'completed') {
        var filtered = getFilteredTasks();
        selectedIdx = filtered.length - 1;
    }
    renderTasks();
}

function deleteTaskByIdx(idx) {
    var filtered = getFilteredTasks();
    if (filtered.length === 0) return;
    // Find the actual index in tasks
    var task = filtered[idx];
    var realIdx = tasks.indexOf(task);
    if (realIdx !== -1) {
        tasks.splice(realIdx, 1);
        saveTasks();
    }
    renderTasks();
}

function toggleDone(idx) {
    var filtered = getFilteredTasks();
    if (filtered.length === 0) return;
    var task = filtered[idx];
    var realIdx = tasks.indexOf(task);
    if (realIdx !== -1) {
        tasks[realIdx].done = !tasks[realIdx].done;
        saveTasks();
    }
    renderTasks();
}

function handleKeyDown(e) {
    if (!modal.classList.contains('hidden')) {
        // Modal open: handle Enter/Escape
        if (e.key === 'Enter') {
            addTask(taskInput.value);
            hideModal();
        } else if (e.key === 'Escape' || e.key === 'Backspace') {
            hideModal();
        }
        return;
    }
    if (!confirmModal.classList.contains('hidden')) {
        // Confirm modal open
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            confirmSelected = 1 - confirmSelected;
            updateConfirmButtons();
        } else if (e.key === 'Enter') {
            if (confirmSelected === 0) {
                deleteTaskByIdx(confirmDeleteIdx);
            }
            hideConfirmModal();
        } else if (e.key === 'Escape' || e.key === 'Backspace') {
            hideConfirmModal();
        }
        return;
    }
    switch (e.key) {
        case 'ArrowUp':
            if (focusMode === 'list') {
                focusMode = 'filter';
                renderFilterBar();
                renderTasks();
            }
            break;
        case 'ArrowDown':
            if (focusMode === 'filter') {
                focusMode = 'list';
                renderFilterBar();
                renderTasks();
            } else if (focusMode === 'list') {
                var filtered = getFilteredTasks();
                if (filtered.length > 0) {
                    selectedIdx = (selectedIdx + 1) % filtered.length;
                    renderTasks();
                }
            }
            break;
        case 'ArrowLeft':
            if (focusMode === 'filter') {
                filterIdx = filterOptions.indexOf(filter);
                filterIdx = (filterIdx - 1 + filterOptions.length) % filterOptions.length;
                filter = filterOptions[filterIdx];
                renderFilterBar();
                selectedIdx = 0;
                renderTasks();
            }
            break;
        case 'ArrowRight':
            if (focusMode === 'filter') {
                filterIdx = filterOptions.indexOf(filter);
                filterIdx = (filterIdx + 1) % filterOptions.length;
                filter = filterOptions[filterIdx];
                renderFilterBar();
                selectedIdx = 0;
                renderTasks();
            }
            break;
        case 'Enter':
            if (focusMode === 'filter') {
                focusMode = 'list';
                renderFilterBar();
                renderTasks();
            } else {
                showModal();
                setTimeout(function() { taskInput.focus(); }, 100);
            }
            break;
        case 'Delete':
        case 'Backspace': {
            if (focusMode === 'list') {
                var filtered = getFilteredTasks();
                if (filtered.length > 0) {
                    showConfirmModal(selectedIdx);
                }
            }
            break;
        }
        case ' ': // Spacebar for mark done
            if (focusMode === 'list') {
                toggleDone(selectedIdx);
            }
            break;
    }
}

addTaskBtn.addEventListener('click', function() {
    showModal();
    setTimeout(function() { taskInput.focus(); }, 100);
});
saveTaskBtn.addEventListener('click', function() {
    console.log('Save button clicked');
    addTask(taskInput.value);
    hideModal();
});
cancelTaskBtn.addEventListener('click', hideModal);

confirmYesBtn.addEventListener('click', function() {
    deleteTaskByIdx(confirmDeleteIdx);
    hideConfirmModal();
});
confirmNoBtn.addEventListener('click', hideConfirmModal);

document.addEventListener('keydown', handleKeyDown);

taskInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        console.log('Enter pressed in input');
        addTask(taskInput.value);
        hideModal();
    } else if (e.key === 'Escape' || e.key === 'Backspace') {
        hideModal();
    }
});

// Initial load
loadTasks();
focusMode = 'filter'; // Start with filter bar focused
renderFilterBar();
renderTasks();
