document.getElementById('show-register').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-form').style.display = 'none';
    document.getElementById('register-form').style.display = 'block';
});

document.getElementById('show-login').addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('register-form').style.display = 'none';
    document.getElementById('login-form').style.display = 'block';
});

document.getElementById('register-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden.');
        return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
        alert('Por favor, introduce un email válido.');
        return;
    }

   let users = JSON.parse(localStorage.getItem('users')) || [];

   if (users.some(user => user.email === email)) {
       alert('Este email ya está registrado.');
       return;
   }

   users.push({ email: email, password: password });

   localStorage.setItem('users', JSON.stringify(users));
   alert('Registro exitoso. Ahora puedes iniciar sesión.');
   document.getElementById('register-form').reset();
   document.getElementById('register-form').style.display = 'none';
   document.getElementById('login-form').style.display = 'block';
});

document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = JSON.parse(localStorage.getItem('users')) || [];

    const user = users.find(user => user.email === email && user.password === password);

    if (user) {
        window.location.href = 'admin.html';
    } else {
        alert('Email o contraseña incorrectos.');
    }
});


function loadUsers() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const tableBody = document.querySelector('#usersTable tbody');
    tableBody.innerHTML = ''; 

    users.forEach(user => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${user.id}</td>
            <td>${user.name}</td>
            <td>${user.email}</td>
        `;
        tableBody.appendChild(row);
    });

    $('#usersTable').DataTable();
}


function logout() {
    window.location.href = 'index.html';
}

document.addEventListener('DOMContentLoaded', loadUsers);