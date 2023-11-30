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


const api_SUMMONER_v4 = 'https://euw1.api.riotgames.com/lol/summoner/v4/summoners/by-name/';
const api_MATCHES_v5 = 'https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/';
const api_MATCH_v5 = 'https://europe.api.riotgames.com/lol/match/v5/matches/';
const api_LEAGUE_v4= 'https://euw1.api.riotgames.com/lol/league/v4/entries/by-summoner/';

const app = express();

app.use(bodyParser.json());
app.use(express.static('public'));

async function get_summoner_info(name) {
    try {
        const response = await axios.get(`${api_SUMMONER_v4}${name}`, { headers: headers });
        return response.data;
    } catch (error) {
        console.error(error);
    }
}
async function get_matches(summoner_info) {
    try {
      const summoner_matches_url = `${api_MATCHES_v5}${summoner_info.puuid}/ids?type=ranked&start=0&count=20`;
      const response = await axios.get(summoner_matches_url, { headers:headers });
      return response.data;
    } catch (error) {
      console.error(error);
    }
  }

async function get_participants(summoner_matches) {
    try {
      let summoner_names = [];
      for (let match of summoner_matches) {
        const req_url = `${api_MATCH_v5}${match}`;
        const response = await axios.get(req_url, { headers:headers });
        const teamId = get_team_id(response.data.info.participants);
        summoner_names.push(get_teammates_with_matching_id(response.data.info.participants, teamId));
      }
      return summoner_names;
    } catch (error) {
      console.error(error);
    }
  }
function get_team_id(participants, name) {
    for (let participant of participants) {
      if (participant.summonerName === name) {
        return participant.teamId;
      }
    }
  }
function get_teammates_with_matching_id(participants, teamId, name) {
    let team_array = [];
    for (let participant of participants) {
      if (participant.teamId === teamId && participant.summonerName !== name) {
        team_array.push(participant.summonerId);
      }
    }
    return team_array;
  }

app.post('/get-summoner-info', async (req, res) => {
    const name = req.body.name;
    get_summoner_info(name).then(summoner_info=>{
        get_matches(summoner_info).then(summoner_matches=>{
            get_participants(summoner_matches).then(summoner_names =>{
                console.log(summoner_names)
            })
        });

    })
    

    // try {
    //     const response = await axios.get(`${api_SUMMONER_v4}${name}`, { headers: headers });
    //     res.json(response.data);
    // } catch (error) {
    //     res.status(500).json({ error: error.message });
    // }
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
