import { faPlus, faUndo } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { FC, useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import { SettingMetaData } from "../../api/transfer";
import { CombinationId } from "../../class/CombinationId";
import { globalStoreContext } from "../../store/GlobalStore";
import { BoxStatus, RouteName } from "../../util/const";
import Button from "../button/Button";
import ButtonGroup from "../button/ButtonGroup";
import LinkedButton from "../button/LinkedButton";
import Status from "./Status";

type Props = {
    setting: SettingMetaData;
    lastUsedSetting: SettingMetaData;
};

const TemporarySettingStatus: FC<Props> = ({ setting, lastUsedSetting }) => {
    const { t } = useTranslation();
    const router = useContext(globalStoreContext).router;
    const handleRevertClick = useCallback((): void => {
        router.redirectToIndex(CombinationId.fromFull(lastUsedSetting.combinationId));
    }, [lastUsedSetting.combinationId]);

    if (!setting.isTemporary) {
        return null;
    }

    return (
        <Status status={BoxStatus.Warning}>
            <h3>{t("temporary-setting.headline")}</h3>
            {t("temporary-setting.description-1")}
            <br />
            {t("temporary-setting.description-2")}

            <ButtonGroup>
                <Button
                    label={t("temporary-setting.button-undo", { name: lastUsedSetting.name })}
                    icon={faUndo}
                    onClick={handleRevertClick}
                    secondary
                />
                <LinkedButton
                    route={RouteName.Settings}
                    label={t("temporary-setting.button-add")}
                    icon={faPlus}
                    primary
                />
            </ButtonGroup>
        </Status>
    );
};

export default observer(TemporarySettingStatus);
