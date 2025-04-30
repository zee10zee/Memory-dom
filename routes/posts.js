import express from "express"
import pool from "../postgres/db.js"
import multer from "multer"
import path from "path"

function createPosts(rootDir){
    const storageSetup = {
        destination : (req,file, cb)=>{
           cb(null, path.join(rootDir,'public/uploads'))
        },
        filename : (req,file,cb)=>{
     //    1E9 = 1000000000
         const fileExtension = path.extname(file.originalname)
           const customizedName = Date.now() + "-" + Math.floor(Math.random() * 1E9)
         //   cb says if no error/null ? give the below name to the image
           cb(null, file.fieldname + "-" + customizedName + fileExtension)
        }  
     }
     // multer setup
     const storage = multer.diskStorage(storageSetup)
     
     const upload = multer({storage:storage})
     const router = express.Router()
     
     
      console.log(router)
     
     router.get('/', async(req,res)=>{
         const posts = await pool.query('SELECT * FROM posts ORDER BY created_at DESC')
         res.render('home.ejs', {posts : posts.rows})
     })
     
     router.get('/api/post/new',(req,res)=>{
         res.render('newPost.ejs')
     })
     
     router.post('/api/post/new', upload.single('postImage'), async(req,res)=>{
         try{
         const body = {
             postTitle : req.body.postTitle.trim(),
             description : req.body.description.trim(),
             postImage : path.join('uploads', req.file.filename)
         }
     
        
         const insertQ = `INSERT INTO posts(postTitle, description, postimage) VALUES(LOWER($1), LOWER($2) , $3) RETURNING *;`
     
         const newPost = await pool.query(insertQ, [body.postTitle, body.description, body.postImage])
     
         if(newPost.rows.length > 0){
             console.log('new post created success')
             console.log('success post added ' + newPost.rows[0])
             res.redirect('/')
         }
        }catch(err){
           return console.log(err)
     }
     
     })


    //  show more of post
    router.get('/api/post/:id', async(req,res)=>{
        const id = Number(req.params.id)
        try{
            const fullPost = await pool.query('SELECT * FROM posts where id  = $1', [id])
            console.log(fullPost.rows)
            if(fullPost.rows.length > 0){
                res.render('showPost.ejs', {post : fullPost.rows[0]})
            }else{
                res.send('something is wrong !')
            }
        }catch(err){
            console.log(err)
        }

    })
     
     // edit post
     
     router.get('/api/post/:id/edit', async(req,res)=>{
         const id = Number(req.params.id)
     
         const post = await pool.query('SELECT * FROM posts where id = $1', [id]);
     res.render('editPost.ejs', {post : post.rows[0]})
     
     })
     
     // update post
     
     router.post('/api/post/:id/update', upload.single('editImage'), async(req,res)=>{
         const id = Number(req.params.id)
         
         try{
             const updatedBody = {
                 postTitle : req.body.editTitle.trim(),
                 description : req.body.description.trim(),
                 postImage : path.join('uploads', req.file.filename)
             }
     
             const updatedPost = await pool.query('UPDATE posts SET posttitle = LOWER($1), description = LOWER($2), postimage  = $3 where id = $4 RETURNING *', [updatedBody.postTitle, updatedBody.description, updatedBody.postImage, id])
     
             if(updatedPost.rows.length > 0){
                 res.redirect('/')
                 console.log('updated user success ; new info ' + JSON.stringify(updatedBody))
             }else{
                 return res.status(500).send('user not found')
             }
     
         }catch(err){
             console.log(err)
             return res.send(err.stack)
         }
     
     })
     
     
     // delete post
     
     router.post('/api/post/:id/delete', async(req,res)=>{
         const id = Number(req.params.id)
     
         try{
             const deletedPost = await pool.query('DELETE FROM posts WHERE id = $1 RETURNING *', [id])
             // to ckeck if something existing was done, even deleted , we should consider based on returning value of db[RETURNING *]
             if(deletedPost.rows.length === 0){
                 return res.status(500).send('post not found')
             }
     
             console.log('success delete')
             res.redirect('/')
     
         }catch(err){
             console.log(err)
             return res.send(err)
         }
     })

     return router;
}

export default createPosts;