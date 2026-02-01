import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import heroData from "../data/hero.json";

import hero1 from "../Img/01.png";
import hero2 from "../Img/03.png";
import hero3 from "../Img/02.png";
import hero4 from "../Img/df.png";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightLong } from "@fortawesome/free-solid-svg-icons";

const images = { hero1, hero2, hero3, hero4 };

export default function HeroSection() {
    const { t } = useTranslation();

    const [index, setIndex] = useState(0);
    const [direction, setDirection] = useState("next");

    const timerRef = useRef(null);

    const startAutoPlay = () => {
        clearInterval(timerRef.current);

        timerRef.current = setInterval(() => {
            setDirection("next");
            setIndex((prev) => (prev + 1) % heroData.length);
        }, 7000);
    };

    useEffect(() => {
        startAutoPlay();

        return () => clearInterval(timerRef.current);
    }, []);

    const goPrev = () => {
        setDirection("prev");
        setIndex((prev) => (prev - 1 + heroData.length) % heroData.length);
        startAutoPlay();
    };

    const goNext = () => {
        setDirection("next");
        setIndex((prev) => (prev + 1) % heroData.length);
        startAutoPlay();
    };

    const slide = heroData[index];

    return (
        <section className="hero">
            <div className="hero__wrapper">
                <div className="hero__sliderCard">

                    {/* ARROWS */}
                    <button
                        className="hero__arrow hero__arrow--left"
                        onClick={goPrev}
                        aria-label="Previous slide"
                        type="button"
                    >
                        ‹
                    </button>

                    <button
                        className="hero__arrow hero__arrow--right"
                        onClick={goNext}
                        aria-label="Next slide"
                        type="button"
                    >
                        ›
                    </button>

                    {/* SLIDE */}
                    <div
                        key={index}
                        className={`hero__row hero__row--${direction}`}
                    >
                        <div className="hero__content">
                            <h1>{t(slide.titleKey)}</h1>
                            <p>{t(slide.textKey)}</p>

                            <Link
                                to="/courses"
                                className="btn btn--read-more btn--with-icon"
                            >
                                {t("hero.hero_cta")}
                                <span className="btn__icon">
                                    <FontAwesomeIcon icon={faArrowRightLong} />
                                </span>
                            </Link>
                        </div>

                        <div className="hero__image">
                            <img
                                src={images[slide.image]}
                                alt={t(slide.titleKey)}
                                loading="eager"
                            />
                        </div>
                    </div>
                </div>

                {/* DOTS */}
                <div className="hero__dots">
                    {heroData.map((_, i) => (
                        <button
                            key={i}
                            className={`hero__dot ${i === index ? "active" : ""}`}
                            onClick={() => {
                                setDirection(i > index ? "next" : "prev");
                                setIndex(i);
                                startAutoPlay();
                            }}
                            aria-label={`Go to slide ${i + 1}`}
                            type="button"
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
