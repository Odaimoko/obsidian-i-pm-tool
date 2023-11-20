import {App, Component, MarkdownRenderer} from "obsidian";
import React from "react";
import {HtmlStringComponent} from "./react-view/view-template/html-string-component";

export const templateMd = `# Workflows
A workflow definition is a **task** with either #tpm/workflow_type/chain or #tpm/workflow_type/checkbox. 

These are valid workflows.

- [ ] write_scripts #tpm/workflow_type/chain #tpm/step/write #tpm/step/revise #tpm/step/export
- [ ] card_design #tpm/workflow_type/checkbox #tpm/step/data #tpm/step/effect #tpm/step/art
- [ ] implementation #tpm/workflow_type/checkbox #tpm/step/impl #tpm/step/test 

This cannot define a workflow, since it's not a task
- portrait_drawing #tpm/workflow_type/chain #tpm/step/draft #tpm/step/color

If a workflow is marked with both tags, the latter one is taken. This is a workflow of type checkbox.
- [ ] multi_workflow_type #tpm/workflow_type/chain #tpm/workflow_type/checkbox #tpm/step/art #tpm/step/data 

If multiple names are given, the first will be chosen as the name. This workflow is named \`multi-name\`.
- [ ] &! \`multi-name\` multi_name2 #tpm/workflow_type/checkbox #tpm/step/art #tpm/step/data 
The special characters does not count.
# Tasks
Use list items to write descriptions.
- [ ] write preface #tpm/workflow/write_scripts #tpm/step/write #tpm/tag/prj_book
\t- Editor says do not include spoilers
- [ ] card: warlock, normal attack #tpm/workflow/card_design  #tpm/tag/prj_card  
\t- [ ] card warlock, fire magic #tpm/workflow/card_design #tpm/step/art #tpm/tag/abandoned
\t- Note: The card needs to be as weak as possible.
- [ ] animations of drawing cards  #tpm/step/impl #tpm/workflow/implementation #tpm/tag/prj_card 
\t- must be smooth 
\t- less than 1.5 sec
- [ ] python code to convert my script into ren'py format #tpm/workflow/implementation  #tpm/tag/prj_book  

This is not a valid task, because it has indentation after a non-list item.
    - [ ] This is a not valid task #tpm/workflow/card_design 

- A list item
\t- [ ] A valid task under a list item #tpm/workflow/card_design #tpm/step/data #tpm/step/effect 
`

const templateHtmlString = `<div class="view-content"><div style="display: flex; justify-content: center; margin-bottom: -20px;"><div style="align-items: center; display: flex; flex-direction: row;"><h1>Tag Project Manage Page</h1><div style="width: 10px;"></div><span><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-help-circle"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg></span></a><span></span></span></div></div><span style="display: flex;"><div style="display: flex; align-items: center; flex-direction: row;"><h2>2/4 Workflow(s)</h2><div style="width: 10px;"></div><button>Select All</button><div style="width: 10px;"></div><button>Unselect All</button><div style="width: 10px;"></div><div style="display: flex; flex-direction: row;"><span><div style="display: flex; flex-direction: row;"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-footprints"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"></path><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"></path><path d="M16 17h4"></path><path d="M4 13h4"></path></svg></span><div style="width: 3px;"></div><label>Chain</label></div></span><div style="width: 10px;"></div><span><div style="display: flex; flex-direction: row;"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check-check"><path d="M18 6 7 17l-5-5"></path><path d="m22 10-7.5 7.5L13 16"></path></svg></span><div style="width: 3px;"></div><label>Checkbox</label></div></span></div></div></span><div><span style="display: inline-block; margin-right: 15px;"><span><input type="checkbox" checked=""><label><span><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon link"><path d="M13.1404 10C13.6728 10.3955 14.1134 10.9001 14.4322 11.4796C14.7511 12.0591 14.9407 12.6999 14.9882 13.3586C15.0357 14.0172 14.94 14.6783 14.7076 15.297C14.4751 15.9157 14.1115 16.4775 13.6412 16.9443L10.8588 19.7073C9.98423 20.5462 8.81284 21.0103 7.59697 20.9998C6.38109 20.9893 5.21801 20.505 4.35822 19.6512C3.49844 18.7974 3.01074 17.6424 3.00018 16.435C2.98961 15.2276 3.45702 14.0644 4.30173 13.1959L5.88768 11.6117"></path><path d="M10.8596 14C10.3272 13.6045 9.88658 13.0999 9.56776 12.5204C9.24894 11.9409 9.05935 11.3001 9.01185 10.6414C8.96435 9.98279 9.06004 9.32171 9.29245 8.70302C9.52486 8.08433 9.88853 7.52251 10.3588 7.05567L13.1412 4.29268C14.0158 3.45384 15.1872 2.98968 16.403 3.00017C17.6189 3.01067 18.782 3.49497 19.6418 4.34877C20.5016 5.20257 20.9893 6.35756 20.9998 7.56498C21.0104 8.77239 20.543 9.93562 19.6983 10.8041L18.1123 12.379"></path></svg></span></a><span><span style="display: inline-flex; justify-items: center;"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-footprints"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"></path><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"></path><path d="M16 17h4"></path><path d="M4 13h4"></path></svg></span><label style="margin-left: 3px;">write_scripts</label></span></span></span></label></span></span><span style="display: inline-block; margin-right: 15px;"><span><input type="checkbox" checked=""><label><span><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon link"><path d="M13.1404 10C13.6728 10.3955 14.1134 10.9001 14.4322 11.4796C14.7511 12.0591 14.9407 12.6999 14.9882 13.3586C15.0357 14.0172 14.94 14.6783 14.7076 15.297C14.4751 15.9157 14.1115 16.4775 13.6412 16.9443L10.8588 19.7073C9.98423 20.5462 8.81284 21.0103 7.59697 20.9998C6.38109 20.9893 5.21801 20.505 4.35822 19.6512C3.49844 18.7974 3.01074 17.6424 3.00018 16.435C2.98961 15.2276 3.45702 14.0644 4.30173 13.1959L5.88768 11.6117"></path><path d="M10.8596 14C10.3272 13.6045 9.88658 13.0999 9.56776 12.5204C9.24894 11.9409 9.05935 11.3001 9.01185 10.6414C8.96435 9.98279 9.06004 9.32171 9.29245 8.70302C9.52486 8.08433 9.88853 7.52251 10.3588 7.05567L13.1412 4.29268C14.0158 3.45384 15.1872 2.98968 16.403 3.00017C17.6189 3.01067 18.782 3.49497 19.6418 4.34877C20.5016 5.20257 20.9893 6.35756 20.9998 7.56498C21.0104 8.77239 20.543 9.93562 19.6983 10.8041L18.1123 12.379"></path></svg></span></a><span><span style="display: inline-flex; justify-items: center;"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check-check"><path d="M18 6 7 17l-5-5"></path><path d="m22 10-7.5 7.5L13 16"></path></svg></span><label style="margin-left: 3px;">card_design</label></span></span></span></label></span></span><span style="display: inline-block; margin-right: 15px;"><span><input type="checkbox"><label><span><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon link"><path d="M13.1404 10C13.6728 10.3955 14.1134 10.9001 14.4322 11.4796C14.7511 12.0591 14.9407 12.6999 14.9882 13.3586C15.0357 14.0172 14.94 14.6783 14.7076 15.297C14.4751 15.9157 14.1115 16.4775 13.6412 16.9443L10.8588 19.7073C9.98423 20.5462 8.81284 21.0103 7.59697 20.9998C6.38109 20.9893 5.21801 20.505 4.35822 19.6512C3.49844 18.7974 3.01074 17.6424 3.00018 16.435C2.98961 15.2276 3.45702 14.0644 4.30173 13.1959L5.88768 11.6117"></path><path d="M10.8596 14C10.3272 13.6045 9.88658 13.0999 9.56776 12.5204C9.24894 11.9409 9.05935 11.3001 9.01185 10.6414C8.96435 9.98279 9.06004 9.32171 9.29245 8.70302C9.52486 8.08433 9.88853 7.52251 10.3588 7.05567L13.1412 4.29268C14.0158 3.45384 15.1872 2.98968 16.403 3.00017C17.6189 3.01067 18.782 3.49497 19.6418 4.34877C20.5016 5.20257 20.9893 6.35756 20.9998 7.56498C21.0104 8.77239 20.543 9.93562 19.6983 10.8041L18.1123 12.379"></path></svg></span></a><span><span style="display: inline-flex; justify-items: center;"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check-check"><path d="M18 6 7 17l-5-5"></path><path d="m22 10-7.5 7.5L13 16"></path></svg></span><label style="margin-left: 3px;">implementation</label></span></span></span></label></span></span><span style="display: inline-block; margin-right: 15px;"><span><input type="checkbox"><label><span><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon link"><path d="M13.1404 10C13.6728 10.3955 14.1134 10.9001 14.4322 11.4796C14.7511 12.0591 14.9407 12.6999 14.9882 13.3586C15.0357 14.0172 14.94 14.6783 14.7076 15.297C14.4751 15.9157 14.1115 16.4775 13.6412 16.9443L10.8588 19.7073C9.98423 20.5462 8.81284 21.0103 7.59697 20.9998C6.38109 20.9893 5.21801 20.505 4.35822 19.6512C3.49844 18.7974 3.01074 17.6424 3.00018 16.435C2.98961 15.2276 3.45702 14.0644 4.30173 13.1959L5.88768 11.6117"></path><path d="M10.8596 14C10.3272 13.6045 9.88658 13.0999 9.56776 12.5204C9.24894 11.9409 9.05935 11.3001 9.01185 10.6414C8.96435 9.98279 9.06004 9.32171 9.29245 8.70302C9.52486 8.08433 9.88853 7.52251 10.3588 7.05567L13.1412 4.29268C14.0158 3.45384 15.1872 2.98968 16.403 3.00017C17.6189 3.01067 18.782 3.49497 19.6418 4.34877C20.5016 5.20257 20.9893 6.35756 20.9998 7.56498C21.0104 8.77239 20.543 9.93562 19.6983 10.8041L18.1123 12.379"></path></svg></span></a><span><span style="display: inline-flex; justify-items: center;"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check-check"><path d="M18 6 7 17l-5-5"></path><path d="m22 10-7.5 7.5L13 16"></path></svg></span><label style="margin-left: 3px;">multi_workflow_type</label></span></span></span></label></span></span></div><div style="align-items: center; display: flex; flex-direction: row;"><h3>0/3 Tags(s)</h3><div style="width: 10px;"></div><button>Include All</button><div style="width: 10px;"></div><button>Exclude All</button><div style="width: 10px;"></div><button>Clear</button></div><div><span style="display: inline-block; margin: 3px;"><span style="display: inline-flex; justify-items: center;"><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-scan"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></svg></span></a><span><label style="margin-left: 5px;">prj_book</label></span></span></span><span style="display: inline-block; margin: 3px;"><span style="display: inline-flex; justify-items: center;"><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-scan"><path d="M3 7V5a2 2 0 0 1 2-2h2"></path><path d="M17 3h2a2 2 0 0 1 2 2v2"></path><path d="M21 17v2a2 2 0 0 1-2 2h-2"></path><path d="M7 21H5a2 2 0 0 1-2-2v-2"></path></svg></span></a><span><label style="margin-left: 5px;">prj_card</label></span></span></span><span style="display: inline-block; margin: 3px;"><span style="display: inline-flex; justify-items: center;"><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg></span></a><span><label style="margin-left: 5px;">abandoned</label></span></span></span></div><p></p><div style="justify-content: flex-start; align-items: center; display: flex; flex-direction: row;"><span style="display: flex; align-items: center;"><input type="text" placeholder="Search task name..." value="" style="width: 100%;"><span style="margin-left: -25px; padding-top: 5px;"><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-x-circle"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></span></a><span></span></span></span><div style="width: 10px;"></div><div style="align-items: center; display: flex; flex-direction: row;"><label> Sort </label><div style="width: 4px;"></div><button>Ascending</button></div></div><p></p><div style="display: flex; flex-direction: row;"><span><input type="checkbox" checked=""><label>Show Completed</label></span><div style="width: 10px;"></div><span><input type="checkbox" checked=""><label>Show Steps</label></span></div><p></p><table><tbody><tr><td style="min-width: 300px; max-width: 500px; padding: 5px 5px 5px 10px; background-color: rgba(0, 0, 0, 0.2);"><div style="display: flex; flex-direction: row;"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check-check"><path d="M18 6 7 17l-5-5"></path><path d="m22 10-7.5 7.5L13 16"></path></svg></span><div style="width: 5px;"></div><span><input type="checkbox"><label><span><span><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon link"><path d="M13.1404 10C13.6728 10.3955 14.1134 10.9001 14.4322 11.4796C14.7511 12.0591 14.9407 12.6999 14.9882 13.3586C15.0357 14.0172 14.94 14.6783 14.7076 15.297C14.4751 15.9157 14.1115 16.4775 13.6412 16.9443L10.8588 19.7073C9.98423 20.5462 8.81284 21.0103 7.59697 20.9998C6.38109 20.9893 5.21801 20.505 4.35822 19.6512C3.49844 18.7974 3.01074 17.6424 3.00018 16.435C2.98961 15.2276 3.45702 14.0644 4.30173 13.1959L5.88768 11.6117"></path><path d="M10.8596 14C10.3272 13.6045 9.88658 13.0999 9.56776 12.5204C9.24894 11.9409 9.05935 11.3001 9.01185 10.6414C8.96435 9.98279 9.06004 9.32171 9.29245 8.70302C9.52486 8.08433 9.88853 7.52251 10.3588 7.05567L13.1412 4.29268C14.0158 3.45384 15.1872 2.98968 16.403 3.00017C17.6189 3.01067 18.782 3.49497 19.6418 4.34877C20.5016 5.20257 20.9893 6.35756 20.9998 7.56498C21.0104 8.77239 20.543 9.93562 19.6983 10.8041L18.1123 12.379"></path></svg></span></a><span>A valid task under a list item</span></span></span></label></span></div></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"><span><input type="checkbox" checked=""><label></label></span></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"><span><input type="checkbox" checked=""><label></label></span></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"><span><input type="checkbox"><label></label></span></td></tr><tr><td style="min-width: 300px; max-width: 500px; padding: 5px 5px 5px 10px;"><div style="display: flex; flex-direction: row;"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-check-check"><path d="M18 6 7 17l-5-5"></path><path d="m22 10-7.5 7.5L13 16"></path></svg></span><div style="width: 5px;"></div><span><input type="checkbox"><label><span><span><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon link"><path d="M13.1404 10C13.6728 10.3955 14.1134 10.9001 14.4322 11.4796C14.7511 12.0591 14.9407 12.6999 14.9882 13.3586C15.0357 14.0172 14.94 14.6783 14.7076 15.297C14.4751 15.9157 14.1115 16.4775 13.6412 16.9443L10.8588 19.7073C9.98423 20.5462 8.81284 21.0103 7.59697 20.9998C6.38109 20.9893 5.21801 20.505 4.35822 19.6512C3.49844 18.7974 3.01074 17.6424 3.00018 16.435C2.98961 15.2276 3.45702 14.0644 4.30173 13.1959L5.88768 11.6117"></path><path d="M10.8596 14C10.3272 13.6045 9.88658 13.0999 9.56776 12.5204C9.24894 11.9409 9.05935 11.3001 9.01185 10.6414C8.96435 9.98279 9.06004 9.32171 9.29245 8.70302C9.52486 8.08433 9.88853 7.52251 10.3588 7.05567L13.1412 4.29268C14.0158 3.45384 15.1872 2.98968 16.403 3.00017C17.6189 3.01067 18.782 3.49497 19.6418 4.34877C20.5016 5.20257 20.9893 6.35756 20.9998 7.56498C21.0104 8.77239 20.543 9.93562 19.6983 10.8041L18.1123 12.379"></path></svg></span></a><span>Card: warlock, normal attack</span></span></span></label></span></div></td><td style="text-align: center;"></td><td style="text-align: center;"></td><td style="text-align: center;"></td><td style="text-align: center;"><span><input type="checkbox"><label></label></span></td><td style="text-align: center;"><span><input type="checkbox"><label></label></span></td><td style="text-align: center;"><span><input type="checkbox"><label></label></span></td></tr><tr><td style="min-width: 300px; max-width: 500px; padding: 5px 5px 5px 10px; background-color: rgba(0, 0, 0, 0.2);"><div style="display: flex; flex-direction: row;"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon lucide-footprints"><path d="M4 16v-2.38C4 11.5 2.97 10.5 3 8c.03-2.72 1.49-6 4.5-6C9.37 2 10 3.8 10 5.5c0 3.11-2 5.66-2 8.68V16a2 2 0 1 1-4 0Z"></path><path d="M20 20v-2.38c0-2.12 1.03-3.12 1-5.62-.03-2.72-1.49-6-4.5-6C14.63 6 14 7.8 14 9.5c0 3.11 2 5.66 2 8.68V20a2 2 0 1 0 4 0Z"></path><path d="M16 17h4"></path><path d="M4 13h4"></path></svg></span><div style="width: 5px;"></div><span><input type="checkbox"><label><span><span><a class="cm-underline"><span><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="svg-icon link"><path d="M13.1404 10C13.6728 10.3955 14.1134 10.9001 14.4322 11.4796C14.7511 12.0591 14.9407 12.6999 14.9882 13.3586C15.0357 14.0172 14.94 14.6783 14.7076 15.297C14.4751 15.9157 14.1115 16.4775 13.6412 16.9443L10.8588 19.7073C9.98423 20.5462 8.81284 21.0103 7.59697 20.9998C6.38109 20.9893 5.21801 20.505 4.35822 19.6512C3.49844 18.7974 3.01074 17.6424 3.00018 16.435C2.98961 15.2276 3.45702 14.0644 4.30173 13.1959L5.88768 11.6117"></path><path d="M10.8596 14C10.3272 13.6045 9.88658 13.0999 9.56776 12.5204C9.24894 11.9409 9.05935 11.3001 9.01185 10.6414C8.96435 9.98279 9.06004 9.32171 9.29245 8.70302C9.52486 8.08433 9.88853 7.52251 10.3588 7.05567L13.1412 4.29268C14.0158 3.45384 15.1872 2.98968 16.403 3.00017C17.6189 3.01067 18.782 3.49497 19.6418 4.34877C20.5016 5.20257 20.9893 6.35756 20.9998 7.56498C21.0104 8.77239 20.543 9.93562 19.6983 10.8041L18.1123 12.379"></path></svg></span></a><span>Write preface</span></span></span></label></span></div></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"><span><input type="checkbox" checked=""><label></label></span></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"><span><input type="checkbox"><label></label></span></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"><span><input type="checkbox"><label></label></span></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"></td><td style="text-align: center; background-color: rgba(0, 0, 0, 0.2);"></td></tr></tbody><thead><tr><th style="background-color: rgba(0, 0, 0, 0); position: sticky; top: -16px; padding: 10px; min-width: 300px; max-width: 500px;"><div><label>0/3 tasks completed: 0.00%.</label></div></th><th style="background-color: rgba(0, 0, 0, 0); position: sticky; top: -16px; padding: 10px; min-width: unset; max-width: unset;"><div>write (1)</div></th><th style="background-color: rgba(0, 0, 0, 0); position: sticky; top: -16px; padding: 10px; min-width: unset; max-width: unset;"><div>revise (0)</div></th><th style="background-color: rgba(0, 0, 0, 0); position: sticky; top: -16px; padding: 10px; min-width: unset; max-width: unset;"><div>export (0)</div></th><th style="background-color: rgba(0, 0, 0, 0); position: sticky; top: -16px; padding: 10px; min-width: unset; max-width: unset;"><div>data (1)</div></th><th style="background-color: rgba(0, 0, 0, 0); position: sticky; top: -16px; padding: 10px; min-width: unset; max-width: unset;"><div>effect (1)</div></th><th style="background-color: rgba(0, 0, 0, 0); position: sticky; top: -16px; padding: 10px; min-width: unset; max-width: unset;"><div>art (0)</div></th></tr></thead></table></div>`

const pageStyle = {border: "solid", borderWidth: 2, padding: 5}

export const ManagePageForTemplate = () => {
    return <div style={pageStyle}>
        <HtmlStringComponent
            htmlString={templateHtmlString}/>
    </div>
}

export async function getTemplateHtml(app: App, el: Element) {
    const compo = new Component()
    await MarkdownRenderer.render(app, templateMd, el as HTMLElement, "", compo);
    return <div style={pageStyle}><HtmlStringComponent htmlString={el.outerHTML}/></div>
}
