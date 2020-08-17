const express =require('express');

const checkAuth =require('../middleware/check-auth');
const orderController =require('../controllers/orders')

const router =express.Router();


router.get('/' ,checkAuth, orderController.orders_get_all);
router.post('/' ,checkAuth, orderController.orders_create_order );
router.get('/:orderId' , checkAuth,orderController.orders_getById);
router.delete('/:orderId' , checkAuth,orderController.orders_deleteById);

module.exports =router;