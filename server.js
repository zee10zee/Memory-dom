import express from "express"
import upload from "./storage.js"
import path from "path"
import postRoutes from "./routes/posts.js"
import userRoute from "./routes/users.js"
import session from "express-session"
import pool from "./postgres/db.js"
import { store } from "./postgres/db.js"



var port = process.env.PORT || 3000
const app = express()

app.use(session({
    store : new store({
      pool : pool, 
      tableName : 'session',
      createTableIfMissing : true
    }),
    secret: process.env.SESSION_SECRET || 'hello world',  // Secret key to sign the session cookie
    resave: false,               // Don't save session if it wasn't modified
    saveUninitialized: true,     // Save sessions even if they are not initialized
    cookie: { secure: false }    // Set to true for HTTPS, false for development (HTTP)
}));


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use('uploads', express.static(path.resolve('public/uploads')))
app.use(async(req,res, next)=>{
    try{
        if(req.session.userId){
            const result = await pool.query('SELECT * FROM users where id = $1', [req.session.userId])
             console.log(result)
             const user = result.rows[0]
            res.locals.loggedInUser = user;
    }else{
        console.log('no sesson avaiable')
    }
    next()
    }catch(err){
        return res.send(err)
    }
})

// routes
app.use('/', postRoutes)
app.use('/', userRoute)



app.listen(port, ()=>{
    console.log('running on port ' + port)
})


// unnecessary import though essential when needed 
// import { fileURLToPath } from "url"
// import { dirname } from "path"
// // gets the url path/online/offline
// const __dirname = dirname(fileURLToPath(import.meta.url))