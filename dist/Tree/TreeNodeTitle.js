import React, { PureComponent } from "react";
import { connect } from "react-redux";
import { Popconfirm } from "antd";
import { PlusCircleOutlined, CloseCircleFilled } from "@ant-design/icons";
import InlineEditor from "../InlineEditor";
import { Dropdown } from "antd";
import AddItemMenu from "./Menu";

class TreeNodeTitle extends PureComponent {
  render() {
    const { node, removeNode, updateNodeName, searchValue } = this.props;
    const { name, key } = node;
    const isLeaf = node.isLeaf;
    const isRoot = node.name === node.key;
    const isArray = node.schema.type === "array";
    const indexBefore = node.name.toLowerCase().indexOf(searchValue);
    const indexAfter = indexBefore + searchValue.length;
    return /*#__PURE__*/ React.createElement(
      "span",
      {
        style: {
          display: "block",
        },
      },
      searchValue && indexBefore >= 0
        ? /*#__PURE__*/ React.createElement(
            InlineEditor,
            {
              value: node.name,
              onChange: (name) => updateNodeName(key, name),
            },
            name.slice(0, indexBefore),
            /*#__PURE__*/ React.createElement(
              "span",
              {
                style: {
                  color: "#f50",
                },
              },
              name.slice(indexBefore, indexAfter)
            ),
            name.slice(indexAfter)
          )
        : /*#__PURE__*/ React.createElement(
            InlineEditor,
            {
              value: node.name,
              onChange: (name) => updateNodeName(key, name),
            },
            name
          ),
      /*#__PURE__*/ React.createElement(
        "span",
        {
          className: "pull-right",
        },
        !(isLeaf || isArray)
          ? /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "form-builder-add-item-menu",
                onClick: (e) => e.stopPropagation(),
              },
              /*#__PURE__*/ React.createElement(
                Dropdown,
                {
                  placement: "bottomLeft",
                  trigger: ["click"],
                  overlay: /*#__PURE__*/ React.createElement(AddItemMenu, {
                    node: node,
                  }),
                },
                /*#__PURE__*/ React.createElement(PlusCircleOutlined, null)
              )
            )
          : null,
        !isRoot
          ? /*#__PURE__*/ React.createElement(
              "span",
              {
                className: "tree-node-delete",
                onClick: (e) => e.stopPropagation(),
              },
              /*#__PURE__*/ React.createElement(
                Popconfirm,
                {
                  placement: "rightTop",
                  title: `Delete "${key}"?`,
                  onConfirm: () => removeNode(key),
                  okText: "Yes",
                  cancelText: "No",
                },
                /*#__PURE__*/ React.createElement(CloseCircleFilled, null)
              )
            )
          : null
      )
    );
  }
}

export default connect(null, (dispatch) => ({
  removeNode: (key) =>
    dispatch({
      type: "TREE_REMOVE_NODE",
      payload: key,
    }),
  updateNodeName: (key, name) =>
    dispatch({
      type: "TREE_UPDATE_NODE",
      payload: {
        target: key,
        nodeUpdate: {
          name,
        },
      },
    }),
}))(TreeNodeTitle);
