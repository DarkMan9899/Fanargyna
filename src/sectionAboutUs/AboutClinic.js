import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/styleAboutUs/AboutClinic.module.scss";

const AboutClinic = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.clinic}>
            <div className="container">
                <h2>{t("about_clinic.title")}</h2>
                <p>{t("about_clinic.desc")}</p>
            </div>
        </section>
    );
};

export default AboutClinic;
