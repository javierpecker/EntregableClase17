import knex from 'knex';
import dbConfig from '../knexfile';

class DB {
    constructor() {
      const environment = process.env.NODE_ENV || 'development';
      console.log(`SETTING ${environment} DB`);
      const options = dbConfig[environment];
      this.connection = knex(options);
    }


    init() {
        this.connection.schema.hasTable('messages').then((exists) => {
          if (!exists){
          console.log('Creamos la tabla messsages!');
          this.connection.schema.
          createTable('messages',(messagesTable) => {
              messagesTable.increments();
              messagesTable.string('email').notNullable();
              messagesTable.string('mensaje').notNullable();
              messagesTable.timestamp('createdAt', { precision: 6 }).defaultTo(knex.fn.now());
            })
            .then(() => {
            console.log('DONE');
          });
        }
        }) 
    }    
}    

export const DBService = new DB();