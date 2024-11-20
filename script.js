const lista = document.getElementById("lista")
let editarId = null

const agregarMod = document.getElementById("agregarMod")
const abrirAgregarMod = document.getElementById("abrirAgregarMod")
const agregarForm = document.getElementById("agregarForm")
const descInput = document.getElementById("descInput")
const idInput = document.getElementById("idInput")
const nombreMod = document.getElementById("nombreMod")

const confirmarDel = document.getElementById("confirmarDel")
const cancelarDel = document.getElementById("cancelarDel")
const btnDel = document.getElementById("btnDel")
let eliminarTarea = null

abrirAgregarMod.addEventListener("click", function() {
  editarId = null
  nombreMod.textContent = "Añadir Nueva Tarea"
  descInput.value = ""
  idInput.value = ""
  agregarMod.style.display = "flex"
})

window.addEventListener("click", function(event) {
  if (event.target === agregarMod) {
    agregarMod.style.display = "none"
  }
  if (event.target === confirmarDel) {
    confirmarDel.style.display = "none"
  }
})

agregarForm.addEventListener("submit", function(event) {
  event.preventDefault()
  const descTarea = descInput.value
  const idTarea = idInput.value

  if (idTarea) {
    const row = document.querySelector(`tr[data-id="${idTarea}"]`)
    row.querySelector(".descripcionTarea").textContent = descTarea
  } else {
    const newidTarea = lista.children.length + 1
    const row = document.createElement("tr")
    row.setAttribute("data-id", newidTarea)
    row.innerHTML = `
      <td>${newidTarea}</td>
      <td class="descripcionTarea">${descTarea}</td>
      <td>
        <button class="btn btnEditar" onclick="editarTarea(${newidTarea})">Editar</button>
        <button class="btn btnBorrar" onclick="delConfirmar(${newidTarea})">Eliminar</button>
      </td>
    `
    lista.appendChild(row)
  }

  actualizarCookies()

  agregarMod.style.display = "none"
})

function editarTarea(id) {
  editarId = id
  const row = document.querySelector(`tr[data-id="${id}"]`)
  const descTarea = row.querySelector(".descripcionTarea").textContent

  descInput.value = descTarea
  idInput.value = id
  nombreMod.textContent = "Editar Tarea"
  agregarMod.style.display = "flex"
}

function delConfirmar(id) {
  eliminarTarea = id
  confirmarDel.style.display = "flex"
}

cancelarDel.addEventListener("click", function() {
  confirmarDel.style.display = "none"
})

btnDel.addEventListener("click", function() {
  if (eliminarTarea !== null) {
    const row = document.querySelector(`tr[data-id="${eliminarTarea}"]`)
    row.remove()
    eliminarTarea = null

    actualizarCookies()
  }
  confirmarDel.style.display = "none"
})

function actualizarCookies() {
  const tareas = []
  lista.querySelectorAll("tr").forEach(row => {
    const id = row.getAttribute("data-id")
    const descripcion = row.querySelector(".descripcionTarea").textContent
    tareas.push(`${id}:${descripcion}`)
  })
  document.cookie = `tareas=${tareas.join('|')}; path=/;`
}

function cargarTareasDesdeCookies() {
  const cookies = document.cookie.split("; ")
  const tareasCookie = cookies.find(cookie => cookie.startsWith("tareas="))
  if (tareasCookie) {
    const tareas = tareasCookie.split("=")[1].split('|')
    tareas.forEach(tarea => {
      const [id, descripcion] = tarea.split(':')
      const row = document.createElement("tr")
      row.setAttribute("data-id", id)
      row.innerHTML = `
        <td>${id}</td>
        <td class="descripcionTarea">${descripcion}</td>
        <td>
          <button class="btn btnEditar" onclick="editarTarea(${id})">Editar</button>
          <button class="btn btnBorrar" onclick="delConfirmar(${id})">Eliminar</button>
        </td>
      `
      lista.appendChild(row)
    })
  }
}

window.onload = cargarTareasDesdeCookies