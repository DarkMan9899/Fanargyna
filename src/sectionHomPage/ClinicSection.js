import React from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";
import "../styles/styleHomePage/clinicSection.scss";
import clinicImg from "../Img/Gemini_Generated_Image_1axy3o1axy3o1axy (2).png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

export default function ClinicSection() {
    const { t } = useTranslation();
    const { lang } = useParams();

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

                    <Link
                        to={`/${lang}/about`}
                        className="btn btn--read-more btn--with-icon"
                    >
                        {t("clinic.button")}
                        <span className="btn__icon">
    <FontAwesomeIcon icon={faArrowRightLong} />
  </span>
                    </Link>

                </div>
            </div>
        </section>
    );
}
