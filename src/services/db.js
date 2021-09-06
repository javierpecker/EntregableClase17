import knex from 'knex';
import dbConfig from '../knexfile';


const initMessages = [
    {
      "email": "javiercyberman@hotmail.com",
      "createdAt": "19/08/2021 23:08:27",
      "mensaje": "asdasd"
    }
]

class DB {
    constructor() {
      const environment = process.env.NODE_ENV || 'development';
      console.log(`SETTING ${environment} DB`);
      const options = dbConfig[environment];
      this.connection = knex(options);
    }


    init() {
        this.connection.schema.hasTable('mensajes').then((exists) => {
          if (!exists){
          console.log('Creamos la tabla messsages!');
          this.connection.schema.
          createTable('mensajes',(messagesTable) => {
              messagesTable.increments();
              messagesTable.string('email').notNullable();
              messagesTable.date('createdAt');
              messagesTable.string('mensaje').notNullable();
            })
            .then(() => {
            console.log('DONE');
          });
        }
        })
    }

    async create(data) {
        console.log(data)
        return await this.connection("mensajes").insert(data);
    }

    async get(tableName, id) {
        const mensaje = await this.connection("mensajes").select("email","createdAt","mensaje");
        //console.log(mensaje)
        return mensaje;
    }

}





export const DBService = new DB();