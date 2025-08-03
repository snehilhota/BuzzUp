if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const expressLayouts = require('express-ejs-layouts');

const dbUrl = process.env.DB_URL;

mongoose.set('strictQuery', true);
mongoose.connect(dbUrl)
const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database Connected");
})

const app = express();
app.set('query parser', 'extended');

app.use(expressLayouts);
app.set('layout', 'layout');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');

app.use((req, res, next) => {
    res.locals.user = req.user || null;  // user will be available in all EJS views
    next();
});
app.use((req, res, next) => {
    res.locals.active = req.path.split('/')[1] || 'home';
    next();
});

app.get('/', (req, res) => {
    res.render('home', { active: "home" })
})

app.get('/login', (req, res) => {
    res.render('auth/login')
})

app.get('/register', (req, res) => {
    res.render('auth/register')
})

app.get('/events', (req, res) => {
    res.render('events/index', {
        events,             // array of event objects
        search: req.query.search,
        category: req.query.category,
        active: 'events'    // for navbar highlighting
    });
})

app.post('/signup', async (req, res) => {
    const idToken = req.headers.authorization?.split('Bearer ')[1];

    if (!idToken) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        // 1. Verify Firebase ID Token
        const decodedToken = await admin.auth().verifyIdToken(idToken);
        const { uid, email } = decodedToken;

        // 2. Get name and role from request body
        const { name, role } = req.body;

        // 3. Check if user already exists
        let user = await User.findOne({ uid });

        if (!user) {
            // 4. Save new user in DB
            user = new User({
                uid,
                name,
                email,
                role: role || 'participant'
            });
            await user.save();
        }

        // 5. Respond
        res.status(201).json({ message: 'Signup successful', user });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ message: 'Server error during signup' });
    }
});


// app.use('/api/users', userRoutes);
// app.use('/api/notifications', notificationRoutes);
// app.use('/api/admin', adminRoutes);

app.listen(3000, (req, res) => {
    console.log("LISTENING ON PORT 3000");
})