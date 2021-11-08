const { schema } = require('normalizr');

// defino entidad author
const schemaAuthor = new schema.Entity('authors', {}, { idAttribute: 'email' });

// defino entidad texto de cada mensaje
const schemaMensaje = new schema.Entity('mensaje', {
    author: schemaAuthor
}, { idAttribute: '_id' });

// defino la entidad mensajes
const schemaMensajes = new schema.Entity('mensajes', {
    mensajes: [schemaMensaje]
});

module.exports = schemaMensajes;

