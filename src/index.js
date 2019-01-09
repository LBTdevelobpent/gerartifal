const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');


//--------------------Rederização da pagina-------//

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false} ));
app.get('/',function(req,res){
    res.sendFile(path.join(__dirname+'/www/index.html'));
});
app.use(express.static('www'));
//-----------------------------------------------//

const router = express.Router();


require("./controllers/index.js")(app);



app.listen(3000);
