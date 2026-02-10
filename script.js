class TodoApp {
    constructor() {
        this.todos = JSON.parse(localStorage.getItem('todos')) || [];
        this.filter = 'all';

        this.form = document.getElementById('todoForm');
        this.input = document.getElementById('todoInput');
        this.list = document.getElementById('todoList');
        this.remaining = document.getElementById('remaining');
        this.clearBtn = document.getElementById('clearCompleted');
        this.filterBtns = document.querySelectorAll('.filter');

        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.addTodo();
        });

        this.filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => this.setFilter(btn.dataset.filter));
        });

        this.clearBtn.addEventListener('click', () => this.clearCompleted());

        this.render();
    }

    addTodo() {
        const text = this.input.value.trim();
        if (!text) return;

        this.todos.push({
            id: Date.now(),
            text,
            completed: false,
        });

        this.input.value = '';
        this.save();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find((t) => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.save();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter((t) => t.id !== id);
        this.save();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter((t) => !t.completed);
        this.save();
        this.render();
    }

    setFilter(filter) {
        this.filter = filter;
        this.filterBtns.forEach((btn) => {
            btn.classList.toggle('active', btn.dataset.filter === filter);
        });
        this.render();
    }

    getFilteredTodos() {
        switch (this.filter) {
            case 'active':
                return this.todos.filter((t) => !t.completed);
            case 'completed':
                return this.todos.filter((t) => t.completed);
            default:
                return this.todos;
        }
    }

    save() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    render() {
        const filtered = this.getFilteredTodos();
        this.list.innerHTML = '';

        if (filtered.length === 0) {
            const empty = document.createElement('li');
            empty.className = 'empty-message';
            empty.textContent =
                this.filter === 'all'
                    ? 'タスクがありません'
                    : this.filter === 'active'
                      ? '未完了のタスクはありません'
                      : '完了済みのタスクはありません';
            this.list.appendChild(empty);
        } else {
            filtered.forEach((todo) => {
                const li = document.createElement('li');
                li.className = `todo-item${todo.completed ? ' done' : ''}`;

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = todo.completed;
                checkbox.addEventListener('change', () => this.toggleTodo(todo.id));

                const span = document.createElement('span');
                span.textContent = todo.text;

                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete';
                deleteBtn.textContent = '削除';
                deleteBtn.addEventListener('click', () => this.deleteTodo(todo.id));

                li.appendChild(checkbox);
                li.appendChild(span);
                li.appendChild(deleteBtn);
                this.list.appendChild(li);
            });
        }

        const activeCount = this.todos.filter((t) => !t.completed).length;
        this.remaining.textContent = activeCount;

        const hasCompleted = this.todos.some((t) => t.completed);
        this.clearBtn.hidden = !hasCompleted;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new TodoApp();
});
