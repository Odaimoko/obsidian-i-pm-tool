import process from "process";
import OdaPmToolPlugin from "../main";
import {expect} from "chai";
import {OdaPmDb} from "../data-model/odaPmDb";
import {OdaPmProject, ProjectDefinedType, ProjectName_Unclassified} from "../data-model/OdaPmProject";
import {OdaPmTask} from "../data-model/OdaPmTask";
import {I_OdaPmWorkflow} from "../data-model/workflow-def";

export function isProduction() {
    return process.env.NODE_ENV === "production";
}

export function devLog(...args: any[]) {
    if (isProduction()) return;
    console.log(...args);
}

export function devAssert(...args: any[]) {
    if (isProduction()) return;
    console.assert(...args)
}

// Test in dev mode.
export function assertOnPluginInit(plugin: OdaPmToolPlugin) {
    if (isProduction()) return;
    console.log("Assert start: on plugin init...");
    console.log("Assert End: on plugin init.")
}

interface AssertFunctions {
    expectTaskInProject: (taskName: string, projectName: string) => void;
    expectTaskPath: (taskName: string, path: string) => void;
    expectWorkflowInProject: (workflowName: string, projectName: string) => void;
    // expectProject: (projectName: string, definedType?: ProjectDefinedType) => void;
}

const dbAssertFunctions: AssertFunctions = {
    expectTaskPath: () => {
        throw new Error("Not Implemented.")
    },
    expectTaskInProject: () => {
        throw new Error("Not Implemented.")
    },
    expectWorkflowInProject: () => {
        throw new Error("Not Implemented.")
    },

}

function expect_project(prj: OdaPmProject | undefined, projectName: string, definedType?: ProjectDefinedType) {
    expect(prj).to.not.be.undefined;
    if (prj) {
        expect(prj.name).to.equal(projectName);
        if (definedType)
            expect(prj.hasDefinedType(definedType)).to.be.true;
    }
}

function expectTaskAbstract(pmDb: OdaPmDb, taskSummary: string, func: (task: OdaPmTask) => void) {
    const task = pmDb.getPmTaskBySummary(taskSummary);
    expect(task, `Task ${taskSummary} not found.`).to.not.be.null;
    if (task) {
        func(task);
    }
}

function expectWorkflowAbstract(pmDb: OdaPmDb, workflowName: string, func: (workflow: I_OdaPmWorkflow) => void) {
    const workflow = pmDb.getWorkflowByName(workflowName);
    expect(workflow, `Workflow ${workflowName} not found.`).to.not.be.null;
    if (workflow) {
        func(workflow);
    }
}

async function testProjectDefinition(projects: OdaPmProject[], pmDb: OdaPmDb) {
    const ut_projects = projects.filter(k =>
        k.name.startsWith("UT_020_1_") && (k.hasDefinedType("file") || k.hasDefinedType("folder"))
    );
    const correct = 4;
    expect(ut_projects, `Front matter defined projects not matched. Prefix 'UT_020_1_'.`)
        .to.have.lengthOf(correct);

    const expectTaskInProject = dbAssertFunctions.expectTaskInProject;
    const expectWorkflowInProject = dbAssertFunctions.expectWorkflowInProject;
    expect_project(pmDb.getProjectByName("UT_020_1_Project_Layer_1_task_definition"),
        "UT_020_1_Project_Layer_1_task_definition", "tag_override");

    expectWorkflowInProject("UT_020_2_1_Wf", ProjectName_Unclassified);
    expectTaskInProject("UT_020_2_1_Task", ProjectName_Unclassified);

    expectWorkflowInProject("UT_020_2_2_Wf", "UT_020_2_Project_Layer_1_folder_definition");
    expectTaskInProject("UT_020_2_2_Task", "UT_020_2_Project_Layer_1_folder_definition");

    expectWorkflowInProject("UT_020_2_3_Wf", "UT_020_2_Project_Layer_1_file_definition");
    expectTaskInProject("UT_020_2_3_Task", "UT_020_2_Project_Layer_1_file_definition");

    expectWorkflowInProject("UT_020_2_4_Wf", "UT_020_2_Project_Layer_1_task_definition");
    expectTaskInProject("UT_020_2_4_Task", "UT_020_2_Project_Layer_1_task_definition");
    devLog("Test PASSED: Project Definition.")
}

async function testTaskProjectLink(pmDb: OdaPmDb) {

    const expectTaskInProject = dbAssertFunctions.expectTaskInProject;

    expectTaskInProject("UT_020_3_2_Unclassified", ProjectName_Unclassified);
    expectTaskInProject("UT_020_3_2_Prj4", "UT_020_3_Prj4");
    expectTaskInProject("UT_020_3_2_file1_Prj1", "UT_020_3_Prj1")
    expectTaskInProject("UT_020_3_2_file2_Prj2", "UT_020_3_Prj2")
    expectTaskInProject("UT_020_3_2_file3_Prj1", "UT_020_3_Prj1")
    expectTaskInProject("UT_020_3_2_file3_Prj3", "UT_020_3_Prj3")
    expectTaskInProject("UT_020_3_2_file4_Prj3", "UT_020_3_Prj3")
    devLog("Test PASSED: Task Project Link.")
}

async function testGetTaskProjectPath(pmDb: OdaPmDb) {
    const expectTaskPath = dbAssertFunctions.expectTaskPath;

    expectTaskPath("UT_020_3_2_Unclassified", "/UT_020_3 layer 0 file_any.md");
    expectTaskPath("UT_020_3_2_Prj4", "/UT_020_3 layer 0 file_any.md:UT_020_3_Prj4");
    expectTaskPath("UT_020_3_2_file1_Prj1", "/UT_020_3 project Folder/UT_020_3 projectroot Prj1.md")
    expectTaskPath("UT_020_3_2_file2_Prj2", "/UT_020_3 project Folder/UT_020_3 file2 Prj2.md")
    expectTaskPath("UT_020_3_2_file3_Prj1", "/UT_020_3 project Folder/UT_020_3 file3 Prj1.md")
    expectTaskPath("UT_020_3_2_file3_Prj3", "/UT_020_3 project Folder/UT_020_3 file3 Prj1.md:UT_020_3_Prj3")
    expectTaskPath("UT_020_3_2_file4_Prj3", "/UT_020_3 project Folder/UT_020_3 file4 Prj3.md")
    devLog("Test PASSED: Get Task Project Path.")
}

async function test_UT_020_3(pmDb: OdaPmDb) {
    // UT_020_3
    // Sanity check
    const ut_020_3_tasks = pmDb.pmTasks.filter(k => {
        return k.summary.startsWith("UT_020_3")
    });
    expect(ut_020_3_tasks, `PmTask with prefix 'UT_020_3' not matched`).to.have.lengthOf(7);
    testGetTaskProjectPath(pmDb);
    testTaskProjectLink(pmDb);
}

function initAssertFunctions(pmDb: OdaPmDb) {

    dbAssertFunctions.expectTaskInProject = (taskName: string, projectName: string) => expectTaskAbstract(pmDb, taskName,
        (task) => {
            expect(task.isInProject(projectName),
                `Task ${taskName} not in project ${projectName}. Task Path: ${task.getProjectPath()}. Task Project: ${JSON.stringify(task.getProjectNames())}`)
                .true;
        })
    dbAssertFunctions.expectTaskPath = (taskName: string, path: string) => expectTaskAbstract(pmDb, taskName,
        (task) => {
            expect(task.getProjectPath(),
                `Task ${taskName} 's path not matched.`)
                .equal(path);
        })
    dbAssertFunctions.expectWorkflowInProject = (workflowName: string, projectName: string) => expectWorkflowAbstract(pmDb, workflowName,
        (workflow) => {
            expect(workflow.isInProject(projectName),
                `Workflow ${workflowName} not in project ${projectName}.`)
                .true;
        }
    )
}

// make this async so the failing tests won't block the plugin and database initialization process.
export async function assertOnDbRefreshed(pmDb: OdaPmDb) {
    devLog("Assert start: on db refreshed...")
    initAssertFunctions(pmDb);
    const projects = pmDb.pmProjects;

    const projectIds = projects.map(k => k.internalKey).unique();
    expect(projectIds, `Project ids are not unique.`).to.have.lengthOf(projects.length);
    testProjectDefinition(projects, pmDb);
    test_UT_020_3(pmDb);
    devLog("Assert end: on db refreshed...")
}
