import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import "../styles/global.scss";   // ճիշտ ճանապարհ
import "../i18n";

import Layout from "../components/Layout";

import Home from "../pages/Home";
import About from "../pages/About";
import Contact from "../pages/Contact";

function PageWrapper() {
    const { lang } = useParams();
    const { i18n } = useTranslation();

    if (!["hy", "en", "ru"].includes(lang)) {
        return <Navigate to="/hy" replace />;
    }

    if (i18n.language !== lang) {
        i18n.changeLanguage(lang);
    }

    return (
        <Layout lang={lang}>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
            </Routes>
        </Layout>
    );
}

export default PageWrapper;
