import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { createRef, useContext, useEffect, useLayoutEffect } from "react";

import TooltipStore from "../../store/TooltipStore";
import Entity from "../entity/Entity";

import "./Tooltip.scss";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINT_MEDIUM } from "../../helper/const";

/**
 * The margin used by the tooltip chevron.
 * @type {number}
 */
const MARGIN_CHEVRON = 8;

/**
 * Calculates the position of the tooltip.
 * @param {HTMLElement} target
 * @param {HTMLElement} content
 * @param {HTMLElement} chevron
 * @return {{top: number, left: number, isChevronRight: boolean, isChevronAbove: boolean}}
 */
function calculatePosition({ target, content, chevron }) {
    const contentRect = content.getBoundingClientRect();
    const chevronRect = chevron.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();

    let isChevronAbove = false;
    let isChevronRight = false;

    let top = targetRect.top + window.scrollY + targetRect.height + chevronRect.height;
    if (top + contentRect.height + chevronRect.height > window.scrollY + window.innerHeight) {
        // Tooltip would be offscreen at the bottom, so place it above the target.
        top = targetRect.top + window.scrollY - contentRect.height - chevronRect.height;
        isChevronAbove = true;
    }

    const targetCenter = targetRect.left + window.scrollX + targetRect.width / 2;
    let left = targetCenter - chevronRect.width / 2 - MARGIN_CHEVRON;
    if (left + contentRect.width + chevronRect.width > window.scrollX + window.innerWidth) {
        // Tooltip would be offscreen at the right, so shift it to the left.
        left = targetCenter + chevronRect.width / 2 + MARGIN_CHEVRON - contentRect.width;
        isChevronRight = true;
    }

    return {
        top,
        left,
        isChevronAbove,
        isChevronRight,
    };
}

/**
 * The component representing the tooltip.
 * @return {ReactDOM|null}
 * @constructor
 */
const Tooltip = () => {
    const tooltipStore = useContext(TooltipStore);
    const isMedium = useMediaQuery({ minWidth: BREAKPOINT_MEDIUM });

    const chevronRef = createRef();
    const contentRef = createRef();
    const tooltipRef = createRef();

    const doRender = tooltipStore.isTooltipAvailable;

    useEffect(() => {
        tooltipStore.setDisableFlag("breakpoint", !isMedium);
    }, [isMedium]);

    useLayoutEffect(() => {
        if (!doRender) {
            return;
        }

        const { top, left, isChevronAbove, isChevronRight } = calculatePosition({
            target: tooltipStore.fetchedTarget.current,
            content: contentRef.current,
            chevron: chevronRef.current,
        });

        tooltipRef.current.style.left = `${left}px`;
        tooltipRef.current.style.top = `${top}px`;

        chevronRef.current.classList.toggle("bottom", isChevronAbove);
        chevronRef.current.classList.toggle("right", isChevronRight);
    });

    if (!doRender) {
        return null;
    }

    return (
        <div className="tooltip" ref={tooltipRef}>
            <div className="chevron" ref={chevronRef}>
                <FontAwesomeIcon icon={faChevronUp} />
                <FontAwesomeIcon icon={faChevronDown} />
            </div>
            <Entity entity={tooltipStore.fetchedData} ref={contentRef} />
        </div>
    );
};

export default observer(Tooltip);
