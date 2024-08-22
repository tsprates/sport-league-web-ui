import { Outlet, Link } from "react-router-dom";
import style from "../App.module.css";

const Layout = () => {
  return (
    <>
      <nav className={style.header}>
        <span className={style.logo}><img src="/Images/logo.svg" alt="League Web UI" width={110} /></span>
        <ul>
          <li>
            <Link to="/schedule"><img src="/Images/schedule.png" alt="Schedule" height={25} /> <span>Schedule</span></Link>
          </li>
          <li>
            <Link to="/leaderboard"><img src="/Images/leaderboard.png" alt="Leaderboard" height={25} /> <span>Leaderboard</span></Link>
          </li>
        </ul>
      </nav>

      <Outlet />

      <footer className={style.footer}><span>API version: 1.0</span></footer>
    </>
  )
};

export default Layout;