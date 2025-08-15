require('./src/database/connection')
const app = require("./app")
const { envPort } = require("./src/config/config")


function startServer(){
 const PORT = envPort.port ||4000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

}

startServer()