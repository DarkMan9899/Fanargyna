import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import PageWrapper from "./components/PageWrapper";

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Navigate to="/hy" replace />} />
                <Route path="/:lang/*" element={<PageWrapper />} />
            </Routes>
        </Router>
    );
}
