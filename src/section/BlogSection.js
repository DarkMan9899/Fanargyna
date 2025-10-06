import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import blogData from "../data/blog.json";
import "../styles/blog.scss";

// ✅ քո նկարը (կարող ես ավելացնել նորեր imageMap-ի մեջ)
import Subtract from "../Img/Subtract.png";
const imageMap = { "Subtract.png": Subtract };

export default function BlogSection() {
    const { t } = useTranslation();
    const [selectedPost, setSelectedPost] = useState(null);

    const handleReadMore = (post) => setSelectedPost(post);
    const closeModal = () => setSelectedPost(null);

    // 🔒 scroll-lock երբ մոդալն բացվում է
    useEffect(() => {
        document.body.style.overflow = selectedPost ? "hidden" : "auto";
    }, [selectedPost]);

    return (
        <section className="blog-section">
            <h2 className="blog-title">{t("blog_section.title")}</h2>

            <div className="blog-container">
                {blogData.map((post) => (
                    <div key={post.id} className="blog-card">
                        <img src={imageMap[post.image]} alt={t(post.titleKey)} />

                        <div className="blog-card__content">
                            {/* ✅ Ամսաթիվ և ժամ */}
                            <div className="blog-card__meta">
                                <span className="date">📅 {post.date}</span>
                                <span className="time">🕒 {post.time}</span>
                            </div>

                            <h3>{t(post.titleKey)}</h3>
                            <p>{t(post.textKey)}</p>

                            <button
                                onClick={() => handleReadMore(post)}
                                className="read-more"
                            >
                                {t("blog_section.read_more")}
                                <span className="read-more__icon">→</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* 🔹 Modal */}
            {selectedPost && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <button className="modal-close" onClick={closeModal}>
                            ×
                        </button>
                        <h3>{t(selectedPost.titleKey)}</h3>
                        <p>{t(selectedPost.modalTextKey)}</p>
                    </div>
                </div>
            )}
        </section>
    );
}
