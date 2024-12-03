class Viaje {
    constructor(codigo, destino, precio, disponibilidad = true) {
        this.codigo = codigo
        this.destino = destino
        this.precio = parseFloat(precio).toFixed(2)
        this.disponibilidad = disponibilidad
    }
    getInfo() {
        return `Viaje [${this.codigo}] a ${this.destino}, precio: ${this.precio} euros`
    }
}

class Vuelo extends Viaje {
    constructor(codigo, destino, precio, aerolinea, duracion) {
        super(codigo, destino, precio)
        this.aerolinea = aerolinea
        this.duracion = duracion
    }
    getInfo() {
        return `${super.getInfo()}, Aerolínea: ${this.aerolinea}, Duración: ${this.duracion} horas`
    }
}

class Hotel extends Viaje {
    constructor(codigo, destino, precio, vuelo, hotel) {
        super(codigo, destino, precio)
        this.vuelo = vuelo
        this.hotel = hotel
    }
    getInfo() {
        return `${super.getInfo()}\n - Vuelo: ${this.vuelo.getInfo()}\n - Hotel: ${this.hotel.getInfo()}`
    }
}

class Cliente {
    constructor(nombre, apellido, email, telefono) {
        this.nombre = nombre
        this.apellido = apellido
        this.email = email
        this.telefono = telefono
    }
    getResumen() {
        return `Cliente: ${this.nombre} ${this.apellido}, Email: ${this.email}, Teléfono: ${this.telefono}`
    }
}

class Reserva {
    constructor(cliente, viaje, fecha) {
        this.cliente = cliente
        this.viaje = viaje
        this.fecha = fecha
    }
    getResumen() {
        return `${this.cliente.getResumen()}\nReservó: ${this.viaje.getInfo()}`
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const clienteBtn = document.getElementById("clienteBtn")
    const viajeBtn = document.getElementById("viajeBtn")
    const reservaBtn = document.getElementById("reservaBtn")

    const clientesTabla = document.getElementById("tablaClientes")
    const viajesTabla = document.getElementById("tablaViajes")
    const reservasTabla = document.getElementById("tablaReservas")

    const clienteSelect = document.getElementById("cliente")

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return regex.test(email)
    }

    function agregarCliente(event) {
        event.preventDefault()
        const nombre = document.getElementById("nombre").value
        const apellido = document.getElementById("apellidos").value
        const email = document.getElementById("correo").value
        const telefono = document.getElementById("telefono").value

        if (nombre && apellido && validarEmail(email) && telefono) {
            const nuevoCliente = new Cliente(nombre, apellido, email, telefono)
            const fila = document.createElement("tr")
            fila.innerHTML = `
                <td>${nuevoCliente.nombre}</td>
                <td>${nuevoCliente.apellido}</td>
                <td>${nuevoCliente.email}</td>
                <td>${nuevoCliente.telefono}</td>
                <td><button class="eliminarBtn">Eliminar</button></td>
            `
            clientesTabla.appendChild(fila)

            const opcion = document.createElement("option")
            opcion.value = `${nuevoCliente.nombre} ${nuevoCliente.apellido}`
            opcion.textContent = `${nuevoCliente.nombre} ${nuevoCliente.apellido}`
            clienteSelect.appendChild(opcion)

            limpiarCampos(["nombre", "apellidos", "correo", "telefono"])
        } else {
            alert("Por favor, rellena todos los campos correctamente.")
        }
    }

    clienteBtn.addEventListener("click", agregarCliente)

    function agregarViaje(event) {
        event.preventDefault()
        const codigo = document.getElementById("codigo").value
        const destino = document.getElementById("destino").value
        const precio = document.getElementById("precio").value
        const tipo = document.getElementById("tipo").value
        const viajeSelect = document.getElementById("viaje") 
    
        if (codigo && destino && precio > 0) {
            const nuevoViaje = new Viaje(codigo, destino, precio)
            const fila = document.createElement("tr")
            fila.innerHTML = `
                <td>${nuevoViaje.codigo}</td>
                <td>${nuevoViaje.destino}</td>
                <td>${nuevoViaje.precio}€</td>
                <td>${tipo}</td>
                <td><button class="eliminarBtn">Eliminar</button></td>
            `
            viajesTabla.querySelector("tbody").appendChild(fila)
    
            const opcionViaje = document.createElement("option")
            opcionViaje.value = nuevoViaje.codigo
            opcionViaje.textContent = `${nuevoViaje.destino} (${nuevoViaje.codigo})`
            viajeSelect.appendChild(opcionViaje)
    
            limpiarCampos(["codigo", "destino", "precio"])
        } else {
            alert("Por favor, rellena todos los campos correctamente.")
        }
    }
    
    viajeBtn.addEventListener("click", agregarViaje)

    function agregarReserva(event) {
        event.preventDefault();
        const cliente = clienteSelect.options[clienteSelect.selectedIndex].text;
        const viajeSelect = document.getElementById("viaje");
        const viaje = viajeSelect.options[viajeSelect.selectedIndex].text;
        const fecha = document.getElementById("fecha").value;
    
        if (cliente && viaje && fecha) {
            const fila = document.createElement("tr");
            fila.innerHTML = `
                <td>${cliente}</td>
                <td>${viaje}</td>
                <td>${fecha}</td>
                <td><button class="eliminarBtn">Eliminar</button></td>
            `;
            reservasTabla.querySelector("tbody").appendChild(fila);
            limpiarCampos(["fecha"]);
        } else {
            alert("Por favor, rellena todos los campos correctamente.");
        }
    }
    

    reservaBtn.addEventListener("click", agregarReserva)

    function eliminarFila(event) {
        if (event.target.classList.contains("eliminarBtn")) {
            event.target.closest("tr").remove()
        }
    }

    document.body.addEventListener("click", eliminarFila)

    function limpiarCampos(ids) {
        ids.forEach(function (id) {
            document.getElementById(id).value = ""
        })
    }
})

