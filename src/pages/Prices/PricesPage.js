import React, { useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import pricesHy from "../../data/prices.hy.json";
import pricesRu from "../../data/prices.ru.json";
import pricesEn from "../../data/prices.en.json";

import { Tabs } from "./Tabs";
import { SearchBox } from "./SearchBox";
import { AccordionGroup } from "./Accordion";

import styles from "../../styles/stylePricePage/prices.module.scss";

const DATA_BY_LANG = {
    hy: pricesHy,
    ru: pricesRu,
    en: pricesEn,
};

export default function PricesPage() {
    const { lang } = useParams(); // /:lang/prices
    const { t, i18n } = useTranslation();

    const currentLang = lang || i18n.language || "hy";
    const pricesData = DATA_BY_LANG[currentLang] || DATA_BY_LANG.hy;

    const [activeCategoryId, setActiveCategoryId] = useState(
        pricesData.categories?.[0]?.id || ""
    );
    const [searchQuery, setSearchQuery] = useState("");

    const isSearching = searchQuery.trim().length > 0;
    const normalizedQuery = searchQuery.trim().toLowerCase();

    // 🔎 search across ALL categories (քո ուզածի պես)
    const filteredData = useMemo(() => {
        if (!isSearching) return pricesData;

        const filteredCategories = pricesData.categories
            .map((cat) => {
                const filteredSections = cat.sections
                    .map((section) => {
                        const filteredItems = section.items.filter((item) =>
                            item.name.toLowerCase().includes(normalizedQuery)
                        );

                        if (filteredItems.length === 0) return null;
                        return { ...section, items: filteredItems };
                    })
                    .filter(Boolean);

                if (filteredSections.length === 0) return null;
                return { ...cat, sections: filteredSections };
            })
            .filter(Boolean);

        return { ...pricesData, categories: filteredCategories };
    }, [isSearching, normalizedQuery, pricesData]);

    const categories = pricesData.categories || [];

    // եթե activeCategoryId-ը չկա (օր. լեզու փոխելիս), վերցնենք առաջինը
    const safeActiveCategoryId =
        categories.find((c) => c.id === activeCategoryId)?.id ||
        categories[0]?.id ||
        "";

    const activeCategory =
        categories.find((cat) => cat.id === safeActiveCategoryId) || null;

    return (
        <div className={styles.pricesPage}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>
                    {/* Կարող ես դնել i18n key */}
                    {t("prices.title", "Services & Prices")}
                </h1>

                {/* 🔎 Live Search */}
                <SearchBox
                    value={searchQuery}
                    onChange={setSearchQuery}
                    placeholder={t("prices.search_placeholder", "Search by service name")}
                />

                {/* Եթե search չկա → Tabs + active category */}
                {!isSearching && (
                    <>
                        <Tabs
                            categories={categories}
                            activeId={safeActiveCategoryId}
                            onChange={setActiveCategoryId}
                        />

                        {activeCategory && (
                            <div className={styles.categoryWrapper}>
                                <h2 className={styles.categoryTitle}>{activeCategory.title}</h2>

                                <AccordionGroup
                                    sections={activeCategory.sections}
                                    forceOpenAll={isSearching}
                                />
                            </div>
                        )}
                    </>
                )}

                {/* Եթե search կա → Search Results across ALL categories */}
                {isSearching && (
                    <div className={styles.searchResults}>
                        <h2 className={styles.categoryTitle}>
                            {t("prices.search_results", "Search results")}
                        </h2>

                        {filteredData.categories.length === 0 && (
                            <p className={styles.noResults}>
                                {t("prices.no_results", "No services found for this query.")}
                            </p>
                        )}

                        {filteredData.categories.map((cat) => (
                            <div key={cat.id} className={styles.categoryWrapper}>
                                <h3 className={styles.categoryTitle}>{cat.title}</h3>

                                <AccordionGroup
                                    sections={cat.sections}   // ✅ ՃԻՇՏ
                                    autoOpen                  // ✅ ՃԻՇՏ prop
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
