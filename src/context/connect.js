import React from 'react';
import deepmerge from 'deepmerge';

import { StoreContext } from './Provider';
import shallowEqual from '../utils/shallowEqual';

const ProviderLens = ({ stateLens, actionsLens, children }) => (
  <StoreContext.Consumer>
    { (storeData) => {
      const dataToMerge = {};
      if (stateLens) {
        dataToMerge.state = stateLens;
      }
      if (actionsLens) {
        dataToMerge.actions = actionsLens;
      }

      const mergedStoreData = deepmerge(
        storeData,
        dataToMerge,
        { clone: false },
      );

      return (
        <StoreContext.Provider value={ mergedStoreData }>
          { children }
        </StoreContext.Provider>
      );
    } }
  </StoreContext.Consumer>
);

export default function connect (
  mapStateLensToProps,
  mapActionsLensToProps,
  mergeProps,
) {
  if (!mapStateLensToProps) {
    mapStateLensToProps = () => ({});
  }

  if (!mapActionsLensToProps) {
    mapActionsLensToProps = () => ({});
  }

  if (!mergeProps) {
    mergeProps = defaultMergeProps;
  }

  return function (WrappedComponent) {

    class ConnectedComponent extends React.Component {

      constructor (props) {
        super(props);
        this.reduxContext = { ProviderLens };
        this.state = {};
      }

      static getDerivedStateFromProps (nextProps) {
        const rest = nextProps.props;
        const storeData = nextProps.storeData;

        return {
          propsToPass: defaultMergeProps(
            mapStateLensToProps(storeData.state, rest),
            mapActionsLensToProps(storeData.actions, rest),
            rest,
          ),
        };
      }

      shouldComponentUpdate (_, { propsToPass }) {
        return !shallowEqual(propsToPass, this.state.propsToPass);
      }

      render () {
        return (
          <WrappedComponent
            reduxContext={ this.reduxContext }
            { ...this.state.propsToPass }
            ref={ this.props.forwardedRef }
          />
        );
      }

    }

    ConnectedComponent.displayName = `Connect(${ WrappedComponent.displayName || WrappedComponent.name || 'Anonymous' })`;

    return React.forwardRef((props, ref) => (
      <StoreContext.Consumer>
        { (storeData) => (
          <ConnectedComponent
            props={ props }
            storeData={ storeData }
            forwardedRef={ ref }
          />
        ) }
      </StoreContext.Consumer>
    ));
  };
}

const defaultMergeProps = (mappedState, mappedActions, ownProps) => ({
  ...mappedState,
  ...mappedActions,
  ...ownProps,
});
