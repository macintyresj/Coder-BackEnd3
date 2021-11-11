const { MONGO_URL } = require('../../config/config');
const { loggerInfo, loggerError } = require('../../config/log4js');
const mongoose = require('mongoose');

class MongoDB {

    #carrito

    constructor() {
        this.connection();
        this.onConnect();
        this.onError();
        this.#carrito = this.createModel();
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
            timestamp: { type: Date, default: Date.now },
            producto: { type: mongoose.Schema.ObjectId, ref: "productos" },
            cliente: { type: mongoose.Schema.ObjectId, ref: "usuarios" }
        });

        schema.set('toJSON', {
            virtuals: true,
            versionKey: false,
            transform: function (doc, ret) { delete ret._id }
        });

        return mongoose.model('carritos', schema);
    }

    async create(id_producto, id_cliente) {
        return await this.#carrito.create({ producto: id_producto, cliente: id_cliente });
    }

    async read(id_cliente) {
        const data = await this.#carrito.find({ cliente: id_cliente }).populate("producto");
        return data;
    }

    async readId(id) {
        const data = await this.#carrito.findById(id).populate("producto");
        return [data];
    }

    async update(id, data) {
        return await this.#carrito.findOneAndUpdate({ _id: id }, data);
    }

    async delete(id) {
        return await this.#carrito.deleteOne({ _id: id });
    }

}

module.exports = MongoDB;