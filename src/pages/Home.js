import {useTranslation} from "react-i18next";
import "../styles/home.scss";
import HeroSection from "../section/HeroSection";
import ServicesSection from "../section/ServicesSection";
import ClinicSection from "../section/ClinicSection";
import Results from "../section/ResultsSection";
import FeaturesBlock from "../section/FeaturesBlock";
import BlogSection from "../section/BlogSection";

export default function Home() {
    const {t} = useTranslation();

    return (
        <div>
            <main className="home-page">
                <HeroSection/>
                <ServicesSection/>
                <ClinicSection/>
                <Results/>
                <FeaturesBlock/>
                <BlogSection/>
            </main>
        </div>

    );
}
