import { Router } from 'express';
import { EventController } from './event.controller';
import { assignServersSchema, createEventSchema, listEventsQuerySchema, updateEventSchema, updateStatusSchema, validateBody, validateQuery } from './event.schema';


const r = Router();

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
r.get('/', validateQuery(listEventsQuerySchema), EventController.list);
r.post('/', validateBody(createEventSchema), EventController.create);


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
r.get('/:id', EventController.get);
r.patch('/:id', validateBody(updateEventSchema), EventController.update);
r.delete('/:id', EventController.remove);


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
r.patch('/:id/status', validateBody(updateStatusSchema), EventController.updateStatus);


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
r.patch('/:id/assign', validateBody(assignServersSchema), EventController.assignServers);


export default r;