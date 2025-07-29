require('./src/database/connection')
const app = require("./app")
const { envPort } = require("./src/config/config")


function startServer(){
  const PORT = envPort.port
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`)
  })
}

startServer()