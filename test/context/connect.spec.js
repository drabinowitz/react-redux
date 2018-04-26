/*eslint-disable react/prop-types*/

jest.mock('redux');

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TestRenderer from 'react-test-renderer';
import { StoreContext } from '../../src/context/Provider';
import connect from '../../src/context/connect';

describe('connect', () => {
    let mapStateLensToProps;
    let mapActionsLensToProps;
    let TestComponent;
    let ConnectedComponent;

    beforeEach(() => {
        mapStateLensToProps = jest.fn(() => ({ data: 1 }));
        mapActionsLensToProps = jest.fn(() => ({ action: 2 }));

        jest.mock(React, 'forwardRef');
        React.forwardRef.callsFake((fn) => fn);

        TestComponent = () => <div />

        ConnectedComponent =
            connect(mapStateLensToProps, mapActionsLensToProps)(TestComponent);
    });

    afterEach(() => {
        React.forwardRef.restore();
    });

    describe('on render', () => {
    });
});
