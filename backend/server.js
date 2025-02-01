const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const hbs = require('hbs');

// Import routes
const authRoute = require('./routes/authRoutes');
const coursesRouter = require('./routes/coursesRoute');
const courseSeatsRouter = require('./routes/course_seats');
const { authenticateToken } = require('./middleware/authenticateToken');
const admissionRoutes = require("./routes/admissionRoutes");

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true })); // Allow CORS for frontend
app.use(bodyParser.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(bodyParser.json()); // Parse JSON request bodies
app.use(cookieParser()); // Parse cookies

// Static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));

// Set up hbs as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));

hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Routes
app.use('/api/auth', authRoute);
app.use('/api/courses', coursesRouter);
app.use('/api/course_seats', courseSeatsRouter);
app.use("/admission", admissionRoutes);

// Render views for the frontend pages
app.get('/', (req, res) => res.render('college-dashboard')); 
app.get('/courses', (req, res) => res.render('courseOffer')); 
app.get('/news', (req, res) => res.render('news'));
app.get('/facilities', (req, res) => res.render('facilities'));
app.get('/about', (req, res) => res.render('about'));
app.get('/signup', (req, res) => res.render('register')); // Signup form
app.get('/login', (req, res) => res.render('login')); // Login form
app.get('/admissionForm', (req, res) => res.render('admissionForm'));

// Protected route
app.get('/college-home', authenticateToken, (req, res) => {
  res.render('college_home', { user: req.user }); // Render college_home with user data
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Global Error:', err);
  res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
