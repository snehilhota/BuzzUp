const admin = require('../firebase');

module.exports = async (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split('Bearer ')[1];
    try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.user = decoded;  // contains uid, email, name..
        return next();
    } catch (err) {
        console.log(err);
        return res.status(401).json({ message: 'Invalid/Expired token' });
    }
};
