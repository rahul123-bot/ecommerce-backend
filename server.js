const app = require("./src/app.js");
const config = require("./src/config/config.js");

const connectDB = require("./src/config/db.js");

connectDB();
const PORT = config.port||4200
app.listen(PORT,"0.0.0.0",()=>{
    console.log(`server is running on port ${PORT}`)
})