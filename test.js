/* eslint-disable no-console */
const sanakirja = require("./index");
let result;
if(process.argv[2]) result = sanakirja(process.argv[2]).catch(err => console.error(err));
else result = sanakirja("sana").catch(err => console.error(err));
(async ()=>{
	console.log(await result);
})();