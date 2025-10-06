import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import "../styles/navbar.scss";
import  logo from "../Logo.png"


export default function Navbar() {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { lang } = useParams();

    const changeLang = (newLang) => {
        i18n.changeLanguage(newLang);
        navigate(window.location.pathname.replace(`/${lang}`, `/${newLang}`));
    };

    return (
        <header className="navbar">
            {/* Վերին շերտ - լեզուներ */}
            <div className="navbar__top">
                <div className="navbar__lang">
                    <button onClick={() => changeLang("hy")}>Հայերեն</button> /{" "}
                    <button onClick={() => changeLang("en")}>English</button> /{" "}
                    <button onClick={() => changeLang("ru")}>Русский</button>
                </div>
            </div>

            <div className="navbar__bottom">
                <div className="navbar__container">
                    {/* Logo */}
                    <div className="navbar__logo">
                        <img src={logo} alt="Fanarjyan Clinic Logo" />
                    </div>

                    {/* Menu */}
                    <nav className={`navbar__menu ${isOpen ? "open" : ""}`}>
                        <Link to={`/${lang}/`} onClick={() => setIsOpen(false)}>{t("home")}</Link>
                        <Link to={`/${lang}/about`} onClick={() => setIsOpen(false)}>{t("about")}</Link>
                        <Link to={`/${lang}/services`} onClick={() => setIsOpen(false)}>{t("services")}</Link>
                        <Link to={`/${lang}/pricelist`} onClick={() => setIsOpen(false)}>{t("pricelist")}</Link>
                        <Link to={`/${lang}/blog`} onClick={() => setIsOpen(false)}>{t("blog")}</Link>
                        <Link to={`/${lang}/contact`} onClick={() => setIsOpen(false)}>{t("contact")}</Link>
                    </nav>

                    {/* Phone Button */}
                    <a href="tel:+37494529006" className="navbar__phone">
                        <span className="icon">📞</span> +374 (94) 529 - 006
                    </a>

                    {/* Mobile Hamburger */}
                    <button
                        className={`hamburger ${isOpen ? "active" : ""}`}
                        onClick={() => setIsOpen(!isOpen)}
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
