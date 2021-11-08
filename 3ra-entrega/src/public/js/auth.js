// login
const formLogin = document.querySelector('#loginForm'),
    inputEmail = document.getElementById('username'),
    inputPassword = document.getElementById('password');

formLogin.onsubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData(formLogin)
    let datosLogin = {
        username: formData.get('username'),
        password: formData.get('password')
    };

    try {
        const response = await fetch(`/auth/login`, {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(datosLogin)
        });

        const data = await response.json();

        if (data.status == "success") {
            alert('Login correcto');
            setTimeout(() => {
                window.location.replace('/');
            }, 500);
        } else {
            alert('Login incorrecto');
        }

    } catch (error) {
        console.log(error);
    }
};

// registro
const formRegister = document.querySelector('#registerForm'),
    inputEmail = document.getElementById('username'),
    inputPassword = document.getElementById('password'),
    inputNombre = document.getElementById('nombre'),
    inputDireccion = document.getElementById('direccion'),
    inputEdad = document.getElementById('edad'),
    inputTelefono = document.getElementById('telefono'),
    inputFoto = document.getElementById('foto');

formRegister.onsubmit = async (e) => {
    e.preventDefault();

    let formData = new FormData(formRegister)
    let datosRegistro = {
        username: formData.get('username'),
        password: formData.get('password'),
        nombre: formData.get('nombre'),
        direccion: formData.get('direccion'),
        edad: formData.get('edad'),
        telefono: formData.get('telefono'),
        foto: formData.get('foto')
    };

    console.log(datosRegistro);

    try {
        const response = await fetch('/auth/signup', {
            // headers: {
            //     'Content-Type': 'application/json'
            // },
            method: 'POST',
            body: datosRegistro
        });

        const data = await response.json();

        if (data.status == "success") {
            alert('Registro correcto');
            setTimeout(() => {
                window.location.replace('/');
            }, 500);
        } else {
            alert('Registro incorrecto');
        }

    } catch (error) {
        console.log(error);
    }
};
