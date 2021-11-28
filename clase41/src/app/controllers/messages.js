const daoFactory = require('../DAO/DAOFactory.js');
const config = require('../../config/config');
const MessageRepository = require('../repository/messageRepository');

class MessagesController extends MessageRepository {

    constructor() {
        super(daoFactory.getPersistencia('messages', config.PERSISTENCIA));
    }

}

module.exports = new MessagesController();