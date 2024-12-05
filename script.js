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
    const viajeSelect = document.getElementById("viaje")

    function cargarDatos() {
        const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || []
        const viajesGuardados = JSON.parse(localStorage.getItem("viajes")) || []
        const reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || []

        clientesGuardados.forEach(cliente => {
            const fila = document.createElement("tr")
            fila.innerHTML = `
                <td>${cliente.nombre}</td>
                <td>${cliente.apellido}</td>
                <td>${cliente.email}</td>
                <td>${cliente.telefono}</td>
                <td><button class="eliminarBtn">Eliminar</button></td>
            `
            clientesTabla.appendChild(fila)

            const opcion = document.createElement("option")
            opcion.value = `${cliente.nombre} ${cliente.apellido}`
            opcion.textContent = `${cliente.nombre} ${cliente.apellido}`
            clienteSelect.appendChild(opcion)
        })

        viajesGuardados.forEach(viaje => {
            const fila = document.createElement("tr")
            fila.innerHTML = `
                <td>${viaje.codigo}</td>
                <td>${viaje.destino}</td>
                <td>${viaje.precio}€</td>
                <td>${viaje.tipo}</td>
                <td><button class="eliminarBtn">Eliminar</button></td>
            `
            viajesTabla.querySelector("tbody").appendChild(fila)

            const opcionViaje = document.createElement("option")
            opcionViaje.value = viaje.codigo
            opcionViaje.textContent = `(${viaje.codigo})`
            viajeSelect.appendChild(opcionViaje)
        })

        reservasGuardadas.forEach(reserva => {
            const fila = document.createElement("tr")
            fila.innerHTML = `
                <td>${reserva.cliente}</td>
                <td>${reserva.viaje}</td>
                <td>${reserva.fecha}</td>
                <td><button class="eliminarBtn">Eliminar</button></td>
            `
            reservasTabla.querySelector("tbody").appendChild(fila)
        })
    }

    cargarDatos()

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

            const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || []
            clientesGuardados.push(nuevoCliente)
            localStorage.setItem("clientes", JSON.stringify(clientesGuardados))

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
            opcionViaje.textContent = `${nuevoViaje.codigo}`
            viajeSelect.appendChild(opcionViaje)

            const viajesGuardados = JSON.parse(localStorage.getItem("viajes")) || []
            viajesGuardados.push({ codigo: nuevoViaje.codigo, destino: nuevoViaje.destino, precio: nuevoViaje.precio, tipo })
            localStorage.setItem("viajes", JSON.stringify(viajesGuardados))

            limpiarCampos(["codigo", "destino", "precio"])
        } else {
            alert("Por favor, rellena todos los campos correctamente.")
        }
    }

    viajeBtn.addEventListener("click", agregarViaje)

    function agregarReserva(event) {
        event.preventDefault();
        const cliente = clienteSelect.options[clienteSelect.selectedIndex].text;
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

            const reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || []
            reservasGuardadas.push({ cliente, viaje, fecha })
            localStorage.setItem("reservas", JSON.stringify(reservasGuardadas))

            limpiarCampos(["fecha"]);
        } else {
            alert("Por favor, rellena todos los campos correctamente.");
        }
    }

    reservaBtn.addEventListener("click", agregarReserva)

    function eliminarFila(event) {
        if (event.target.classList.contains("eliminarBtn")) {
            const fila = event.target.closest("tr")
            const tabla = fila.closest("table")
    
            
        if (tabla === clientesTabla) {
            const clientesGuardados = JSON.parse(localStorage.getItem("clientes")) || []
            const nombreCliente = fila.cells[0].textContent + " " + fila.cells[1].textContent; 
            const nuevosClientes = clientesGuardados.filter(cliente => `${cliente.nombre} ${cliente.apellido}` !== nombreCliente)
            localStorage.setItem("clientes", JSON.stringify(nuevosClientes))
            } else if (tabla === viajesTabla) {
                const viajesGuardados = JSON.parse(localStorage.getItem("viajes")) || []
                const codigoViaje = fila.cells[0].textContent; 
                const nuevosViajes = viajesGuardados.filter(viaje => viaje.codigo !== codigoViaje)
                localStorage.setItem("viajes", JSON.stringify(nuevosViajes))
            } else if (tabla === reservasTabla) {
                const reservasGuardadas = JSON.parse(localStorage.getItem("reservas")) || []
                const clienteReserva = fila.cells[0].textContent; 
                const viajeReserva = fila.cells[1].textContent;
                const nuevasReservas = reservasGuardadas.filter(reserva => reserva.cliente !== clienteReserva || reserva.viaje !== viajeReserva)
                localStorage.setItem("reservas", JSON.stringify(nuevasReservas))
            }
    
            fila.remove() 
        }
    }
    

    document.body.addEventListener("click", eliminarFila)

    function limpiarCampos(ids) {
        ids.forEach(function (id) {
            document.getElementById(id).value = ""
        })
    }
})


