import React from "react";
import { connect } from "react-redux";
import { Slider, Switch, Button, List, Modal } from "antd";
const { confirm } = Modal;

const tipFormatter = ((flag = false) => (number) => {
  flag = !flag;
  return flag ? number : window.innerWidth - number;
})();

class Settings extends React.Component {
  siderWidth() {
    const { leftSiderWidth, rightSiderWidth } = this.props.settings;
    return {
      key: "sider-width",
      title: "Sider Width",
      description: /*#__PURE__*/ React.createElement(Slider, {
        included: true,
        min: 0,
        max: window.innerWidth,
        tipFormatter: tipFormatter,
        range: true,
        value: [leftSiderWidth, window.innerWidth - rightSiderWidth],
        onChange: ([left, right]) => {
          this.props.updateSettings({
            leftSiderWidth: left > 200 ? left : 200,
            rightSiderWidth: window.innerWidth - right,
          });
        },
      }),
    };
  }

  formWidth() {
    return {
      key: "form-item",
      title: "Form Width",
      description: /*#__PURE__*/ React.createElement(Slider, {
        min: 0,
        max: window.innerWidth,
        value: this.props.settings.formWidth,
        onChange: (value) => {
          this.props.updateSettings({
            formWidth: value,
          });
        },
      }),
    };
  }

  inlineMode() {
    return {
      key: "inline-mode",
      title: "Inline Mode",
      actions: [
        /*#__PURE__*/ React.createElement(Switch, {
          onChange: (v) =>
            this.props.updateSettings({
              isInlineMode: v,
            }),
          checked: this.props.settings.isInlineMode,
        }),
      ],
    };
  }

  liveValidate() {
    return {
      key: "live-validate",
      title: "Live Validate",
      actions: [
        /*#__PURE__*/ React.createElement(Switch, {
          onChange: (v) =>
            this.props.updateSettings({
              isLiveValidate: v,
            }),
          checked: this.props.settings.isLiveValidate,
        }),
      ],
    };
  }

  menu() {
    const { setTree, rootNode, setMenu, menu } = this.props;
    return {
      key: "menu",
      title: "Menu",
      description: [
        /*#__PURE__*/ React.createElement(
          Button,
          {
            key: "edit",
            onClick: () => setTree(menu),
          },
          "Customize"
        ),
        /*#__PURE__*/ React.createElement(
          Button,
          {
            key: "set",
            onClick: () => setMenu(rootNode),
          },
          "Apply Change"
        ),
      ],
    };
  }

  reset() {
    return {
      key: "reset",
      description: /*#__PURE__*/ React.createElement(
        Button,
        {
          type: "danger",
          sytle: {
            width: "100%",
          },
          key: "edit",
          onClick: () => {
            confirm({
              title: "Reset Form Buiilder?",
              content:
                "Removing persistent data from local storage.\n All settings and unsaved form will be lost.",
              okText: "Continue",
              okType: "danger",
              closable: true,
              maskClosable: true,

              onOk() {
                window.localStorage.removeItem(
                  "persist:react-jsonschema-formbuilder"
                );
                window.location.reload();
              },
            });
          },
        },
        "Reset Form Builder"
      ),
    };
  }

  listItems() {
    return [
      this.siderWidth(),
      this.formWidth(),
      this.inlineMode(),
      this.liveValidate(),
      this.menu(),
      this.reset(),
    ];
  }

  renderItem(a) {
    const {
      Item,
      Item: { Meta },
    } = List;
    return /*#__PURE__*/ React.createElement(
      Item,
      {
        key: a.key,
        actions: a.actions,
      },
      /*#__PURE__*/ React.createElement(Meta, {
        title: a.title,
        description: a.description,
      })
    );
  }

  render() {
    return /*#__PURE__*/ React.createElement(List, {
      itemLayout: "horizontal",
      dataSource: this.listItems(),
      renderItem: this.renderItem,
    });
  }
}

export default connect(
  ({
    settings,
    tree: {
      present: [rootNode],
    },
    menu,
  }) => ({
    settings,
    rootNode,
    menu,
  }),
  (dispatch) => ({
    updateSettings: (payload) =>
      dispatch({
        type: "SETTINGS_UPDATE",
        payload,
      }),
    setTree: ({ schema, uiSchema }) =>
      dispatch({
        type: "TREE_SET_TREE",
        payload: {
          name: "menu",
          schema,
          uiSchema,
        },
      }),
    setMenu: ({ schema, uiSchema }) =>
      dispatch({
        type: "MENU_SET",
        payload: {
          schema,
          uiSchema,
        },
      }),
  })
)(Settings);
