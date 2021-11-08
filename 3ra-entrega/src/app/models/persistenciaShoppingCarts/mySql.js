const { mySql } = require('../../../config/config');
const { loggerError } = require('../../../config/log4js');
const knex = require('knex')(mySql);

class MySQL {

    constructor() {
        this.tableName = 'carritos';
        this.createTable(this.tableName);
    }

    async createTable(tableName) {
        try {
            const exists = await knex.schema.hasTable(tableName);
            if (!exists) {
                return await knex.schema.createTable(tableName, table => {
                    table.increments('id');
                    table.timestamp('timestamp').defaultTo(knex.fn.now());
                    table.integer('product_id').unsigned().notNullable();
                    table.foreign('product_id').references('id').inTable('productos').onDelete('CASCADE');
                });
            }
        } catch (error) {
            loggerError.error('--> error:', error);
        }
    }

    async create(product_id) {
        try {
            return await knex(this.tableName).insert({ product_id: product_id });
        } catch (error) {
            loggerError.error('--> error:', error);
        }
    }

    async read() {
        try {
            let rows = await knex.from(this.tableName)
                .join('productos', 'product_id', '=', 'productos.id')
                .select('carritos.id', 'carritos.timestamp', 'carritos.product_id', 'productos.nombre', 'productos.descripcion', 'productos.codigo', 'productos.foto', 'productos.precio', 'productos.stock');
            let items = rows.map(element => {
                return {
                    id: element.id,
                    timestamp: element.timestamp,
                    producto: {
                        id: element.product_id,
                        timestamp: element.timestamp,
                        nombre: element.nombre,
                        descripcion: element.descripcion,
                        codigo: element.codigo,
                        foto: element.foto,
                        precio: element.precio,
                        stock: element.stock
                    }
                }
            });
            return items;
        } catch (error) {
            loggerError.error('--> error:', error);
        }
    }

    async readId(id) {
        try {
            let carrito = await knex.from(this.tableName)
            .join('productos', 'product_id', '=', 'productos.id')
            .select('carritos.id', 'carritos.timestamp', 'carritos.product_id', 'productos.nombre', 'productos.descripcion', 'productos.codigo', 'productos.foto', 'productos.precio', 'productos.stock')
            .where('carritos.id', id);
            return [{
                id: carrito[0].id,
                timestamp: carrito[0].timestamp,
                producto: {
                    id: carrito[0].product_id,
                    nombre: carrito[0].nombre,
                    descripcion: carrito[0].descripcion,
                    codigo: carrito[0].codigo,
                    foto: carrito[0].foto,
                    precio: carrito[0].precio,
                    stock: carrito[0].stock
                }
            }];
        } catch (error) {
            loggerError.error('--> error:', error);
        }
    }

    async update(id, data) {
        try {
            return await knex(this.tableName).where({ id: id }).update(data);
        } catch (error) {
            loggerError.error('--> error:', error);
        }
    }

    async delete(id) {
        try {
            return await knex(this.tableName).where({ id: id }).del();
        } catch (error) {
            loggerError.error('--> error:', error);
        }
    }

}

module.exports = MySQL;