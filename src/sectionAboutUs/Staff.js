import React, { useState, useEffect } from "react";
import { useTranslation, Trans } from "react-i18next";
import staffData from "../data/staff.json";
import { staffImages } from "../data/staffImages";
import styles from "../styles/styleAboutUs/Staff.module.scss";
import { FaArrowRight } from "react-icons/fa";

const Staff = () => {
    const { t, i18n } = useTranslation();
    const [activeDoctor, setActiveDoctor] = useState(null);

    // Optional: close modal on ESC
    useEffect(() => {
        const handleEsc = (e) => {
            if (e.key === "Escape") setActiveDoctor(null);
        };

        if (activeDoctor) {
            document.addEventListener("keydown", handleEsc);
            document.body.style.overflow = "hidden"; // lock background scroll
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.removeEventListener("keydown", handleEsc);
            document.body.style.overflow = "";
        };
    }, [activeDoctor]);

    useEffect(() => {}, [i18n.language]);

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
                            />

                            <div className={styles.info}>
                                <h3>{t(`staff.${doctor.key}.name`)}</h3>
                                <h4>{t(`staff.${doctor.key}.profession`)}</h4>

                                <p>{t(`staff.${doctor.key}.shortText`)}</p>

                                <button
                                    className="btn btn--read-more btn--with-icon"
                                    onClick={() => setActiveDoctor(doctor.key)}
                                >
                                    {t("staff.read_more")}
                                    <span className="btn__icon">
                    <FaArrowRight />
                  </span>
                                </button>
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
                            <h3>{t(`staff.${activeDoctor}.modalTitle`)}</h3>

                            <button
                                className={styles.modalClose}
                                onClick={() => setActiveDoctor(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className={styles.modalBody}>
                            {/* ✅ NEW LINE + BOLD SUPPORT */}
                            <p className="text-with-breaks">
                                <Trans
                                    i18nKey={`staff.${activeDoctor}.modalText`}
                                    components={{ strong: <strong /> }}
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
