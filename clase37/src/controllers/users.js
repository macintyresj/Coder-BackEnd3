let usersModel = require('../models/factoryUsers');

class Users {

    async list(data) {
        return await usersModel.read(data);
    }

    async listId(id) {
        return await usersModel.readId(id);
    }

    async save(user) {
        return await usersModel.create(user);
    }

    async update(id, data) {
        return await usersModel.update(id, data);
    }

    async delete(id) {
        return await usersModel.delete(id);
    }

}

module.exports = new Users();