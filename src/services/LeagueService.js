import axios from "axios";

/**
 * A class representing a service that processes the data for match schedule
 * and generates leaderboard.
 * 
 * NOTE: MAKE SURE TO IMPLEMENT ALL EXISITNG METHODS BELOW WITHOUT CHANGING THE INTERFACE OF THEM, 
 *       AND PLEASE DO NOT RENAME, MOVE OR DELETE THIS FILE.  
 * 
 *       ADDITIONALLY, MAKE SURE THAT ALL LIBRARIES USED IN THIS FILE FILE ARE COMPATIBLE WITH PURE JAVASCRIPT
 * 
 */
class LeagueService {

    constructor() {
        this.matches = [];
    }

    /**
     * Sets the match schedule.
     * Match schedule will be given in the following form:
     * [
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      },
     *      {
     *          matchDate: [TIMESTAMP],
     *          stadium: [STRING],
     *          homeTeam: [STRING],
     *          awayTeam: [STRING],
     *          matchPlayed: [BOOLEAN],
     *          homeTeamScore: [INTEGER],
     *          awayTeamScore: [INTEGER]
     *      }    
     * ]
     * 
     * @param {Array} matches List of matches.
     */
    setMatches(matches) {
        this.matches = matches;
    }

    /**
     * Returns the full list of matches.
     * 
     * @returns {Array} List of matches.
     */
    getMatches() {
        return this.matches;
    }

    /**
     * Returns the leaderboard in a form of a list of JSON objecs.
     * 
     * [     
     *      {
     *          teamName: [STRING],
     *          matchesPlayed: [INTEGER],
     *          goalsFor: [INTEGER],
     *          goalsAgainst: [INTEGER],
     *          points: [INTEGER]     
     *      },      
     * ]       
     * 
     * @returns {Array} List of teams representing the leaderboard.
     */
    getLeaderboard() {
        const teams = this._getTeams()

        const leaderboard = teams.reduce((acc, team) => {
            acc[team] = { teamName: team, matchesPlayed: 0, goalsFor: 0, goalsAgainst: 0, points: 0 };
            return acc;
        }, {});

        this.matches.forEach((match) => {
            if (match.matchPlayed) {
                this._updateLeaderboard(leaderboard, match.homeTeam, match.homeTeamScore, match.awayTeamScore);
                this._updateLeaderboard(leaderboard, match.awayTeam, match.awayTeamScore, match.homeTeamScore);
            }
        });

        return this._generateRanking(Object.values(leaderboard));
    }

    /**
     * Updates the team statistics.
    */
    _updateLeaderboard(leaderboard, team, goalsFor, goalsAgainst) {
        const teamStats = leaderboard[team];
        teamStats.matchesPlayed += 1;
        teamStats.goalsFor += goalsFor;
        teamStats.goalsAgainst += goalsAgainst;

        if (goalsFor > goalsAgainst) {
            teamStats.points += 3;
        } else if (goalsFor === goalsAgainst) {
            teamStats.points += 1;
        }
    }

    /**
     * Returns the list of the team names.
     * 
     * @returns {Array} List of the team names.
     */
    _getTeams() {
        const teams = [];

        for (let match of this.matches) {
            if (!teams.includes(match.homeTeam)) {
                teams.push(match.homeTeam)
            }

            if (!teams.includes(match.awayTeam)) {
                teams.push(match.awayTeam)
            }
        }

        return teams;
    }

    /**
     * Generates the ranking.
     * 
     * @returns {Array} Ranking the teams.
     */
    _generateRanking(leaderboard) {
        leaderboard.sort((a, b) => {
            const pointsDiff = b.points - a.points;

            // 1. Compare by total points
            if (pointsDiff !== 0) return pointsDiff;

            // 2. Compare by head-to-head points
            const headToHeadPointsDiff = this._getHeadToHeadPoints(b, a) - this._getHeadToHeadPoints(a, b);
            if (headToHeadPointsDiff !== 0) return headToHeadPointsDiff;

            // 3. Compare by goal difference
            const goalsDiff = (b.goalsFor - b.goalsAgainst) - (a.goalsFor - a.goalsAgainst);
            if (goalsDiff !== 0) return goalsDiff;

            // 4. Compare by goals scored
            const goalsForDiff = b.goalsFor - a.goalsFor;
            if (goalsForDiff !== 0) return goalsForDiff;

            // 5. Compare by team name alphabetically
            return a.teamName.localeCompare(b.teamName);
        });

        return leaderboard;
    }

    /**
     * Calculates the head-to-head points difference between two teams.
     * 
     * @param {object} teamA 
     * @param {object} teamB 
     * @returns {number} - The points difference between teamA and teamB in their head-to-head matches.
     */
    _getHeadToHeadPoints(teamA, teamB) {
        let points = 0;

        this.matches.forEach((match) => {
            if (match.matchPlayed) {
                if (match.homeTeam === teamA.teamName && match.awayTeam === teamB.teamName) {
                    if (match.homeTeamScore > match.awayTeamScore) {
                        points += 3;
                    } else if (match.homeTeamScore === match.awayTeamScore) {
                        points += 1;
                    }
                }

                if (match.awayTeam === teamA.teamName && match.homeTeam === teamB.teamName) {
                    if (match.awayTeamScore > match.homeTeamScore) {
                        points += 3;
                    } else if (match.awayTeamScore === match.homeTeamScore) {
                        points += 1;
                    }
                }
            }
        });

        return points;
    }

    /**
     * Asynchronic function to fetch the data from the server and set the matches.
     */
    async fetchData() {
        let accessToken = localStorage.getItem('access_token');

        if (!accessToken) {
            const tokenResponse = await axios.get('http://localhost:3001/api/v1/getAccessToken');
            accessToken = tokenResponse.data.access_token;
            localStorage.setItem('access_token', accessToken);
        }

        const response = await axios.get('http://localhost:3001/api/v1/getAllMatches', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        });

        this.setMatches(response.data.matches);
    }
}

export default LeagueService;