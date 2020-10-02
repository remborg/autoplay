import { Cell } from '@jupyterlab/cells';
import { Notebook, NotebookModel } from '@jupyterlab/notebook';
import { ServiceManager } from '@jupyterlab/services';
import { createSessionContext, NBTestUtils } from '@jupyterlab/testutils';
import { JSONExt, JSONObject } from '@lumino/coreutils';
import 'ts-jest';
import { getMetadata, hideCodeCells, runAllCells, setMetadata, showCodeCells } from '../src/notebookActions';
import { AutoplayMetadata } from '../src/types.model';

jest.setTimeout(10000);

const PYTHON_SPEC: JSONObject = {
    name: 'Python',
    spec: {
        language: 'python',
        argv: [],
        display_name: 'python',
        env: {}
    },
    resources: { foo: 'bar' }
};

const KERNELSPECS: JSONObject = {
    default: 'python',
    kernelspecs: {
        python: PYTHON_SPEC,
        shell: {
            name: 'shell',
            spec: {
                language: 'shell',
                argv: [],
                display_name: 'Shell',
                env: {}
            },
            resources: {}
        }
    }
};

const autoplayMetadata = {
    "autoplay": {
        "autoRun": true,
        "hideCodeCells": true
    }
}

const createNotebookWithMetadata = () => {
    const rendermime = NBTestUtils.defaultRenderMime();
    const notebook = new Notebook({
        rendermime,
        contentFactory: NBTestUtils.createNotebookFactory(),
        mimeTypeService: NBTestUtils.mimeTypeService
    });

    const content = {
        ...NBTestUtils.DEFAULT_CONTENT,
        "metadata": {
            ...NBTestUtils.DEFAULT_CONTENT.metadata,
            ...autoplayMetadata
        }
    }
    const model = new NotebookModel();
    model.fromJSON(content);
    notebook.model = model;

    notebook.activeCellIndex = 0;

    return notebook;
}

describe('autoplay', () => {
    let notebook: Notebook;

    beforeEach(() => {
        notebook = createNotebookWithMetadata();
    });

    it('should get the notebook metadata for the autoplay key', () => {
        const metadata = getMetadata(notebook);
        expect(metadata).toEqual(autoplayMetadata.autoplay);
    });

    it('should set the notebook metadata for the autoplay key', () => {
        const mockMetadata: AutoplayMetadata = {
            autoRun: false,
            hideCodeCells: false
        };

        let metadata = notebook.model.metadata.get('autoplay');
        expect(metadata).not.toEqual(mockMetadata);

        setMetadata(notebook, mockMetadata);

        metadata = notebook.model.metadata.get('autoplay');
        expect(metadata).toEqual(mockMetadata);
    });

    it('should hide code cells', () => {
        const codeCells = notebook.widgets
            .filter((cell: Cell) => (cell.constructor.name === "CodeCell"));

        let visibleCodeCells = codeCells.filter((cell: Cell) => cell.inputArea.isHidden === false).length;
        expect(visibleCodeCells).toEqual(5);

        hideCodeCells(notebook);

        visibleCodeCells = codeCells.filter((cell: Cell) => cell.inputArea.isHidden === false).length;
        expect(visibleCodeCells).toEqual(0);
    });

    it('should show code cells', () => {
        const codeCells = notebook.widgets
            .filter((cell: Cell) => (cell.constructor.name === "CodeCell"));
        hideCodeCells(notebook);

        let visibleCodeCells = codeCells.filter((cell: Cell) => cell.inputArea.isHidden === false).length;
        expect(visibleCodeCells).toEqual(0);

        showCodeCells(notebook);

        visibleCodeCells = codeCells.filter((cell: Cell) => cell.inputArea.isHidden === false).length;
        expect(visibleCodeCells).toEqual(5);
    });

    it('should run all cells', async (done) => {
        const manager: ServiceManager.IManager = new ServiceManager({ standby: 'never' });
        const specs = JSONExt.deepCopy(KERNELSPECS) as any;
        await manager.ready;

        const getSpecsSpy = jest.fn().mockReturnValue(specs);
        Object.defineProperty(manager.sessions, 'specs', { get: getSpecsSpy });

        const session = await createSessionContext({ sessionManager: manager.sessions });
        await session.initialize();
        expect(notebook.activeCellIndex).toEqual(0);

        runAllCells(notebook, session);
        expect(notebook.activeCellIndex).toEqual(5);

        await session.shutdown();
        done();
    });
});
