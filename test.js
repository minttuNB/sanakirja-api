/* eslint-disable no-console */
const sanakirja = require("./index");
let result;
if(process.argv[2]) result = sanakirja(process.argv[2]);
else result = sanakirja("sana");
(async ()=>{
	console.log(await result);
})();