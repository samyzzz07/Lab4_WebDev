// ---------- Types ----------
// A todo is an object with these three properties
interface Todo {
  id: number;
  text: string;
  done: boolean;
}

// The filter can only be one of these three strings
type Filter = "all" | "active" | "completed";

// ---------- State (the data of our app) ----------
let todos: Todo[] = [];
let nextId: number = 1;
let currentFilter: Filter = "all";

// ---------- Grab elements from the HTML ----------
// "as HTMLInputElement" tells TS this element is an <input>,
// so we are allowed to use .value on it
const input = document.getElementById("todo-input") as HTMLInputElement;
const addBtn = document.getElementById("add-btn") as HTMLButtonElement;
const list = document.getElementById("todo-list") as HTMLUListElement;
const count = document.getElementById("count") as HTMLSpanElement;
const clearCompletedBtn = document.getElementById("clear-completed") as HTMLButtonElement;
const clearAllBtn = document.getElementById("clear-all") as HTMLButtonElement;
const filterButtons = document.querySelectorAll<HTMLButtonElement>(".filter");

// ---------- Functions that change the data ----------
function addTodo(): void {
  const text: string = input.value.trim();
  if (text === "") return; // don't add empty todos

  todos.push({ id: nextId, text: text, done: false });
  nextId++;
  input.value = "";
  render();
}

function toggleTodo(id: number): void {
  for (const todo of todos) {
    if (todo.id === id) {
      todo.done = !todo.done;
    }
  }
  render();
}

function deleteTodo(id: number): void {
  todos = todos.filter((todo) => todo.id !== id);
  render();
}

function editTodo(id: number, newText: string): void {
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
function render(): void {
  list.innerHTML = ""; // wipe the list, then rebuild it

  for (const todo of todos) {
    // skip todos that don't match the current filter
    if (currentFilter === "active" && todo.done) continue;
    if (currentFilter === "completed" && !todo.done) continue;

    const li = document.createElement("li");
    if (todo.done) li.classList.add("done");

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

      editBox.addEventListener("keydown", (e: KeyboardEvent) => {
        if (e.key === "Enter") editTodo(todo.id, editBox.value);
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
  const left: number = todos.filter((todo) => !todo.done).length;
  count.textContent = left + (left === 1 ? " item left" : " items left");
}

// ---------- Listen for clicks ----------
addBtn.addEventListener("click", addTodo);

input.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Enter") addTodo();
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
    currentFilter = btn.dataset.filter as Filter;

    // move the blue "active" look to the clicked button
    filterButtons.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");

    render();
  });
});

// first draw
render();
