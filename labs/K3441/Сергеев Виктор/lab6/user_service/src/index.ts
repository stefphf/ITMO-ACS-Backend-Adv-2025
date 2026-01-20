import { AppDataSource } from "./data-source";
import express = require("express");
import { useExpressServer } from 'routing-controllers';
import { useSwagger } from "./swagger";
import SETTINGS from "./config/settings";
import { CustomErrorHandler } from "./middlewares/ErrorHandler";
import { connectRabbitMQ } from "./userMessageBroker";

AppDataSource.initialize()
.then(async () => {
    console.log(`JWT Secret Key: ${SETTINGS.JWT_SECRET_KEY.toString('hex')}`);
    console.log("db initiated");
}).catch(error => console.log(error));

let app = express();
const options = {
    routePrefix: SETTINGS.APP_API_PREFIX,
    controllers: [__dirname + SETTINGS.APP_CONTROLLERS_PATH],
    middlewares: [CustomErrorHandler],
    validation: true,
    classTransformer: true,
    defaultErrorHandler: false,
};

app = useExpressServer(app, options);
app = useSwagger(app, options);

app.listen(SETTINGS.APP_PORT, () => {
    console.log(`[+] UserService running on ${SETTINGS.APP_PORT}`);
    connectRabbitMQ();
});