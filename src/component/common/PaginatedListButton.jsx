import { observer } from "mobx-react-lite";
import * as PropTypes from "prop-types";
import React, { createRef, useEffect } from "react";
import { useTranslation } from "react-i18next";

import { debounce } from "../../helper/utils";

import ActionButton from "./ActionButton";

/**
 *
 * @param element
 * @param {PaginatedList} paginatedList
 */
async function handleScroll(element, paginatedList) {
    if (
        element.current &&
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

    return (
        <ActionButton
            primary
            spacing
            ref={element}
            label={t(`${localePrefix}.load`)}
            loadingLabel={t(`${localePrefix}.loading`)}
            isVisible={paginatedList.hasNextPage}
            isLoading={paginatedList.isLoading}
            onClick={async () => {
                await paginatedList.requestNextPage();
            }}
        />
    );
};

PaginatedListButton.propTypes = {
    paginatedList: PropTypes.object.isRequired,
    localePrefix: PropTypes.string.isRequired,
    loadOnScroll: PropTypes.bool,
};

export default observer(PaginatedListButton);
