# Fleet Tracker School Backend

Backend services for the Fleet Tracker School system built with MERN stack (MongoDB, Express.js, React.js, Node.js), providing API endpoints for route management, real-time tracking, and user authentication.

## Features

- RESTful API endpoints for bus tracking and management
- Real-time location updates using Socket.IO
- JWT-based authentication and authorization
- MongoDB database integration
- Express.js server architecture

# Fleet Tracker School Backend

This is the backend repository for the Fleet Tracker School project. It serves multiple frontend apps for parents, drivers, and managers. Below is the folder structure and a brief description of each directory and its role in the backend application.

## Folder Structure

```
fleet-tracker-school-backend/
├── config/                # Configurations (e.g., database, environment)
│   └── db.js              # MongoDB connection file
├── controllers/           # Business logic for each user role
│   ├── parentController.js
│   ├── driverController.js
│   └── managerController.js
├── models/                # Mongoose schemas and models
│   ├── User.js            # User schema with role-based fields
│   ├── Vehicle.js         # Fleet-related schema
│   └── Route.js           # Routes schema
├── middleware/            # Custom middleware (authentication, authorization)
│   └── authMiddleware.js
├── routes/                # Modular routes for each role
│   ├── parents.js         # Parent-specific routes
│   ├── drivers.js         # Driver-specific routes
│   └── managers.js        # Manager-specific routes
├── services/              # Services for database interactions and business logic
│   ├── parentService.js
│   ├── driverService.js
│   └── managerService.js
├── utils/                 # Utility functions
│   └── helpers.js         # Common helper functions
├── .env.example           # Example environment variables file
├── app.js                 # Main application file
├── package.json           # Project dependencies and scripts
└── README.md              # Project documentation
```

## Folder Descriptions

### `config/`
- Contains configuration files for the application. 
- `db.js` handles the MongoDB connection, setting up the database connection string from environment variables.

### `controllers/`
- Contains controllers that define the business logic for each user role (parent, driver, manager).
- For example, `parentController.js` handles functions and logic specific to parent users, while `driverController.js` handles driver-related functions.
- The separation of controllers by role allows for easy addition of role-specific logic without mixing responsibilities.

### `models/`
- Contains Mongoose schemas and models that define the data structure for the backend.
- Examples include:
  - `User.js`: Defines the schema for user accounts, with fields for `name`, `email`, `password`, and `role`.
  - `Vehicle.js`: Defines the schema for vehicle data relevant to fleet management.
  - `Route.js`: Defines the schema for route and trip information.
- Using Mongoose models ensures that data is stored and validated consistently.

### `middleware/`
- Contains middleware functions for authentication and authorization.
- `authMiddleware.js` manages JWT-based authentication and role-based authorization, ensuring secure access to protected routes.

### `routes/`
- Contains API routes organized by user role for modular structure and scalability.
  - `parents.js` provides routes for parent-specific functionalities.
  - `drivers.js` provides routes for driver-specific functionalities.
  - `managers.js` provides routes for manager-specific functionalities.
- Each route file uses corresponding controllers to handle requests.

### `services/`
- Contains services responsible for handling complex database operations and encapsulating business logic for each user role.
- For example, `parentService.js` includes database operations and logic specific to parents, such as fetching child information or managing permissions.
- Organizing business logic in services keeps controllers lightweight and focused on routing.

### `utils/`
- Contains utility functions that are reusable across the application.
- `helpers.js` includes helper functions and common utility logic to avoid duplication in other files.

### `.env.example`
- Provides an example of the environment variables required by the application, such as `MONGO_URI`, `JWT_SECRET`, and other sensitive configurations.
- Developers should rename this file to `.env` and update it with actual values when setting up the environment.

### `app.js`
- The main entry point of the application.
- Initializes the server, middleware, and routes, and starts listening on the specified port.

### `package.json`
- Defines project dependencies, scripts, and metadata.
- Use this file to manage package installations and run scripts for starting or testing the application.

### `README.md`
- Contains project documentation, setup instructions, and other relevant information for developers working on the backend.

---

This folder structure is designed to keep the backend modular and maintainable. Each role-specific functionality is separated, making it easy to extend or modify features for parents, drivers, and managers without affecting other parts of the codebase.


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
