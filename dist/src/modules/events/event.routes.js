"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const event_controller_1 = require("./event.controller");
const event_schema_1 = require("./event.schema");
const r = (0, express_1.Router)();
/** @openapi
 * /api/events:
 *    get:
 *      tags: [Events]
 *      summary: Lister les événements (filtre + pagination)
 *      parameters:
 *          - in: query
 *          name: q
 *          schema: { type: string }
 *          description: Recherche plein texte (titre/description/client)
 *          - in: query
 *          name: status
 *          schema: { $ref: '#/components/schemas/EventStatus' }
 *          - in: query
 *          name: type
 *          schema: { $ref: '#/components/schemas/EventType' }
 *          - in: query
 *          name: types
 *          schema: { type: string }
 *          description: CSV de types (ex: mariage,buffet)
 *          - in: query
 *          name: from
 *          schema: { type: string, format: date-time }
 *          - in: query
 *          name: to
 *          schema: { type: string, format: date-time }
 *          - in: query
 *          name: minAmount
 *          schema: { type: number }
 *          - in: query
 *          name: maxAmount
 *          schema: { type: number }
 *          - in: query
 *          name: city
 *          schema: { type: string }
 *          - in: query
 *          name: page
 *          schema: { type: integer, minimum: 1, default: 1 }
 *          - in: query
 *          name: limit
 *          schema: { type: integer, minimum: 1, maximum: 100, default: 10 }
 *          - in: query
 *          name: sort
 *          schema: { type: string, default: '-startAt' }
 *      responses:
 *          '200': { description: OK }
 *    post:
 *      tags: [Events]
 *      summary: Créer un événement
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema: { $ref: '#/components/schemas/CreateEvent' }
 *          responses:
 *              '201': { description: Created }
 */
r.get('/', (0, event_schema_1.validateQuery)(event_schema_1.listEventsQuerySchema), event_controller_1.EventController.list);
r.post('/', (0, event_schema_1.validateBody)(event_schema_1.createEventSchema), event_controller_1.EventController.create);
/** @openapi
* /api/events/{id}:
* get:
* tags: [Events]
* summary: Récupérer un événement par id
* patch:
* tags: [Events]
* summary: Mettre à jour un événement
* requestBody:
* content:
* application/json:
* schema: { $ref: '#/components/schemas/UpdateEvent' }
* delete:
* tags: [Events]
* summary: Supprimer un événement
*/
r.get('/:id', event_controller_1.EventController.get);
r.patch('/:id', (0, event_schema_1.validateBody)(event_schema_1.updateEventSchema), event_controller_1.EventController.update);
r.delete('/:id', event_controller_1.EventController.remove);
/** @openapi
* /api/events/{id}/status:
* patch:
* tags: [Events]
* summary: Mettre à jour le statut d'un événement
* requestBody:
* required: true
* content:
* application/json:
* schema: { $ref: '#/components/schemas/UpdateStatus' }
*/
r.patch('/:id/status', (0, event_schema_1.validateBody)(event_schema_1.updateStatusSchema), event_controller_1.EventController.updateStatus);
/** @openapi
* /api/events/{id}/assign:
* patch:
* tags: [Events]
* summary: Assigner les serveurs d'un événement (remplace la liste)
* requestBody:
* required: true
* content:
* application/json:
* schema: { $ref: '#/components/schemas/AssignServers' }
*/
r.patch('/:id/assign', (0, event_schema_1.validateBody)(event_schema_1.assignServersSchema), event_controller_1.EventController.assignServers);
exports.default = r;
