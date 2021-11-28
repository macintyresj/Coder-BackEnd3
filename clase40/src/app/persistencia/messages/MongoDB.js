const messageModel = require('../../models/message');
const MongoDBConnection = require('../../../database/connection');
const config = require('../../../config/config');

const { normalize } = require('normalizr');
const schemaMensajes = require('../../models/messageNormalizr');

let instanciaMongoDB = null;

class MongoDB {

    constructor() {
        this.model = messageModel;
        this.conectarDB();

        this.randomValue = Math.random(100);
    }

    printValue() {
        console.log(`Random Value Messages: ${this.randomValue}`);
    }

    static getInstance() {
        if (!instanciaMongoDB) {
            instanciaMongoDB = new MongoDB();
        }

        return instanciaMongoDB;
    }

    async conectarDB() {
        const db = MongoDBConnection.getMongoDBInstance(config.URL_MONGO_ATLAS);
        await db.connect();
    }

    async create(message) {
        return this.model.create(message);
    }

    async read() {
        const dataMongo = await this.model.find({});
        // let mensajes = dataMongo.map(msg => ({...msg._doc}));
        // const mensajesNormalizados = normalize({id: "mensajes", mensajes: mensajes}, schemaMensajes);
        return dataMongo;
    }

    async readId(id) {
        return await this.model.findById(id);
    }

    async update(id, data) {
        return await this.model.findOneAndUpdate({ _id: id }, data);
    }

    async delete(id) {
        return await this.model.deleteOne({ _id: id });
    }

    async deleteAll() {
        return await this.model.deleteMany({});
    }    

}

module.exports = MongoDB;