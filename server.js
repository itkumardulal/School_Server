require('./src/database/connection')
const app = require("./app")

function startServer(){
const PORT = process.env.PORT || 4000; 
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


}

startServer()