import { Notebook } from '@jupyterlab/notebook';
import { Widget } from '@lumino/widgets';
import React from 'react';
import ReactDOM from 'react-dom';
import { getMetadata } from '../notebookActions';
import { AutoplayMetadata, DEFAULT_AUTOPLAY_METADATA } from '../types.model';

/**
 * A widget used to display the options so the user can setup the notebook
 */
export class SetSettingsDialog extends Widget {
    metadata: AutoplayMetadata;

    constructor(notebook: Notebook) {
        const wrapper = document.createElement('div');
        wrapper.className = "ap-setSettingsDialog";
        super({ node: wrapper });
        this.metadata = getMetadata(notebook) || DEFAULT_AUTOPLAY_METADATA;

        const content = SetSettingsContent({ metadata: this.metadata });
        ReactDOM.render(content, wrapper);
    }

    /**
     * Get the value of the widget.
     */
    getValue(): AutoplayMetadata {
        return this.metadata;
    }
}

interface ISetSettingsContent {
    metadata: AutoplayMetadata
}

const SetSettingsContent = ({ metadata }: ISetSettingsContent) => (
    <div className="ap-setSettingsDialog-form">
        <label>
            <input type="checkbox"
                defaultChecked={metadata.autoRun}
                onChange={() => metadata.autoRun = !metadata.autoRun} />
                Run all cells
        </label>
        <label>
            <input type="checkbox"
                defaultChecked={metadata.hideCodeCells}
                onChange={() => metadata.hideCodeCells = !metadata.hideCodeCells} />
                Hide all code cells
        </label>
    </div>
);

export { SetSettingsContent };

