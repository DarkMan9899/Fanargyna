// ClinicalText.jsx
import { Trans } from "react-i18next";
import React from "react";

export default function ClinicalText({ i18nKey }) {
    return (
        <Trans
            i18nKey={`results_section.stories.${openModal}.modalText`}
            components={{
                i: <i />,
                b: <strong />,
                br: <br />
            }}
        >
            <div className="text-with-breaks" />
        </Trans>

    );
}
