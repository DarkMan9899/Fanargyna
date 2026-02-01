import React from "react";
import  logo from "../Img/Fanarjyan-logo-blue.png"
import "../styles/footer.scss";
import { useTranslation } from "react-i18next";

export default function Footer() {
    const { t } = useTranslation();

    return (
        <footer className="footer">
            <hr className="footer__divider" />

            <div className="footer__content">
                <div className="footer__logo">
                    <img src={logo} alt="Fanarjyan Clinic" />
                </div>

                <div className="footer__text">
                    <span>© 2026 Ֆանարջյան</span>
                    <span>|</span>
                    <span>{t("footer.rights")}</span>

                </div>
            </div>
        </footer>
    );
}
