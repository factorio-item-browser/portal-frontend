import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { createRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { debounce } from "../../helper/utils";

import Button from "./Button";

/**
 *
 * @param element
 * @param {PaginatedList} paginatedList
 */
async function handleScroll(element, paginatedList) {
    if (
        paginatedList.hasNextPage &&
        !paginatedList.isLoading &&
        window.scrollY + window.innerHeight > element.current.offsetTop - window.innerHeight * 0.1
    ) {
        await paginatedList.requestNextPage();
    }
}

/**
 * The button loading more pages for a paginated list.
 * @param {PaginatedList} paginatedList
 * @param {string} localePrefix
 * @param {boolean} [loadOnScroll]
 * @returns {ReactDOM|null}
 * @constructor
 */
const PaginatedListButton = ({ paginatedList, localePrefix, loadOnScroll = false }) => {
    const { t } = useTranslation();
    const element = createRef();

    useEffect(() => {
        if (loadOnScroll) {
            const debounceHandleScroll = debounce(
                async () => {
                    await handleScroll(element, paginatedList);
                },
                100,
                this
            );

            window.addEventListener("scroll", debounceHandleScroll);
            return () => {
                window.removeEventListener("scroll", debounceHandleScroll);
            };
        }
    });

    // We have no additional pages, so do not display the button at all.
    if (!paginatedList.hasNextPage) {
        return null;
    }

    // We are already loading the next page, so show the animation.
    if (paginatedList.isLoading) {
        return (
            <Button primary spacing>
                <FontAwesomeIcon icon={faSpinner} spin />
                {t(`${localePrefix}.loading`)}
            </Button>
        );
    }

    // Show the default button, waiting to be clicked.
    return (
        <Button
            primary
            spacing
            ref={element}
            onClick={async () => {
                await paginatedList.requestNextPage();
            }}
        >
            {t(`${localePrefix}.load`)}
        </Button>
    );
};

PaginatedListButton.propTypes = {
    paginatedList: PropTypes.object.isRequired,
    localePrefix: PropTypes.string.isRequired,
    loadOnScroll: PropTypes.bool,
};

export default observer(PaginatedListButton);
