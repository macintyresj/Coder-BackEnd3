const { mySql } = require('../../../config/config');
const { loggerError } = require('../../../config/log4js');
const knex = require('knex')(mySql);

class MySQL {

    constructor() {
        this.tableName = 'productos';
        this.createTable(this.tableName);
    }

    async createTable(tableName) {
        try {
            const exists = await knex.schema.hasTable(tableName);
            if (!exists) {
                return await knex.schema.createTable(tableName, table => {
                    table.increments('id');
                    table.string('nombre').notNullable();
                    table.string('descripcion').notNullable();
                    table.string('codigo').unique().notNullable();
                    table.string('foto');
                    table.float('precio').notNullable();
                    table.integer('stock').unsigned().notNullable();
                    table.timestamp('timestamp').defaultTo(knex.fn.now());
                });
            }
        } catch (error) {
            loggerError.error('--> error:', error);
        }
    }

    async create(producto) {
        try {
            return await knex(this.tableName).insert(producto);
        } catch (error) {
            loggerError.error('--> error:', error);
        }
    }

    async read() {
        try {
            let rows = await knex.from(this.tableName).select('*');
            return rows;
        } catch (error) {
            loggerError.error('--> error:', error);
        }
    }

    async readId(id) {
        try {
            let rows = await knex.from(this.tableName).select('*').where({ id: id });
            return rows[0];
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

    async search(filters) {
        return await knex(this.tableName)
            .where('nombre', filters.nombre)
            .orWhere('codigo', filters.codigo)
            .orWhereBetween('precio', [filters.precioMin, filters.precioMax])
            .orWhereBetween('stock', [filters.stockMin, filters.stockMax]);
    }

}

module.exports = MySQL;