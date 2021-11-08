const { TIPO_PERSISTENCIA } = require('../../config/config');
const persistenciaMongoDB = require('./persistenciaUsers/mongoDB');
const persistenciaMongoDB_DBaaS = require('./persistenciaUsers/mongoDB_DBaaS');

class FactoryUsersModel {

    static setPersistencia(tipo) {
        switch(tipo) {
            case 'MongoDB': return new persistenciaMongoDB();
            case 'MongoDB_DBaaS': return new persistenciaMongoDB_DBaaS();
        }
    }

}

module.exports = FactoryUsersModel.setPersistencia(TIPO_PERSISTENCIA)