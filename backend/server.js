// Import required modules
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const hbs = require('hbs');

dotenv.config();

const app = express();

// Middleware
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(cookieParser());

// Static files (CSS, JS)
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(process.env.UPLOADS_DIR || 'uploads'));

// Set up hbs as the view engine
app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'views'));
hbs.registerPartials(path.join(__dirname, 'views', 'partials'));

// Import routes
const authRoute = require('./routes/authRoutes');
const coursesRouter = require('./routes/coursesRoute');
const courseSeatsRouter = require('./routes/course_seats');
const admissionRoutes = require("./routes/admissionRoutes");
const uploadRoutes = require('./routes/uploadRoutes');
const studentDashboardRoute = require('./routes/studentRoutes');
const profileRoute = require('./routes/profileRoute');
const { authenticateToken } = require('./middleware/authenticateToken');
const { authenticateAdmin } = require('./middleware/authenticateAdmin'); // ✅ Import admin auth middleware
const adminRoutes = require('./routes/adminRoutes');
const adminDashboardRoutes = require("./routes/adminDashboardRoute");

// Routes
app.use('/api/auth', authRoute);
app.use('/api/courses', coursesRouter);
app.use('/api/course_seats', courseSeatsRouter);
app.use('/admission', admissionRoutes);
app.use('/api', uploadRoutes);
app.use('/api', studentDashboardRoute);
app.use('/api', profileRoute);
app.use("/api/admin", adminRoutes);
app.use("/api/admin", adminDashboardRoutes);

// ✅ Admin Login Page Route
app.get('/adminlogin', (req, res) => res.render('adminLogin'));

// ✅ Admin Dashboard Route - Now Uses Admin Authentication Middleware
app.get('/admin-dashboard', (req, res) => res.render('adminDashboard'));

// ✅ Profile Route - Only accessible if logged in
app.get('/profile', authenticateToken, (req, res) => {
    res.render('profile', { user: req.user });
});

// ✅ Logout Route - Clears JWT and redirects to "/"
app.get('/logout', (req, res) => {
    res.clearCookie('jwt'); // Clear JWT cookie if used
    res.redirect('/'); // Redirect to the college dashboard
});

// Render views for frontend pages
app.get('/', (req, res) => res.render('college-dashboard'));
app.get('/news', (req, res) => res.render('news'));
app.get('/facilities', (req, res) => res.render('facilities'));
app.get('/about', (req, res) => res.render('about'));
app.get('/signup', (req, res) => res.render('register'));
app.get('/login', (req, res) => res.render('login'));

// 🔒 Protected Routes (Require Authentication)
app.get('/college-home', authenticateToken, (req, res) => {
    res.render('college_home', { user: req.user });
});

app.get('/admissionForm', authenticateToken, (req, res) => {
    res.render('admissionForm', { user: req.user });
});

app.get('/student-home', authenticateToken, (req, res) => {
    res.render('studentDashboard', { user: req.user });
});

// 🆕 404 Handler - Handles unmatched routes
app.use((req, res) => {
    res.status(404).json({ error: 'Route Not Found' });
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Global Error:', err);
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
