import React, { useEffect, useState } from "react";
import styles from "../../styles/stylePricePage/prices.module.scss";

export function AccordionGroup({ sections, autoOpen = false }) {
    const [openIds, setOpenIds] = useState([]);

    // 🔓 Auto-open ALL sections when search is active
    useEffect(() => {
        if (autoOpen && sections?.length) {
            setOpenIds(sections.map((s) => s.id));
        }
    }, [autoOpen, sections]);

    if (!sections || sections.length === 0) return null;

    const toggle = (id) => {
        setOpenIds((prev) =>
            prev.includes(id)
                ? prev.filter((x) => x !== id)
                : [...prev, id]
        );
    };

    return (
        <div className={styles.accordionGroup}>
            {sections.map((section) => {
                const isOpen = openIds.includes(section.id);

                return (
                    <div
                        key={section.id}
                        className={`${styles.accordionItem} ${
                            isOpen ? styles.accordionItemOpen : ""
                        }`}
                    >
                        <button
                            type="button"
                            className={styles.accordionHeader}
                            onClick={() => toggle(section.id)}
                        >
                            <span className={styles.accordionTitle}>
                                {section.title}
                            </span>
                            <span
                                className={`${styles.accordionIcon} ${
                                    isOpen ? styles.accordionIconOpen : ""
                                }`}
                            >
                                ▾
                            </span>
                        </button>

                        {isOpen && (
                            <div className={styles.accordionBody}>
                                {section.items?.map((item, index) => (
                                    <div key={index} className={styles.serviceRow}>
                                        <div className={styles.serviceText}>
                                            <div className={styles.serviceName}>
                                                {item.name}
                                            </div>

                                            {item.description?.length > 0 && (
                                                <ul className={styles.serviceDescription}>
                                                    {item.description.map((line, i) => (
                                                        <li key={i}>{line}</li>
                                                    ))}
                                                </ul>
                                            )}

                                            {item.note && (
                                                <div className={styles.serviceNote}>
                                                    {item.note}
                                                </div>
                                            )}
                                        </div>

                                        <div className={styles.servicePrice}>
                                            {item.price}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
