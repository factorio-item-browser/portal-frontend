import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";

import Button from "./Button";

/**
 * The component representing a button with an action, which also have a loading animation.
 * @param {string} label
 * @param {string} loadingLabel
 * @param {*} [icon]
 * @param {function} onClick
 * @param {boolean} isLoading
 * @param {boolean} isVisible
 * @param {*} props
 * @param {React.RefObject<HTMLElement>} ref
 * @return {null|*}
 * @constructor
 */
const ActionButton = ({ label, loadingLabel, icon, onClick, isLoading, isVisible, ...props }, ref) => {
    if (!isVisible) {
        return null;
    }

    if (isLoading) {
        return (
            <Button {...props} ref={ref}>
                <FontAwesomeIcon icon={faSpinner} spin />
                {loadingLabel}
            </Button>
        );
    }

    return (
        <Button onClick={onClick} {...props} ref={ref}>
            {icon ? <FontAwesomeIcon icon={icon} /> : null}
            {label}
        </Button>
    );
};

ActionButton.propTypes = {
    icon: PropTypes.any,
    isLoading: PropTypes.bool.isRequired,
    isVisible: PropTypes.bool.isRequired,
    label: PropTypes.string.isRequired,
    loadingLabel: PropTypes.string.isRequired,
    onClick: PropTypes.func.isRequired,
};

export default observer(ActionButton, { forwardRef: true });
