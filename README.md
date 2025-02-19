# InstaNotes

InstaNotes is a powerful and intuitive notes app designed to help you quickly capture, organize, and manage your notes. Built with a modern tech stack, it offers a seamless user experience with features like authentication, authorization, and secure storage of notes.

## 🛠 Tech Stack

- **Frontend**: [Vite](https://vitejs.dev/) + [React](https://reactjs.org/) + [Tailwind CSS](https://tailwindcss.com/)
- **Backend**: [Node.js](https://nodejs.org/en/) + [Express](https://expressjs.com/) + [MongoDB](https://www.mongodb.com/)
- **Authentication**: [jsonwebtoken](https://github.com/auth0/node-jsonwebtoken), [bcrypt.js](https://github.com/dcodeIO/bcrypt.js)
- **Deployment**: Frontend on [Vercel](https://vercel.com/), Backend on [Render](https://render.com/)

## 🔗 Live Demo

Check out the live demo of InstaNotes [here](https://instanotes-2a1b.onrender.com/).

## ✨ Features

- **Authentication & Authorization**: Secure login and signup using JWT and bcrypt for password hashing.
- **Create, Edit, Delete Notes**: Seamlessly manage your notes with easy-to-use UI components.
- **Pin Notes**: Pin important notes for easy access.
- **Responsive Design**: Optimized for both desktop and mobile devices using Tailwind CSS.
- **Search Functionality**: Quickly search through your notes with integrated search features.
- **API Integration**: RESTful API endpoints to handle note-related actions.

## 📂 Project Structure

### Frontend (Vite + React)
## 📂 Project Structure

### Frontend (Vite + React)

```bash
frontend/
├── public/               # Public assets and files
├── src/
│   ├── assets/           # Static assets
│   ├── components/       # Reusable React components
│   ├── pages/            # Page components (e.g., login, signup, dashboard)
│   ├── utils/            # Utility functions (e.g., API requests)
│   ├── App.css           # Global styles
│   ├── App.jsx           # Main App component
│   ├── index.css         # Tailwind and other global styles
│   └── main.jsx          # Entry point for the React app
├── .gitignore            # Ignored files and directories
├── README.md             # Project readme
├── package.json          # Frontend dependencies
├── postcss.config.js     # PostCSS configuration
├── tailwind.config.js    # Tailwind CSS configuration
├── vite.config.js        # Vite configuration
```

### Backend (Node.js + Express)

```bash
backend/
├── models/               # Mongoose schemas for notes and users
├── .gitignore            # Ignored files and directories
├── config.json           # MongoDB Atlas connection settings
├── package-lock.json     # Backend dependencies lock file
├── package.json          # Backend dependencies
├── server.js             # Main server file
├── utils.js              # Utility functions (e.g., JWT handling)
```

## 💻 How to Run Locally

### Step 1: Clone the repository
```bash
git clone https://github.com/your-username/InstaNotes.git
```

### Step 2: Navigate to the project directory

- **For Frontend:**

```bash
cd frontend
npm install
```

- **For Backend:**

```bash
cd backend
npm install
```

### Step 3: Set up environment variables

Create a `.env` file in the `backend` directory and add the following variables:

```bash
MONGO_URI=<your-mongodb-connection-string>
JWT_SECRET=<your-jwt-secret>
```

### Step 4: Navigate to the project directory

- **For Frontend:**

```bash
cd frontend
npm install
```

- **For Backend:**

```bash
cd backend
npm run server / dev
```

### Step 5: Visit the App

To view the frontend of your application, open the following URL in your browser:

[http://localhost:5173](http://localhost:5173)

### Step 6: API Endpoints

- `POST /api/auth/signup`: Register a new user
- `POST /api/auth/login`: Log in a user
- `POST /api/notes`: Create a new note
- `GET /api/notes`: Get all notes for a user
- `PUT /api/notes/:id`: Update a note
- `DELETE /api/notes/:id`: Delete a note

## 👥 Contributing

Contributions are welcome! If you'd like to improve InstaNotes or fix any bugs, please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature-branch`)
3. Commit your changes (`git commit -m 'Add some feature'`)
4. Push to the branch (`git push origin feature-branch`)
5. Open a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

