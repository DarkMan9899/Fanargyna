import React, { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import staffData from "../data/staff.json";
import { staffImages } from "../data/staffImages";
import styles from "../styles/styleAboutUs/Staff.module.scss";
import { FaArrowRight } from "react-icons/fa";

const Staff = () => {
    const { t } = useTranslation();
    const [activeDoctor, setActiveDoctor] = useState(null);
    // ✅ Fix: track screen width reactively, not via window.innerWidth in render
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 640);

    useEffect(() => {
        const handler = () => setIsMobile(window.innerWidth <= 640);
        window.addEventListener("resize", handler);
        return () => window.removeEventListener("resize", handler);
    }, []);

    // Close modal on ESC + scroll lock
    useEffect(() => {
        const handleEsc = (e) => { if (e.key === "Escape") setActiveDoctor(null); };
        if (activeDoctor) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [activeDoctor]);

    return (
        <section className={styles.staff}>
            <div className="container">
                <h2>{t("staff.title")}</h2>

                <div className={styles.grid}>
                    {staffData.map((doctor) => (
                        <div key={doctor.id} className={styles.card}>
                            <img
                                src={staffImages[doctor.key]}
                                alt={t(`staff.${doctor.key}.name`)}
                                loading="lazy"
                            />

                            <div className={styles.info}>
                                <h3>{t(`staff.${doctor.key}.name`)}</h3>
                                <h4>{t(`staff.${doctor.key}.profession`)}</h4>

                                <Trans
                                    i18nKey={`staff.${doctor.key}.shortText`}
                                    components={{ br: <br /> }}
                                />

                                <div className={styles.actions}>
                                    <button
                                        className={`btn ${isMobile ? "btn--primary" : "btn--read-more btn--with-icon"}`}
                                        onClick={() => setActiveDoctor(doctor.key)}
                                    >
                                        {t("staff.read_more")}
                                        {!isMobile && (
                                            <span className="btn__icon">
                                                <FaArrowRight />
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {activeDoctor && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setActiveDoctor(null)}
                >
                    <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
                        <div className={styles.modalHeader}>
                            <h3>
                                <Trans
                                    i18nKey={`staff.${activeDoctor}.modalTitle`}
                                    components={{ br: <br /> }}
                                />
                            </h3>
                            <button
                                className={styles.modalClose}
                                onClick={() => setActiveDoctor(null)}
                                aria-label="Close"
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            <p className="text-with-breaks">
                                <Trans
                                    i18nKey={`staff.${activeDoctor}.modalText`}
                                    components={{ i: <i />, b: <strong /> }}
                                />
                            </p>
                        </div>

                        <div className={styles.modalFooter}>
                            <button
                                className="btn btn--primary"
                                onClick={() => setActiveDoctor(null)}
                            >
                                {t("close")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
};

export default Staff;
