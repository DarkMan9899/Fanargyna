import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/styleAboutUs/AboutHero.module.scss";
import heroImg from "../Img/shutterstock_2206007663 (1).png"; // փոխիր քո նկարի path-ը

const AboutHero = () => {
    const { t } = useTranslation();

    return (
        <section className={styles.hero}>
            <img src={heroImg} alt="Fanarjyan Clinic" className={styles.heroImg} />
            <div className={styles.overlay}></div>
            <div className={styles.content}>
                <h1>{t("about_hero.title")}</h1>
            </div>
        </section>
    );
};

export default AboutHero;
