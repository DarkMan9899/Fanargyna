import React, { useEffect, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import servicesHy from "../data/services.hy.json";
import servicesRu from "../data/services.ru.json";
import servicesEn from "../data/services.en.json";

import styles from "../styles/styleService/servicePage.module.scss";

/* ICON IMAGES */
import femaleInfertilityIcon from "../Img/icon/urology.png";
import maleInfertilityIcon from "../Img/icon/Reproductive.png";
import urologyIcon from "../Img/icon/urology.png";
import gynecologyIcon from "../Img/icon/gynecology.png";
import radiologyIcon from "../Img/icon/ultrasound.png";

/* DATA BY LANGUAGE */
const DATA_BY_LANG = {
    hy: servicesHy,
    ru: servicesRu,
    en: servicesEn,
};

/* ICON MAP */
const ICON_MAP = {
    female: femaleInfertilityIcon,
    male: maleInfertilityIcon,
    urology: urologyIcon,
    gynecology: gynecologyIcon,
    radiology: radiologyIcon,
};

export default function ServicePage() {
    const { lang } = useParams();
    const location = useLocation();
    const { i18n, t } = useTranslation();

    /* scroll to top on page open */
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, []);

    const currentLang = lang || i18n.language || "hy";
    const rawData = DATA_BY_LANG[currentLang] || servicesHy;
    const servicesData = rawData?.tabs?.length ? rawData : servicesHy;

    const tabs = servicesData.tabs || [];

    /* preselect tab from ?tab= */
    const query = new URLSearchParams(location.search);
    const preselectedTab = query.get("tab");

    const initialTab =
        preselectedTab && tabs.find((t) => t.id === preselectedTab)
            ? preselectedTab
            : tabs[0]?.id;

    const [activeTabId, setActiveTabId] = useState(initialTab);
    const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

    const sectionRefs = useRef({});
    const [activeMenuId, setActiveMenuId] = useState(
        activeTab?.menu?.[0]?.id
    );

    /* reset menu when tab changes */
    useEffect(() => {
        setActiveMenuId(activeTab?.menu?.[0]?.id || null);
        sectionRefs.current = {};
    }, [activeTabId]);

    /* scroll spy */
    useEffect(() => {
        if (!activeTab?.menu) return;

        const observer = new IntersectionObserver(
            (entries) => {
                const visible = entries
                    .filter((e) => e.isIntersecting)
                    .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                if (visible[0]?.target?.id) {
                    setActiveMenuId(visible[0].target.id);
                }
            },
            {
                rootMargin: "-20% 0px -60% 0px",
                threshold: [0.2, 0.5, 0.7],
            }
        );

        activeTab.menu.forEach((m) => {
            const el = sectionRefs.current[m.id];
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, [activeTab]);

    const handleMenuClick = (id) => {
        const el = sectionRefs.current[id];
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={styles.servicePage}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>
                    {t("services.title", "Ծառայություններ")}
                </h1>

                {/* ---------- TOP TABS ---------- */}
                <div className={styles.tabs}>
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            type="button"
                            className={`${styles.tabButton} ${
                                tab.id === activeTabId ? styles.activeTab : ""
                            }`}
                            onClick={() => setActiveTabId(tab.id)}
                        >
                            {ICON_MAP[tab.icon] && (
                                <img
                                    src={ICON_MAP[tab.icon]}
                                    alt={tab.title}
                                    className={styles.icon}
                                    loading="lazy"
                                />
                            )}
                            <span>{tab.title}</span>
                        </button>
                    ))}
                </div>

                {/* ---------- MAIN LAYOUT ---------- */}
                <div className={styles.layout}>
                    {/* CONTENT */}
                    <div className={styles.content}>
                        {activeTab?.content?.map((block) => (
                            <section
                                key={block.id}
                                id={block.id}
                                ref={(el) => (sectionRefs.current[block.id] = el)}
                                className={styles.section}
                            >
                                {block.title && (
                                    <h2 className={styles.sectionTitle}>{block.title}</h2>
                                )}

                                {block.type === "paragraphs" &&
                                    block.text.map((p, i) => (
                                        <p key={i} className={styles.paragraph}>
                                            {p}
                                        </p>
                                    ))}

                                {block.type === "list" && (
                                    <ul className={styles.list}>
                                        {block.items.map((li, i) => (
                                            <li key={i}>{li}</li>
                                        ))}
                                    </ul>
                                )}
                            </section>
                        ))}
                    </div>

                    {/* SIDEBAR */}
                    <aside className={styles.sidebar}>
                        <button
                            className={styles.sidebarToggle}
                            type="button"
                            onClick={() => setSidebarOpen((s) => !s)}
                        >
                            {t("services.menu", "Բաժիններ")} ▾
                        </button>

                        <div
                            className={`${styles.sidebarInner} ${
                                sidebarOpen ? styles.sidebarOpen : ""
                            }`}
                        >
                            {activeTab?.menu?.map((m) => (
                                <button
                                    key={m.id}
                                    type="button"
                                    className={`${styles.menuItem} ${
                                        m.id === activeMenuId ? styles.menuItemActive : ""
                                    }`}
                                    onClick={() => {
                                        handleMenuClick(m.id);
                                        setSidebarOpen(false);
                                    }}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </div>
    );
}
