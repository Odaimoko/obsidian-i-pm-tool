// https://docs.obsidian.md/Plugins/User+interface/Views
import {ItemView, Plugin, WorkspaceLeaf} from "obsidian";
import {ReactManagePage} from "./viewCreator";
import {createRoot, Root} from "react-dom/client";
import {createContext, StrictMode} from "react";

export const ManagePageViewId = "iPm-Tool-ManageView";

export class ManagePageView extends ItemView {
    root: Root | null = null;

    plugin: Plugin;

    constructor(leaf: WorkspaceLeaf, plugin: Plugin) {
        super(leaf);
        this.plugin = plugin;
    }

    getViewType() {
        return ManagePageViewId;
    }

    getDisplayText() {
        return "Project Management";
    }

    async onOpen() {
        this.registerEvent(this.app.metadataCache.on("dataview:metadata-change", () => {
            this.renderPage()
        }));
        this.renderPage();
    }


    private renderPage() {
        // TODOQ Why [1]? What is the first child?
        const container = this.containerEl.children[1];

        container.empty();
        // container.createEl("h2", {text: this.getDisplayText()});
        // viewCreator(container, this.plugin)

        // React
        this.root = createRoot(this.containerEl.children[1]); // Override the previous container
        this.root.render(
            <StrictMode>
                <PluginContext.Provider value={this.plugin}>
                    <ReactManagePage/>
                </PluginContext.Provider>
            </StrictMode>,
        );
    }

    async onClose() {
        this.root?.unmount();
    }

}

export const PluginContext = createContext<Plugin>(null);