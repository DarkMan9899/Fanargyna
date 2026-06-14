import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/styleAboutUs/AboutDoctor.module.scss";
import doctorImg from "../Img/Davit.png"; // փոխիր քո նկարը

const AboutDoctor = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.doctor}>
            <div className={styles.container}>
                <div className={styles.imageWrapper}>
                    <img src={doctorImg} alt="Dr. Fanarjyan" loading="lazy" />
                </div>
                <div className={styles.textWrapper}>
                    <h3>{t("about_doctor.title")}</h3>
                    <p>{t("about_doctor.desc")}</p>
                </div>
            </div>
        </section>
    );
};

export default AboutDoctor;
