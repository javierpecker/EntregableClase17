import express from 'express';
import path from 'path';
import moment from "moment";
import handlebars from 'express-handlebars';
import * as http from 'http';
import io from 'socket.io';
import fs from "fs";
import routerRead from './routes/rutas';
import { DBService } from './services/db';


const app = express();
const puerto = 8080;
const server = http.Server(app)
DBService.init();


server.listen(puerto, () =>
  console.log('Server up en puerto', puerto)
);
server.on('error', (err) => {
  console.log('ERROR ATAJADO', err);
});

const layoutFolderPath = path.resolve(__dirname, '../views/layouts');
const defaultLayerPath = path.resolve(__dirname, '../views/layouts/index.hbs');
const partialFolderPath = path.resolve(__dirname, '../views/partial');
app.set('view engine', 'hbs');

app.engine(
  'hbs',
  handlebars({
    layoutsDir: layoutFolderPath,
    partialsDir: partialFolderPath,
    defaultLayout: defaultLayerPath,
    extname: 'hbs',
  })
);

const publicPath = path.resolve(__dirname, '../public');

app.use(express.static(publicPath));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api', routerRead);

const readfile = () => {
  let filenames = fs.readdirSync("./persistentdata");
  const found = filenames.find((element) => "messages.txt" === element);
  if (found === "messages.txt") {
    const data = fs.readFileSync("./persistentdata/messages.txt", "utf-8");
    return data;
  } else {
    console.log("Archivo no leido");
  }
};

const guardarMessages = (messages) => {
  fs.writeFileSync(
    "./persistentdata/messages.txt",
    JSON.stringify(messages, undefined, 2),
    "utf-8"
  );
};


const guardarNewMessage = (data) => {
  console.log(data)
  let now = new Date();
  let date = moment(now).format("DD/MM/YYYY HH:MM:SS");
  const newMessage = { email: data.email, createdAt: date, mensaje: data.mensaje };
  DBService.create(newMessage);
};

const productos = [];

const myWSServer = io(server);


myWSServer.on('connection', (socket) => {
  console.log('\n\nUn cliente se ha conectado');
  console.log(`ID DEL SOCKET DEL CLIENTE => ${socket.client.id}`);
  console.log(`ID DEL SOCKET DEL SERVER => ${socket.id}`);

  socket.on('new-message', (data) => {
    productos.push(data);
    socket.emit('messages', productos);
  });

  socket.on('askData', (data) => {
    const chatfile = DBService.get();
    socket.emit('messages', productos);
    socket.emit('message', chatfile);

  });

  socket.on("chatMessage", (chat) => {
    guardarNewMessage(chat);
    console.log(DBService.get())
    //const chatfile = 
    DBService.get().then((chatfile) =>{
    console.log("imprimo el chat", chatfile)
    socket.emit("message", chatfile);
    socket.broadcast.emit("message", chatfile);
    });
  });
});