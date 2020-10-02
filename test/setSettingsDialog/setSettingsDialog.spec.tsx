import React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow';
import 'ts-jest';
import { SetSettingsContent } from '../../src/setSettingsDialog/setSettingsDialog';
import { AutoplayMetadata } from '../../src/types.model';

jest.setTimeout(10000);

const autoplayMetadata: AutoplayMetadata = {
    "autoRun": true,
    "hideCodeCells": true
}

describe('SetSettingDialog', () => {

    it('should show popup content', () => {
        const renderer = ShallowRenderer.createRenderer();

        const component = renderer.render(
            <SetSettingsContent metadata={autoplayMetadata}></SetSettingsContent>
        );

        expect(component).toMatchSnapshot();
    });
});
