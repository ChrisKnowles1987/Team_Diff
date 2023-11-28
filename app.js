const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

const api_key = process.env.API_KEY;
const headers = {
    "User-Agent": "Your User Agent",
    "Accept-Language": "en-US,en;q=0.9",
    "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
    "Origin": "https://developer.riotgames.com",
    "X-Riot-Token": api_key
};

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

app.post('/get-summoner-info', async (req, res) => {
    const name = req.body.name;
    const api_SUMMONER_v4 = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';

    try {
        const response = await axios.get(`${api_SUMMONER_v4}${name}`, { headers: headers });
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
