const API_URL = "https://todo-backend-sccd.onrender.com"; // mudar depois para o backend no Render

async function loadTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  const tasks = await res.json();
  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(t => {
    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = t.text;
    li.appendChild(span);

    // Editar inline
    const editBtn = document.createElement("button");
    editBtn.textContent = "Editar";
    editBtn.classList.add("edit");
    editBtn.onclick = () => {
      const input = document.createElement("input");
      input.value = t.text;
      li.insertBefore(input, span);
      li.removeChild(span);
      editBtn.textContent = "Salvar";
      editBtn.onclick = async () => {
        await fetch(`${API_URL}/tasks/${t.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: input.value })
        });
        loadTasks();
      };
    };
    li.appendChild(editBtn);

    // Deletar
    const delBtn = document.createElement("button");
    delBtn.textContent = "Deletar";
    delBtn.onclick = () => deleteTask(t.id);
    li.appendChild(delBtn);

    list.appendChild(li);
  });
}

async function addTask() {
  const text = document.getElementById("taskInput").value.trim();
  if (!text) return;

  await fetch(`${API_URL}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text })
  });

  document.getElementById("taskInput").value = "";
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${API_URL}/tasks/${id}`, { method: "DELETE" });
  loadTasks();
}

loadTasks();
