import React from "react";
import { useTranslation } from "react-i18next";
import "../styles/clinicSection.scss"
import clinicImg from "../Img/Subtract.png";

export default function ClinicSection() {
    const { t } = useTranslation();

    return (
        <section className="clinic-section">
            <div className="clinic-section__container">
                {/* Ձախ կողմի քարտ */}
                <div className="clinic-card">
                    <img src={clinicImg} alt={t("clinic.title")} />
                </div>

                {/* Աջ կողմի բովանդակություն */}
                <div className="clinic-content">
                    <h2 className="clinic-subtitle">{t("clinic.subtitle")}</h2>
                    <h1 className="clinic-title">{t("clinic.title")}</h1>
                    <p className="clinic-text">{t("clinic.text")}</p>

                    <button className="btn btn--read-more">
                        {t("clinic.button")}
                        <span className="btn__icon">➔</span>
                    </button>

                </div>
            </div>
        </section>
    );
}
