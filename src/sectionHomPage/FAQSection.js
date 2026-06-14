import React, { useState } from "react";
import styles from "../styles/styleHomePage/faq.module.scss";
import { useTranslation } from "react-i18next";
import faqDataHy from "../data/faq.hy.json";
import faqDataRu from "../data/faq.ru.json";
import faqDataEn from "../data/faq.en.json";

const FAQ = () => {
    const { i18n, t } = useTranslation();

    // ⬇️ պահում ենք բացված հարցերի ինդեքսների array
    const [openIndexes, setOpenIndexes] = useState([]);

    const lang = i18n.language;

    const faqData =
        lang === "hy" ? faqDataHy : lang === "ru" ? faqDataRu : faqDataEn;

    const toggleItem = (index) => {
        setOpenIndexes((prev) =>
            prev.includes(index)
                ? prev.filter((i) => i !== index) // փակել
                : [...prev, index]               // բացել
        );
    };

    return (
        <section className={styles.faqSection}>
            <div className="container">
                <h2 className={styles.title}>{t("faq_title")}</h2>

                <div className={styles.accordion}>
                    {faqData.map((item, index) => {
                        const isOpen = openIndexes.includes(index);

                        return (
                            <div key={index} className={styles.item}>
                                <button
                                    className={styles.question}
                                    onClick={() => toggleItem(index)}
                                >

                                    {item.question}
                                    <span
                                        className={`${styles.icon} ${
                                            isOpen ? styles.open : ""
                                        }`}
                                    >
                                        ▼
                                    </span>
                                </button>

                                {isOpen && (
                                    <div className={`${styles.answer} ${styles.textWithBreaks}`}>
                                        {item.answer}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
};

export default FAQ;
