# Porichoy PDF Service

Microservice for generating PDF resumes from HTML with Bangla font support.

## Features

- PDF generation using Puppeteer
- Bangla font support (Noto Sans Bengali)
- Responsive A4 format
- Secure API with authentication
- Docker support

## Installation

### Local Development

```bash
npm install
cp .env.example .env
# Edit .env with your API key
npm run dev
```

### Docker

```bash
docker build -t porichoy-pdf-service .
docker run -p 3001:3001 -e API_KEY=your_api_key porichoy-pdf-service
```

## Deployment

### Railway / Render / Fly.io

1. Create a new service from this directory
2. Set environment variables:
   - `PORT=3001`
   - `API_KEY=your_secure_api_key`
3. Deploy

## API Endpoints

### Health Check

```bash
GET /health
```

### Generate PDF

```bash
POST /generate
Authorization: Bearer YOUR_API_KEY
Content-Type: application/json

{
  "profileData": { ... },
  "user": { ... }
}
```

Returns: PDF file (application/pdf)

## Environment Variables

- `PORT` - Server port (default: 3001)
- `API_KEY` - Authentication API key

## Font Support

The service includes:
- Noto Sans Bengali for Bangla text
- Inter for English text
- Proper Unicode support for Bangla characters

