import { useEffect, useState } from "react";
import style from "../css/Container.module.css";
import { getUrlFlag } from "../utils.js";
import LeagueService from "../services/LeagueService.js";
import moment from "moment";

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
        }
    }, []);

    if (error) {
        return <p className={style.error}>{error}</p>;
    }

    return (
        <section className={style.container}>
            <h1 className={style.heading}>League Schedule</h1>
            <table className={style.tableSchedule}>
                <thead>
                    <tr>
                        <th className={style.dateTime}>Date/Time</th>
                        <th className={style.stadium}>Stadium</th>
                        <th className={style.headHomeTeam}>Home Team</th>
                        <th></th>
                        <th className={style.headAwayTeam}>Away Team</th>
                    </tr>
                </thead>
                <tbody>
                    {loading && (
                        <tr>
                            <td colSpan={5}>
                                <div className={style.loading}><div></div><div></div><div></div><div></div></div>
                            </td>
                        </tr>
                    )}
                    {matches && matches.map((m) => (
                        <tr key={m.homeTeam + '_' + m.awayTeam}>
                            <td className={style.dateTime}><span>{moment(m.matchDate).add(5, 'hours').format("D.M.YYYY")}<br />{moment(m.matchDate).add(5, 'hours').format("hh:mm")}</span></td>
                            <td className={style.stadium}>{m.stadium}</td>
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
