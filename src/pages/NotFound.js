import style from '../NotFound.module.css'


function NoFound() {
    return (
        <div className={style.notFound}>
            <img src="/Images/404.png" alt="" />
        </div>
    )
}

export default NoFound;
