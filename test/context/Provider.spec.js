/*eslint-disable react/prop-types*/

jest.mock('redux');

import React, { Component } from 'react'
import PropTypes from 'prop-types'
import TestRenderer from 'react-test-renderer'
import { bindActionCreators } from 'redux'
import Provider, { StoreContext } from '../../src/context/Provider'

describe('Provider', () => {
    let mockState;
    let unsubscribe;
    let mockStore;
    let mockActions;
    let props;
    let provider;

    beforeEach(() => {
        bindActionCreators.mockImplementation((val) => val);

        mockState = { a: 1 };

        unsubscribe = jest.fn();

        mockStore = {
            dispatch: jest.fn(),
            subscribe: jest.fn(() => unsubscribe),
            getState: jest.fn(() => mockState),
        };

        mockActions = {
            test: {
                run: jest.fn(),
            },
        };

        props = {
            store: mockStore,
            actions: mockActions,
            children: [],
        };

        provider = new Provider(props);
        provider.setState = jest.fn();
    });

    describe('on construction', () => {

        test('should not subscribe to the store', () => {
            expect(mockStore.subscribe).not.toHaveBeenCalled();
        });

        test('should set initial state equal to the store state', () => {
            expect(provider.state.current).toBe(mockState);
        });

        test('should call bindActionCreators with actions and store.dispatch', () => {
            expect(bindActionCreators).toHaveBeenCalledWith(mockActions, mockStore.dispatch);
        });
    });

    describe('on component did mount', () => {

        beforeEach(() => {
            provider.componentDidMount();
        });

        test('should subscribe to the store', () => {
            expect(mockStore.subscribe).toHaveBeenCalledTimes(1);
        });

        test('should not unsubscribe from the store', () => {
            expect(unsubscribe).not.toHaveBeenCalled();
        });

        describe('on render', () => {
            let renderResult;

            beforeEach(() => {
                renderResult = provider.render();
            });

            test('should return a StoreContext.Provider with store data as value and children props as children', () => {
                expect(renderResult.type).toBe(StoreContext.Provider);
                expect(renderResult.props.value).toEqual({
                    state: mockState,
                    actions: mockActions,
                    dispatch: mockStore.dispatch,
                });
                expect(renderResult.props.children).toBe(props.children);
            });
        });

        describe('on store subscription event', () => {

            beforeEach(() => {
                mockStore.subscribe.mock.calls[0][0]();
            });

            test('should call setState with the new store state', () => {
                expect(provider.setState).toHaveBeenCalledTimes(1);
                expect(provider.setState.mock.calls[0][0]()).toEqual({ current: mockState });
            });
        });

        describe('on component will unmount', () => {

            beforeEach(() => {
                provider.componentWillUnmount();
            });

            test('should unsubscribe from the store', () => {
                expect(unsubscribe).toHaveBeenCalledTimes(1);
            });
        });
    });
});
