
import { Notebook } from '@jupyterlab/notebook';

export type AutoplayMetadata = {
    autoRun: boolean,
    hideCodeCells: boolean
}

export const DEFAULT_AUTOPLAY_METADATA: AutoplayMetadata = {
    autoRun: false,
    hideCodeCells: false
}

export type AutoplayCommand = {
    label: string,
    command: string,
    handler: (notebook: Notebook) => void
}
