# HBIU Learning Management System - Backend API

A comprehensive Node.js Express API server for the HBIU Learning Management System with complete authentication, user management, course management, and admin functionality.

## Features

- 🚀 **Complete Express.js API**: Fully functional RESTful API with all CRUD operations
- 🔒 **Security**: Helmet, CORS, Rate Limiting, JWT Authentication, Password Hashing
- 🔑 **Authentication**: JWT-based auth with role-based access control (Admin, Lecturer, Student)
- 📝 **Request Logging**: Morgan middleware for comprehensive request logging
- 🗃️ **Database**: SQLite with Sequelize ORM, complete models and associations
- ⚡ **Development**: Hot-reload with Nodemon, comprehensive error handling
- 🛡️ **Validation**: Express Validator middleware for all inputs
- � **User Management**: Complete user CRUD with profile management
- 🎓 **Course System**: Full course management with enrollment system
- 🏫 **College Management**: Multi-college support with admin controls
- 📊 **Analytics**: Admin dashboard with system statistics
- 🌱 **Database Seeding**: Sample data for testing and development

## Quick Start

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- SQLite (included with the project)

### Installation

1. Navigate to the backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```
Edit the `.env` file with your configuration.

4. Start the development server:
```bash
npm run dev
```

The server will start on `http://localhost:5000`

### Available Scripts

- `npm start` - Start the production server
- `npm run dev` - Start the development server with hot reload
- `npm test` - Run tests (to be implemented)

## API Endpoints

### Health Check
- `GET /health` - Server health status

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `POST /api/auth/forgot-password` - Forgot password
- `POST /api/auth/reset-password` - Reset password

### Users
- `GET /api/users` - Get all users (admin)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user (admin)
- `GET /api/users/:id/courses` - Get user's courses

### Courses
- `GET /api/courses` - Get all courses
- `POST /api/courses` - Create course (lecturer)
- `GET /api/courses/:id` - Get course by ID
- `PUT /api/courses/:id` - Update course (lecturer)
- `DELETE /api/courses/:id` - Delete course (admin)
- `POST /api/courses/:id/enroll` - Enroll in course
- `GET /api/courses/:id/modules` - Get course modules
- `GET /api/courses/:id/assignments` - Get course assignments

### Colleges
- `GET /api/colleges` - Get all colleges
- `POST /api/colleges` - Create college (admin)
- `GET /api/colleges/:id` - Get college by ID
- `PUT /api/colleges/:id` - Update college (admin)
- `DELETE /api/colleges/:id` - Delete college (admin)
- `GET /api/colleges/:id/courses` - Get college courses
- `GET /api/colleges/:id/staff` - Get college staff

### Admin
- `GET /api/admin/stats` - Get admin statistics
- `GET /api/admin/users` - Get all users (admin view)
- `PUT /api/admin/users/:id/role` - Update user role
- `GET /api/admin/analytics` - Get system analytics
- `POST /api/admin/bulk-operations` - Bulk operations

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NODE_ENV` | Environment mode | development |
| `PORT` | Server port | 5000 |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `DB_PATH` | SQLite database file path | ./database/hbiu_lms.sqlite |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRE` | JWT expiration time | 7d |

## Project Structure

```
backend/
├── routes/           # API route definitions
│   ├── auth.js      # Authentication routes
│   ├── users.js     # User management routes
│   ├── courses.js   # Course management routes
│   ├── colleges.js  # College management routes
│   └── admin.js     # Admin routes
├── models/          # Sequelize database models
│   ├── User.js      # User model
│   ├── College.js   # College model
│   ├── Course.js    # Course model
│   ├── Enrollment.js # Enrollment model
│   ├── Assignment.js # Assignment model
│   └── index.js     # Model associations
├── config/          # Configuration files
│   └── database.js  # Database connection config
├── database/        # SQLite database files
├── middleware/      # Custom middleware (to be added)
├── controllers/     # Route controllers (to be added)
├── utils/           # Utility functions (to be added)
├── uploads/         # File uploads directory
├── logs/            # Log files
├── .env             # Environment variables
├── .gitignore       # Git ignore file
├── package.json     # Project dependencies
├── server.js        # Main server file
└── README.md        # This file
```

## Next Steps

1. **Database Setup**: ✅ SQLite database configured with Sequelize models
2. **Authentication**: Implement JWT authentication middleware
3. **Validation**: Add input validation for all routes
4. **Controllers**: Move business logic to controller files
5. **Testing**: Add unit and integration tests
6. **Documentation**: Add API documentation with Swagger
7. **Deployment**: Set up deployment scripts and CI/CD

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting
- Input validation ready
- JWT authentication ready
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the ISC License.