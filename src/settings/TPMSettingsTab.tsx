import {App, PluginSettingTab, Setting, ValueComponent} from "obsidian";
import TPMPlugin from "../main";
import {createRoot, Root} from "react-dom/client";
import React, {useState} from "react";
import {getSettings, setSettingsValueAndSave, SettingName, usePluginSettings} from "./settings";
import {SerializedType} from "./SerializedType";
import {ONotice} from "../utils/o-notice";
import {isTagNameValid, POTENTIAL_TAG_MATCHER} from "../data-model/markdown-parse";
import {HStack} from "../ui/react-view/view-template/h-stack";
import {PluginContext} from "../ui/obsidian/manage-page-view";
import {
    centerChildren,
    centerChildrenHoriVertStyle,
    diffGroupSpacing,
    sameGroupSpacing
} from "../ui/react-view/style-def";
import {DataTable} from "../ui/react-view/view-template/data-table";
import {Tag_Prefix_Tag} from "../data-model/workflow-def";
import {getPriorityIcon} from "../ui/react-view/task-table-view";
import {TwiceConfirmButton} from "../ui/react-view/view-template/twice-confirm-button";
import {ObsidianIconView} from "../ui/react-view/view-template/icon-view";
import {Evt_ReqDbReload} from "../typing/dataview-event";

export class TPMSettingsTab extends PluginSettingTab {
    plugin: TPMPlugin;
    private root: Root;

    constructor(app: App, plugin: TPMPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty(); // This is settings page, after clicking the tab.

        // const header = containerEl.createEl("div");
        // const head = header.createEl("label");
        // head.style.display = "flex";
        // head.createEl("h1", {text: this.plugin.manifest.name});
        // head.createEl("h2", {text: "by Odaimoko"});
        // containerEl.createEl("h3", {text: "Plugin Behaviours"});
        new Setting(containerEl)
            .setName('Notify when a task is malformed')
            .setDesc('A task or workflow definition is malformed if it contains multiple lines, or the text is empty. Try adding blank line before or after the task.')
            .addToggle(this.setValueAndSave("report_malformed_task"));
        new Setting(containerEl)
            .setName('Capitalized the first letter in table row')
            .addToggle(this.setValueAndSave("capitalize_table_row_initial"));

        const projectHeader = containerEl.createEl("h2", {text: "Projects"})

        new Setting(containerEl)
            .setName('Unclassified workflows available for all projects')
            .setDesc("If ON, unclassified workflows will be available to any projects. If OFF, only workflows in that project are available.")
            .addToggle(this.setValueAndSave("unclassified_workflows_available_to_all_projects"));
        const headerAsModule = new Setting(containerEl).setName("Header as module")
            .setDesc("If ON, the tasks under headers with the same name can be grouped together.")
            .addToggle(this.setValueAndSave("manage_page_header_as_module"));

        const priTagDiv = containerEl.createDiv();
        priTagDiv.className = "setting-item";

        this.root = createRoot(priTagDiv); // Override the previous container
        this.root.render(
            <PluginContext.Provider value={this.plugin}>
                <PriorityTagsEditView/>
            </PluginContext.Provider>
        )

    }

    setValueAndSave<T extends SerializedType>(settingName: SettingName) {
        return (vc: ValueComponent<T>) =>
            // @ts-ignore
            vc.setValue(this.plugin.settings[settingName])
                // @ts-ignore
                .onChange?.(async (value: T) => {
                    await setSettingsValueAndSave(this.plugin, settingName, value)
                }
            );
    }

} // Singleton!

export function PriorityTagsEditView() {
    const plugin = React.useContext(PluginContext);
    const labels = ["High", "Med High", "Medium", "Med Low", "Low"]
    const [editingTags, setEditingTags] = useState<string[]>(getSettings()?.priority_tags as string[])
    const [settingsTags, setSettingsTags] = usePluginSettings<string[]>("priority_tags")
    const headers: string[] = []


    const rows = labels.map(k => {
        const idx = labels.indexOf(k);
        const oriTag = editingTags[idx];
        return [
            <HStack>
                {getPriorityIcon(idx)}
                <label>{k}</label>
            </HStack>,
            <HStack style={centerChildrenHoriVertStyle}>
                <label>{Tag_Prefix_Tag}</label>
                <input style={{width: 60}} type={"text"}
                       placeholder={oriTag}
                       value={oriTag}
                       onChange={(e) => {
                           const tag = e.target.value;
                           const match = tag.match(POTENTIAL_TAG_MATCHER);
                           if (!match || match.length == 0 || match[0].length != tag.length) {
                               new ONotice(`Invalid tag: ${tag}.`);
                               return;
                           }
                           editingTags[idx] = tag;
                           setEditingTags([...editingTags])

                       }}
                />
            </HStack>
        ]
    })
    return <div>
        <HStack style={{justifyContent: "space-between"}} spacing={diffGroupSpacing}>
            <div>

                <div className={"setting-item-name"}>Priority tags</div>
                <div className={"setting-item-description"}>

                    <p>
                        Customize your priority tags.
                    </p>
                    <p>
                        Current tags are: <b>{settingsTags.join(", ")}.</b>
                    </p>
                    <HStack style={centerChildren}>
                        <label>
                            On save, the priority tags will be replaced in all tasks.
                            This is NOT undoable.
                        </label>
                        <TwiceConfirmButton
                            onConfirm={() => {
                                // Do not save if any tag is invalid
                                for (const tag of editingTags) {
                                    if (!isTagNameValid(tag)) {
                                        new ONotice(`Priority tags not saved. Invalid tag: ${tag}.`);
                                        return;
                                    }
                                }
                                setSettingsTags([...editingTags]).then(() => {
                                    setEditingTags([...editingTags]) // re-render
                                    // TODO replace tags in all tasks
                                    // Trigger database refresh
                                    plugin.getEmitter().emit(Evt_ReqDbReload)
                                })
                            }}
                            confirmView={
                                <HStack style={centerChildren} spacing={sameGroupSpacing}>

                                    <ObsidianIconView style={{color: "var(--text-warning)"}}
                                                      iconName={"alert-circle"}/>
                                    <label>Save</label>
                                </HStack>

                            }
                            twiceConfirmView={<label>Confirm</label>}
                        />
                    </HStack>
                </div>

            </div>
            <DataTable tableTitle={"Pri"} headers={headers} rows={rows}/>

        </HStack>
    </div>
}
