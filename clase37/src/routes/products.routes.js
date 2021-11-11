const { Router } = require('express');
const router = Router();
const products = require('../controllers/products');
const checkAuthentication = require('../middlewares/checkAuthentication');
const isAdmin = require('../middlewares/isAdmin');
const { loggerWarn } = require('../config/log4js');


router.get('/listar', async (req, res) => {
    try {
        const data = await products.list();
        if (data.length > 0) {
            res.json(data);
        } else {
            throw new Error('No hay productos cargados.')
        }
    } catch (error) {
        loggerWarn.warn(error.message);
        res.json({ error: error.message });
    }
});

router.get('/listar/:id', async (req, res) => {
    try {
        const product = await products.listId(req.params.id);
        res.json(product);
    } catch (error) {
        loggerWarn.warn(error.message);
        res.json({ error: error.message });
    }
});

router.post('/agregar', checkAuthentication, isAdmin, async (req, res) => {
    try {
        res.json(await products.save(req.body));
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
});

router.put('/actualizar/:id', checkAuthentication, isAdmin, async (req, res) => {
    try {
        res.json(await products.update(req.params.id, req.body));
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
});

router.delete('/borrar/:id', checkAuthentication, isAdmin, async (req, res) => {
    try {
        res.json(await products.delete(req.params.id));
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
});

// filtros
router.get('/buscar', async (req, res) => {
    try {
        const data = await products.search(req.query);
        if (data.length > 0) {
            res.json(data);
        } else {
            throw new Error('No hay productos que coincidan con la busqueda.')
        }
    } catch (error) {
        loggerWarn.warn(error);
        res.json({ error: error.message });
    }
})

module.exports = router;