
import { resolve } from "dns/promises";
import { setTimeout } from "timers";

async function james() {
    let xyz = await Promise.resolve(leeway)
    console.log("james is about to return")
    return xyz 

}

let kk_state = 'Pending'

let leeway = new Promise<string>((resolve, reject) => {setTimeout(() => {
    console.log('Promise Started');
    kk_state = 'resolved';
    resolve('This is done');
    
}, 5000);}).catch(err => console.log(err));
    //.then(value => console.log(value))
async function letter (){
    return await james()
}

    
var cron = require('node-cron');

cron.schedule('* * * * *', async () => {
    console.log('running a task every minute');
},{
    timezone: 'Europe/London'
    , scheduled : true
});
         