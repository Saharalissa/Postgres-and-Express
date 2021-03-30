// const express = require('express');
// const router = express.Router();
// const db = require('../config/database');
// const User = require('../models/User');
// const Book = require('../models/Book');

// router.get('/', (req, res) => {
//     // res.send('GIGS');
//     Book.findAll()
//     .then(books => {
//         console.log(books)  
//     })
//     .catch(err => console.log(err))
// });


// router.post('/add', (req, res) => {
//     const data = {
//         title: 'Looking for a developer',
//         technologies: 'React NodeJs ReactNative',
//         description: 'some discription goes here',
//         budget: '$3000',
//         contact_email: 'user1@gmail.com'
//     }

//     let {title, technologies, description, budget, contact_email} = data
//     //Insert data
//     Gig.create({title, technologies, description, budget, contact_email})
//     .then(gigs => {
//         console.log(gigs)
//         res.send('Data added to gigs table');
//     })
//     .catch(err => console.log(err))
// });

// module.exports = router;