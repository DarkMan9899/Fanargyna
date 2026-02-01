import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import "../styles/styleHomePage/navbar.scss";
import logo from "../Img/Fanarjyan-logo-blue.png";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { lang } = useParams();

    const changeLang = (newLang) => {
        i18n.changeLanguage(newLang);
        navigate(window.location.pathname.replace(`/${lang}`, `/${newLang}`));
    };

    // 🔹 Detect scroll
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 60);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <header className={`navbar ${scrolled ? "scrolled" : ""}`}>

            {/* 🔹 Language selector */}
            <div className="navbar__top">
                <div className="navbar__lang">
                    <button onClick={() => changeLang("hy")}>Հայերեն</button> /{" "}
                    <button onClick={() => changeLang("en")}>English</button> /{" "}
                    <button onClick={() => changeLang("ru")}>Русский</button>
                </div>
            </div>

            <div className="navbar__bottom">
                <div className="navbar__container">

                    {/* 🔹 Logo */}
                    <div className="navbar__logo">
                        <NavLink to={`/${lang}/`}>
                            <img src={logo} alt="Fanarjyan Clinic Logo" />
                        </NavLink>
                    </div>

                    {/* 🔹 Menu */}
                    <nav className={`navbar__menu ${isOpen ? "open" : ""}`}>
                        <NavLink to={`/${lang}/`} end onClick={() => setIsOpen(false)}>
                            {t("home")}
                        </NavLink>
                        <NavLink to={`/${lang}/about`} onClick={() => setIsOpen(false)}>
                            {t("about")}
                        </NavLink>
                        <NavLink to={`/${lang}/services`} onClick={() => setIsOpen(false)}>
                            {t("services")}
                        </NavLink>
                        <NavLink to={`/${lang}/prices`} onClick={() => setIsOpen(false)}>
                            {t("pricelist")}
                        </NavLink>
                        <NavLink to={`/${lang}/blog`} onClick={() => setIsOpen(false)}>
                            {t("blog")}
                        </NavLink>
                        <NavLink to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>
                            {t("contact")}
                        </NavLink>

                        {/* 📱 Mobile phone inside menu */}
                        <a href="tel:+37494529006" className="navbar__phone--mobile">
                            <FontAwesomeIcon icon={faPhone} />
                            +374 10 52 90 06
                        </a>
                    </nav>

                    {/* 🖥 Desktop phone */}
                    <a href="tel:+37494529006" className="navbar__phone--desktop">
                        <FontAwesomeIcon icon={faPhone} />
                        +374 (94) 529 - 006
                    </a>

                    {/* 🔹 Hamburger */}
                    <button
                        className={`hamburger ${isOpen ? "active" : ""}`}
                        onClick={() => setIsOpen(!isOpen)}
                        aria-label="Menu toggle"
                    >
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>

                </div>
            </div>
        </header>
    );
}
