import { createServer } from 'net';
import { Throttle } from 'stream-throttle';
import randomBytesReadableStream from "random-bytes-readable-stream" ;
import Schedule from "./schedule.js";

const DEFUALT_PORT = 6969;
const DEFUALT_ADDRESS = '0.0.0.0';

export default class Server {
    constructor (conf){
        this.CONF = conf;
        const {
            ServerPort,
            ServerAddress
        } = this.CONF;
        this.server = createServer((socket)=>this.onConnection(socket));
        this.server.listen(ServerPort ?? DEFUALT_PORT, ServerAddress ?? DEFUALT_ADDRESS);
        console.log(`Server Listening on Port ${ServerPort ?? DEFUALT_PORT}`);
    }

    onConnection(socket){
        const socketSchedule = new Schedule(this.CONF,(size,speed)=>{
            randomBytesReadableStream({size: size}).pipe(new Throttle({rate: speed}))
                .on("data",(data)=>socket.write(data));
        });
        socketSchedule.start();
        socket.on('data',(data)=>this.onSocketData(socket,data));
        socket.on('close',()=>{
            socketSchedule.end();
            this.onSocketClose(socket)
        });
        socket.on('error',e=>{
            this.onSocketErr(socket,e);
        });
    }
    onSocketData(socket,data){
        //console.log(socket.address().address,'Data Recieved',data);
    }
    onSocketClose(socket){
        console.log('Client closed',socket.address().address);
    }
    onSocketErr(socket,e){
        console.log(`Client Error : ${e.message} on ${socket.address().address}`);
    }
}