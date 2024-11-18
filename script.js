// Clase Tarea
class Tarea {
    constructor(id, descripcion) {
        this.id = id;
        this.descripcion = descripcion;
    }
    getDescripcion() {
        return this.descripcion;
    }
    setDescripcion(descripcion) {
        this.descripcion = descripcion;
    }
}

// Clase TareaManager
class TareaManager {
    constructor() {
        this.tareas = this.loadTareas();
    }

    addTarea(tarea) {
        this.tareas.push(tarea);
        this.saveTareas();
    }

    updateTarea(id, descripcion) {
        const tarea = this.tareas.find(t => t.id === id);
        if (tarea) {
            tarea.setDescripcion(descripcion);
            this.saveTareas();
        }
    }

    deleteTarea(id) {
        this.tareas = this.tareas.filter(t => t.id !== id);
        this.saveTareas();
    }

    saveTareas() {
        document.cookie = `tareas=${JSON.stringify(this.tareas)};path=/`;
    }

    loadTareas() {
        const cookies = document.cookie.split("; ").find(row => row.startsWith("tareas="));
        return cookies ? JSON.parse(cookies.split("=")[1]) : [];
    }
}

// Variables globales
const taskManager = new TareaManager();
const taskTableBody = document.getElementById("taskTableBody");
const taskModal = document.getElementById("taskModal");
const deleteModal = document.getElementById("deleteModal");

let currentTaskId = null;

// Eventos de botones
document.getElementById("addTaskBtn").addEventListener("click", () => openModal("add"));
document.getElementById("saveTaskBtn").addEventListener("click", saveTask);
document.getElementById("confirmDeleteBtn").addEventListener("click", confirmDelete);
document.getElementById("cancelDeleteBtn").addEventListener("click", closeDeleteModal);

// Cerrar modales
document.querySelectorAll(".close").forEach(closeBtn => closeBtn.addEventListener("click", closeModal));

// Mostrar tareas
function renderTareas() {
    taskTableBody.innerHTML = "";
    taskManager.tareas.forEach(tarea => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tarea.id}</td>
            <td>${tarea.descripcion}</td>
            <td>
                <button onclick="openModal('edit', ${tarea.id})">Editar</button>
                <button onclick="openDeleteModal(${tarea.id})">Eliminar</button>
            </td>
        `;
        taskTableBody.appendChild(row);
    });
}

// Función para abrir modal
function openModal(mode, id = null) {
    if (mode === "add") {
        currentTaskId = null;
        document.getElementById("modalTitle").textContent = "Añadir Tarea";
        document.getElementById("taskDescription").value = "";
    } else if (mode === "edit") {
        currentTaskId = id;
        const tarea = taskManager.tareas.find(t => t.id === id);
        document.getElementById("modalTitle").textContent = "Editar Tarea";
        document.getElementById("taskDescription").value = tarea.descripcion;
    }
    taskModal.style.display = "flex";
}

// Función para guardar tarea
function saveTask() {
    const descripcion = document.getElementById("taskDescription").value.trim();
    if (!descripcion) {
        alert("La descripción no puede estar vacía.");
        return;
    }

    if (currentTaskId === null) {
        const id = taskManager.tareas.length ? Math.max(...taskManager.tareas.map(t => t.id)) + 1 : 1;
        taskManager.addTarea(new Tarea(id, descripcion));
    } else {
        taskManager.updateTarea(currentTaskId, descripcion);
    }

    closeModal();
    renderTareas();
}

// Función para abrir modal de eliminación
function openDeleteModal(id) {
    currentTaskId = id;
    deleteModal.style.display = "flex";
}

// Confirmar eliminación
function confirmDelete() {
    taskManager.deleteTarea(currentTaskId);
    closeDeleteModal();
    renderTareas();
}

// Cerrar modales
function closeModal() {
    taskModal.style.display = "none";
}

function closeDeleteModal() {
    deleteModal.style.display = "none";
}

// Render inicial
renderTareas();
