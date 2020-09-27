// @flow

import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { IconDefinition } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React from "react";
import type { ElementRef } from "../../type/common";
import Button from "./Button";

type Props = {
    label: string,
    loadingLabel: string,
    icon?: IconDefinition,
    primary?: boolean,
    secondary?: boolean,
    spacing?: boolean,
    onClick: () => void | Promise<void>,
    isLoading: boolean,
    isVisible: boolean,
};

/**
 * The component representing a button with an action, which also have a loading animation.
 * @constructor
 */
const ActionButton = (props: Props, ref: ElementRef): React$Node => {
    if (!props.isVisible) {
        return null;
    }

    if (props.isLoading) {
        return (
            <Button
                label={props.loadingLabel}
                icon={faSpinner}
                primary={props.primary}
                secondary={props.secondary}
                spacing={props.spacing}
                ref={ref}
            />
        );
    }

    return (
        <Button
            label={props.label}
            icon={props.icon}
            primary={props.primary}
            secondary={props.secondary}
            spacing={props.spacing}
            onClick={props.onClick}
            ref={ref}
        />
    );
};

export default (observer(ActionButton, { forwardRef: true }): typeof ActionButton);