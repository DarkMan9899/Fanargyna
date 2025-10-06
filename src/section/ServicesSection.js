import React, { useState, useEffect } from "react";
import servicesData from "../data/tsconfig.json";
import { useTranslation } from "react-i18next";

const ServicesSection = () => {
    const { t } = useTranslation();
    const [activeIndex, setActiveIndex] = useState(0);
    const visibleCount = 3;

    // ▶️ Prev / Next ֆունկցիաներ
    const prevSlide = () => {
        setActiveIndex((prev) =>
            prev === 0 ? servicesData.length - 1 : prev - 1
        );
    };

    const nextSlide = () => {
        setActiveIndex((prev) =>
            prev === servicesData.length - 1 ? 0 : prev + 1
        );
    };

    // 🔄 Auto rotate
    useEffect(() => {
        const interval = setInterval(() => {
            setActiveIndex((prev) =>
                prev === servicesData.length - 1 ? 0 : prev + 1
            );
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    const getVisibleServices = () => {
        let result = [];
        for (let i = 0; i < visibleCount; i++) {
            result.push(servicesData[(activeIndex + i) % servicesData.length]);
        }
        return result;
    };

    return (
        <section className="services">
            <h2 className="services__title">{t("services_section.title")}</h2>
            <div className="services__wrapper">
                <div className="services__container">
                    {getVisibleServices().map((service) => (
                        <div key={service.id} className="card fade-in">
                            <div className="card__badge">
                                <img
                                    src={service.icon}
                                    alt={t(`services_section.${service.id}.title`)}
                                />
                            </div>

                            <h3>{t(`services_section.${service.id}.title`)}</h3>
                            <p>{t(`services_section.${service.id}.desc`)}</p>

                            <button className="read-more">
                                {t("services_section.readMore")}

                                <span className="read-more__icon">→</span>
                            </button>
                        </div>
                    ))}
                </div>

                {/* 🔥 Սլաքները միասին ձախ ներքևում */}
                <div className="arrows">
                    <button className="arrow left" onClick={prevSlide}>
                        &#8592;
                    </button>
                    <button className="arrow right" onClick={nextSlide}>
                        &#8594;
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ServicesSection;
