const express = require('express');

const router = express.Router();

const CLIENT_ID = '518658428495855627'
const CLIENT_SECRET = '3D4Q_IWOOfh8jDJT6jDLOJDPb0Myn3_T'
const redirect = encodeURIComponent('http://genbot.ml/api/discord/callback');

router.get('/login', (req, res) => {
  res.redirect(`https://discordapp.com/oauth2/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirect}&response_type=code&scope=identify%20email%20guilds%20guilds.join%20connections%20messages.read`);
});


const fetch = require('node-fetch');
const btoa = require('btoa');
const { catchAsync } = require('../utils');

router.get('/callback', catchAsync(async (req, res) => {
  if (!req.query.code) throw new Error('NoCodeProvided');
  const code = req.query.code;
  const creds = btoa(`${CLIENT_ID}:${CLIENT_SECRET}`);
  const response = await fetch(`https://discordapp.com/api/oauth2/token?grant_type=authorization_code&code=${code}&redirect_uri=${redirect}`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${creds}`,
      },
    });
  console.log(`${code}`)
  const json = await response.json();
  res.redirect(`/?token=${json.access_token}`);
}));

module.exports = router;