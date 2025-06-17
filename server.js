require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const Route = require('./routes.js');
app.use(express.json()); //middleware

const posts = [
    {
        username: 'admin',
        title: 'Post 1',
    },
    {
        username: 'uche',
        title: 'Post 2',
    },
];

app.get('/posts', authenticateToken, (req, res) => {
    res.json(posts.filter(post => post.username === req.user.name),);
});


/// middleware function

function authenticateToken(req, res, next) {
    const autHeader = req.headers['authorization'];
    const token = autHeader && autHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

app.listen(3000);