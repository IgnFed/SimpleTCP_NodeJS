import { createServer, Socket } from "net";
import { argv } from 'process';
import IBasicsServerArgs from "./interfaces/IBasicsServerArgs";


const [host, port] = argv.filter((_, idx)=> idx > 1);

const serverObj:IBasicsServerArgs = {
  host: host || "localhost",
  port: Number(port) || 9000
}

const clients: Socket[] = [];
let counter =0;

const server = createServer((socket:Socket)=>{
  const _socket = socket;
  counter++;
  Object.assign(_socket,{id:counter});
  console.log(`Client Connected!`);

  socket.on("data", (data)=>{
    console.log(data.toString('utf-8'));
  })

  socket.on("end", ()=>{
    const idx = clients.find((client: typeof _socket)=> client.id === _socket.id)
    clients.splice(idx);
    console.log(`Client With id ${idx} disconnected.`);
  })
  
  socket.on('error', (e)=>{
    throw new Error("From Error: Disconnected.");
  })

  clients.push(_socket);
  _socket.pipe(_socket);
})


server.listen({...serverObj}, ()=>{
  console.log(`Listening on ${host}:${port}`);
})

