import Server from "./server.js";
import { initClients } from "./clients.js";
import {readFile} from "fs";

const configPath = "conf.json";


const Main = async function(conf){
    const server = new Server(conf);
    //initClients(conf);
}


readFile(configPath, 'utf8', (err, data) => {
    if (err) {
        console.error(err);
        return;
    }
    try{
        const CONFIG = JSON.parse(data);
        Main(CONFIG);
    }catch(e){
        console.log("cant open config file");
    }
});