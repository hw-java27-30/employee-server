import {launchServer} from "./server.ts";
import {configuration} from "./config/timeControlConfig.js";
import * as mongoose from "mongoose";

mongoose.connect(configuration.mongoUri)
    .then(() => {
        console.log("MongoDB successfully connected")
        launchServer();
    })
    .catch(() => {
        console.log("Something went wrong")
    })