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

async function get_participants(summoner_matches, name) {
    try {
      let summoner_names = [];
      for (let match of summoner_matches) {
        const req_url = `${api_MATCH_v5}${match}`;
        const response = await axios.get(req_url, { headers:headers });
        const teamId = get_team_id(response.data.info.participants, name);
        summoner_names.push(get_teammates_with_matching_id(response.data.info.participants, teamId, name));
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

  async function get_winrate(participants, queue_type) {
    try {
      let winrates = {};
      for (let match of participants) {
        for (let player of match) {
          const req_url = `${api_LEAGUE_v4}${player}`;
          const response = await axios.get(req_url, { headers });
          for (let item of response.data) {
            if (item.queueType === queue_type) {
              let summonerName = item.summonerName;                 
              let wins = item.wins || 0;
              let losses = item.losses || 0;
              let total_games = wins + losses;
              if (total_games > 0) {
                let winrate = `${((wins / total_games) * 100).toFixed(1)} %`;
                winrates[summonerName] = winrate;
              } else {
                winrates[summonerName] = '0 %';  // Set winrate to 0% if no games played
              }
            }
          }
        }
      }
      return winrates;
    } catch (error) {
      console.error(error);
    }
  }
  

app.post('/get-summoner-info', async (req, res) => {
    const name = req.body.name;
    const summoner_info = await get_summoner_info(name);
    const matches = await get_matches(summoner_info);
    const teammates = await get_participants(matches, name);
    const winrates = await get_winrate(teammates, queueType ='RANKED_SOLO_5x5')
    console.log(winrates);
    res.json(winrates);
});

const port = 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
