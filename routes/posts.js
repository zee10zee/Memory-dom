import express from "express"
import pool from "../postgres/db.js"
import multer from "multer"
import path from "path"
import upload from "../storage.js"
// end of multer
const router = express.Router()

// pool.query('DELETE FROM users').then((data)=> console.log('deleted')).catch((err)=> console.log(err));

     router.get('/', async(req,res)=>{
         try{
              const postsAndCreators = await pool.query(`
                SELECT posts.* ,
                users.username,
                users.lastname,
                users.profilepicture
                FROM posts 
                LEFT JOIN users 
                ON posts.user_id = users.id ORDER BY posts.created_at DESC `)
         if(postsAndCreators.rows.length === 0){
            console.log('no posts found')
         }

         console.log(JSON.stringify(postsAndCreators.rows, null, 2))

         
         res.render('home.ejs', {posts : postsAndCreators.rows})
         
        
         }catch(err){
            console.log(err)
            return res.status(500).send(err)
         }
     });
     
     router.get('/api/post/new', validateLogin,(req,res)=>{
         res.render('newPost.ejs')
     })
     
     router.post('/api/post/new', validateLogin,upload.single('postImage'), async(req,res)=>{
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
     
     router.get('/api/post/:id/edit',validateLogin, async(req,res)=>{
         const id = Number(req.params.id)


     
         const post = await pool.query('SELECT * FROM posts where id = $1', [id]);
     res.render('editPost.ejs', {post : post.rows[0]})
     
     })
     
     // update post
     
     router.post('/api/post/:id/update', validateLogin, upload.single('editImage'), async(req,res)=>{
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
     
     router.post('/api/post/:id/delete', validateLogin, async(req,res)=>{
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

     function validateLogin(req,res,next){
        const loggedInUser = req.session.userId;
        if(!loggedInUser){
            console.log('please log in first ')
            return res.redirect('/login')
        }
        next()
     }

export default router;