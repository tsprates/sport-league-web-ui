import { useEffect, useState } from "react";
import { getUrlFlag } from "../utils.js";
import LeagueService from "../services/LeagueService.js";
import style from "../css/Container.module.css";

function Schedule() {
    const [leaderboard, setLeaderboard] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const leagueService = new LeagueService();

                try {
                    await leagueService.fetchData();
                    setLeaderboard(leagueService.getLeaderboard());
                } catch (error) {
                    console.error('Error fetching matches: ', error);
                    setError('Failed to load matches');
                } finally {
                    setLoading(false);
                }
            };

            fetchData();
        } catch (error) {
            console.error('Error fetching matches: ', error);
            setError('Failed to load matches');
        } finally {
            setLoading(false);
        }
    }, []);

    if (loading) {
        return <p className={style.loading}>Loading...</p>;
    }

    if (error) {
        return <p className={style.error}>{error}</p>;
    }

    return (
        <section className={style.container}>
            <h1 className={style.heading}>League Standings</h1>
            <table className={style.tableLeaderboard}>
                <thead>
                    <tr>
                        <th className={style.teamName}>Team Name</th>
                        <th>MP</th>
                        <th>GF</th>
                        <th>GA</th>
                        <th>GD</th>
                        <th>Points</th>
                    </tr>
                </thead>
                <tbody>
                    {leaderboard && leaderboard.map((t) => (
                        <tr key={t.teamName}>
                            <td>
                                <div className={style.team}>
                                    <img src={getUrlFlag(t.teamName)} alt={t.teamName} />
                                    <strong>{t.teamName}</strong>
                                </div>
                            </td>
                            <td>{t.matchesPlayed}</td>
                            <td>{t.goalsFor}</td>
                            <td>{t.goalsAgainst}</td>
                            <td>{t.goalsFor - t.goalsAgainst}</td>
                            <td><span className={style.points}>{t.points}</span></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Schedule;
