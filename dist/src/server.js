"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = require("./app");
const db_1 = require("./config/db");
const env_1 = require("./env");
async function bootstrap() {
    await (0, db_1.connectDB)();
    app_1.app.listen(env_1.env.PORT, () => console.log(`🚀 API on http://localhost:${env_1.env.PORT} | Swagger UI /docs`));
}
bootstrap();
/*
app.listen(env.PORT, () => {
  console.log(`🚀 API on http://localhost:${env.PORT}`);
});
*/ 
