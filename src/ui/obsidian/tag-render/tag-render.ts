/**
 * MIT License
 *
 * Copyright (c) 2022 Darren Kuro
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 * https://github.com/darrenkuro/obsidian-basetag/blob/master/LICENSE
 */

import {App, livePreviewState, Plugin, PluginSettingTab, Setting} from "obsidian";
import {syntaxTree} from "@codemirror/language";
import {RangeSetBuilder} from "@codemirror/state";
import {
    Decoration,
    DecorationSet,
    EditorView,
    PluginValue,
    ViewPlugin,
    ViewUpdate,
    WidgetType,
} from "@codemirror/view";
import {devLog} from "../../../utils/env-util";
import {
    Tag_Prefix_Step,
    Tag_Prefix_Tag,
    Tag_Prefix_TaskType,
    Tag_Prefix_Workflow
} from "../../../data-model/workflow-def";
import {Tag_Prefix_Project} from "../../../data-model/OdaPmProject";

const tag_class = "basename-tag";

/** Get the current vault name. */
const getVaultName = () => window.app.vault.getName();

/** Create a custom tag node from text content (can include #). */
const createTagNode = (tag: string | null, readingMode: boolean) => {
    const tagNode = document.createElement("a");
    // devLog("[Tag]", tag // the full tag, including #
    if (!tag)
        return tagNode;

    // Keep the 'tag' class for consistent css styles.
    tagNode.className = `tag ${tag_class}`;
    tagNode.target = "_blank";
    tagNode.rel = "noopener";
    // To comply with colorful-tag css seletor
    tagNode.href = readingMode ? `${tag}` : `#${tag}`;

    const vaultStr = encodeURIComponent(getVaultName());
    const queryStr = `tag:${encodeURIComponent(tag)}`;
    tagNode.dataset.uri = `obsidian://search?vault=${vaultStr}&query=${queryStr}`;

    // Remove the hash tags to conform to the same style.
    tagNode.textContent = tag.slice(tag.lastIndexOf("/") + 1).replace("#", "");

    tagNode.onclick = () => window.open(tagNode.dataset.uri);

    return tagNode;
};

/** Create a tag node in the type of widget from text content. */
class TagWidget extends WidgetType {
    constructor(private tag: string, private readingMode: boolean) {
        super();
    }

    toDOM(view: EditorView): HTMLElement {
        return createTagNode(this.tag, this.readingMode);
    }
}

// the only external function, otherwise this plugin is self-contained
function shouldTagBeAbbr(tag: string) {
    const lowerTag = tag.toLowerCase();
    return lowerTag.startsWith(Tag_Prefix_Tag)
        || lowerTag.startsWith(Tag_Prefix_Project)
        || lowerTag.startsWith(Tag_Prefix_Workflow)
        || lowerTag.startsWith(Tag_Prefix_Step)
        || lowerTag.startsWith(Tag_Prefix_Tag)
        || lowerTag.startsWith(Tag_Prefix_TaskType);
}

class editorPlugin implements PluginValue {
    decorations: DecorationSet;

    constructor(view: EditorView) {
        this.decorations = this.buildDecorations(view);
    }

    update(update: ViewUpdate): void {
        if (
            update.view.composing ||
            update.view.plugin(livePreviewState)?.mousedown
        ) {
            this.decorations = this.decorations.map(update.changes);
        } else if (update.selectionSet || update.viewportChanged) {
            this.decorations = this.buildDecorations(update.view);
        }
    }

    private buildDecorations(view: EditorView): DecorationSet {
        const builder = new RangeSetBuilder<Decoration>();

        // console.log(view.visibleRanges) // a subset that is drawn.

        for (const {from, to} of view.visibleRanges) {
            let curHashtagStart = -1; // uninitialized
            let status = 0; // 0 unstarted, 1 started.
            let tag = "";
            syntaxTree(view.state).iterate({
                from,
                to,
                enter: (node) => {

                    // accumulate the full hash tag between hashtag-begin and hashtag-end
                    if (node.name.contains("hashtag")) {

                        // inside some tag `#x/y/_z` 

                        // Do not render if falls under selection (cursor) range.
                        const extendedFrom = node.from - 1;
                        const extendedTo = node.to + 1;

                        for (const range of view.state.selection.ranges) {
                            if (extendedFrom <= range.to && range.from < extendedTo) {
                                curHashtagStart = -1;
                                status = 0;
                                tag = "";
                                return;
                            }
                        }

                        const text = view.state.sliceDoc(node.from, node.to);
                        switch (status) {
                            case 0:
                                // not started
                                if (node.name.contains("hashtag-begin")) {
                                    // without `cm-` prefix, split by `_`
                                    curHashtagStart = node.from;
                                    tag = "" + text;
                                    devLog("[Hashtag] begin", text, node.name.split("_"))
                                    status = 1;
                                }
                                break;
                            case 1:
                                // Handle tags in the text region.
                                if (node.name.contains("hashtag-end")) {
                                    if (curHashtagStart == -1)
                                        return;
                                    tag += text;
                                    status = 0;
                                    if (shouldTagBeAbbr(tag)) {
                                        builder.add(
                                            // To include the "#".
                                            curHashtagStart - 1,
                                            node.to,
                                            Decoration.replace({
                                                widget: new TagWidget(tag, false),
                                            }),
                                        );
                                    }
                                } else {
                                    tag += text;
                                }
                                break;
                        }

                    }

                    // Handle tags in frontmatter.
                    // if (node.name === "hmd-frontmatter") {
                    //     // Do not render if falls under selection (cursor) range.
                    //     const extendedFrom = node.from;
                    //     const extendedTo = node.to + 1;
                    //
                    //     for (const range of view.state.selection.ranges) {
                    //         if (extendedFrom <= range.to && range.from < extendedTo) {
                    //             return;
                    //         }
                    //     }
                    //
                    //     let frontmatterName = "";
                    //     let currentNode = node.node;
                    //
                    //     // Go up the nodes to find the name for frontmatter, max 20.
                    //     for (let i = 0; i < 20; i++) {
                    //         currentNode = currentNode.prevSibling ?? node.node;
                    //         if (currentNode?.name.contains("atom")) {
                    //             frontmatterName = view.state.sliceDoc(
                    //                 currentNode.from,
                    //                 currentNode.to,
                    //             );
                    //             break;
                    //         }
                    //     }
                    //
                    //     // Ignore if it's not frontmatter for tags.
                    //     if (
                    //         frontmatterName.toLowerCase() !== "tags" &&
                    //         frontmatterName.toLowerCase() !== "tag"
                    //     )
                    //         return;
                    //
                    //     const contentNode = node.node;
                    //     const content = view.state.sliceDoc(
                    //         contentNode.from,
                    //         contentNode.to,
                    //     );
                    //     const tagsArray = content.split(" ").filter((tag) => tag !== "");
                    //
                    //     // Loop through the array of tags.
                    //     let currentIndex = contentNode.from;
                    //     for (let i = 0; i < tagsArray.length; i++) {
                    //         builder.add(
                    //             currentIndex,
                    //             currentIndex + tagsArray[i].length,
                    //             Decoration.replace({
                    //                 widget: new TagWidget(tagsArray[i], false),
                    //             }),
                    //         );
                    //
                    //         // Length and the space char.
                    //         currentIndex += tagsArray[i].length + 1;
                    //     }
                    // }
                },
            });
        }

        return builder.finish();
    }
}

// Rerender Property by changing the text directly
const rerenderProperty = () => {
    document
        .querySelectorAll(
            `[data-property-key="tags"] .multi-select-pill-content span:not(.${tag_class})`,
        )
        .forEach((node: HTMLSpanElement) => {
            const text = node.textContent ?? "";
            node.textContent = text.slice(text.lastIndexOf("/") + 1);
            node.className = tag_class;
            node.dataset.tag = text;
        });
}

export default class TagRenderer extends Plugin {
    public settings: SettingParams = DEFAULT_SETTING;

    async onload() {
        // await this.loadSettings();
        this.registerEditorExtension(
            ViewPlugin.fromClass(editorPlugin, {
                decorations: (value) =>
                    // only renders on editor if setting allows
                    this.settings.renderOnEditor
                        ? value.decorations
                        : new RangeSetBuilder<Decoration>().finish(),
            }),
        );

        this.registerMarkdownPostProcessor((el: HTMLElement) => {
            // Find the original tags to render.
            el.querySelectorAll(`a.tag:not(.${tag_class})`).forEach(
                (node: HTMLAnchorElement) => {
                    // Remove class 'tag' so it doesn't get rendered again.
                    node.removeAttribute("class");
                    // Hide this node and append the custom tag node in its place.
                    node.style.display = "none";
                    node.parentNode?.insertBefore(
                        createTagNode(node.textContent, true),
                        node,
                    );
                },
            );
        });

        // Rerender property by changing the text directly
        this.registerEvent(
            this.app.workspace.on("layout-change", rerenderProperty)
        );

        this.registerEvent(
            this.app.workspace.on("file-open", rerenderProperty)
        );

        // this.addSettingTab(new SettingTab(this.app, this));
    }

    async loadSettings() {
        this.settings = Object.assign(DEFAULT_SETTING, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }
}

interface SettingParams {
    renderOnEditor: boolean;
}

const DEFAULT_SETTING: SettingParams = {
    renderOnEditor: true,
};

class SettingTab extends PluginSettingTab {
    constructor(public app: App, public plugin: TagRenderer) {
        super(app, plugin);
    }

    async display() {
        const {settings: setting} = this.plugin;
        const {containerEl} = this;
        containerEl.empty();

        const editorSetting = new Setting(containerEl);
        editorSetting
            .setName("Render on Editor")
            .setDesc("Render basetags also on editor.")
            .addToggle((toggle) => {
                toggle.setValue(setting.renderOnEditor);
                toggle.onChange(async (value) => {
                    setting.renderOnEditor = value;
                    await this.plugin.saveSettings();
                });
            });
    }
}
