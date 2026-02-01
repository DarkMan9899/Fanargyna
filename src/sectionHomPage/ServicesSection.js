import React, { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

import servicesHy from "../data/services.hy.json";
import { serviceImages } from "../data/serviceImages";

export default function ServicesSection() {
    const { lang } = useParams();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [index, setIndex] = useState(0);
    const [visibleCount, setVisibleCount] = useState(3);
    const [paused, setPaused] = useState(false);

    // animation
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState("next"); // next | prev

    /* =========================
       RESPONSIVE
    ========================= */
    useEffect(() => {
        const update = () => {
            if (window.innerWidth <= 768) setVisibleCount(1);
            else if (window.innerWidth <= 992) setVisibleCount(2);
            else setVisibleCount(3);
        };
        update();
        window.addEventListener("resize", update);
        return () => window.removeEventListener("resize", update);
    }, []);

    /* =========================
       DATA
    ========================= */
    const data = useMemo(() => {
        try {
            return require(`../data/services.${lang}.json`).tabs || [];
        } catch {
            return servicesHy.tabs || [];
        }
    }, [lang]);

    const total = data.length;

    /* =========================
       AUTOPLAY — TRUE LOOP
    ========================= */
    useEffect(() => {
        if (paused || total <= visibleCount) return;

        const timer = setInterval(() => {
            handleNext();
        }, 5000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paused, total, visibleCount]);

    /* =========================
       CONTROLS
    ========================= */
    const handleNext = () => {
        if (animating) return;
        setDirection("next");
        setAnimating(true);

        setTimeout(() => {
            setIndex((prev) => (prev + 1) % total);
            setAnimating(false);
        }, 420);
    };

    const handlePrev = () => {
        if (animating) return;
        setDirection("prev");
        setAnimating(true);

        setTimeout(() => {
            setIndex((prev) => (prev - 1 + total) % total);
            setAnimating(false);
        }, 420);
    };

    /* =========================
       WINDOW (CIRCULAR)
    ========================= */
    const visibleItems = Array.from({ length: visibleCount }).map(
        (_, i) => data[(index + i) % total]
    );

    const goToService = (id) => {
        navigate(`/${lang}/services?tab=${id}`);
    };

    if (!total) return null;

    return (
        <section className="services">
            <div className="services__header">
                <h2 className="services__title">
                    {t("services_section.title")}
                </h2>
            </div>

            <div
                className="services__frame"
                onMouseEnter={() => setPaused(true)}
                onMouseLeave={() => setPaused(false)}
            >
                <button
                    className="services__arrow services__arrow--left"
                    onClick={handlePrev}
                >
                    ‹
                </button>

                <div className="services__container">
                    <div
                        className={`services__track--simple ${
                            animating ? `is-animating ${direction}` : ""
                        }`}
                    >
                        {visibleItems.map((service) => (
                            <div className="card" key={service.id}>
                                <div className="card__badge">
                                    <img
                                        src={serviceImages[service.id]?.icon}
                                        alt={service.title}
                                    />
                                </div>

                                <h3>{service.title}</h3>
                                <p>{service.content?.[0]?.text?.[0] || ""}</p>

                                <button
                                    className="btn btn--read-more btn--with-icon"
                                    onClick={() => goToService(service.id)}
                                >
                                    {t("services_section.readMore")}
                                    <span className="btn__icon">
                    <FontAwesomeIcon icon={faArrowRightLong} />
                  </span>
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <button
                    className="services__arrow services__arrow--right"
                    onClick={handleNext}
                >
                    ›
                </button>
            </div>
        </section>
    );
}
