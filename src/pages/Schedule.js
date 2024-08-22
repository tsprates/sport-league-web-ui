import { useEffect, useState } from "react";
import style from "../Container.module.css";
import moment from "moment";
import LeagueService from "../services/LeagueService.js";

function Schedule() {
    const [matches, setMatches] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const fetchData = async () => {
                const leagueService = new LeagueService();

                try {
                    await leagueService.fetchData();
                    setMatches(leagueService.getMatches());
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

    const getUrlFlag = (country) => `https://flagsapi.codeaid.io/${country}.png`;

    if (loading) {
        return <p className={style.loading}>Loading...</p>;
    }

    if (error) {
        return <p className={style.error}>{error}</p>;
    }

    return (
        <section className={style.container}>
            <h1 className={style.heading}>League Schedule</h1>
            <table className={style.tableSchedule}>
                <thead>
                    <tr>
                        <th>Date/Time</th>
                        <th>Stadium</th>
                        <th className={style.headHomeTeam}>Home Team</th>
                        <th></th>
                        <th className={style.headAwayTeam}>Away Team</th>
                    </tr>
                </thead>
                <tbody>
                    {matches && matches.map((m) => (
                        <tr key={m.homeTeam + '_' + m.awayTeam}>
                            <td>{moment(m.matchDate).add(5, 'hours').format('D.M.YYYY hh:mm')}</td>
                            <td>{m.stadium}</td>
                            <td>
                                <div className={style.homeTeam}>
                                    <strong>{m.homeTeam}</strong>
                                    <img src={getUrlFlag(m.homeTeam)} alt={m.homeTeam} />
                                </div>
                            </td>
                            <td>
                                <strong>{m.homeTeamScore} : {m.awayTeamScore}</strong>
                            </td>
                            <td>
                                <div className={style.awayTeam}>
                                    <img src={getUrlFlag(m.awayTeam)} alt={m.awayTeam} />
                                    <strong>{m.awayTeam}</strong>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

export default Schedule;
