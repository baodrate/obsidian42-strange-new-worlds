// the title displayed at the top of a uic-ref-area

import ThePlugin from "src/main";
import { setFileLinkHandlers } from "./uic-ref--parent";
import {hideAll} from 'tippy.js';
import { getIcon } from "obsidian";

/**
 * Title in HoverView or sidepane
 *
 * @param {string} key
 * @param {string} filePath
 * @param {number} refCount
 * @param {boolean} isPopover
 * @return {*}  {Promise<string>}
 */
export const getUIC_Ref_Title_Div = async (refType: string, key: string, filePath: string, refCount: number, lineNu: number, isPopover:boolean, thePlugin: ThePlugin): Promise<HTMLElement> => {
    const titleEl = createDiv();
    titleEl.addClass(isPopover ? "snw-ref-title-popover" : "snw-ref-title-side-pane");
    titleEl.addClass("tree-item-self");
    titleEl.addClass("is-clickable");
    titleEl.setAttribute("snw-ref-title-type",  refType);
    titleEl.setAttribute("snw-ref-title-key",   key);
    titleEl.setAttribute("snw-data-file-name",  filePath);
    titleEl.setAttribute("snw-data-line-number",lineNu.toString());

    const titleLabelEl = createDiv();
    titleLabelEl.addClass("snw-ref-title-popover-label");
    titleLabelEl.innerText = key;

    titleEl.append(titleLabelEl);

    if(isPopover) {
        const openSidepaneIconEl = createSpan();
        openSidepaneIconEl.addClass("snw-ref-title-popover-icon")
        openSidepaneIconEl.innerHTML = getIcon("more-horizontal").outerHTML;

        const imgWrappper = createSpan();
        imgWrappper.appendChild(openSidepaneIconEl);
        imgWrappper.addClass("snw-ref-title-popover-open-sidepane-icon");
        imgWrappper.setAttribute("snw-ref-title-type",  refType);
        imgWrappper.setAttribute("snw-ref-title-key",   key);
        imgWrappper.setAttribute("snw-data-file-name",  filePath);
        imgWrappper.setAttribute("snw-data-line-number",lineNu.toString());
        titleEl.appendChild(imgWrappper);

        //event bindings
        setTimeout( async () => {
            const imgEl: HTMLElement = document.querySelector(".snw-ref-title-popover-open-sidepane-icon");
            if(imgEl) {
                imgEl.onclick = async (e: MouseEvent) => {
                    e.stopPropagation();
                    hideAll({duration: 0}); // hide popup
                    // @ts-ignore
                    const parentEl = e.target.closest(".snw-ref-title-popover-open-sidepane-icon");
                    //open view into side pane
                    const refType = parentEl.getAttribute("snw-ref-title-type")
                    const key = parentEl.getAttribute("snw-ref-title-key")
                    const path = parentEl.getAttribute("snw-data-file-name")
                    const lineNu = parentEl.getAttribute("snw-data-line-number")
                    thePlugin.activateView(refType, key, path, Number(lineNu));
                }
                await setFileLinkHandlers(true);    
            }
        }, 300);
    } //END isPopover

    return titleEl;
}
