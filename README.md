# Store Rate Application

A full-stack web application for rating and reviewing stores, built with React.js (Vite) for the frontend and Node.js/Express for the backend.

Demo Video -> [Storate - Google Chrome 2025-09-03 17-16-38.zip](https://github.com/user-attachments/files/22117138/Storate.-.Google.Chrome.2025-09-03.17-16-38.zip)


## 📸 Screenshots  

### Frontend UI  
- Login Page  
  <img width="1912" height="1007" alt="image" src="https://github.com/user-attachments/assets/502dead1-fa01-43b8-bc2f-833ac8ac1f6e" />
  
- Signup Page  
  <img width="1919" height="1009" alt="image" src="https://github.com/user-attachments/assets/0e9e6750-5280-442f-b88b-30367824ac10" />

- Records Table
  <img width="1919" height="1019" alt="image" src="https://github.com/user-attachments/assets/541d3587-1d40-4653-a2ee-d2ff52279a2a" />

- Store Listing  
  <img width="1910" height="1021" alt="image" src="https://github.com/user-attachments/assets/5b2fe2e0-178f-4ccd-b8fb-e0744e848ba9" />
 
- Store Details + Reviews  
<img width="1892" height="1017" alt="image" src="https://github.com/user-attachments/assets/e25ba664-0253-47cb-8bf3-75337aae694b" />

<img width="1890" height="1006" alt="image" src="https://github.com/user-attachments/assets/9a7be923-a4ea-4afb-8fe4-bc02c55e02e7" />

- Users records (Admin View)
<img width="1914" height="1014" alt="image" src="https://github.com/user-attachments/assets/cd989901-85fc-409c-b3fb-8fbbdfaa16f7" />



### Database  (Neon Console Screenshots below)
- Users Table  
  <img width="1910" height="1020" alt="image" src="https://github.com/user-attachments/assets/7d636fa1-3e30-4eab-9d92-d084fa0de9f4" />


- Stores Table  
  <img width="1899" height="1012" alt="image" src="https://github.com/user-attachments/assets/01716a0e-30ab-4e39-b8d0-e33bf2638bbc" />


- Reviews Table  
  <img width="1908" height="985" alt="image" src="https://github.com/user-attachments/assets/a1002f67-17de-48e1-bb52-e2696953a74b" />


### Application Flow Diagrams


1->Rating and reviews flow
![Diagram_1](https://github.com/user-attachments/assets/2fcb3ef6-fa9f-4dc8-bfc5-3ef1a3948dff)

2->store management flow
![Diagram_2](https://github.com/user-attachments/assets/11c4f43a-eb25-409c-a013-fecc3a6ffb4d)

3->Data flow (Authentication flow)
![Diagram_3](https://github.com/user-attachments/assets/cf2ce7aa-d72b-4eab-9f97-21afa399530b)



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


