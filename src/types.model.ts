
import { Notebook } from '@jupyterlab/notebook';

export type AutoplayMetadata = {
    autoRun: boolean,
    hideCodeCells: boolean
}

export type AutoplayCommand = {
    label: string,
    command: string,
    handler: (notebook: Notebook) => void
}
