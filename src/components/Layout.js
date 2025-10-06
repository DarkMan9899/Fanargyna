import React from "react";
import "../styles/layout.scss";
import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({children}) {
    return (
        <div className="layout-container">
            <Navbar/>
                <main>
                    {children}
                </main>

                <Footer/>
        </div>
);
}
