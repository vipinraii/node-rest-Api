
const Order =require('../models/order');
const Product = require('../models/product');
const mongoose =require('mongoose');

exports.orders_get_all = (req, res, next) =>{
    Order.find().select('product quantity _id').populate('product','name')
    .exec()
   .then(docs =>{
       res.status(200).json({
           count:docs.length,
           orders:docs.map(doc=>{
                return{
                    id:doc._id,
                    product:doc.product,
                    quantity:doc.quantity,
                    request:{
                        type:'GET',
                        url:'http://localhost:3000/orders/' + doc._id,
                    }                   
        }
    })         
       });
      })
   .catch(err =>{
       console.log(err);
       res.status(500).json({error:err});
   })
}

exports.orders_create_order =(req, res, next) =>{
    Product.findById(req.body.productId).then(product=>{
        if(!product){
            return res.status(404).json({
                message:"Prodcts Not found"
            });
        }
       const order=new Order({
           _id: mongoose.Types.ObjectId(),
           product:req.body.productId,
           quantity:req.body.quantity,
           
       });
       return order.save() ;
   })
       .then(result =>{
           console.log(result);
           res.status(201).json({
               message : 'Ordered successfully',
               createdOrder:{
                   quantity:result.quantity,
                   product:result.product,
                   _id:result._id,
                   request:{
                       type:'GET',
                       url:'http://localhost:3000/orders/' + result._id 
                   }
   
               }});
       }).catch(err =>{
       console.log(err);
       res.status(500).json({error:err});
   
});
}
exports.orders_getById =(req, res, next) =>{
    const id =req.params.orderId; 
    
   Order.findById(id).select('product quantity _id').populate('product')
   .exec()
   .then(doc =>{
       console.log("From Database",doc);
       if(doc){
        res.status(200).json({
            product:doc,
            request :{
                type :'GET',
                url:'http://localhost:3000/orders/' 
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
exports.orders_deleteById=(req, res, next) =>{
    const id =req.params.orderId; 
    Order.remove({_id:id})
    .exec()
    .then(result =>{
        
         res.status(200).json({
             message:'Order deleted ',
             request:{
                 type:'POST',
                 url:'http://localhost:3000/orders',
                 body:{
                     product :'String',
                     quantity:'Number'
                 }
             }
         });      
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    })
}