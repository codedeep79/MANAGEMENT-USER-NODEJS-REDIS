const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// Set port
const port = 3000;

// Init app
const app = express();

// View engine
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

// Body-parser 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set up folder static
app.use(express.static(__dirname + "/public"));
// method override
app.use(methodOverride('_method')); 

// Into main.handlebars and after run file other
app.get('/', (req, res, next) => {
    res.render("searchusers");
});

app.get('/user/add', function(req, res, next){
  res.render('adduser');
});



app.listen(port, () => {
    console.log("Server Started On Port " + port);
});