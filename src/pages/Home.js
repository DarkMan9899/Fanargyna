import {useTranslation} from "react-i18next";
import "../styles/styleHomePage/home.scss";
import HeroSection from "../sectionHomPage/HeroSection";
import ServicesSection from "../sectionHomPage/ServicesSection";
import ClinicSection from "../sectionHomPage/ClinicSection";
import Results from "../sectionHomPage/ResultsSection";
import FeaturesBlock from "../sectionHomPage/FeaturesBlock";
import BlogSection from "../sectionHomPage/BlogSection";
import ContactSection from "../sectionHomPage/ContactSection";
import FAQSection from "../sectionHomPage/FAQSection";

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
                <FAQSection/>
                <ContactSection/>
            </main>
        </div>

    );
}
