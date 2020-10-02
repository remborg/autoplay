
import { ISessionContext } from '@jupyterlab/apputils';
import { Cell, CodeCell } from '@jupyterlab/cells';
import { Notebook, NotebookActions } from '@jupyterlab/notebook';
import { AutoplayMetadata } from './types.model';

const getMetadata = (notebook: Notebook): AutoplayMetadata => {
    const meta = notebook.model.metadata.get('autoplay') as AutoplayMetadata;
    return meta;
}

const setMetadata = (notebook: Notebook, metadata: AutoplayMetadata) => {
    const meta = notebook.model.metadata.set('autoplay', metadata);
    return meta;
}

const hideCodeCells = (notebook: Notebook, force = false) => {
    notebook.widgets
        .filter((cell: Cell) => cell instanceof CodeCell && cell.inputArea.isHidden === false)
        .forEach((cell: Cell) => {
            cell.inputArea.hide();
        });

    if (force === true) {
        Private.forcedCellsVisibleNotebookIds = Private.forcedCellsVisibleNotebookIds.filter((id: string) => id !== notebook.id);
    }
}

const showCodeCells = (notebook: Notebook) => {
    notebook.widgets
        .filter((cell: Cell) => cell instanceof CodeCell)
        .filter((cell: Cell) => cell.inputArea.isHidden === true)
        .forEach((cell: Cell) => {
            cell.inputArea.show();
        });

    if (Private.forcedCellsVisibleNotebookIds.includes(notebook.id) === false) {
        Private.forcedCellsVisibleNotebookIds.push(notebook.id);
        // Listening to notebook close event so we can remove it from the list of 'forced cells visible' ones 
        notebook.disposed.connect((notebook: Notebook) => {
            Private.forcedCellsVisibleNotebookIds = Private.forcedCellsVisibleNotebookIds.filter((id: string) => id !== notebook.id);
        });
    }
}

const runAllCells = (notebook: Notebook, notebookSession: ISessionContext) => {
    NotebookActions.runAll(notebook, notebookSession);
    if (Private.ranNotebookIds.includes(notebook.id) === false) {
        Private.ranNotebookIds.push(notebook.id);
        // Listening to notebook close event so we can remove it from the list of ran ones 
        notebook.disposed.connect((notebook: Notebook) => {
            Private.ranNotebookIds = Private.ranNotebookIds.filter((id: string) => id !== notebook.id);
        });
    }
}

const getRanNotebookIds = () => {
    return Private.ranNotebookIds;
}

const getForcedCellsVisibleNotebookIds = () => {
    return Private.forcedCellsVisibleNotebookIds;
}

/**
 * A namespace for private data.
 */
namespace Private {
    export let ranNotebookIds: string[] = [];
    export let forcedCellsVisibleNotebookIds: string[] = [];
}

export { getMetadata, setMetadata, hideCodeCells, showCodeCells, runAllCells, getRanNotebookIds, getForcedCellsVisibleNotebookIds };

