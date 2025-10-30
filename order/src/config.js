require('dotenv').config();

module.exports = {
    mongoURI: process.env.MONGODB_ORDER_URI || 'mongodb://localhost/orders',
    rabbitMQURI: 'amqp://rabbitmq',
    rabbitMQQueue: 'orders',
    port: 3002,
    exchangeName: "orders",
  queueName: "orders_queue",
};
  