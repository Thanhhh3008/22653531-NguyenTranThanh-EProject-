const amqp = require("amqplib");
const config = require("../config");
const OrderService = require("../services/orderService");

class MessageBroker {
  static async connect(retries = 10, delay = 5000) {
    let connection;
    let channel;

    for (let i = 0; i < retries; i++) {
      try {
        console.log(`🐇 [RabbitMQ] Connecting to ${process.env.RABBITMQ_URI || "amqp://rabbitmq"} (attempt ${i + 1}/${retries})`);
        
        connection = await amqp.connect("amqp://rabbitmq");
        channel = await connection.createChannel();

        console.log("✅ [RabbitMQ] Connected successfully!");

        // Ensure the queue exists
        await channel.assertQueue(config.rabbitMQQueue, { durable: true });
        console.log(`📦 [RabbitMQ] Queue ready: ${config.rabbitMQQueue}`);

        // Consume messages
        channel.consume(config.rabbitMQQueue, async (message) => {
          try {
            const order = JSON.parse(message.content.toString());
            console.log("📥 [RabbitMQ] Received message:", order);

            const orderService = new OrderService();
            await orderService.createOrder(order);

            channel.ack(message);
            console.log("✅ [RabbitMQ] Order processed successfully");
          } catch (error) {
            console.error("❌ [RabbitMQ] Error processing message:", error.message);
            channel.reject(message, false);
          }
        });

        // If connected successfully, break the retry loop
        return { connection, channel };

      } catch (error) {
        console.error(`⚠️ [RabbitMQ] Connection failed: ${error.message}`);
        if (i < retries - 1) {
          console.log(`⏳ Retrying in ${delay / 1000}s...`);
          await new Promise((resolve) => setTimeout(resolve, delay));
        } else {
          console.error("❌ [RabbitMQ] Could not connect after multiple retries.");
          process.exit(1);
        }
      }
    }
  }
}

module.exports = MessageBroker;
