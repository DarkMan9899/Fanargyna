import { useTranslation } from "react-i18next";

export default function About() {
    const { t } = useTranslation();
    return <h2>{t("about")}</h2>;
}
