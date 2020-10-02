import { JupyterLab } from '@jupyterlab/application';
import { ICommandPalette, IPaletteItem } from '@jupyterlab/apputils';
import { NotebookTracker } from '@jupyterlab/notebook';
import { CommandPalette } from '@lumino/widgets';
import 'ts-jest';
import { AutoplayCommand } from '../src/types.model';
import { __private } from './../src/index';

jest.setTimeout(10000);

describe('autoplay', () => {
    it('should register commands', () => {
        const namespace = 'notebook-tracker-test';
        const app = new JupyterLab();
        const notebookTracker = new NotebookTracker({ namespace });
        const commandPalette = new CommandPalette({ commands: app.commands })
        const palette: ICommandPalette = {
            ...commandPalette,
            placeholder: '',
            activate: () => { },
            addItem: (options: IPaletteItem) => ({ isDisposed: true, dispose: () => { } })
        };

        __private.commands.forEach((command: AutoplayCommand) => {
            expect(commandPalette.commands.hasCommand(command.command)).toBeFalsy;
        });

        __private.registerCommands(
            app,
            notebookTracker,
            palette,
            __private.commands
        );

        __private.commands.forEach((command: AutoplayCommand) => {
            expect(commandPalette.commands.hasCommand(command.command)).toBeTruthy;
        });
    });
});
