import React, { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import features from "../data/features.json";
import fanarjian from "../Img/01.png";
import tsri from "../Img/02.png";
import xumb from "../Img/03.png";
import fan from "../Img/df.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const imageMap = { fanarjian, tsri, xumb, fan };

export default function FeaturesBlock() {
    const { t } = useTranslation();
    const { lang } = useParams();

    const [idx, setIdx] = useState(0);
    const timerRef = useRef(null);

    const startAuto = () => {
        clearInterval(timerRef.current);
        timerRef.current = setInterval(() => {
            setIdx(p => (p + 1) % features.length);
        }, 5000);
    };

    useEffect(() => {
        startAuto();
        return () => clearInterval(timerRef.current);
    }, []);

    const next = () => {
        clearInterval(timerRef.current);
        setIdx(p => (p + 1) % features.length);
        startAuto();
    };

    const prev = () => {
        clearInterval(timerRef.current);
        setIdx(p => (p - 1 + features.length) % features.length);
        startAuto();
    };

    const slide = features[idx];

    return (
        <section className="feature-block">

            <div id="features" className="feature-slider">

                <div className="feature-slider__image">
                    <img src={imageMap[slide.image]} alt={t(slide.titleKey)} />
                </div>

                <div className="feature-slider__content">

                    <div className="feature-text-wrap">
                        <h3 className="feature-title">
                            {t(slide.titleKey)}
                        </h3>

                        <p className="feature-text">
                            {t(slide.textKey)}
                        </p>
                    </div>

                    <div className="feature-nav">
                        <button onClick={prev} className="nav-btn" aria-label="Previous">←</button>
                        <button onClick={next} className="nav-btn" aria-label="Next">→</button>
                    </div>

                </div>

            </div>

            <div className="feature-cta">
                <div className="feature-cta__bg" />

                <div className="feature-cta__content">

                    <h3 className="cta-title">
                        {t("services_cta.title")}
                    </h3>

                    <Link
                        to={`/${lang}/services`}
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