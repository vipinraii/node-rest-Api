const express =require('express');
const router =express.Router();

const multer =require('multer');
const checkAuth =require('../middleware/check-auth');
const productController =require('../controllers/products');


const storage = multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,'./uploads/');
    },
    filename:(req,file,cb)=>{
        cb(null,new Date().toISOString()+file.originalname);
    }
});

const fileFilter=(req,file,cb)=>{
     if(file.mimetype ==='image/jpeg' ||file.mimetype ==='image/png'){
         cb(null,true)
     }else{
         cb(null,false)
     }
}
const upload =multer(
    {storage:storage,
     limits:{
    fileSize:1024*1024*5
     },
     fileFilter:fileFilter
});

router.get('/' , productController.products_get_all);


router.post ('/' ,checkAuth, upload.single('productImg'),productController.products_create_products);

router.get('/:productId' , productController.products_getById);

router.patch('/:productId' ,checkAuth, productController.products_updateById );

router.delete('/:productId' ,checkAuth, productController.products_removeByID);

module.exports =router;