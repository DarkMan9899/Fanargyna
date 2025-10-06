import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import heroData from "../data/hero.json";

import hero1 from "../Img/Subtract.png";
import hero2 from "../Img/Subtract.png";

const images = { hero1, hero2 };

export default function HeroSection() {
    const { t } = useTranslation();
    const [index, setIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setIndex((prev) => (prev + 1) % heroData.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const slide = heroData[index];

    return (
        <section className="hero">
            <div className="hero__content">
                <h1>{t(slide.titleKey)}</h1>
                <p className="subtitle">{t(slide.subtitleKey)}</p>
                <p>{t(slide.textKey)}</p>

                <button className="btn btn--read-more">
                    {t("hero.hero_cta")} <span className="btn__icon">→</span>
                </button>
            </div>

            <div className="hero__image">
                <img src={images[slide.image]} alt={t(slide.titleKey)} />
                <button
                    className="btn btn--outline hero__arrow"
                    onClick={() => setIndex((index + 1) % heroData.length)}
                >
                    →
                </button>
            </div>
        </section>
    );
}
