const { MONGO_URL } = require('../../../config/config');
const mongoose = require('mongoose');
const { loggerInfo, loggerError } = require('../../../config/log4js');

class MongoDB {

    #product

    constructor() {
        this.connection();
        this.onConnect();
        this.onError();
        this.#product = this.createModel();
    }

    async connection() {
        await mongoose.connect(MONGO_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
    }

    onConnect() {
        mongoose.connection.on('connected', () => {
            loggerInfo.info('[Mongoose] - connected');
        });
    }

    onError() {
        mongoose.connection.on('error', (err) => {
            loggerError.error('[Mongoose] - error:', err);
        });
    }

    createModel() {
        const schema = mongoose.Schema({
            nombre: { type: String, required: true },
            descripcion: { type: String, required: true },
            codigo: { type: String, required: true, unique: true },
            foto: { type: String, required: false },
            precio: { type: Number, required: true },
            stock: { type: Number, required: true },
            timestamp: { type: Date, default: Date.now }
        });

        schema.set('toJSON', {
            virtuals: true,
            versionKey: false,
            transform: function (doc, ret) { delete ret._id }
        });

        return mongoose.model('productos', schema);
    }

    async create(data) {
        return await this.#product.create(data);
    }

    async read() {
        const data = await this.#product.find({});
        return data;
    }

    async readId(id) {
        const data = await this.#product.findById(id);
        return data;
    }

    async update(id, data) {
        return await this.#product.findOneAndUpdate({ _id: id }, data);
    }

    async delete(id) {
        return await this.#product.deleteOne({ _id: id });
    }

    async search(filters) {
        return await this.#product.find({
            $or: [
                { nombre: filters.nombre },
                { codigo: filters.codigo },
                { precio: { $gte: filters.precioMin, $lte: filters.precioMax } },
                { stock: { $gte: filters.stockMin, $lte: filters.stockMax } }
            ]
        });
    }

}

module.exports = MongoDB;