const express = require('express');
const router = express.Router();
const { loggerError } = require('../config/log4js');
const controller = require('../app/controllers/products');
const controllerFaker = require('../app/controllers/productsFaker');

// ruta listar productos
router.get('/', async (req, res) => {
    try {
        const data = await controller.list();
        const productos = data.map(e => {
            return {
                id: e.id,
                title: e.title,
                price: e.price,
                thumbnail: e.thumbnail,
                timestamp: e.timestamp
            }
        })
        res.render('productsList',
            {
                products: productos,
                hayProductos: data.length > 0
            }
        );
    } catch (error) {
        loggerError.error(`Ha ocurrido un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

// ruta test productos faker
router.get('/vista-test', (req, res) => {
    try {
        const data = controllerFaker.generar(req.query.cant);
        res.render('productsListFaker',
            {
                products: data,
                hayProductos: data.length > 0
            }
        );
    } catch (error) {
        loggerError.error(`Ha ocurrido un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

router.get('/json', async (req, res) => {
    try {
        res.json(await controller.list());
    } catch (error) {
        loggerError.error(`Ha ocurrido un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

//Listar por ID
router.get('/:id', async (req, res) => {
    try {
        res.json(await controller.listId(req.params.id));
    } catch (error) {
        loggerError.error(`Ha ocurrido un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

// agregar producto
router.post('/', async (req, res) => {
    try {
        res.json(await controller.save(req.body));
    } catch (error) {
        loggerError.error(`Ha ocurrido un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

// actualizar producto
router.put('/:id', async (req, res) => {
    try {
        res.json(await controller.update(req.params.id, req.body));
    } catch (error) {
        loggerError.error(`Ha ocurrido un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

// borrar producto
router.delete('/:id', async (req, res) => {
    try {
        res.json(await controller.delete(req.params.id));
    } catch (error) {
        loggerError.error(`Ha ocurido un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

module.exports = router;
