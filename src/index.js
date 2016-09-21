import React, { Component, PropTypes } from 'react';

const buttonStyles = {
  position: 'absolute',
  top: '50%',
  right: '6px',
  marginTop: '-13px',
  padding: '4px 10px',
  background: '#e2e2e2',
  borderRadius: '2px',
  color: '#000',
  textAlign: 'center',
  textDecoration: 'none',
  WebkitUserSelect: 'none',
  MozUserSelect: 'none',
  userSelect: 'none'
};

const inputStyles = {
  width: '100%'
};

const shownInputStyles = {
  ...inputStyles,
  display: 'block'
};

const hiddenInputStyles = {
  ...inputStyles,
  display: 'none'
};

export default class PasswordMask extends Component {
  static propTypes = {
    value: PropTypes.any.isRequired,
    className: PropTypes.string,
    id: PropTypes.string,
    name: PropTypes.string,
    placeholder: PropTypes.string,
    onChange: PropTypes.func,
    onShow: PropTypes.func,
    onHide: PropTypes.func,
    onToggle: PropTypes.func,
    inputStyles: PropTypes.object,
    buttonStyles: PropTypes.object
  };

  constructor() {
    super();

    this.state = {
      showPassword: false,
      hasBeenFocused: false
    };
  }

  invokeCallbacks(value, showPassword) {
    const { onShow, onHide, onToggle } = this.props;

    if (!onToggle && !onShow && !onHide) {
      return;
    }

    if (onToggle) {
      onToggle(value);
    }

    if (showPassword) {
      if (onShow) {
        onShow(value);
      }
    }
    else {
      if (onHide) {
        onHide(value);
      }
    }
  }

  focusVisibleField() {
    const { showPassword } = this.state;
    const visibleField = showPassword ? this.refs.text : this.refs.password;

    visibleField.focus();
  }

  componentWillUpdate(nextProps, nextState) {
    const { showPassword } = this.state;

    if (nextState.showPassword !== showPassword) {
      this.invokeCallbacks(nextProps.value, nextState.showPassword);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { showPassword, hasBeenFocused } = this.state;

    if (hasBeenFocused &&
      (prevProps.value !== this.props.value || prevState.showPassword !== showPassword)) {
      this.focusVisibleField();
    }
  }

  togglePasswordMask() {
    const { showPassword } = this.state;
    this.setState({ showPassword: !showPassword });
  }

  render() {
    const { value, className, id, name, placeholder, onChange } = this.props;

    return (
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          ref="text"
          style={{
            ...this.state.showPassword ? shownInputStyles : hiddenInputStyles,
            ...this.props.inputStyles
          }}
          value={value}
          className={className}
          id={this.state.showPassword ? id : ''}
          name={this.state.showPassword ? name : ''}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => this.setState({ hasBeenFocused: true })}
        />

        <input
          type="password"
          ref="password"
          style={{
            ...this.state.showPassword ? hiddenInputStyles : shownInputStyles,
            ...this.props.inputStyles
          }}
          value={value}
          className={className}
          id={!this.state.showPassword ? id : ''}
          name={!this.state.showPassword ? name : ''}
          placeholder={placeholder}
          onChange={onChange}
          onFocus={() => this.setState({ hasBeenFocused: true })}
        />

        <a
          href=""
          style={{
            ...buttonStyles,
            ...this.props.buttonStyles
          }}
          onMouseDown={e => e.preventDefault()}
          onClick={e => {
            e.preventDefault();
            this.togglePasswordMask();
          }}
        >
          {this.state.showPassword ? 'Hide' : 'Show'}
        </a>
      </div>
    );
  }
}
