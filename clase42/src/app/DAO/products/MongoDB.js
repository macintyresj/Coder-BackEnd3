const IDao = require('../IDao');
const productModel = require('../../models/product');
const MongoDBConnection = require('../../../database/connection');
const config = require('../../../config/config');

let instanciaMongoDB = null;

class MongoDBDao extends IDao {

    constructor() {
        super();
        
        this.nombreColeccion = productModel;
        this.conectarDB();
    }

    static getInstance() {
        if (!instanciaMongoDB) {
            instanciaMongoDB = new MongoDBDao();
        }

        return instanciaMongoDB;
    } 

    async conectarDB() {
        const db = MongoDBConnection.getMongoDBInstance(config.URL_MONGO_ATLAS);
        await db.connect();
    }

    async create(data) {
        if (data.title.trim().length < 1) {
            throw new Error("Campo title requerido.");
        } else if (isNaN(data.price)) {
            throw new Error("El campo precio debe ser un número");
        } else if (data.price < 1) {
            throw new Error("El campo precio debe ser mayor o igual a 1.");
        } else {
            return await this.nombreColeccion.create(data);
        }
    }

    async read() {
        const data = await this.nombreColeccion.find({});
        if (data.length > 0) {
            return data;
        } else {
            return [];
        }
    }

    async readId(id) {
        const data = await this.nombreColeccion.findById(id);
        return data;
    }

    async update(id, data) {
        return await this.nombreColeccion.findOneAndUpdate({ _id: id }, data);
    }

    async delete(id) {
        return await this.nombreColeccion.deleteOne({ _id: id });
    }  

}

module.exports = MongoDBDao;