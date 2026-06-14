import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
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

/* ─── AnimatedCounter ─────────────────────────────────────────────────────── */
const AnimatedCounter = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        const end = Number(target);
        if (!end) return;
        const DURATION = 1500;
        const FRAMES   = 60;
        const increment = Math.ceil(end / FRAMES);
        const interval  = Math.floor(DURATION / FRAMES);
        let current = 0;
        const timer = setInterval(() => {
            current = Math.min(current + increment, end);
            setCount(current);
            if (current >= end) clearInterval(timer);
        }, interval);
        return () => clearInterval(timer);
    }, [target]);

    return <span>{count.toLocaleString()}+</span>;
};

/* ─── ResultsSection ──────────────────────────────────────────────────────── */
export default function ResultsSection() {
    const { t } = useTranslation();

    // ── ALL hooks first, no early returns before this block ─────────────────
    const total = resultsData.length;

    const [index,      setIndex]      = useState(0);
    const [visible,    setVisible]    = useState(3);
    const [paused,     setPaused]     = useState(false);
    const [openModal,  setOpenModal]  = useState(null);
    const [animating,  setAnimating]  = useState(false);
    const [direction,  setDirection]  = useState("next");
    const [touchStart, setTouchStart] = useState(null);
    const [touchEnd,   setTouchEnd]   = useState(null);
    const isAnimatingRef = useRef(false);

    // Responsive visible count
    useEffect(() => {
        const update = () => {
            if      (window.innerWidth <= 576)  setVisible(1);
            else if (window.innerWidth <= 1024) setVisible(2);
            else                                setVisible(3);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    const handleNext = useCallback(() => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        setDirection("next");
        setAnimating(true);
        setTimeout(() => {
            setIndex((i) => (i + 1) % total);
            setAnimating(false);
            isAnimatingRef.current = false;
        }, 350);
    }, [total]);

    const handlePrev = useCallback(() => {
        if (isAnimatingRef.current) return;
        isAnimatingRef.current = true;
        setDirection("prev");
        setAnimating(true);
        setTimeout(() => {
            setIndex((i) => (i - 1 + total) % total);
            setAnimating(false);
            isAnimatingRef.current = false;
        }, 350);
    }, [total]);

    // Autoplay
    useEffect(() => {
        if (paused || total <= visible) return;
        const timer = setInterval(handleNext, 5000);
        return () => clearInterval(timer);
    }, [paused, total, visible, handleNext]);

    // ESC key + scroll lock for modal
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") setOpenModal(null); };
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

    const visibleItems = useMemo(
        () => Array.from({ length: visible }).map((_, i) => resultsData[(index + i) % total]),
        [index, visible, total]
    );
    // ── Guard after all hooks ────────────────────────────────────────────────
    if (!total) return null;

    const minSwipeDistance = 50;
    const onTouchStart = (e) => { setTouchEnd(null); setTouchStart(e.targetTouches[0].clientX); };
    const onTouchMove  = (e) => { setTouchEnd(e.targetTouches[0].clientX); };
    const onTouchEnd   = () => {
        if (touchStart === null || touchEnd === null) return;
        const dist = touchStart - touchEnd;
        if (Math.abs(dist) >= minSwipeDistance) { dist > 0 ? handleNext() : handlePrev(); }
        setTouchStart(null);
        setTouchEnd(null);
    };

    return (
        <section className="results">
            <h2 className="results__title">{t("results_section.title")}</h2>

            <div className="results__stats">
                {["story", "clients", "results", "awards"].map((k) => (
                    <div key={k}>
                        <p>{t(`results_section.stats.${k}`)}</p>
                        <h3><AnimatedCounter target={resultsData[0].stats[k]} /></h3>
                    </div>
                ))}
            </div>

            <h2 className="results__subtitle">{t("results_section.subtitle")}</h2>

            <div
                className="results__frame"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <button className="results__arrow left" onClick={handlePrev} aria-label="Previous">‹</button>

                <div
                    className="results__slider"
                    onTouchStart={onTouchStart}
                    onTouchMove={onTouchMove}
                    onTouchEnd={onTouchEnd}
                >
                    <div className={`results__track--simple ${animating ? `is-animating ${direction}` : ""}`}>
                        {visibleItems.map((item) => (
                            <div className="result-card" key={item.id}>
                                <img
                                    src={imageMap[item.image]}
                                    alt={t(`results_section.stories.${item.id}.title`)}
                                    className="result-card__img"
                                    loading="lazy"
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

                <button className="results__arrow right" onClick={handleNext} aria-label="Next">›</button>
            </div>

            {openModal && (
                <div className="modalOverlay" onClick={() => setOpenModal(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modalHeader">
                            <h3>{t(`results_section.stories.${openModal}.title`)}</h3>
                            <button className="modalClose" onClick={() => setOpenModal(null)} aria-label="Close">×</button>
                        </div>
                        <div className="modalBody">
                            <Trans
                                i18nKey={`results_section.stories.${openModal}.modalText`}
                                components={{ i: <i />, b: <strong /> }}
                            />
                        </div>
                        <div className="modalFooter">
                            <button className="btn btn--primary" onClick={() => setOpenModal(null)}>
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}
