import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import features from "../data/features.json";
import surgery from "../Img/Subtract.png"; // հիմա նույն նկարը; հետո կփոխես
import "../styles/features.scss";

const imageMap = { surgery };

export default function FeaturesBlock() {
    const { t } = useTranslation();
    const [idx, setIdx] = useState(0);

    const next = () => setIdx((p) => (p + 1) % features.length);
    const prev = () => setIdx((p) => (p - 1 + features.length) % features.length);

    // autoplay (5s)
    useEffect(() => {
        const id = setInterval(next, 5000);
        return () => clearInterval(id);
    }, []);

    const slide = features[idx];

    return (
        <section className="feature-block">
            {/* ───── Top: slider 600×560 left image + right content ───── */}
            <div className="feature-slider">
                <div className="feature-slider__image">
                    <img src={imageMap[slide.image]} alt={slide.id} />
                    <div className="feature-slider__overlay">
                        <div className="clinic-mark">
                            <span className="clinic-mark__title">FANARJYAN</span>
                            <span className="clinic-mark__subtitle">CLINIC</span>
                        </div>
                        <div className="overlay-caption">
                            <div className="line">ՖԱՆԱՐՋՅԱՆ ԿԼԻՆԻԿԱ</div>
                            <div className="line">ՁԵԶ ՀԵՏ ԱՄԵՆԱԴԺՎԱՐ ՊԱՀԵՐԻՆ</div>
                        </div>
                    </div>
                </div>

                <div className="feature-slider__content">
                    <h3 className="feature-title">{t(slide.titleKey)}</h3>
                    <p className="feature-text">{t(slide.textKey)}</p>

                    <div className="feature-nav">
                        <button aria-label="Previous" onClick={prev} className="nav-btn">←</button>
                        <button aria-label="Next" onClick={next} className="nav-btn">→</button>
                    </div>
                </div>
            </div>

            {/* ───── Bottom: CTA banner 1600×230 background ───── */}
            <div className="feature-cta">
                <div className="feature-cta__bg" />
                <div className="feature-cta__content">
                    <h3 className="cta-title">{t("services_cta.title")}</h3>
                    <button className="btn btn--read-more">
                        {t("results_section.read_more")}
                        <span className="btn__icon">→</span>
                    </button>
                </div>
            </div>
        </section>
    );
}
