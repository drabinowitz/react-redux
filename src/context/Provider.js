import React from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';

export const StoreContext = React.createContext();

export default class Provider extends React.Component {

  constructor (props) {
    super(props);
    this._unsubscribe = null;

    this._getState = this._getState.bind(this);
    this.state = this._getState();

    this._actions = bindActionCreators(this.props.actions, this.props.store.dispatch);
    this._dispatch = this.props.store.dispatch;
  }

  componentDidMount () {
    this._unsubscribe = this.props.store.subscribe(() => {
      this.setState(() => this._getState());
    });
  }

  componentWillUnmount () {
    this._unsubscribe && this._unsubscribe();
  }

  render () {
    const storeData = {
      state: this.state.current,
      actions: this._actions,
      dispatch: this._dispatch,
    };

    return (
      <StoreContext.Provider value={ storeData }>
        { this.props.children }
      </StoreContext.Provider>
    );
  }

  _getState () {
    return {
      current: this.props.store.getState(),
    };
  }

}

Provider.propTypes = {
  store: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired,
};
