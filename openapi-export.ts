import { writeFileSync } from 'fs';
import { swaggerSpec } from './src/docs/swagger';

writeFileSync('openapi.json', JSON.stringify(swaggerSpec, null, 2));
console.log('openapi.json generated');