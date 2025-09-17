import {configuration} from "./config/timeControlConfig.js";
import express from "express";
import * as fs from "node:fs";
import morgan from "morgan";
import {errorHandler} from "./errorHandler/errorHandler.js";
import {accountRouter} from "./routes/accountRouter.js";
import {crewShiftRouter} from "./routes/crewShift.js";
import swaggerUi from "swagger-ui-express"
import swaggerDoc from "../docs/openapi.json" with {type: "json"}


export const launchServer = () => {

    const app = express();
    const logStream = fs.createWriteStream('access.log', {flags: 'a'});
    //==============SecurityMiddleware=========

    //=============Middlewares=================
    app.use(express.json());
    app.use(morgan('dev'));
    app.use(morgan('combined', {stream: logStream}))
    //==============Swagger Docs===============
    app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
    //==============Routers====================
    app.use('/accounts', accountRouter);
    app.use('/shift', crewShiftRouter)


    //===============ErrorHandler==============
    app.use(errorHandler)
    //=========================================
    app.listen(configuration.port, () => {
        console.log(`Server runs at http://localhost:${configuration.port}`)})
}