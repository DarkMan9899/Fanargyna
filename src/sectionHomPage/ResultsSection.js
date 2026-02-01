import React, { useEffect, useMemo, useState } from "react";
import { useTranslation, Trans } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

import resultsData from "../data/results.json";
import Pat1 from "../Img/pat/Պատմություն 1.JPG";
import Pat2 from "../Img/pat/Պատմություն 2.jpg";
import Pat3 from "../Img/pat/Պատմություն 3.jpg";
import Pat4 from "../Img/pat/Պատմություն 4.jpg";
import Pat5 from "../Img/pat/Պատմություն 5.jpg";
import Pat6 from "../Img/pat/Պատմություն 6.jpg";

const imageMap = { Pat1, Pat2, Pat3, Pat4, Pat5, Pat6 };

/* =========================
   COUNTER
========================= */
const AnimatedCounter = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = Number(target);
        if (!end) return;

        const step = Math.max(1, Math.floor(1500 / end));

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, step);

        return () => clearInterval(timer);
    }, [target]);

    return <span>{count}+</span>;
};

/* =========================
   MAIN
========================= */
export default function ResultsSection() {
    const { t } = useTranslation();

    const [index, setIndex] = useState(0);
    const [visible, setVisible] = useState(3);
    const [paused, setPaused] = useState(false);
    const [openModal, setOpenModal] = useState(null);

    // animation
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState("next");

    const total = resultsData.length;

    /* =========================
       RESPONSIVE
    ========================= */
    useEffect(() => {
        const update = () => {
            if (window.innerWidth <= 576) setVisible(1);
            else if (window.innerWidth <= 1024) setVisible(2);
            else setVisible(3);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    /* =========================
       AUTOPLAY — TRUE LOOP
    ========================= */
    useEffect(() => {
        if (paused || total <= visible) return;

        const timer = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused, total, visible]);

    /* =========================
       ESC + SCROLL LOCK (Staff-style)
    ========================= */
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setOpenModal(null);
        };

        if (openModal) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [openModal]);

    /* =========================
       CONTROLS
    ========================= */
    const handleNext = () => {
        if (animating) return;
        setDirection("next");
        setAnimating(true);

        setTimeout(() => {
            setIndex((i) => (i + 1) % total);
            setAnimating(false);
        }, 350);
    };

    const handlePrev = () => {
        if (animating) return;
        setDirection("prev");
        setAnimating(true);

        setTimeout(() => {
            setIndex((i) => (i - 1 + total) % total);
            setAnimating(false);
        }, 350);
    };

    /* =========================
       CIRCULAR WINDOW
    ========================= */
    const visibleItems = useMemo(
        () =>
            Array.from({ length: visible }).map(
                (_, i) => resultsData[(index + i) % total]
            ),
        [index, visible, total]
    );

    return (
        <section className="results">
            <h2 className="results__title">{t("results_section.title")}</h2>

            {/* STATS */}
            <div className="results__stats">
                {["story", "clients", "results", "awards"].map((k) => (
                    <div key={k}>
                        <p>{t(`results_section.stats.${k}`)}</p>
                        <h3>
                            <AnimatedCounter target={resultsData[0].stats[k]} />
                        </h3>
                    </div>
                ))}
            </div>

            <h3 className="results__subtitle">
                {t("results_section.subtitle")}
            </h3>

            {/* SLIDER */}
            <div
                className="results__frame"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <button className="results__arrow left" onClick={handlePrev}>
                    ‹
                </button>

                <div className="results__slider">
                    <div
                        className={`results__track--simple ${
                            animating ? `is-animating ${direction}` : ""
                        }`}
                    >
                        {visibleItems.map((item) => (
                            <div className="result-card" key={item.id}>
                                <img
                                    src={imageMap[item.image]}
                                    alt=""
                                    className="result-card__img"
                                />

                                <h4>{t(`results_section.stories.${item.id}.title`)}</h4>

                                <button
                                    className="btn btn--read-more btn--with-icon"
                                    onClick={() => setOpenModal(item.id)}
                                >
                                    {t("results_section.read_more")}
                                    <span className="btn__icon">
                    <FontAwesomeIcon icon={faArrowRightLong} />
                  </span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button className="results__arrow right" onClick={handleNext}>
                    ›
                </button>
            </div>

            {/* =========================
         MODAL — INLINE (STAFF STYLE)
      ========================= */}
            {openModal && (
                <div
                    className="modalOverlay"
                    onClick={() => setOpenModal(null)}
                >
                    <div
                        className="modal"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="modalHeader">
                            <h3>
                                {t(`results_section.stories.${openModal}.title`)}
                            </h3>

                            <button
                                className="modalClose"
                                onClick={() => setOpenModal(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="modalBody">
                            <Trans
                                i18nKey={`results_section.stories.${openModal}.modalText`}
                                components={{
                                    i: <i />,
                                    b: <strong />
                                }}
                            >
                                <div className="text-with-breaks" />
                            </Trans>
                        </div>



                        <div className="modalFooter">
                            <button
                                className="btn btn--primary"
                                onClick={() => setOpenModal(null)}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
