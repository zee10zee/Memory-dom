import express from "express"
import createPosts from "./routes/posts.js"
import userRoute from "./routes/users.js"
import path from "path"
import { fileURLToPath } from "url"
import { dirname } from "path"
// gets the url path/online/offline
const __dirname = dirname(fileURLToPath(import.meta.url))

var port = process.env.PORT || 3000
const app = express()


app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({extended : true}))

// const userRoute = router
// routes
app.use('/', createPosts(__dirname))
app.use('/', userRoute)
app.use('/', userRoute)




app.listen(port, ()=>{
    console.log('running on port ' + port)
})