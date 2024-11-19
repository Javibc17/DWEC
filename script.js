class Tarea {
    constructor(id, descripcion) {
        this.id = id;
        this.descripcion = descripcion;
        this.timestamp = new Date(); // Almacena la fecha y hora actual
    }
    getDescripcion() {
        return this.descripcion;
    }
    setDescripcion(descripcion) {
        this.descripcion = descripcion;
    }
}

class TareaManager {
    constructor() {
        this.tareas = this.loadTareas();
    }

    addTarea(tarea) {
        this.tareas.push(tarea);
        this.saveTareas();
    }

    getNextId() {
        return this.tareas.length ? Math.max(...this.tareas.map(t => t.id)) + 1 : 1;
    }

    updateTarea(id, descripcion) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.setDescripcion(descripcion);
            this.saveTareas();
        } else {
            console.error("Tarea no encontrada");
        }
    }

    deleteTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.saveTareas();
    }

    saveTareas() {
        document.cookie = `tareas=${encodeURIComponent(JSON.stringify(this.tareas))}; path=/`;
    }

    loadTareas() {
        const cookies = document.cookie.split("; ").find(row => row.startsWith("tareas="));
        if (cookies) {
            try {
                const tareasJson = JSON.parse(decodeURIComponent(cookies.split("=")[1]));
                // Reconstruir las instancias de Tarea
                return tareasJson.map(tareaData => new Tarea(tareaData.id, tareaData.descripcion));
            } catch (e) {
                console.error("Error al cargar tareas:", e);
                return [];
            }
        }
        return [];
    }
}

const taskManager = new TareaManager();
const taskTableBody = document.getElementById("taskTableBody");
const taskModal = document.getElementById("taskModal");
const deleteModal = document.getElementById("deleteModal");

let currentTaskId = null;

document.getElementById("BtnAgregar").addEventListener("click", () => openModal("add"));

document.getElementById("saveTaskBtn").addEventListener("click", saveTask);
document.getElementById("confirmDeleteBtn").addEventListener("click", confirmDelete);
document.getElementById("cancelDeleteBtn").addEventListener("click", closeDeleteModal);

document.querySelectorAll(".close").forEach(closeBtn => closeBtn.addEventListener("click", closeModal));

function renderTareas() {
    taskTableBody.innerHTML = "";
    taskManager.tareas.forEach(tarea => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tarea.timestamp.toLocaleString()}</td> <!-- Mostrar la fecha y hora -->
            <td>${tarea.descripcion}</td>
            <td>
                <button onclick="openModal('edit', ${tarea.id})">Editar</button>
                <button onclick="openDeleteModal(${tarea.id})">Eliminar</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

function openModal(mode, id = null) {
    if (mode === "add") {
        currentTaskId = null;
        document.getElementById("modalTitle").textContent = "Añadir Tarea";
        document.getElementById("taskDescription").value = "";
    } else if (mode === "edit") {
        currentTaskId = id;
        const tarea = taskManager.tareas.find(t => t.id === id);
        if (tarea) {
            document.getElementById("modalTitle").textContent = "Editar Tarea";
            document.getElementById("taskDescription").value = tarea.descripcion;
        } else {
            console.error("Tarea no encontrada para editar");
        }
    }
    taskModal.style.display = "flex";
}

function saveTask() {
    const descripcion = document.getElementById("taskDescription").value.trim();
    if (!descripcion) {
        alert("La descripción no puede estar vacía.");
        return;
    }

    if (currentTaskId === null) {
        const id = taskManager.getNextId();
        taskManager.addTarea(new Tarea(id, descripcion));
    } else {
        taskManager.updateTarea(currentTaskId, descripcion);
    }

    closeModal();
    renderTareas();
}

function openDeleteModal(id) {
    currentTaskId = id;
    deleteModal.style.display = "flex";
}

function confirmDelete() {
    taskManager.deleteTarea(currentTaskId);
    closeDeleteModal();
    renderTareas();
}

function closeModal() {
    taskModal.style.display = "none";
}

function closeDeleteModal() {
    deleteModal.style.display = "none";
}

renderTareas();