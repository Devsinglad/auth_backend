require('dotenv').config();

const express = require('express');
const app = express();
const jwt = require('jsonwebtoken');
const Route = require('./routes.js');
app.use(express.json()); //middleware

let refreshTokens = [];
app.post(Route.getToken, (req, res) => {
    const refreshToken = req.body.token;
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        const accessToken = generateToken(user);
        res.json({accessToken: accessToken});
    });

})

app.post(Route.login, (req, res) => {
    const userName = req.body.username;
    const password = req.body.password;
    const user = {name: userName, password: password};
    const accessToken = generateToken(user);

    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
    refreshTokens.push(refreshToken);
    res.json({accessToken: accessToken, refreshToken: refreshToken, user: user});
});


/// middleware function

function generateToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '15s',});
}

app.listen(4000);