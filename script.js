"use strict";
// ---------- State (the data of our app) ----------
let todos = [];
let nextId = 1;
let currentFilter = "all";
// ---------- Grab elements from the HTML ----------
// "as HTMLInputElement" tells TS this element is an <input>,
// so we are allowed to use .value on it
const input = document.getElementById("todo-input");
const addBtn = document.getElementById("add-btn");
const list = document.getElementById("todo-list");
const count = document.getElementById("count");
const clearCompletedBtn = document.getElementById("clear-completed");
const clearAllBtn = document.getElementById("clear-all");
const filterButtons = document.querySelectorAll(".filter");
// ---------- Functions that change the data ----------
function addTodo() {
    const text = input.value.trim();
    if (text === "")
        return; // don't add empty todos
    todos.push({ id: nextId, text: text, done: false });
    nextId++;
    input.value = "";
    render();
}
function toggleTodo(id) {
    for (const todo of todos) {
        if (todo.id === id) {
            todo.done = !todo.done;
        }
    }
    render();
}
function deleteTodo(id) {
    todos = todos.filter((todo) => todo.id !== id);
    render();
}
function editTodo(id, newText) {
    const text = newText.trim();
    if (text === "") {
        deleteTodo(id); // empty text means remove it
        return;
    }
    for (const todo of todos) {
        if (todo.id === id) {
            todo.text = text;
        }
    }
    render();
}
// ---------- Draw everything on the screen ----------
function render() {
    list.innerHTML = ""; // wipe the list, then rebuild it
    for (const todo of todos) {
        // skip todos that don't match the current filter
        if (currentFilter === "active" && todo.done)
            continue;
        if (currentFilter === "completed" && !todo.done)
            continue;
        const li = document.createElement("li");
        if (todo.done)
            li.classList.add("done");
        // checkbox
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.done;
        checkbox.addEventListener("change", () => toggleTodo(todo.id));
        // text
        const span = document.createElement("span");
        span.textContent = todo.text;
        // double-click: swap the text for an input box
        span.addEventListener("dblclick", () => {
            const editBox = document.createElement("input");
            editBox.type = "text";
            editBox.value = todo.text;
            editBox.className = "edit-input";
            editBox.addEventListener("keydown", (e) => {
                if (e.key === "Enter")
                    editTodo(todo.id, editBox.value);
            });
            li.replaceChild(editBox, span);
            editBox.focus();
        });
        // delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.className = "delete-btn";
        deleteBtn.textContent = "🗑";
        deleteBtn.addEventListener("click", () => deleteTodo(todo.id));
        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(deleteBtn);
        list.appendChild(li);
    }
    // update "x items left" (only counts todos that are not done)
    const left = todos.filter((todo) => !todo.done).length;
    count.textContent = left + (left === 1 ? " item left" : " items left");
}
// ---------- Listen for clicks ----------
addBtn.addEventListener("click", addTodo);
input.addEventListener("keydown", (e) => {
    if (e.key === "Enter")
        addTodo();
});
clearCompletedBtn.addEventListener("click", () => {
    todos = todos.filter((todo) => !todo.done);
    render();
});
clearAllBtn.addEventListener("click", () => {
    todos = [];
    render();
});
filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        currentFilter = btn.dataset.filter;
        // move the blue "active" look to the clicked button
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        render();
    });
});
// first draw
render();
