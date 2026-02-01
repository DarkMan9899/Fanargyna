import React from "react";
import styles from "../../styles/stylePricePage/prices.module.scss";

export function Tabs({ categories, activeId, onChange }) {
    if (!categories || categories.length === 0) return null;

    return (
        <div className={styles.tabs}>
            {categories.map((cat) => {
                const isActive = cat.id === activeId;
                return (
                    <button
                        key={cat.id}
                        type="button"
                        className={`${styles.tabButton} ${
                            isActive ? styles.tabButtonActive : ""
                        }`}
                        onClick={() => onChange(cat.id)}
                    >
                        {cat.title}
                    </button>
                );
            })}
        </div>
    );
}
