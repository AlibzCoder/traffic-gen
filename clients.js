
import { Socket } from 'net';
import { Throttle } from 'stream-throttle';
import randomBytesReadableStream from "random-bytes-readable-stream" ;
import Schedule from "./schedule.js";

export default class Client{
    constructor ({ADDR,PORT},conf){
        this.CONF = conf;
        this.ADDR = ADDR;
        this.PORT = PORT;
        this.client = new Socket();
        
        
        this.client.on("data",(data)=>this.onData(data));
        this.client.on("error",(e)=>this.onError(e));

        this.connect();
    }

    connect(){
        this.client.connect(this.PORT, this.ADDR, ()=>this.onConnect());
    }

    onConnect (){
        console.log(`Connected to ${this.ADDR}:${this.PORT}`);
        this.clientSchedule = new Schedule(this.CONF,(size,rate)=>{
            randomBytesReadableStream({size}).pipe(new Throttle({rate}))
                .on("data",data=>this.client.write(data))
        });  
        this.clientSchedule.start();

        this.client.on("close",()=>this.onClose());
    }
    onData (data){
        //console.log(`${this.ADDR}:${this.PORT} Received: ` , data);
    }
    onClose(){
        console.log(`Connection closed ${this.ADDR}:${this.PORT}`);
        this.clientSchedule.end();
    }
    onError (e){
        console.log(e.message);
    }
}

export const initClients = (conf)=>{
    const {
        ServerPort,
        IPs,
        ClientRetryInterval
    } = conf;
    if(IPs instanceof Array && typeof ServerPort === "number"){
        const clients = IPs.map((addr)=> new Client({ADDR:addr,PORT:ServerPort},conf));

        setInterval(()=>{
            clients.forEach(cl=>{
                if(cl.client.readyState !== "open") {
                    console.log(`retrying to connect to ${cl.ADDR}:${cl.PORT}`);
                    cl.connect()
                }
            })
        },(ClientRetryInterval ?? 30) * 60 * 1000)

    }
}