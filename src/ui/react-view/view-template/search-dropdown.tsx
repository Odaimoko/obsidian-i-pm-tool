import {StyleProps, VStack} from "./h-stack";
import React, {KeyboardEvent, useRef, useState} from "react";
import {usePopup} from "./hovering-popup";
import {devLog} from "../../../utils/env-util";
import {I_Nameable} from "../../../data-model/I_Nameable";
import {getDropdownStyle, loopIndex} from "../project-filter";
import {isCharacterInput} from "../../../utils/react-user-input";


interface I_OptionItem {
    name: string,
    optionValue: string,
}

export type OptionValueType = I_Nameable | I_OptionItem;

function getProjectOptionValue(project: OptionValueType) {
    // @ts-ignore
    return Object.keys(project).includes("optionValue") ? project['optionValue'] : project.name;
}

export const SearchDropdown = (props: {
    data: OptionValueType[]
    handleSetOptionValues(param: string[]): void;
} & StyleProps) => {
    const [searchText, setSearchText] = useState("")
    const {dropDownDisplay, setDropDownDisplay, showDropdown} = usePopup();
    const filtered = props.data.filter(k => k.name.toLowerCase().includes(searchText.toLowerCase()))

    function handleSetSearchText(txt: string) {
        setSearchText(txt)
    }

    const childRefs: Record<string, HTMLButtonElement | null> = {}; // Object to hold references to child components
    const inputRef = useRef<HTMLInputElement>(null);
    const selectedChild = useRef(-1);
    // Put OnKeyDown Event on the container div, so that we can use arrow keys to select the project.
    // Don't put it on the input box, otherwise when the focus is not on the input box, the event will not be triggered.
    function resetKeyboardState() {
        selectedChild.current = -1;
    }

    return <div style={Object.assign({}, props.style, {position: "relative"})}
                onKeyDown={handleBaseKeyboard}
                onBlur={(event) => {
                    // Hide Dropdown if we lose focus
                    if (event.relatedTarget && event.relatedTarget.id.startsWith("project_choice")) {
                        // Let the project_choice button handle the click event
                        // Otherwise when we lose focus and hide the dropdown, the button will not be triggered.
                    } else {
                        // Close when click outside
                        hideDropdown()
                    }
                }}
    >
        <input ref={inputRef}
               type="text" placeholder="Search/Select Project"
               value={searchText}
               onChange={(event) => {
                   const text = event.target.value;
                   // when there is text, show the dropdown
                   if (text && text.length > 0) {
                       showDropdown()
                   } else {
                       hideDropdown()
                   }
                   handleSetSearchText(text)
               }}

               onFocus={() => {
                   // show when click search input box

                   devLog("Input Focused");
                   showDropdown();
               }}
        />
        {/*Add background so it won't be transparent. */}
        <div id={"project_choices"} style={getDropdownStyle(dropDownDisplay)}
        >
            <VStack spacing={2}>
                {filtered.map((project: OptionValueType) => {
                    const childId = `project_choice_${project.name}`;
                    return (
                        <button id={childId} onClick={(event) => {
                            // console.log(event.target) // html element
                            props.handleSetOptionValues([getProjectOptionValue(project)])
                            hideDropdown()
                            handleSetSearchText("");
                        }} key={project.name}
                                ref={(ref) => {
                                    childRefs[childId] = ref;
                                }}
                        >{project.name}</button>
                    )
                })}
            </VStack>

        </div>
    </div>

    function handleBaseKeyboard(event: KeyboardEvent) {

        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
            showDropdown()
            const keys = Object.keys(childRefs);
            if (keys.length === 0) return true;
            const offset = event.key === "ArrowDown" ? 1 : -1;

            selectedChild.current = loopIndex(selectedChild.current + offset, keys.length);
            const curKey = keys[selectedChild.current];
            childRefs[curKey]?.focus();
        } else if (isCharacterInput(event)) {
            devLog(`Input Focus via ${event.key}`)
            inputRef.current?.focus();
        } else if (event.key === "Escape") {
            inputRef.current?.focus()
        } else if (event.key === "Enter") {
            console.log("Propagate")
            // inputRef.current?.focus();
            return true
        }
        return undefined;
    }


    function hideDropdown() {
        setDropDownDisplay("none")
        resetKeyboardState()
    }
}
