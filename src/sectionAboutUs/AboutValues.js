import React from "react";
import { useTranslation } from "react-i18next";
import styles from "../styles/styleAboutUs/AboutValues.module.scss";

import icon1 from "../Img/icon/vision.png";
import icon2 from "../Img/icon/mission.png";
import icon3 from "../Img/icon/values.png";

const AboutValues = () => {
    const { t } = useTranslation();

    const cards = [
        {
            icon: icon1,
            title: t("about_values.vision.title"),
            desc: t("about_values.vision.desc"),
        },
        {
            icon: icon2,
            title: t("about_values.mission.title"),
            desc: t("about_values.mission.desc"),
        },
        {
            icon: icon3,
            title: t("about_values.values.title"),
            desc: t("about_values.values.desc"),
        },
    ];

    return (
        <section className={styles.values}>
            <div className="container">
                <div className={styles.grid}>
                    {cards.map((item, index) => (
                        <div key={index} className={styles.card}>
                            <div className={styles.icon}>
                                <img src={item.icon} alt={item.title} loading="lazy" />
                            </div>

                            <h3>{item.title}</h3>
                            <p>{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default AboutValues;
