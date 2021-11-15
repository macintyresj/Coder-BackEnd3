const express = require('express');
const router = express.Router();
const { loggerError } = require('../config/log4js');
const controller = require('../app/controllers/products');

// ruta listar productos total
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

//Listar por ID 
router.get('/:id', async (req, res) => {
    try {
        res.json(await controller.listId(req.params.id));
    } catch (error) {
        loggerError.error(`Ocurrio un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

// agregar producto
router.post('/', async (req, res) => {
    try {
        res.json(await controller.save(req.body));
    } catch (error) {
        loggerError.error(`Ocurrio un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

// actualizar producto
router.put('/:id', async (req, res) => {
    try {
        res.json(await controller.update(req.params.id, req.body));
    } catch (error) {
        loggerError.error(`Ocurrio un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

// borrar producto
router.delete('/:id', async (req, res) => {
    try {
        res.json(await controller.delete(req.params.id));
    } catch (error) {
        loggerError.error(`Ocurrio un error: ${error.message}`)
        res.json({ error: error.message });
    }
});

module.exports = router;
