import {Vault, Workspace} from "obsidian";
import {STask} from "obsidian-dataview";

// region Copied from dataview

// Do we really need to replace the whole file?
// Yes we do, because there's no editor.
/** Rewrite a task with the given completion status and new text. */
export async function rewriteTask(vault: Vault, task: STask, desiredStatus: string, desiredText?: string) {
    if (desiredStatus == task.status && (desiredText == undefined || desiredText == task.text)) return;
    desiredStatus = desiredStatus == "" ? " " : desiredStatus;
    const rawFiletext = await vault.adapter.read(task.path);
    const hasRN = rawFiletext.contains("\r");
    const filetext = rawFiletext.split(/\r?\n/u);

    if (filetext.length < task.line) return;
    const match = LIST_ITEM_REGEX.exec(filetext[task.line]);
    if (!match || match[2].length == 0) return;

    const taskTextParts = task.text.split("\n");
    if (taskTextParts[0].trim() != match[3].trim()) return;

    // We have a positive match here at this point, so go ahead and do the rewrite of the status.
    const initialSpacing = /^[\s>]*/u.exec(filetext[task.line])![0];
    if (desiredText) {
        const desiredParts = desiredText.split("\n");

        const newTextLines: string[] = [`${initialSpacing}${task.symbol} [${desiredStatus}] ${desiredParts[0]}`].concat(
            desiredParts.slice(1).map(l => initialSpacing + "\t" + l)
        );

        filetext.splice(task.line, task.lineCount, ...newTextLines);
    } else {
        filetext[task.line] = `${initialSpacing}${task.symbol} [${desiredStatus}] ${taskTextParts[0].trim()}`;
    }

    const newText = filetext.join(hasRN ? "\r\n" : "\n");
    await vault.adapter.write(task.path, newText);
}

export const LIST_ITEM_REGEX = /^[\s>]*(\d+\.|\d+\)|\*|-|\+)\s*(\[.{0,1}\])?\s*(.*)$/mu;


// endregion
// if we use workspace.openLinkText, a task without a block id will be opened with its section
export function openTaskPrecisely(workspace: Workspace, task: STask) {
    // Copy from dataview. See TaskItem.
    workspace.openLinkText(
        task.link.toFile().obsidianLink(),
        task.path,
        false,
        {
            eState: {
                cursor: {
                    from: {line: task.line, ch: task.position.start.col},
                    to: {line: task.line + task.lineCount - 1, ch: task.position.end.col},
                },
                line: task.line,
            },
        }
    );
}
