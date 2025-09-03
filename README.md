# Store Rate Application

A full-stack web application for rating and reviewing stores, built with React.js (Vite) for the frontend and Node.js/Express for the backend.

## 🌟 Features

### Frontend
- Modern, responsive UI built with React.js and Vite
- User authentication (login/signup)
- Store rating and review system
- User profiles with avatars
- Interactive UI components using Radix UI
- Form handling with React Hook Form
- State management with Jotai
- Avatar generation using DiceBear and Multiavatar

### Backend
- RESTful API with Express.js
- User authentication with JWT
- PostgreSQL database integration
- File upload handling
- CORS enabled for cross-origin requests
- Environment variable configuration

## 🚀 Tech Stack

### Frontend
- React 18
- Vite (Build Tool)
- Radix UI (UI Components)
- React Hook Form (Form Handling)
- Jotai (State Management)
- Axios (HTTP Client)
- React Router (Routing)
- Tailwind CSS (Styling)
- Framer Motion (Animations)
- React Icons
- React Hot Toast (Notifications)
- Zod (Schema Validation)

### Backend
- Node.js
- Express.js
- PostgreSQL (Database)
- Sequelize (ORM)
- JWT (Authentication)
- Bcrypt (Password Hashing)
- Multer (File Uploads)
- CORS
- Dotenv (Environment Variables)

## 📦 Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- PostgreSQL (local or cloud instance)

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/prsAxios/Storate.git
   cd Storate
   ```

2. **Set up the backend**
   ```bash
   cd backend
   npm install
   cp .env.example .env  # Update the environment variables as needed
   ```

3. **Set up the frontend**
   ```bash
   cd ../frontend
   npm install
   cp .env.example .env  # Update the environment variables as needed
   ```

## ⚙️ Configuration

### Backend (.env)
```
PORT=5000
POSTGRES_URL=postgres://username:password@localhost:5432/your_database
# or use DATABASE_URL instead of POSTGRES_URL
# DATABASE_URL=postgres://username:password@localhost:5432/your_database
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
FILE_UPLOAD_PATH=./public/uploads
MAX_FILE_UPLOAD=1000000  # 1MB
POSTGRES_SSL=false  # Set to true for production with SSL

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api/v1
# Add other frontend environment variables as needed
```

## 🚦 Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```
   The backend server will start on `http://localhost:5000`

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 🏗️ Project Structure

```
store-rate/
├── backend/               # Backend server
│   ├── config/           # Configuration files
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   ├── utils/            # Utility functions
│   ├── .env              # Environment variables
│   ├── index.js          # Entry point
│   └── package.json
│
└── frontend/             # Frontend React app
    ├── public/           # Static files
    ├── src/
    │   ├── atoms/        # Jotai state atoms
    │   ├── components/   # Reusable components
    │   ├── hooks/        # Custom React hooks
    │   ├── pages/        # Page components
    │   ├── utilities/    # Utility functions
    │   ├── App.jsx       # Main App component
    │   └── main.jsx      # Entry point
    ├── .env              # Frontend environment variables
    └── package.json
```

## 📝 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - Login user
- `GET /api/v1/auth/me` - Get current user
- `PUT /api/v1/auth/updatedetails` - Update user details
- `PUT /api/v1/auth/updatepassword` - Update password
- `POST /api/v1/auth/forgotpassword` - Forgot password
- `PUT /api/v1/auth/resetpassword/:resettoken` - Reset password

### Users
- `GET /api/v1/users` - Get all users (admin only)
- `GET /api/v1/users/:id` - Get single user
- `PUT /api/v1/users/:id` - Update user (admin only)
- `DELETE /api/v1/users/:id` - Delete user (admin only)

### Stores
- `GET /api/v1/stores` - Get all stores
- `GET /api/v1/stores/:id` - Get single store
- `POST /api/v1/stores` - Create new store
- `PUT /api/v1/stores/:id` - Update store
- `DELETE /api/v1/stores/:id` - Delete store
- `POST /api/v1/stores/:id/photo` - Upload store photo

### Reviews
- `GET /api/v1/reviews` - Get all reviews
- `GET /api/v1/reviews/:id` - Get single review
- `POST /api/v1/stores/:storeId/reviews` - Add review for store
- `PUT /api/v1/reviews/:id` - Update review
- `DELETE /api/v1/reviews/:id` - Delete review

## 🧪 Testing

To run tests:

```bash
# Run backend tests
cd backend
npm test

# Run frontend tests
cd ../frontend
npm test
```

## 🚀 Deployment

### Backend Deployment
1. Set up a PostgreSQL database (e.g., Supabase, Neon, or self-hosted)
2. Configure environment variables in production
3. Deploy to a Node.js hosting service that supports PostgreSQL (e.g., Heroku, Render, Railway, or Vercel with a database add-on)

### Frontend Deployment
1. Build the production version:
   ```bash
   cd frontend
   npm run build
   ```
2. Deploy the `dist` folder to a static hosting service (e.g., Vercel, Netlify, GitHub Pages)

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Vite](https://vitejs.dev/) - Next Generation Frontend Tooling
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces
- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [MongoDB](https://www.mongodb.com/) - The database for modern applications
