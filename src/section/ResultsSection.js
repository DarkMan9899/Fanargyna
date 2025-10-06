import React, { useEffect, useState } from "react";
import resultsData from "../data/results.json";
import Subtract from "../Img/Subtract.png";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";

const imageMap = {
    subtract: Subtract
};

// 🔢 Հաշվիչը՝ 0-ից մինչև արժեքը
const AnimatedCounter = ({ target }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let start = 0;
        const end = parseInt(target);
        if (start === end) return;

        let duration = 1500;
        let incrementTime = Math.floor(duration / end);

        const timer = setInterval(() => {
            start += 1;
            setCount(start);
            if (start === end) clearInterval(timer);
        }, incrementTime);

        return () => clearInterval(timer);
    }, [target]);

    return <span>{count}+</span>;
};

// 🪟 Modal կոմպոնենտ
const Modal = ({ onClose, title, text }) => {
    return createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <button className="modal-close" onClick={onClose}>×</button>
                <h2>{title}</h2>
                <p>{text}</p>
            </div>
        </div>,
        document.body
    );
};

// 🧩 Results Section
export default function ResultsSection() {
    const { t } = useTranslation();
    const [openModal, setOpenModal] = useState(null);

    return (
        <section className="results">
            <h2 className="results__title">{t("results_section.title")}</h2>

            {/* Վերևի թվային ինֆո */}
            <div className="results__stats">
                {["story", "clients", "results", "awards"].map((key) => (
                    <div className="results__stat" key={key}>
                        <p>{t(`results_section.stats.${key}`)}</p>
                        <h3><AnimatedCounter target={resultsData[0].stats[key]} /></h3>
                    </div>
                ))}
            </div>

            {/* Քարտերը */}
            <div className="results__cards">
                {resultsData.map((item) => (
                    <div className="result-card" key={item.id}>
                        <img src={imageMap[item.image]} alt={item.id} />
                        <h3>{t(`results_section.stories.${item.id}.title`)}</h3>
                        <button
                            className="btn btn--read-more"
                            onClick={() => setOpenModal(item.id)}
                        >
                            {t("results_section.read_more")}
                            <span className="btn__icon">→</span>
                        </button>

                        {openModal === item.id && (
                            <Modal
                                onClose={() => setOpenModal(null)}
                                title={t(`results_section.stories.${item.id}.title`)}
                                text={t(`results_section.stories.${item.id}.modalText`)}
                            />
                        )}
                    </div>
                ))}
            </div>
        </section>
    );
}
