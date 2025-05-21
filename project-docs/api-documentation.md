
# API Documentation

## Authentication
All protected endpoints require authentication via Auth0. Include the authentication token in the request headers.

## Events API

### Get Events
**GET** `/api/events`

Retrieves a list of published events.

Query Parameters:
- `type`: Filter by event type (Optional)
- `startDate`: Filter events starting from this date (Optional)
- `endDate`: Filter events until this date (Optional)

Response: 200 OK
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "eventType": "string",
    "startDateTime": "string",
    "endDateTime": "string",
    "location": "string",
    "creator": {
      "id": "string",
      "firstName": "string",
      "lastName": "string"
    }
  }
]
```

### Get Single Event
**GET** `/api/events/{id}`

Retrieves details of a specific event.

Response: 200 OK
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "eventType": "string",
  "startDateTime": "string",
  "endDateTime": "string",
  "location": "string",
  "creator": {
    "id": "string",
    "firstName": "string",
    "lastName": "string",
    "email": "string"
  }
}
```

### Create Event
**POST** `/api/events`

Creates a new event. Requires ADMIN or STAFF role.

Request Body:
```json
{
  "title": "string",
  "description": "string",
  "eventType": "string",
  "startDateTime": "string",
  "endDateTime": "string",
  "location": "string",
  "address": "string"
}
```

Response: 201 Created
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "eventType": "string",
  "startDateTime": "string",
  "endDateTime": "string",
  "location": "string"
}
```

### Update Event
**PUT** `/api/events/{id}`

Updates an existing event. Requires authentication.

Request Body:
```json
{
  "title": "string",
  "description": "string",
  "startDate": "string",
  "endDate": "string",
  "location": "string",
  "type": "string",
  "capacity": "number",
  "isPublished": "boolean"
}
```

Response: 200 OK
```json
{
  "id": "string",
  "title": "string",
  "description": "string",
  "eventType": "string",
  "startDateTime": "string",
  "endDateTime": "string",
  "location": "string"
}
```

### Delete Event
**DELETE** `/api/events/{id}`

Deletes an event. Requires ADMIN or STAFF role.

Response: 204 No Content

## Photos API

### Get Photos
**GET** `/api/photos`

Retrieves a list of photos from the gallery.

Response: 200 OK
```json
[
  {
    "id": "string",
    "title": "string",
    "description": "string",
    "imageUrl": "string"
  }
]
```

## Error Responses

All endpoints may return the following error responses:

- 400 Bad Request: Invalid input parameters
- 401 Unauthorized: Missing or invalid authentication
- 404 Not Found: Resource not found
- 500 Internal Server Error: Server-side error
