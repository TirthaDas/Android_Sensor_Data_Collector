const express=require('express')
const router= express.Router()
const adminController=require('../controllers/adminController')

router.post('/api/admin/signup',adminController.signup)
router.post('/api/admin/login',adminController.login)



module.exports=router