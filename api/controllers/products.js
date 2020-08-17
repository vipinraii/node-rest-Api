const Product = require('../models/product');
const  mongoose  = require('mongoose');
exports.products_get_all=(req, res, next) =>{
    Product.find()
    .select("name price _id productImg")
    .exec()
   .then(docs =>{
       const response ={
       count:docs.length,
       products:docs.map(doc =>{
           return {
               name:doc.name,
               price:doc.price,
                _id:doc._id,
                productImg:doc.productImg,
               request :{
                   type:'GET',
                   url:'http://localhost:3000/products/' + doc._id 
                   
               }  
           }
       })
       };
       res.status(200).json(response);
      })
   .catch(err =>{
       console.log(err);
       res.status(500).json({error:err});
   })

}

exports.products_create_products=(req, res, next) =>{
    console.log(req.file);
    const product=new Product({
        _id:new mongoose.Types.ObjectId(),
        name:req.body.name,
        price:req.body.price,
        productImg:req.file.path
    });
    product.save().then(result =>{
        console.log(result);
        res.status(201).json({
            message : 'Created product successfully',
            createdProduct:{
                name:result.name,
                price:result.price,
                _id:result._id,
                productImg:result.productImg,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/' + result._id 
                }

            }
        });
    }).catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    }) 
}

exports.products_getById =(req, res, next) =>{
    const id =req.params.productId;

   Product.findById(id).select('name price _id productImg')
   .exec()
   .then(doc =>{
       console.log("From Database",doc);
       if(doc){
        res.status(200).json({
            product:doc,
            request :{
                type :'GET',
                url:'http://localhost:3000/products/' 
            }
        });
       }else {
           res.status(404).json({message:"No valid Entry for Provided ID"});
       }
   })
   .catch(err =>{
       console.log(err);
       res.status(500).json({error:err});
   })
}

exports.products_updateById=(req, res, next) =>{
    const updateOps ={};
    for(const Ops of req.body ){
        updateOps[Ops.propName]=Ops.value
    }
    const id =req.params.productId;
    Product.update({_id:id},{$set:updateOps}).select
    .exec()
    .then(result =>{
        res.status(200).json({
         message :'Product successfully updated',
            request:{
                type:'GET',
                url:'http://localhost:3000/products/' + id
            }
        });     
   })
   .catch(err =>{
    console.log(err);
    res.status(500).json({error:err});
});
}
exports.products_removeByID=(req, res, next) =>{
    const id =req.params.productId;

    Product.remove({_id:id})
    .exec()
    .then(result =>{
        
         res.status(200).json({
             message:'Product deleted ',
             request:{
                 type:'POST',
                 url:'http://localhost:3000/products',
                 body:{
                     name:"String",
                     price:"Number"
                 }
             }
         });      
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    })
}