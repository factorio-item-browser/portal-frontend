// @flow

import { faPlus, faUndo } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import React, { useCallback, useContext } from "react";
import { useTranslation } from "react-i18next";
import CombinationId from "../../class/CombinationId";
import { ROUTE_SETTINGS } from "../../const/route";
import { STATUS_WARNING } from "../../const/status";
import { routeStoreContext } from "../../store/RouteStore";
import type { SettingMetaData } from "../../type/transfer";
import Button from "../button/Button";
import ButtonGroup from "../button/ButtonGroup";
import LinkedButton from "../button/LinkedButton";
import Status from "./Status";

type Props = {
    setting: SettingMetaData,
    lastUsedSetting: SettingMetaData,
};

const TemporarySettingStatus = ({ setting, lastUsedSetting }: Props): React$Node => {
    const { t } = useTranslation();
    const router = useContext(routeStoreContext).router;
    const handleRevertClick = useCallback((): void => {
        router.redirectToIndex(CombinationId.fromFull(lastUsedSetting.combinationId));
    }, [lastUsedSetting.combinationId]);

    if (!setting.isTemporary) {
        return null;
    }

    return (
        <>
            <Status status={STATUS_WARNING}>
                <h3>{t("temporary-setting.headline")}</h3>
                {t("temporary-setting.description-1")}
                <br />
                {t("temporary-setting.description-2")}

                <ButtonGroup>
                    <Button
                        label={t("temporary-setting.button-undo", { name: lastUsedSetting.name })}
                        icon={faUndo}
                        onClick={handleRevertClick}
                    />
                    <LinkedButton
                        route={ROUTE_SETTINGS}
                        label={t("temporary-setting.button-add")}
                        icon={faPlus}
                        primary
                    />
                </ButtonGroup>
            </Status>
        </>
    );
};

export default (observer(TemporarySettingStatus): typeof TemporarySettingStatus);
