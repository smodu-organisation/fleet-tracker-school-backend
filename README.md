# Fleet Tracker School Backend

Backend services for the Fleet Tracker School system built with MERN stack (MongoDB, Express.js, React.js, Node.js), providing API endpoints for route management, real-time tracking, and user authentication.

## Features

- RESTful API endpoints for bus tracking and management
- Real-time location updates using Socket.IO
- JWT-based authentication and authorization
- MongoDB database integration
- Express.js server architecture

## Prerequisites

- Node.js 18.x or higher
- MongoDB 6.x or higher
- npm or yarn package manager

## Setup

1. Clone the repository:
```bash
git clone https://github.com/your-org/fleet-tracker-school-backend.git
cd fleet-tracker-school-backend
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your configuration including:
# - MongoDB connection string
# - JWT secret
# - Server port
# - Other environment-specific variables
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

The server will start on the configured port (default: 5000)

## API Documentation

API documentation can be accessed at `/api/docs` when running the server.

## Related Repositories

- [fleet-tracker-school](https://github.com/smodu-organisation/fleet-tracker-school) - Main project documentation
- [fleet-tracker-school-frontend](https://github.com/smodu-organisation/fleet-tracker-school-frontend) - Frontend applications
- [fleet-tracker-school-shared](https://github.com/smodu-organisation/fleet-tracker-school-shared) - Shared utilities

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
