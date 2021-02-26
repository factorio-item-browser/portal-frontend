import { observer } from "mobx-react-lite";
import React, { createRef, FC } from "react";
import { useTranslation } from "react-i18next";
import { useSelectClick } from "../../../../util/hooks";
import Option from "./Option";

type Props = {
    value: string;
};

/**
 * The component representing the (readonly) combination id.
 */
const OptionCombinationId: FC<Props> = ({ value }) => {
    const ref = createRef<HTMLDivElement>();
    const handleClick = useSelectClick(ref);
    const { t } = useTranslation();

    return (
        <Option label={t("settings.combination-id.label")} fullWidth>
            <div className={"static-value"} ref={ref} onClick={handleClick}>
                {value}
            </div>
        </Option>
    );
};

export default observer(OptionCombinationId);
