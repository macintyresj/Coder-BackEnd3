// obtener userAuth
(async () => {
    const response = await fetch('/getUser');
    const data = await response.json();
    if (Object.keys(data)[0] != 'error') {
        document.getElementById('user').innerHTML = `
                <span style="font-size: 14px; color: white;">${data.nombre} - </span>
                <span style="font-size: 12px; color: white;">${data.email} - </span>
                <span style="font-size: 12px; color: white;">${data.telefono}</span>
                <img src="${location.href}assets/${data.foto}" width="45px" />
            `
        document.getElementById('btnLogout').innerHTML = `
                <a class="btn btn-sm btn-danger" href="/auth/logout">Logout</a>
            `
    } else {
        document.getElementById('user').innerHTML = `
            <form class="form-inline">
                <a class="btn btn-outline-success" href="signup.html">Signup</a>
                <a class="btn btn-outline-primary" href="login.html">Login</a>
            </form>
            `
    }
})();

const HTMLProducts = document.querySelector('#app');
const HTMLCarrito = document.querySelector('#carrito');

const renderProducts = (data) => {

    if (Object.keys(data)[0] != 'error') {
        const template = data.map((product) => `
            <div class="col">
                <div class="card text-white bg-dark">
                    <img src="${product.foto}" class="card-img-top p-3 w-50 mx-auto">
                    <div class="card-body text-center">
                        <h5 class="card-title">${product.nombre}</h5>
                        <p class="card-text"><b>$ ${product.precio}</b> <br> 
                            <small>Código: ${product.codigo} - Stock: ${product.stock}</small>
                        </p>
                        <p class="card-text">${product.descripcion}</p>
                    </div>
                    <div class="card-footer text-center">
                        <button class="btn btn-sm btn-success" type="button" onclick="agregarCarrito('${product.id}')">
                            Agregar al carrito
                        </button>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-primary" type="button" data-toggle="modal" data-target="#modalEditProduct" onclick="editarProducto('${product.id}')">
                                Editar
                            </button>
                            <button class="btn btn-sm btn-danger" type="button" onclick="eliminarProducto('${product.id}')">
                                Eliminar
                            </button>
                        </div>
                    </div>
                </div>
            </div>`).join('');
        HTMLProducts.innerHTML = template;
    } else {
        const template = `
                <div class="col">
                    <div class="alert alert-info" role="alert">
                        ${data.error}
                    </div>
                </div>`
        HTMLProducts.innerHTML = template;
    }

}

const productosListar = async () => {
    try {
        const response = await fetch('/productos/listar');
        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.log(error);
    }
}

const renderCarrito = async () => {

    try {
        const response = await fetch('/carrito/listar');
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            const template = data.map((carrito) => `
            <tr>
                <td> <img src="${carrito.producto.foto}" width="50" height="50" alt="foto producto"> </td>
                <td>${carrito.producto.nombre}</td>
                <td>${carrito.producto.descripcion}</td>
                <td>$ ${carrito.producto.precio}</td>
                <td>
                    <button class="btn btn-sm btn-danger" type="button" onclick="eliminarCarrito('${carrito.id}')">
                        Eliminar
                    </button>
                </td>
            </tr>
            `).join('');
            HTMLCarrito.innerHTML = template;
        } else {
            const template = `<tr>
                                <td colspan="7">${data.error}</td>
                            </tr>`
            HTMLCarrito.innerHTML = template;
        }
    } catch (error) {
        console.log(error);
    }

}

(async () => {
    await productosListar();
    await renderCarrito();
})();


const formAddProduct = document.querySelector('#formAddProduct'),
    inputCodigo = document.getElementById('codigo'),
    inputNombre = document.getElementById('nombre'),
    inputDescripcion = document.getElementById('descripcion'),
    inputPrecio = document.getElementById('precio'),
    inputStock = document.getElementById('stock'),
    inputFoto = document.getElementById('foto');

formAddProduct.onsubmit = async (e) => {
    e.preventDefault();

    const datosFormulario = {
        codigo: inputCodigo.value,
        nombre: inputNombre.value,
        descripcion: inputDescripcion.value,
        precio: inputPrecio.value,
        stock: inputStock.value,
        foto: inputFoto.value
    };

    try {
        const response = await fetch('/productos/agregar', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(datosFormulario)
        });

        const data = await response.json();

        if (Object.keys(data)[0] != 'error') {
            productosListar();
            const btn = document.querySelector('#btnCancelarAdd');
            btn.click();
        } else {
            alert(`Error: ${data.error}. Descripción: ${data.descripcion}`);
        }
    } catch (error) {
        console.log(error);
    }
};

const btnCancelarAdd = document.querySelector('#btnCancelarAdd');
btnCancelarAdd.addEventListener('click', () => {
    formAddProduct.reset();
})

const formEditProduct = document.querySelector('#formEditProduct'),
    inputEditCodigo = document.getElementById('edit_codigo'),
    inputEditNombre = document.getElementById('edit_nombre'),
    inputEditDescripcion = document.getElementById('edit_descripcion'),
    inputEditPrecio = document.getElementById('edit_precio'),
    inputEditStock = document.getElementById('edit_stock'),
    inputEditFoto = document.getElementById('edit_foto');

const editarProducto = async (id) => {

    try {
        let response = await fetch(`/productos/listar/${id}`);
        let data = await response.json();

        inputEditCodigo.setAttribute('value', `${data.codigo}`)
        inputEditNombre.setAttribute('value', `${data.nombre}`)
        inputEditDescripcion.setAttribute('value', `${data.descripcion}`)
        inputEditPrecio.setAttribute('value', `${data.precio}`)
        inputEditStock.setAttribute('value', `${data.stock}`)
        inputEditFoto.setAttribute('value', `${data.foto}`)

        formEditProduct.onsubmit = async (e) => {
            e.preventDefault();

            let formData = new FormData(formEditProduct)
            let datosEditFormulario = {
                codigo: formData.get('codigo'),
                nombre: formData.get('nombre'),
                descripcion: formData.get('descripcion'),
                precio: formData.get('precio'),
                stock: formData.get('stock'),
                foto: formData.get('foto')
            };

            try {
                let response = await fetch(`/productos/actualizar/${data.id}`, {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'PUT',
                    body: JSON.stringify(datosEditFormulario)
                });

                let result = await response.json();

                if (Object.keys(result)[0] != 'error') {
                    await productosListar();
                    const btn = document.querySelector('#btnCancelarEdit');
                    btn.click();
                } else {
                    alert(`Error: ${result.error}. Descripción: ${result.descripcion}`);
                }
            } catch (error) {
                console.log(error);
            }
        }

    } catch (error) {
        console.log(error);
    }

}

const btnCancelarEdit = document.querySelector('#btnCancelarEdit');
btnCancelarEdit.addEventListener('click', () => {
    formEditProduct.reset();
})

const eliminarProducto = async (id) => {

    try {
        const response = await fetch(`/productos/borrar/${id}`, {
            method: 'delete'
        });
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            await productosListar();
            await renderCarrito();
        } else {
            alert(`Error: ${data.error}. Descripción: ${data.descripcion}`);
        }
    } catch (error) {
        console.log(error);
    }

}

const agregarCarrito = async (id_product) => {

    try {
        const response = await fetch(`/carrito/agregar/${id_product}`, {
            method: 'POST'
        });
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            renderCarrito();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.log(error);
    }

}

const eliminarCarrito = async (id) => {

    try {
        const response = await fetch(`/carrito/borrar/${id}`, {
            method: 'delete'
        });
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            renderCarrito();
        } else {
            alert(data.error);
        }
    } catch (error) {
        console.log(error);
    }

}

//----------------------------------------------------
//---------GENERAR NUEVA ORDEN DE PEDIDO--------------
//----------------------------------------------------
const newOrder = async () => {
    try {
        const response = await fetch('/orders/new-order', {
            method: 'POST'
        });
        const data = await response.json();
        if (Object.keys(data)[0] != 'error') {
            alert(data.descripcion)
        } else {
            alert(data.error)
        }
    } catch (error) {
        console.log(error);
    }
}

// mostrar u ocultar campos de busqueda
const filterSelect = document.querySelector('#optionsSearch');
const buscarPorNombre = document.querySelector('#buscarPorNombre'),
    buscarPorCodigo = document.querySelector('#buscarPorCodigo'),
    buscarPorPrecio = document.querySelector('#buscarPorPrecio'),
    buscarPorStock = document.querySelector('#buscarPorStock'),
    formSearchBtns = document.querySelector('#formSearchBtns');

filterSelect.addEventListener('change', () => {
    switch (filterSelect.value) {
        case "1":
            buscarPorNombre.setAttribute("style", "display: block;");
            buscarPorCodigo.setAttribute("style", "display: none;");
            buscarPorPrecio.setAttribute("style", "display: none;");
            buscarPorStock.setAttribute("style", "display: none;");
            formSearchBtns.setAttribute("style", "display: block;");
            limpiarInputsSearchForm();
            break;
        case "2":
            buscarPorNombre.setAttribute("style", "display: none;");
            buscarPorCodigo.setAttribute("style", "display: block;");
            buscarPorPrecio.setAttribute("style", "display: none;");
            buscarPorStock.setAttribute("style", "display: none;");
            formSearchBtns.setAttribute("style", "display: block;");
            limpiarInputsSearchForm();
            break;
        case "3":
            buscarPorNombre.setAttribute("style", "display: none;");
            buscarPorCodigo.setAttribute("style", "display: none;");
            buscarPorPrecio.setAttribute("style", "display: block;");
            buscarPorStock.setAttribute("style", "display: none;");
            formSearchBtns.setAttribute("style", "display: block;");
            limpiarInputsSearchForm();
            break;
        case "4":
            buscarPorNombre.setAttribute("style", "display: none;");
            buscarPorCodigo.setAttribute("style", "display: none;");
            buscarPorPrecio.setAttribute("style", "display: none;");
            buscarPorStock.setAttribute("style", "display: block;");
            formSearchBtns.setAttribute("style", "display: block;");
            limpiarInputsSearchForm();
            break;
    }
})

// filtro de productos
const formSearch = document.querySelector('#formSearch');

formSearch.onsubmit = async (e) => {
    e.preventDefault();

    let formDataSearch = new FormData(formSearch);

    const datosFormSearch = {
        nombre: formDataSearch.get('inputSearchNombre'),
        codigo: formDataSearch.get('inputSearchCodigo'),
        precioMin: formDataSearch.get('inputSearchPrecioMin'),
        precioMax: formDataSearch.get('inputSearchPrecioMax'),
        stockMin: formDataSearch.get('inputSearchStockMin'),
        stockMax: formDataSearch.get('inputSearchStockMax')
    }

    try {
        const response = await fetch(`/productos/buscar?nombre=${datosFormSearch.nombre}&codigo=${datosFormSearch.codigo}&precioMin=${datosFormSearch.precioMin}&precioMax=${datosFormSearch.precioMax}&stockMin=${datosFormSearch.stockMin}&stockMax=${datosFormSearch.stockMax}`)
        const data = await response.json();
        renderProducts(data);
    } catch (error) {
        console.log(error);
    }

}

const limpiarFiltros = async () => {
    buscarPorNombre.setAttribute("style", "display: none;");
    buscarPorCodigo.setAttribute("style", "display: none;");
    buscarPorPrecio.setAttribute("style", "display: none;");
    buscarPorStock.setAttribute("style", "display: none;");
    formSearchBtns.setAttribute("style", "display: none;");
    await productosListar();
}

const limpiarInputsSearchForm = () => {
    document.getElementById('inputSearchNombre').value = '';
    document.getElementById('inputSearchCodigo').value = '';
    document.getElementById('inputSearchPrecioMin').value = '';
    document.getElementById('inputSearchPrecioMax').value = '';
    document.getElementById('inputSearchStockMin').value = '';
    document.getElementById('inputSearchStockMax').value = '';
}