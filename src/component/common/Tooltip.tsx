import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { observer } from "mobx-react-lite";
import React, { FC, useContext, useEffect, useLayoutEffect, useRef } from "react";
import { useMediaQuery } from "react-responsive";
import { BREAKPOINT_MEDIUM } from "../../const/breakpoint";
import { tooltipStoreContext } from "../../store/TooltipStore";
import Entity from "../entity/Entity";

import "./Tooltip.scss";

const MARGIN_CHEVRON = 8;

type Position = {
    top: number;
    left: number;
    isChevronAbove: boolean;
    isChevronRight: boolean;
};

function calculatePosition(target: Element, content: Element, chevron: Element): Position {
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
 */
const Tooltip: FC = () => {
    const tooltipStore = useContext(tooltipStoreContext);
    const isMedium = useMediaQuery({ minWidth: BREAKPOINT_MEDIUM });

    const chevronRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);
    const tooltipRef = useRef<HTMLDivElement>(null);

    const doRender = tooltipStore.isTooltipAvailable;

    useEffect(() => {
        tooltipStore.setDisableFlag("breakpoint", !isMedium);
    }, [isMedium]);

    useLayoutEffect((): void => {
        if (!doRender || !tooltipStore.fetchedTarget) {
            return;
        }

        const target = tooltipStore.fetchedTarget.current;
        const tooltip = tooltipRef.current;
        const content = contentRef.current;
        const chevron = chevronRef.current;

        if (!target || !tooltip || !content || !chevron) {
            return;
        }

        const { top, left, isChevronAbove, isChevronRight } = calculatePosition(target, content, chevron);

        tooltip.style.left = `${left}px`;
        tooltip.style.top = `${top}px`;

        chevron.classList.toggle("bottom", isChevronAbove);
        chevron.classList.toggle("right", isChevronRight);
    });

    if (!doRender || !tooltipStore.fetchedData) {
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
