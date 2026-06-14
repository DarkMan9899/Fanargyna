import React, { useRef, useState, useEffect } from "react";
import emailjs from "@emailjs/browser";
import { useTranslation } from "react-i18next";
import "../styles/styleHomePage/contact.scss";
import { FaInstagram, FaFacebookF, FaLinkedinIn, FaYoutube } from "react-icons/fa";


export default function ContactSection() {
    const { t, i18n } = useTranslation();
    const formRef = useRef(null);

    const [state, setState] = useState({
        loading: false,
        ok: null,
        msg: ""
    });

    // Optional: clear message after 4 seconds
    useEffect(() => {
        if (state.ok === null) return;

        const timer = setTimeout(() => {
            setState((prev) => ({ ...prev, ok: null, msg: "" }));
        }, 4000);

        return () => clearTimeout(timer);
    }, [state.ok]);

    const sendEmail = async (e) => {
        e.preventDefault();
        setState({ loading: true, ok: null, msg: "" });

        try {
            const res = await emailjs.sendForm(
                process.env.REACT_APP_EMAILJS_SERVICE_ID,
                process.env.REACT_APP_EMAILJS_TEMPLATE_ID,
                formRef.current,
                process.env.REACT_APP_EMAILJS_PUBLIC_KEY
            );

            if (res.status === 200) {
                setState({
                    loading: false,
                    ok: true,
                    msg: t("contact_section.form.success")
                });

                formRef.current.reset();
            } else {
                throw new Error("EmailJS failed");
            }
        } catch (err) {
            setState({
                loading: false,
                ok: false,
                msg: t("contact_section.form.error")
            });
        }
    };

    return (
        <section className="contact" id="contact">
            <h2 className="contact__title">{t("contact_section.title")}</h2>

            <div className="contact__grid">
                {/* ================= FORM ================= */}
                <form ref={formRef} onSubmit={sendEmail} className="contact__form">
                    {/* hidden fields for email template */}
                    <input type="hidden" name="lang" value={i18n.language} />
                    <input
                        type="hidden"
                        name="to_email"
                        value="fanarjyanclinic@gmail.com"
                    />

                    <input
                        type="text"
                        name="name"
                        className="input"
                        placeholder={t("contact_section.form.name")}
                        required
                    />

                    <input
                        type="email"
                        name="email"
                        className="input"
                        placeholder={t("contact_section.form.email")}
                        required
                    />

                    <textarea
                        name="message"
                        className="textarea"
                        placeholder={t("contact_section.form.message")}
                        rows={6}
                        required
                    />

                    <div className="contact__button-wrapper">
                        <button
                            type="submit"
                            className="btn btn--outline contact__submit"
                            disabled={state.loading}
                        >
                            {state.loading
                                ? t("contact_section.form.sending")
                                : t("contact_section.form.send")}
                        </button>
                    </div>

                    {state.ok !== null && (
                        <p className={`form-status ${state.ok ? "ok" : "err"}`}>
                            {state.msg}
                        </p>
                    )}
                </form>

                {/* ================= INFO ================= */}
                <aside className="contact__info">
                    <div className="info-item">
                        <h4>{t("contact_section.info.phoneTitle")}</h4>
                        <a href={`tel:${t("contact_section.info.phoneValueTel")}`}>
                            {t("contact_section.info.phoneValue")}
                        </a>
                        <a href={`tel:${t("contact_section.info.phoneValueTel2")}`}>
                            {t("contact_section.info.phoneValue2")}
                        </a>
                    </div>

                    <div className="info-item">
                        <h4>{t("contact_section.info.emailTitle")}</h4>
                        <a href={`mailto:${t("contact_section.info.emailValue")}`}>
                            {t("contact_section.info.emailValue")}
                        </a>
                    </div>

                    <div className="info-item">
                        <h4>{t("contact_section.info.locationTitle")}</h4>
                        <p>{t("contact_section.info.locationValue")}</p>
                    </div>
                    <div className="info-item contact__socials">
                        <h4>{t("contact_section.info.socialTitle")}</h4>

                        <div className="social-icons">
                            <a
                                href="https://www.instagram.com/fanarjyan_clinic?igsh=aWpiemgzaXZybXgx"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Instagram"
                            >
                                <FaInstagram />
                            </a>

                            <a
                                href="https://www.facebook.com/share/1XTPQsvasy/?mibextid=wwXIfr"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="Facebook"
                            >
                                <FaFacebookF />
                            </a>

                            <a
                                href="https://www.linkedin.com/company/fanarjyan-clinic/"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                            >
                                <FaLinkedinIn />
                            </a>

                            <a
                                href="https://youtube.com/@fanarjyanclinic8413?si=DzpiC6K18szdXebg"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="YouTube"
                            >
                                <FaYoutube />
                            </a>
                        </div>
                    </div>

                </aside>



            </div>
        </section>
    );
}
