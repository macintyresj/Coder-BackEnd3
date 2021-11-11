const { MONGO_URL } = require('../../config/config');
const { loggerInfo, loggerError } = require('../../config/log4js');
const mongoose = require('mongoose');

class MongoDB {

    #user

    constructor() {
        this.connection();
        this.onConnect();
        this.onError();
        this.#user = this.createModel();
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
            email: { type: String, required: true, unique: true },
            password: { type: String, required: true },
            nombre: { type: String, required: true },
            direccion: { type: String, required: false },
            edad: { type: Number, required: false },
            telefono: { type: String, required: true },
            foto: { type: String }
        });

        schema.set('toJSON', {
            virtuals: true,
            versionKey: false,
            transform: function (doc, ret) { delete ret._id }
        });

        return mongoose.model('usuarios', schema);
    }

    async create(data) {
        return await this.#user.create(data);
    }

    async read(user) {
        const data = await this.#user.find(user);
        return data;
    }

    async readId(id) {
        const data = await this.#user.findById(id);
        return data;
    }

    async update(id, data) {
        return await this.#user.findOneAndUpdate({ _id: id }, data);
    }

    async delete(id) {
        return await this.#user.deleteOne({ _id: id });
    }

}

module.exports = MongoDB;