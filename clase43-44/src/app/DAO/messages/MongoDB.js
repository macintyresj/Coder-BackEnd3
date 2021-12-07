const IDao = require('../IDao');
const messageModel = require('../../models/message');
const MongoDBConnection = require('../../../database/connection');
const config = require('../../../config/config');

const { normalize } = require('normalizr');
const schemaMensajes = require('../../models/messageNormalizr');

const MessageDTO = require('../../DTO/messagesDTO');

let instanciaMongoDB = null;

class MongoDBDao extends IDao {

    constructor() {
        super();
        
        this.model = messageModel;
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

    async create(message) {
        return this.model.create(message);
    }

    async read() {
        let dataMongo = await this.model.find({});
        let mensajes = dataMongo.map(msg => new MessageDTO(msg.id, msg.author, msg.text, msg.fyh));
        let mensajesNormalizados = normalize({id: "mensajes", mensajes: mensajes}, schemaMensajes);
        return mensajesNormalizados;
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

module.exports = MongoDBDao;