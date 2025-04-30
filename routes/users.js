
import { Router } from "express";

const router = Router()


router.get('/signUp', (req,res)=>{
    res.render('users/signup.ejs')
})

router.get('/login', (req,res)=>{
    res.render('users/login.ejs')
})


export default router;