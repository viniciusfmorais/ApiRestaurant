const sequelize = require('../config/database');
const Customer = require('./Customer');
const MenuItem = require('./MenuItem');
const Order = require('./Order');
const OrderItem = require('./OrderItem');

// Define relationships
Customer.hasMany(Order, { 
  foreignKey: 'customer_id',
  as: 'orders'
});

Order.belongsTo(Customer, { 
  foreignKey: 'customer_id',
  as: 'customer'
});

Order.hasMany(OrderItem, { 
  foreignKey: 'order_id',
  as: 'items'
});

OrderItem.belongsTo(Order, { 
  foreignKey: 'order_id',
  as: 'order'
});

MenuItem.hasMany(OrderItem, { 
  foreignKey: 'menu_item_id',
  as: 'orderItems'
});

OrderItem.belongsTo(MenuItem, { 
  foreignKey: 'menu_item_id',
  as: 'menuItem'
});

module.exports = {
  sequelize,
  Customer,
  MenuItem,
  Order,
  OrderItem
};