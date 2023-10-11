import {ItemView, Plugin, WorkspaceLeaf} from "obsidian";
import {getAPI, Literal, STask} from "obsidian-dataview";
import {
    getDefTags,
    getTypeDefTag,
    OdaPmWorkflowType,
    Workflow_Type_Enum_Array
} from "./workflow/workflow_chain";
// https://docs.obsidian.md/Plugins/User+interface/Views
export const ManagePageViewId = "iPm-Tool-ManageView";

const dv = getAPI(); // We can use dv just like the examples in the docs

function createWorkflowFromTask(task: STask): OdaPmWorkflowType[] {
    const workflows = []
    const defTags = getDefTags();
    for (const wfType of Workflow_Type_Enum_Array) {
        const defTag = getTypeDefTag(wfType);
        if (task.tags.includes(defTag)) {
            const workflow: OdaPmWorkflowType = new OdaPmWorkflowType(wfType, trimTagsFromTask(task));

            for (const tag of task.tags) {
                // exclude def tags. we allow both OdaPmWorkflowType on the same task
                if (defTags.includes(tag)) {
                    continue;
                }
                workflow.addStep(tag)
            }
            workflows.push(workflow)
        }
    }

    return workflows;
}

function trimTagsFromTask(task: STask): string {
    // remove all tags from text
    let text: string = task.text;
    for (const tag of task.tags) {
        text = text.replace(tag, "")
    }
    return text.trim()
}

function createDvEl(container: Element, plugin: Plugin) {

    // const f = await dv.pages() // DataArray<SMarkdownPage[]>, 
    // DataArray supports some linq expressions
    // SMarkdownPage is a page. STask is a task. SListItemBase is a list item.
    // Replace .file.tasks with index access

    const list =
        dv.pages()["file"]["tasks"].where(function (k: STask) {
                for (const defTag of getDefTags()) {
                    if (k.tags.includes(defTag)) return true;
                }
                return false;
            }
        )
            .flatMap((task: STask) => createWorkflowFromTask(task))
    ;

    // Vis
    const defitionstDiv = container.createEl("h3", {text: "Task Types"});
    const bodyDiv = defitionstDiv.createEl("body");
    const torender = list.map((wf: OdaPmWorkflowType): Literal => {
        return wf.toObject();
    })
    dv.list(torender, bodyDiv, plugin);
}

export class ManagePageView extends ItemView {

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
        const container = this.containerEl.children[1];
        container.empty();
        container.createEl("h2", {text: this.getDisplayText()});
        createDvEl(container, this.plugin)
    }

    async onClose() {
        // Nothing to clean up.
    }
}

