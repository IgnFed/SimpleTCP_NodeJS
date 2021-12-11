import { createConnection } from 'net';
import { argv, openStdin } from 'process';
import IBasicsClientArgs from './interfaces/IBasicsClientArgs';


const [host, port, user] = argv.filter((_,idx)=> idx > 1);
const clientObj:IBasicsClientArgs = {
  host: host || "localhost",
  port: Number(port) || 9000
}

const client = createConnection({...clientObj, allowHalfOpen:true});

client
.on("connect", ()=>{
  console.log('connected...');
  openStdin().addListener("data", (data)=>{
    client.write(`${user}: ${data}`);
  })
})

.on("data", (data)=>{
  console.log(`${data.toString()}`);
})

.on("end", ()=>{
  console.log(`{${user}} has been disconnected.`);
})

.on("error", (e)=>{
  throw new Error("From Error: Disconnected.");
})
