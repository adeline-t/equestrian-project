# API Documentation

Complete API reference for the Equestrian Management System.

## 📚 Documentation in This Section

- **[API Endpoints](./endpoints.md)** - Complete endpoint reference
- **[Authentication](./authentication.md)** - API authentication guide
- **[Error Codes](./error-codes.md)** - Error response reference
- **[Rate Limiting](./rate-limiting.md)** - Rate limit information

## 🌐 Base URLs

### Development
```
http://localhost:8787/api
```

### Production
```
https://your-worker.workers.dev/api
```

## 🚀 Quick Start

### Health Check
```bash
curl https://your-api-url/api/health
```

**Response:**
```json
{
  "status": "ok",
  "message": "API opérationnelle",
  "timestamp": "2024-12-01T15:30:00.000Z",
  "version": "1.0.0",
  "environment": "production"
}
```

### List Riders
```bash
curl https://your-api-url/api/riders
```

**Response:**
```json
[
  {
    "id": 1,
    "name": "Jean Dupont",
    "phone": "+33612345678",
    "email": "jean@example.com",
    "activity_start_date": "2024-01-15",
    "activity_end_date": null,
    "created_at": "2024-01-15T10:00:00.000Z",
    "updated_at": "2024-01-15T10:00:00.000Z"
  }
]
```

## 📋 API Overview

### Resources

The API provides access to three main resources:

1. **Riders** - Horse riders/students
2. **Horses** - Horses and ponies
3. **Associations** - Rider-horse relationships

### HTTP Methods

- **GET** - Retrieve resources
- **POST** - Create new resources
- **PUT** - Update existing resources
- **DELETE** - Delete resources

### Response Format

All responses are in JSON format with appropriate HTTP status codes.

**Success Response:**
```json
{
  "id": 1,
  "name": "Example",
  ...
}
```

**Error Response:**
```json
{
  "error": "Error type",
  "message": "Detailed error message",
  "timestamp": "2024-12-01T15:30:00.000Z"
}
```

## 🔑 Authentication

Currently, the API uses Supabase authentication. All requests are authenticated through Supabase's built-in security.

See [Authentication Guide](./authentication.md) for details.

## 📊 Endpoints Summary

### Riders

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/riders` | List all riders |
| GET | `/api/riders/:id` | Get single rider |
| POST | `/api/riders` | Create rider |
| PUT | `/api/riders/:id` | Update rider |
| DELETE | `/api/riders/:id` | Delete rider |
| GET | `/api/riders/:id/horses` | Get rider's horses |

### Horses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/horses` | List all horses |
| GET | `/api/horses/:id` | Get single horse |
| POST | `/api/horses` | Create horse |
| PUT | `/api/horses/:id` | Update horse |
| DELETE | `/api/horses/:id` | Delete horse |
| GET | `/api/horses/:id/riders` | Get horse's riders |

### Associations

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/associations` | List all associations |
| GET | `/api/associations/:id` | Get single association |
| POST | `/api/associations` | Create association |
| PUT | `/api/associations/:id` | Update association |
| DELETE | `/api/associations/:id` | Delete association |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| GET | `/api/docs` | API documentation |

## 📝 Request Examples

### Create a Rider

**Request:**
```bash
curl -X POST https://your-api-url/api/riders \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Marie Martin",
    "phone": "+33612345678",
    "email": "marie@example.com",
    "activity_start_date": "2024-01-15"
  }'
```

**Response:**
```json
{
  "id": 2,
  "name": "Marie Martin",
  "phone": "+33612345678",
  "email": "marie@example.com",
  "activity_start_date": "2024-01-15",
  "activity_end_date": null,
  "created_at": "2024-12-01T15:30:00.000Z",
  "updated_at": "2024-12-01T15:30:00.000Z"
}
```

### Create an Association

**Request:**
```bash
curl -X POST https://your-api-url/api/associations \
  -H "Content-Type: application/json" \
  -d '{
    "rider_id": 1,
    "horse_id": 5,
    "association_start_date": "2024-01-15"
  }'
```

**Response:**
```json
{
  "id": 1,
  "rider_id": 1,
  "horse_id": 5,
  "association_start_date": "2024-01-15",
  "association_end_date": null,
  "riders": {
    "id": 1,
    "name": "Jean Dupont"
  },
  "horses": {
    "id": 5,
    "name": "Jolly Jumper",
    "kind": "horse"
  }
}
```

## ⚠️ Error Handling

### HTTP Status Codes

- **200** - Success
- **201** - Created
- **400** - Bad Request (validation error)
- **404** - Not Found
- **429** - Too Many Requests (rate limited)
- **500** - Internal Server Error

### Error Response Format

```json
{
  "error": "Validation error",
  "message": "Champs requis: name",
  "timestamp": "2024-12-01T15:30:00.000Z"
}
```

See [Error Codes](./error-codes.md) for complete reference.

## 🔒 Rate Limiting

- **Limit:** 60 requests per minute per IP
- **Window:** 60 seconds
- **Response:** 429 Too Many Requests

See [Rate Limiting](./rate-limiting.md) for details.

## 🧪 Testing the API

### Using curl
```bash
# Health check
curl https://your-api-url/api/health

# List riders
curl https://your-api-url/api/riders

# Get specific rider
curl https://your-api-url/api/riders/1
```

### Using Postman
1. Import the API collection (coming soon)
2. Set base URL variable
3. Run requests

### Using JavaScript
```javascript
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://your-api-url/api'
});

// Get riders
const riders = await api.get('/riders');

// Create rider
const newRider = await api.post('/riders', {
  name: 'Jean Dupont',
  email: 'jean@example.com'
});
```

## 📖 Detailed Documentation

For complete endpoint documentation with all parameters, validation rules, and examples:

- **[API Endpoints](./endpoints.md)** - Full endpoint reference
- **[Authentication](./authentication.md)** - Auth implementation
- **[Error Codes](./error-codes.md)** - All error codes
- **[Rate Limiting](./rate-limiting.md)** - Rate limit details

## 🆘 Getting Help

- **API Issues:** Check [Error Codes](./error-codes.md)
- **Authentication:** See [Authentication Guide](./authentication.md)
- **Rate Limits:** Review [Rate Limiting](./rate-limiting.md)
- **General Help:** Open an issue on GitHub

---

**Ready to use the API?** Check out [API Endpoints](./endpoints.md) for detailed documentation.