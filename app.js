const express = require('express');
const path = require('path');
//Connecting to database
const db = require('./config/database');
const index =require('./models/index');
const bodyParser = require('body-parser');
const User = require('./models/User');
const Book = require('./models/Book');
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');

// import passport and passport-jwt modules
const passport = require('passport');
const passportJWT = require('passport-jwt');
const { send } = require('process');

// create some helper functions to work on the database
const createUser = async ({name, email, password }) => {
    // const salt = await bcrypt.genSalt(10); 
    // password = await bcrypt.hash(password, salt);
    return await User.create({ name, email, password });
  };
  const getAllUsers = async () => {
    return await User.findAll();
  };
  const getUser = async obj => {
    return await User.findOne({
    where: obj,
  });
  };

//Test database connection
db.authenticate()
.then(()=>console.log('connected to DB'))
.catch(err => console.log('Error:', err))

const app = express();
// Express middleware that allows POSTing data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// basic route
app.get("/", (req, res) => {
    res.json({ message: "WELCOME TO HOME PAGE" });
  });

// get all users
app.get('/users', function(req, res) {
    getAllUsers().then(user => res.json({ user, msg: 'all users' })); 
    
  });

// register route
app.post('/register', function(req, res, next) {
    const { name, email, password } = req.body;
    createUser({ name, email, password }).then(user =>
      res.json({ user, msg: 'account created successfully' })
    );
  });

  
// ExtractJwt to help extract the token
let ExtractJwt = passportJWT.ExtractJwt;
// JwtStrategy which is the strategy for the authentication
let JwtStrategy = passportJWT.Strategy;
let jwtOptions = {};
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = 'secret';

// strategy for web token
let strategy = new JwtStrategy(jwtOptions, function(jwt_payload, next) {
    console.log('payload received', jwt_payload);
    let user = getUser({ name: jwt_payload.name, id: jwt_payload.id });
    if (user) {
      next(null, user);
    } else {
      next(null, false);
    }
  })

// use the strategy
passport.use(strategy);
app.use(passport.initialize());

// login route
app.post('/auth', async function(req, res, next) { 
    const { name, email, password } = req.body;
    if (name && email && password) {

      let user = await getUser({ name });
      if (!user) {
        res.status(401).json({ msg: 'No such user found', user });
      }
     if (user.email === email && user.password === password) {
        
        let payload = {name: user.name, id: user.id };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        req.user = jwt.verify(token, jwtOptions.secretOrKey);
        // const token = jwt.sign({id}, process.env.SECRET_TOKEN);
        res.header('auth-token', token).send( {token:token} );
      } else {
        res.status(401).json({ msg: 'invalid user' });
      }
    }
  });
// logout route
app.post('/auth/logout', async function(req, res, next) { 
    const { name, email, password } = req.body;
    if (name && email && password) {

      let user = await getUser({ name });
        let payload = { name: user.name, id: user.id };
        let token = jwt.sign(payload, jwtOptions.secretOrKey);
        if (user.email === email && user.password === password)  {
            console.log('token.........',token)   
            token =""
            res.json({ msg:'user is logged out', token: token})        
        }
      
      else {
        res.json('no user logged in')
      }
    }
  });
const base64url = require('base64url');
// get one user
app.get('/users/me', async function(req, res) {  
//    let y =  base64url.decode(x)
//    y = JSON.parse(y)
//    res.send(y.name)

try {
    // request.user is getting fetched from Middleware after token authentication
    const authUser = req.body
    const user = await getUser(authUser);
    res.send(user);
  } catch (e) {
    res.send({ message: "Error in Fetching user" });
  }
  });
// get one user
// app.get('/users/:id', async function(req, res) { 
    // let id = req.params.id;
    // let user = await getUser({id }); 
    // if(user){
    // res.send(user)
    // }
    // else {res.json('user is invalid')}  
//   });

// add book For Authorized users
// app.post('/users/:id/books', async function(req, res) {
//     const name = req.body.name;
//     const userId = req.params.id;
//     const book = await Book.create({name, userId});
//     res.send('book added'); 
//   });

//For authorized users
//add a book
app.post('/books', async function(req, res) {
    const name = req.body.name;
    const id = req.body.userId;
    const user = await getUser({id});
    if(user) {
    const book = await Book.create({name: name, userId: id});
    res.send('book added'); 
    } else {
    res.send('user is not registered'); 
    } 
  });
//edit a book name
app.put('/books/:id', async function(req, res) {
    const name = req.body.name;
    const bookId = req.params.id;
    const id = req.body.userId;
    
    const user = await getUser({id});
    const getBook = async obj => {
        return await Book.findOne({
        where: obj,
      });
      };
    if(user) {
        const book = await getBook({id: bookId});
        if (book) {
          book.name = name;
          await book.save();
          res.send('book edited')   
        }else {
          res.send('no book registered with this id')
        }
        
    }else {
        res.send('user is not registered'); 
    }
    
  });
//delete a book
app.delete('/books/:id', async function(req, res) {
    const bookId = req.params.id;
    const id = req.body.userId;
    
    const user = await getUser({id});
    const getBook = async obj => {
        return await Book.findOne({
        where: obj,
      });
      };
    if(user) {
        const book = await getBook({id: bookId});
        if (book) {
          await book.destroy();
          res.send('book deleted')   
        }else {
          res.send('no book registered with this id')
        }
        
    }else {
        res.send('user is not registered'); 
    }
    
  });

//get one book
app.get('/books/:id', async function(req, res) {
    const bookId = req.params.id;
  
    const getBook = async obj => {
        return await Book.findOne({
        where: obj,
      });
      };

        const book = await getBook({id: bookId});
        if (book) {
          res.send(book)   
        }else {
          res.send('no book registered with this id')
        }    
  });

//get all books
app.get('/books', async function(req, res) {
  
    const getAllBooks = async obj => {
        return await Book.findAll({
        where: obj,
      });
      };

       const books = await getAllBooks();
       res.send(books)   
  });

const PORT=process.env.PORT || 1000;
app.listen(PORT, console.log (`Server started at port ${PORT}`));