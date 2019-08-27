const express=require('express')
const router= express.Router()
const adminController=require('../controllers/adminController')
const checkAuth=require('../middleware/check-auth')


router.post('/api/admin/signup',adminController.signup)
router.post('/api/admin/login',adminController.login)
router.get('/api/sensordata/:id',checkAuth,adminController.getSensorData)
router.post('/api/downloadData/:id',checkAuth,adminController.downloadData)



module.exports=router