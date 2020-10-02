'use strict'
import { JupyterFrontEnd, JupyterFrontEndPlugin } from '@jupyterlab/application';
import { ICommandPalette, showDialog } from '@jupyterlab/apputils';
import { INotebookTracker, Notebook, NotebookPanel } from '@jupyterlab/notebook';
import { getForcedCellsVisibleNotebookIds, getMetadata, getRanNotebookIds, hideCodeCells, runAllCells, setMetadata, showCodeCells } from './notebookActions';
import { SetSettingsDialog } from './setSettingsDialog/setSettingsDialog';
import { AutoplayCommand } from './types.model';

const extension: JupyterFrontEndPlugin<void> = {
  id: 'autoplay',
  autoStart: true,
  requires: [INotebookTracker, ICommandPalette],
  activate
};

function activate(
  app: JupyterFrontEnd,
  notebookTracker: INotebookTracker,
  palette: ICommandPalette
) {
  __private.registerCommands(app, notebookTracker, palette, commands);
  initNotebookTracker(notebookTracker);

  console.log('JupyterLab extension autoplay is activated!');
};

const commands: AutoplayCommand[] = [
  {
    label: 'Show code cells',
    command: 'autoplay:show-code-cells',
    handler: (notebook: Notebook) => {
      showCodeCells(notebook);
    }
  },
  {
    label: 'Hide code cells',
    command: 'autoplay:hide-code-cells',
    handler: (notebook: Notebook) => {
      hideCodeCells(notebook, true);
    }
  },
  {
    label: 'Set notebook autorun config',
    command: 'autoplay:set-config',
    handler: (notebook: Notebook) => {
      __private.showSetSettingsDialog(notebook);
    }
  }
];

const registerCommands = (
  app: JupyterFrontEnd,
  notebookTracker: INotebookTracker,
  palette: ICommandPalette,
  commands: AutoplayCommand[]
) => {
  // registering commands
  commands.forEach(command => {
    if (app.commands.hasCommand(command.command) === false) {
      app.commands.addCommand(command.command, {
        label: command.label,
        isEnabled: () => notebookTracker.currentWidget && notebookTracker.currentWidget.isVisible,
        execute: () => command.handler(notebookTracker.currentWidget.content)
      });

      palette.addItem({ command: command.command, category: 'Autoplay' });
    }
  });
}

const initNotebookTracker = (notebookTracker: INotebookTracker) => {
  notebookTracker.currentChanged.connect((notebookTracker: INotebookTracker, notebookPanel: NotebookPanel) => {
    if (!notebookTracker.currentWidget) {
      return;
    }

    const notebook = notebookTracker.currentWidget.content;
    const notebookContext = notebookTracker.currentWidget.context;
    const notebookSession = notebookTracker.currentWidget.context.sessionContext;

    // This runs every time user displays the notebook (even when swapping tabs)
    notebookContext.ready.then(() => {
      const notebookMetadata = getMetadata(notebook);
      if (!notebookMetadata) {
        return;
      }
      // Checking if user ran 'show code cells' command
      const notebookCellsForcedVisible = getForcedCellsVisibleNotebookIds().includes(notebook.id);
      if (notebookMetadata.hideCodeCells === true && notebookCellsForcedVisible === false) {
        hideCodeCells(notebook);
      }

      // Run all cells only once
      const notebookHasBeenRan = getRanNotebookIds().includes(notebook.id);
      if (notebookMetadata.autoRun === true && notebookHasBeenRan === false) {
        notebookTracker.currentWidget.sessionContext.ready
          .then(() =>
            notebookTracker.currentWidget.revealed
          )
          .then(() => {
            runAllCells(notebook, notebookSession);
          });
      }
    });

  });
}

const showSetSettingsDialog = async (notebook: Notebook) => {
  const prompt = showDialog({
    title: 'When the notebook is opened:',
    body: new SetSettingsDialog(notebook)
  });

  const result = await prompt;

  if (result.button.accept !== true) {
    return;
  }
  console.log(result);

  setMetadata(notebook, result.value);
}


export const __private = { activate, registerCommands, showSetSettingsDialog, commands }
export default extension;
