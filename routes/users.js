
import express from "express"
import pool from "../postgres/db.js"
import path from "path";
import upload from "../storage.js";
import session from "express-session";
import { log } from "console";
const router = express.Router()

router.get('/api/signup', (req,res)=>{
        res.render('users/signup.ejs')
        console.log(upload)
    })
    
router.post('/api/signup', upload.single('profilePicture'), async(req,res)=>{

    try{
        const dob = new Date(`${req.body.ob}-${req.body.mob}-${req.body.dayob}`)
        const body = {
            username : req.body.username.trim(),
            lastname : req.body.lastname.trim(),
            email : req.body.useremail.trim(),
            age : req.body.age.trim(),
            gender : req.body.gender,
            dateofbirth : dob,
            profilepicture : path.join('uploads', req.file.filename) 
        };

        const userExists = await pool.query('SELECT * FROM users WHERE LOWER(username) = $1 AND LOWER(email) = $2', [body.username, body.email])
        if(userExists.rows.length > 0){
            console.log('user with these crednential already exists !')
            return res.send('user with these crednential already exists !')
        }

        const newUser = await pool.query(`INSERT INTO users (username, lastname,email,age,gender,dateofbirth, profilepicture) 
        VALUES ( LOWER($1),LOWER($2), LOWER($3), $4, $5, $6, $7)RETURNING *;`, [body.username, body.lastname, body.email, body.age, body.gender, body.dateofbirth, body.profilepicture]);
        if(newUser.rows.length){
            console.log(req.session.userId = newUser.rows[0].id)
            res.redirect('/')
            console.log('from sign uped ' + req.session.userId)
        }
       }catch(err){
          console.log(err)
          return res.send(err)
       }
    })



    // login route
router.get('/login',(req,res)=>{
    res.render('users/login.ejs')
})

router.post('/api/login', async(req,res)=>{
    const body = {
        username : req.body.username.trim(),
        email : req.body.useremail.trim()
    }

    try{
        const loggedInUser = await pool.query('SELECT * FROM users where LOWER(username) = $1 AND LOWER(email) = $2', [body.username, body.email])

        if(loggedInUser.rows.length === 0){
            console.log('please sign up first !')
            return res.send('please sign up first !')
        }
        req.session.userId = loggedInUser.rows[0].id
        console.log('welcome back ! ' + loggedInUser.rows[0].username)
        res.redirect('/')
    }catch(err){
        console.error("the error : " + err)
        return res.status(500).send(err)
    }


    
})


router.post('/logout', (req,res)=>{
    const activeUser = req.session.userId;
    if(!activeUser){
        return console.log('user not found or something is worong !')
    }
    req.session.destroy((err)=>{
        if(err){
            return res.send(err)
        }

        res.redirect('/')
    })
})



// pool.query(`CREATE TABLE IF NOT EXISTS users 
//     (id SERIAL PRIMARY KEY, 
//     username VARCHAR(100), 
//     lastname VARCHAR(100),
//     email VARCHAR(100),
//     age INT NOT NULL,
//     gender   TEXT CHECK(gender IN('male', 'female', 'other')),
//     dateOfBirth DATE NOT NULL,
//     nationality TEXT, 
//     ProfilePicture TEXT)`).then((data)=>{
//         console.log(data.rows)
//     }).catch(err => console.log(err));

export default router;