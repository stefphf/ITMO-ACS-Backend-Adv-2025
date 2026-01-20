import { Connection, Channel } from "amqplib";
import SETTINGS from "./config/settings";
const amqplib = require("amqplib")

let connection: Connection;
let userLoggedChannel: Channel

async function connectRabbitMQ() {
    try {
        connection = await amqplib.connect(SETTINGS.MESSAGE_BROKER_URL)
        userLoggedChannel = await connection.createChannel()
        await userLoggedChannel.assertQueue("user.loggedIn")
        console.log("[+] Gateway amqp connected successfully")

        await consumeUserLoggedChannel()
    } catch (err) {
        console.log("[-] Gateway amqp connection failed")
        console.log(err.message)
    }
}

async function consumeUserLoggedChannel() {
    await userLoggedChannel.consume("user.loggedIn", (msg) => {
        if (msg !== null) {
            try {
                const data = JSON.parse(msg.content.toString());
                console.log(`[+] User logged in with information: ${JSON.stringify(data)}`)
            } catch (err) {
            console.log("[-] failed to parse message content")
            }
        }
        userLoggedChannel.ack(msg);
    })
}

export default connectRabbitMQ