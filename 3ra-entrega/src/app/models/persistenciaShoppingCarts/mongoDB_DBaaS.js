const { MONGO_DBaaS_URL } = require('../../../config/config');
const mongoose = require('mongoose');
const MongoDB = require('./mongoDB');

class MongoDB_DBaaS extends MongoDB {

    constructor() {
        super();
        this.connection();
    }

    async connection() {
        await mongoose.connect(MONGO_DBaaS_URL,
            {
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );
    }

}

module.exports = MongoDB_DBaaS;