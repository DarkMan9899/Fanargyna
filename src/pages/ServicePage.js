import React, { useEffect, useMemo, useRef, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import servicesHy from "../data/services.hy.json";
import servicesRu from "../data/services.ru.json";
import servicesEn from "../data/services.en.json";

import styles from "../styles/styleService/servicePage.module.scss";

/* ICON IMAGES */
import femaleInfertilityIcon from "../Img/icon/Reproductive.png";
import maleInfertilityIcon from "../Img/icon/Reproductive.png";
import urologyIcon from "../Img/icon/urology.png";
import gynecologyIcon from "../Img/icon/gynecology.png";
import radiologyIcon from "../Img/icon/ultrasound.png";
import endocrinological from "../Img/icon/unnamed.png"

/* DATA BY LANGUAGE */
const DATA_BY_LANG = { hy: servicesHy, ru: servicesRu, en: servicesEn };

/* ICON MAP */
const ICON_MAP = {
    female: femaleInfertilityIcon,
    male: maleInfertilityIcon,
    urology: urologyIcon,
    gynecology: gynecologyIcon,
    radiology: radiologyIcon,
    endocrinological:endocrinological
};

export default function ServicePage() {
    const { lang } = useParams();
    const location = useLocation();
    const { i18n, t } = useTranslation();

    const currentLang = lang || i18n.language || "hy";
    const rawData = DATA_BY_LANG[currentLang] || servicesHy;
    const servicesData = rawData?.tabs?.length ? rawData : servicesHy;

    const tabs = servicesData.tabs || [];

    // ✅ preselect tab from ?tab=
    const preselectedTab = useMemo(() => {
        const query = new URLSearchParams(location.search);
        return query.get("tab");
    }, [location.search]);

    const resolvedInitialTab =
        preselectedTab && tabs.find((x) => x.id === preselectedTab)
            ? preselectedTab
            : tabs[0]?.id;

    const [activeTabId, setActiveTabId] = useState(resolvedInitialTab);

    // ✅ եթե back/forward-ից query tab-ը փոխվեց՝ սինխրոնացնենք
    useEffect(() => {
        if (!resolvedInitialTab) return;
        setActiveTabId(resolvedInitialTab);
    }, [resolvedInitialTab]);

    const activeTab = tabs.find((x) => x.id === activeTabId) || tabs[0];

    // ✅ refs map
    const sectionRefs = useRef({});

    // ✅ ճիշտ ref setter՝ չի ջնջվում effect-ով
    const setSectionRef = (id) => (el) => {
        if (el) sectionRefs.current[id] = el;
        else delete sectionRefs.current[id];
    };

    const [activeMenuId, setActiveMenuId] = useState(activeTab?.menu?.[0]?.id || null);

    // ✅ reset active menu on tab change OR navigation
    useEffect(() => {
        setActiveMenuId(activeTab?.menu?.[0]?.id || null);
    }, [activeTabId, location.key]); // location.key կարևոր է back/forward-ի համար

    // ✅ scroll top on navigation
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "auto" });
    }, [location.key]);

    // ✅ scroll spy (stable)
    useEffect(() => {
        if (!activeTab?.menu?.length) return;

        let observer;

        const setup = () => {
            observer = new IntersectionObserver(
                (entries) => {
                    const visible = entries
                        .filter((e) => e.isIntersecting)
                        .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

                    if (visible[0]?.target?.id) setActiveMenuId(visible[0].target.id);
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
        };

        // DOM paint-ից հետո
        requestAnimationFrame(setup);

        return () => observer?.disconnect();
    }, [activeTabId, location.key]); // ✅ այստեղ էլ

    const handleMenuClick = (id) => {
        const el = sectionRefs.current[id];
        if (!el) return;
        el.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className={styles.servicePage}>
            <div className={styles.container}>
                <h1 className={styles.pageTitle}>{t("services_page_title", "Services")}</h1>

                {/* TOP TABS */}
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

                <div className={styles.layout}>
                    {/* CONTENT */}
                    <div className={styles.content}>
                        {activeTab?.content?.map((block) => (
                            <section
                                key={block.id}
                                id={block.id}
                                ref={setSectionRef(block.id)}
                                className={styles.section}
                            >
                                {block.title && <h2 className={styles.sectionTitle}>{block.title}</h2>}

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
                            {t("services.menu", "Բովանդակություն")} ▾
                        </button>

                        <div className={`${styles.sidebarInner} ${sidebarOpen ? styles.sidebarOpen : ""}`}>
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
