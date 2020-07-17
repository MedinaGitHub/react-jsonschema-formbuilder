import React, { Component } from "react";
import { Provider, connect } from "react-redux";
import { store, persistor } from "./store";
import { PersistGate } from "redux-persist/integration/react";
import "./css";
import { Layout, Tabs, Card } from "antd";
import Tree from "./Tree";
import { FormView, SchemaView, UiSchemaView, FormDataView } from "./views";
import NodeEditor from "./Editor";
import Toolbar from "./Toolbar";
import Settings from "./Settings";
const { Header, Sider, Content } = Layout;
const { TabPane } = Tabs;

class App extends Component {
  constructor(...args) {
    super(...args);
    this.state = {
      collapsed: false,
    };

    this.toggle = () => {
      this.setState({
        collapsed: !this.state.collapsed,
      });
    };
  }

  render() {
    const { settings } = this.props;
    console.log("this.props", this.props);
    return /*#__PURE__*/ React.createElement(
      Layout,
      null,
      /*#__PURE__*/ React.createElement(
        Sider,
        {
          trigger: null,
          collapsible: true,
          collapsed: this.state.collapsed,
          width: settings.leftSiderWidth,
          style: {
            background: "#fff",
            padding: 0,
            overflow: "auto",
            boxShadow:
              "0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 3px 0 rgba(0, 0, 0, 0.2)",
            height: "100vh",
            position: "fixed",
            left: 0,
          },
        },
        /*#__PURE__*/ React.createElement(
          Tabs,
          {
            defaultActiveKey: "0",
            size: "small",
            type: "card",
          },
          /*#__PURE__*/ React.createElement(
            TabPane,
            {
              tab: "Editor",
              style: {
                padding: "8px",
              },
              key: "0",
            },
            /*#__PURE__*/ React.createElement(Tree, null)
          )
        )
      ),
      /*#__PURE__*/ React.createElement(
        Layout,
        {
          style: {
            marginLeft: settings.leftSiderWidth,
          },
        },
        /*#__PURE__*/ React.createElement(
          Header,
          {
            style: {
              background: "#fff",
              padding: 0,
            },
          },
          /*#__PURE__*/ React.createElement(Toolbar, {
            customProps: this.props.customProps,
          })
        ),
        /*#__PURE__*/ React.createElement(
          Content,
          {
            style: {
              minHeight: 280,
              padding: "12px 8px",
            },
          },
          /*#__PURE__*/ React.createElement(
            Card,
            {
              bordered: false,
              style: {
                width: settings.formWidth,
                margin: "12px 8px",
                display: "inline-block",
                verticalAlign: "top",
              },
            },
            /*#__PURE__*/ React.createElement(FormView, null)
          )
        )
      ),
      /*#__PURE__*/ React.createElement(
        Sider,
        {
          width: this.props.activeNodeKey ? settings.rightSiderWidth : 0,
          style: {
            overflow: "auto",
            background: "#fff",
            boxShadow:
              "0 2px 3px 0 rgba(0, 0, 0, 0.2), 0 2px 3px 0 rgba(0, 0, 0, 0.2)",
            position: "fixed",
            height: "100vh",
            right: 0,
          },
        },
        /*#__PURE__*/ React.createElement(NodeEditor, null)
      )
    );
  }
}

const AppContainer = connect(({ activeNodeKey, settings }) => ({
  activeNodeKey,
  settings,
}))(App);
export default (props) =>
  /*#__PURE__*/ React.createElement(
    Provider,
    {
      store: store,
    },
    /*#__PURE__*/ React.createElement(
      PersistGate,
      {
        loading: null,
        persistor: persistor,
      },
      /*#__PURE__*/ React.createElement(AppContainer, {
        customProps: props,
      })
    )
  );
