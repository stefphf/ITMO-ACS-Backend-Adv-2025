import { Connection, Channel } from "amqplib";
import SETTINGS from "./config/settings";
const amqplib = require("amqplib")

let connection: Connection;
let userLoggedChannel: Channel

export async function connectRabbitMQ() {
    try {
        connection = await amqplib.connect(SETTINGS.MESSAGE_BROKER_URL)
        userLoggedChannel = await connection.createChannel()
        await userLoggedChannel.assertQueue("user.loggedIn")
        console.log("[+] UserService amqp connected successfully")
    } catch (err) {
        console.log("[-] UserService amqp connection failed")
        console.log(err.message)
    }
}

export async function sendUserLoggedMessage(payload) {
    if (!userLoggedChannel) throw new Error("[-] Sending msg while channel not initialized");
    try {
        await userLoggedChannel.sendToQueue(
            "user.loggedIn",
            Buffer.from(JSON.stringify(payload))
        )
        console.log("[+] User login message sent")
    } catch (err) {
        console.log("[-] User login message sending failed")
        console.log(err)
    }
}
