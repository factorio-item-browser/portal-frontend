import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSpinner} from "@fortawesome/free-solid-svg-icons";
import {observer} from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React from "react";
import {useTranslation} from "react-i18next";

import "./PaginatedListButton.scss";

/**
 * The button loading more pages for a paginated list.
 * @param {PaginatedList} paginatedList
 * @param {string} localePrefix
 * @returns {ReactDOM|null}
 * @constructor
 */
const PaginatedListButton = ({ paginatedList, localePrefix }) => {
    const { t } = useTranslation();

    // We have no additional pages, so do not display the button at all.
    if (!paginatedList.hasNextPage) {
        return null;
    }

    // We are already loading the next page, so show the animation.
    if (paginatedList.isLoading) {
        return (
            <div className="paginated-list-button">
                <FontAwesomeIcon icon={faSpinner} spin />
                {t(`${localePrefix}.loading`)}
            </div>
        );
    }

    // Show the default button, waiting to be clicked.
    return (
        <div className="paginated-list-button" onClick={async () => {
            await paginatedList.requestNextPage();
        }}>
            {t(`${localePrefix}.load`)}
        </div>
    );
};

PaginatedListButton.propTypes = {
    paginatedList: PropTypes.object.isRequired,
    localePrefix: PropTypes.string.isRequired,
};

export default observer(PaginatedListButton);
