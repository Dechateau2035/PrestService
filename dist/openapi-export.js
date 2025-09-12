"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const swagger_1 = require("./src/docs/swagger");
(0, fs_1.writeFileSync)('openapi.json', JSON.stringify(swagger_1.swaggerSpec, null, 2));
console.log('openapi.json generated');
