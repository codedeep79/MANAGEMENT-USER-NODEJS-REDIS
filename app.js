const express = require('express');
const exphbs = require('express-handlebars');
const path = require('path');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const redis = require('redis');

// Create Redis Client
let client = redis.createClient();

client.on('connect', function(){
  console.log('Connected to Redis...');
});
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

app.post('/user/add', (req, res, next) => {
    let id = req.body.id;
    let first_name = req.body.first_name;
    let last_name = req.body.last_name;
    let email = req.body.email;
    let phone = req.body.phone;

    client.hmset(id, [
    'first_name', first_name,
    'last_name', last_name,
    'email', email,
    'phone', phone
    ], function(err, reply){
        if(err){
            console.log(err);
        }
        console.log(reply);
        res.redirect('/');
    });
});

app.post('/user/search', function(req, res, next){
  let id = req.body.id;

  client.hgetall(id, function(err, userObj){
    if(!userObj){
      res.render('searchusers', {
        error: 'User does not exist'
      });
    } else {
      userObj.id = id;
      res.render('details', {
        user: userObj
      });
    }
  });
});

app.delete('/user/delete/:id', function(req, res, next){
  client.del(req.params.id);
  res.redirect('/');
});


app.listen(port, () => {
    console.log("Server Started On Port " + port);
});