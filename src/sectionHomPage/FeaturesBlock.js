import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import features from "../data/features.json";
import fanarjian from "../Img/01.png";
import tsri from "../Img/02.png";
import xumb from "../Img/03.png";
import fan from "../Img/df.png"


import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const imageMap = { fanarjian, tsri, xumb,fan };

export default function FeaturesBlock() {
    const { t } = useTranslation();
    const { lang } = useParams(); // ✅ hook-ը ճիշտ տեղում
    const [idx, setIdx] = useState(0);

    const next = () => setIdx((p) => (p + 1) % features.length);
    const prev = () => setIdx((p) => (p - 1 + features.length) % features.length);

    /* autoplay */
    useEffect(() => {
        const id = setInterval(next, 5000);
        return () => clearInterval(id);
    }, []);

    const slide = features[idx];

    return (
        <section className="feature-block">
            {/* ───── TOP SLIDER ───── */}
            <div className="feature-slider">
                <div className="feature-slider__image">
                    <img src={imageMap[slide.image]} alt={slide.id} />
                </div>

                <div className="feature-slider__content">
                    <h3 className="feature-title">{t(slide.titleKey)}</h3>
                    <p className="feature-text">{t(slide.textKey)}</p>

                    <div className="feature-nav">
                        <button
                            aria-label="Previous"
                            onClick={prev}
                            className="nav-btn"
                        >
                            ←
                        </button>
                        <button
                            aria-label="Next"
                            onClick={next}
                            className="nav-btn"
                        >
                            →
                        </button>
                    </div>
                </div>
            </div>

            {/* ───── CTA BANNER ───── */}
            <div className="feature-cta">
                <div className="feature-cta__bg" />
                <div className="feature-cta__content">
                    <h3 className="cta-title">{t("services_cta.title")}</h3>

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
