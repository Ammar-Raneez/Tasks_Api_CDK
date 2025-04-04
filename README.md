# Task Management API

A serverless Task Management API built with Express, TypeScript, MongoDB, and AWS services.

Hosted URL: `https://peimtfghmt.ap-northeast-1.awsapprunner.com`

## Architecture Overview

This application is structured as a serverless Node.js API deployed on AWS AppRunner. It uses:

- **Express.js with TypeScript**: For API implementation
- **MongoDB with Mongoose**: For data persistence
- **AWS S3**: For file storage
- **AWS AppRunner**: For scalable Dockerized deployments
- **AWS CDK**: For infrastructure as code

## Project Structure

```
project-root/
├── src/
│   ├── common/      # Common and shared resources (constants, enums, interfaces, custom middlewares, dtos, etc.)
│   ├── controllers/ # Route handlers
│   ├── dao/         # Service DAOs
│   ├── loaders/     # MongoDB and Express application loaders
│   ├── models/      # MongoDB schemas
│   ├── routes/      # API routes
│   ├── servers/     # Servers utilized to run the API
│   ├── services/    # Business logic
│   ├── utils/       # Utility functions
│   └── main.ts      # Application entry point
├── libs/cdk/       # AWS CDK deployment code
├── tests/          # Test files
└── README.md       # Documentation
```

## API Endpoints

The API provides the following endpoints:

### Tasks

- `POST /api/tasks` - Create a new task
- `GET /api/tasks` - Get all tasks
- `GET /api/tasks/:id` - Get a task by ID
- `PUT /api/tasks/:id` - Update a task
- `DELETE /api/tasks/:id` - Delete a task
- `POST /api/tasks/upload-url` - Get a pre-signed URL for file upload

### Users (External API with caching)

- `GET /api/users` - Get users from external API with caching

## Setup and Deployment

### Prerequisites

- Node.js 18.x or later
- AWS Account and CLI configured
- MongoDB Atlas account or local MongoDB instance

## Deployment to AWS

1. Configure AWS CLI with your credentials
2. Deploy the `configStack` to produce the required parameters in SSM
3. Deploy the `commonResourcesStack` to produce the required S3 bucket and CloudFront distribution
4. Comment out the `AppRunner` definition and deploy the `serverStack` to ensure the ECR repository is present
5. Deploy the complete `serverStack`

### Local Development

1. Clone the repository
2. Install dependencies:
   ```
   yarn
   ```
3. Create a `.env` file based on the `.env.example` under `/src/common/environments`
4. Run the development server:
   ```
   yarn run dev
   ```

## Scalability Considerations

The application is designed for scalability in the following ways:

1. **Scalable and performant**: AWS AppRunner scales infinitely and manages everything required to run Docker containers leading to seamless future enhancements.
2. **Modular Design**: The code is organized into separate modules (controllers, services, etc.) that can be extended.
3. **Caching**: External API responses are cached in MongoDB with TTL.
4. **MongoDB Atlas**: Can scale horizontally for database needs.
5. **Rate Limiting**: Implemented to prevent abuse.

## Limitations

Areas that require addressing:

1. This system utilizes MongoDB instead of DynamoDB due to budget constraints.
2. Test cases are very limited and needs improvement.

## Future Improvements

Potential areas for enhancement:

1. Implement authentication and authorization
2. Add pagination for GET endpoints
