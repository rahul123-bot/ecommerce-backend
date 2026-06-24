const app = require("./src/app.js");
const config = require("./src/config/config.js");

const connectDB = require("./src/config/db.js");

connectDB();

app.listen(config.port,config.host,()=>{
    console.log(`server is running on http://${config.host}:${config.port}`)
})