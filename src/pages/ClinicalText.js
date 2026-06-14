import { Trans } from "react-i18next";
import React from "react";

// ClinicalText: renders rich-text i18n content with inline HTML components
export default function ClinicalText({ i18nKey }) {
    if (!i18nKey) return null;
    return (
        <Trans
            i18nKey={i18nKey}
            components={{
                i: <i />,
                b: <strong />,
                br: <br />
            }}
        />
    );
}
