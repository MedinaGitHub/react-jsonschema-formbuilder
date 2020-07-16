function _extends() {
  _extends =
    Object.assign ||
    function (target) {
      for (var i = 1; i < arguments.length; i++) {
        var source = arguments[i];
        for (var key in source) {
          if (Object.prototype.hasOwnProperty.call(source, key)) {
            target[key] = source[key];
          }
        }
      }
      return target;
    };
  return _extends.apply(this, arguments);
}

import React from "react";
import { Input, Alert } from "antd";
const { TextArea } = Input;

function shallowEqual(objA, objB) {
  if (objA === objB) {
    return true;
  }

  if (!objA || !objB) {
    return false;
  }

  var key; // Test for A's keys different from B.

  for (key in objA) {
    if (
      objA.hasOwnProperty(key) &&
      (!objB.hasOwnProperty(key) || objA[key] !== objB[key])
    ) {
      return false;
    }
  } // Test for B'a keys missing from A.

  for (key in objB) {
    if (objB.hasOwnProperty(key) && !objA.hasOwnProperty(key)) {
      return false;
    }
  }

  return true;
}

export default class JsonEditor extends React.Component {
  constructor(props) {
    super(props);

    this.onChange = (e) => {
      const value = e.target.value;

      try {
        const obj = value ? JSON.parse(value) : null;
        this.setState(
          {
            value: obj,
            string: value,
            error: null,
          },
          () => this.props.onChange(obj)
        );
      } catch (error) {
        this.setState({
          string: value,
          error,
        });
      }
    };

    this.onClickPrettify = () => {
      let { error } = this.state;

      if (!error) {
        this.setState({
          string: JSON.stringify(this.props.value, null, 2),
        });
      }
    };

    const { value: _value } = props;
    this.state = {
      string: JSON.stringify(_value, null, 2),
      value: _value,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (!shallowEqual(nextProps.value, this.state.value)) {
      this.setState({
        value: nextProps.value,
        string: JSON.stringify(nextProps.value, null, 2),
        error: null,
      });
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextState.string !== this.state.string;
  }

  renderErrorMessage() {
    const { error } = this.state;
    if (!error) return null;
    const errorMessage = error.toString();
    const message = /*#__PURE__*/ React.createElement(
      "a",
      {
        href: "#!",
        onClick: () => {
          const matched = /position ([0-9]+)/.exec(errorMessage);
          const position = matched ? matched[1] : -1;
          const input = this.input.textAreaRef;
          input.selectionStart = position;
          input.selectionEnd = position;
          input.focus();
        },
      },
      error.toString()
    );
    return /*#__PURE__*/ React.createElement(Alert, {
      message: message,
      type: "error",
      showIcon: true,
    });
  }

  render() {
    const { string } = this.state;
    return /*#__PURE__*/ React.createElement(
      "div",
      null,
      this.renderErrorMessage() ||
        /*#__PURE__*/ React.createElement(Alert, {
          message: /*#__PURE__*/ React.createElement(
            "a",
            {
              href: "#!",
              onClick: this.onClickPrettify,
            },
            "Prettify"
          ),
          type: "success",
          showIcon: true,
        }),
      /*#__PURE__*/ React.createElement(
        TextArea,
        _extends({}, this.props, {
          ref: (ref) => (this.input = ref),
          value: string,
          onChange: this.onChange,
        })
      )
    );
  }
}
