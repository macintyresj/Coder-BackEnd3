import { saveProduct, findById, updateProduct, deleteProduct } from './modules/products.js';

// obtener usuario autenticado
(async () => {
    try {
        const responseGetUserAuth = await fetch('/getUser');
        const user = await responseGetUserAuth.json();
        document.querySelector('#userauth').innerHTML = `
            <div class="alert alert-secondary">
                <a class="btn btn-secondary float-rigth" href="/logout">Logout</a>
                <h3 class="alert-heading">Bienvenido ${user.username}</h3>
                <img class="d-inline rounded-circle" src="${user.foto || ''}">
                <p class="d-inline">${user.email || ''}</p>
            </div>
        `;
    } catch (error) {
        console.log(error);
    }
})();

// inicializamos la conexion ws
const socket = io.connect();

// renderizamos la tabla con handlebars
var template = Handlebars.compile(
    `
    {{#if hayProductos}}
    <table class="table table-dark align-middle">
        <thead>
            <tr>
                <th>Nombre</th>
                <th>Precio</th>
                <th>Foto</th>
                <th colspan="2"></th>
            </tr>
        </thead>
        <tbody>
            {{#each products}}
            <tr>
                <td> {{ this.title }} </td>
                <td> $ {{ this.price }} </td>
                <td> <img src="{{ this.thumbnail }}" width="50" height="50" alt="foto producto"> </td>
                <td> 
                    <button class="btn btn-sm btn-secondary" onclick="editarProducto('{{ this.id }}')">Editar</button> 
                </td>
                <td> <button class="btn btn-sm btn-secondary" onclick="eliminarProducto('{{ this.id }}')">Eliminar</button> </td>
            </tr>
            {{/each}}
        </tbody>
    </table>
    {{else}}
    <div class="alert alert-info">
        <h5 class="alert-heading">No hay productos cargados</h5>
    </div>
    {{/if}}
    `
);

// recibo desde el servidor los productos
socket.on('products', data => {
    var HTML = template(data);
    document.getElementById('content').innerHTML = HTML;
});

// recibo probables mensajes de error desde el servidor
socket.on('error', data => {
    alert(data.error);
});




//-----------------------------------------------------------------------------------------------------------
//------------------ GUARDAR PRODUCTO ------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

// guardamos el form para escuchar el evento submit
const form = document.querySelector('#formulario');
const inputTitle = document.getElementById('title');
const inputPrice = document.getElementById('price');
const inputThumbnail = document.getElementById('thumbnail');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {

        let variables = {
            "title": inputTitle.value,
            "price": Number(inputPrice.value),
            "thumbnail": inputThumbnail.value
        }

        const res = await saveProduct(variables);
        console.log(res);

        socket.emit('newProduct', 'Producto agregado');
        form.reset();
        inputTitle.focus();

    } catch (error) {
        console.log('Ha ocurrido un error', error);
    }

});




//-----------------------------------------------------------------------------------------------------------
//------------------ EDITAR PRODUCTO ------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------

// guardamos el form para escuchar el evento submit
const formEditar = document.querySelector('#formularioEditar');
const formTitle = document.querySelector('#formTitle');
const inputTitleEditar = document.getElementById('edit_title');
const inputPriceEditar = document.getElementById('edit_price');
const inputThumbnailEditar = document.getElementById('edit_thumbnail');

async function editarProducto(id) {
    formTitle.innerHTML = `<h2>Editar Producto id: ${id}</h2>`;
    form.classList.add('ocultar');
    formEditar.classList.remove('ocultar');
    inputTitleEditar.focus();

    let variables = {
        "id": id
    }

    const resFindById = await findById(variables);

    // capturo los datos y los cargo al formulario de edición
    inputTitleEditar.setAttribute('value', `${resFindById.data.product.title}`);
    inputPriceEditar.setAttribute('value', `${resFindById.data.product.price}`);
    inputThumbnailEditar.setAttribute('value', `${resFindById.data.product.thumbnail}`);

    formEditar.onsubmit = async (e) => {
        e.preventDefault();

        try {

            let formData = new FormData(formEditar)

            let variables = {
                "id": resFindById.data.product.id,
                "title": formData.get('title'),
                "price": Number(formData.get('price')),
                "thumbnail": formData.get('thumbnail')
            }

            const res = await updateProduct(variables);
            console.log(res);
            
            socket.emit('newProduct', 'Producto actualizado');
            closeEditForm();

        } catch (error) {
            console.log('Ha ocurrido un error', error);
        }

    };
}

const closeEditForm = () => {
    inputTitleEditar.setAttribute('value', '');
    inputPriceEditar.setAttribute('value', '');
    inputThumbnailEditar.setAttribute('value', '');
    formEditar.reset();
    formTitle.innerHTML = '<h2>Agregar Producto</h2>';
    form.classList.remove('ocultar');
    formEditar.classList.add('ocultar');
}


//-----------------------------------------------------------------------------------------------------------
//------------------ ELIMINAR PRODUCTO ------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------
async function eliminarProducto(id) {

    try {
        
        let variables = {
            "id": id
        }

        const res = await deleteProduct(variables);
        console.log(res);

        socket.emit('deleteProduct', `Producto eliminado`);

    } catch (error) {
        console.log(error);
    }

}


// renderiza template con nuevos mensajes
function render(messages) {
    if (messages.length > 0) {
        var html = messages.map((elem) => {
            return (`
                <div class="mb-2">
                    <img src="${elem.author.avatar}" width="30px">
                    <strong style="color: blue;">${elem.author.email}</strong> <span style="color: maroon;">[${elem.fyh}]</span>:
                    <em style="color: green;">${elem.text}</em>
                </div>
            `)
        }).join(" ");
        document.getElementById('messages').innerHTML = html;
    } else {
        // si no hay mensajes renderiza un aviso
        var html = `
                <div>
                    <strong style="color: red;">Ups! Aún no hay mensajes..</strong>
                </div>`;
        document.getElementById('messages').innerHTML = html;
    }
}

// se ejecuta cuando enviamos un nuevo mensaje
function addMessage(e) {
    let messages = {
        author: {
            email: document.getElementById('email').value,
            nombre: document.getElementById('nombre').value,
            apellido: document.getElementById('apellido').value,
            edad: document.getElementById('edad').value,
            alias: document.getElementById('alias').value,
            avatar: document.getElementById('avatar').value,
        },
        text: document.getElementById('message').value
    };
    socket.emit('newMessage', messages);
    document.getElementById('message').value = "";
    return false;
}

// recibimos los mensajes del servidor y renderizamos
socket.on('messages', messages => {
    // normalizado
    const lengthNormalizado = JSON.stringify(messages).length;
    console.log('Normalizado:', messages, lengthNormalizado);

    // desnormalizado
    const mensajesDesnormalizados = desnormalizarMensajes(messages);
    const lengthDesnormalizado = JSON.stringify(mensajesDesnormalizados).length;
    console.log('Desnormalizado:', mensajesDesnormalizados, lengthDesnormalizado);

    // % de compresión
    const compresion = (lengthNormalizado / lengthDesnormalizado) * 100;
    console.log('Porcentaje de compresión:', compresion)
    compresion > 100 ?
        document.querySelector('#compresion').innerHTML = `<b> - %</b>`
        :
        document.querySelector('#compresion').innerHTML = `<b>${compresion.toFixed(0)}%</b>`
    render(mensajesDesnormalizados.mensajes);
});

function deleteMessages() {
    socket.emit('deleteMessages', 'Todos los mensajes se han eliminado');
}

function desnormalizarMensajes(data) {
    // defino entidad author
    const author = new normalizr.schema.Entity('authors', {}, { idAttribute: 'email' });

    // defino entidad texto de cada mensaje
    const mensaje = new normalizr.schema.Entity('mensaje', {
        author: author
    }, { idAttribute: 'id' });

    // defino la entidad mensajes
    const mensajes = new normalizr.schema.Entity('mensajes', {
        mensajes: [mensaje]
    });

    const denormalizedData = normalizr.denormalize(data.result, mensajes, data.entities);

    return denormalizedData;
}

window.editarProducto = editarProducto;
window.closeEditForm = closeEditForm;
window.eliminarProducto = eliminarProducto;

window.addMessage = addMessage;
window.deleteMessages = deleteMessages;