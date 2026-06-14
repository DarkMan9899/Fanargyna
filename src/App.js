import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PageWrapper from "./components/PageWrapper";
import ScrollToTop from "./components/ScrollToTop";
import ScrollToHash from "./components/ScrollToHash";
import AdminPanel from "./admin/AdminPanel";

export default function App() {
    return (
        <Router>
            <ScrollToTop />
            <ScrollToHash />
            <Routes>
                {/* ── Admin panel ─────────────────────────────── */}
                <Route path="/admin" element={<AdminPanel />} />

                {/* ── Public site ─────────────────────────────── */}
                <Route path="/" element={<Navigate to="/hy" replace />} />
                <Route path="/:lang/*" element={<PageWrapper />} />
            </Routes>
        </Router>
    );
}
