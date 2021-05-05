import { observer } from "mobx-react-lite";
import React, { FC, useRef } from "react";
import { Trans, useTranslation } from "react-i18next";
import { Config } from "../../../../util/config";
import { useSelectClick } from "../../../../util/hooks";
import ExternalLink from "../../../link/ExternalLink";
import Option from "./Option";

type Props = {
    value: string;
};

/**
 * The component representing the (readonly) combination id.
 */
const OptionCombinationId: FC<Props> = ({ value }) => {
    const ref = useRef<HTMLDivElement>(null);
    const handleClick = useSelectClick(ref);
    const { t } = useTranslation();

    const description = (
        <Trans i18nKey="settings.combination-id.description">
            abc <ExternalLink url={Config.discordLink}>Discord server</ExternalLink> ghi
        </Trans>
    );

    return (
        <Option label={t("settings.combination-id.label")} description={description} fullWidth>
            <div className={"static-value"} ref={ref} onClick={handleClick}>
                {value}
            </div>
        </Option>
    );
};

export default observer(OptionCombinationId);
