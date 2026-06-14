import React from "react";
import styles from "../../styles/stylePricePage/prices.module.scss";

export function SearchBox({ value, onChange, placeholder }) {
    return (
        <div className={styles.searchBox}>
            <input
                type="search"
                className={styles.searchInput}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />

        </div>
    );
}
