import React from "react";
import { connect } from "react-redux";
import { Menu } from "antd";
const { SubMenu, Item } = Menu;

function nameGen(name, occupied) {
  let n = 1;
  let newName = name;

  while (occupied && occupied.includes(newName)) {
    newName = name + "_" + n;
    n += 1;
  }

  return newName;
}

class AddItemMenu extends React.Component {
  constructor(...args) {
    super(...args);

    this.onAddNode = (node2add) => {
      const { addNode } = this.props;
      const name = nameGen(
        node2add.name,
        this.props.node.children.map((a) => a.name)
      );
      addNode({ ...node2add, name });
    };
  }

  render() {
    const {
      menu: { children: menuTree },
      menuOpenKeys,
      menuOpenChange,
    } = this.props;
    return /*#__PURE__*/ React.createElement(
      Menu,
      {
        mode: "inline",
        theme: "dark",
        openKeys: menuOpenKeys,
        onOpenChange: menuOpenChange,
      },
      menuTree.map((a) =>
        a.schema &&
        a.schema.type === "object" &&
        a.children &&
        a.children.length
          ? /*#__PURE__*/ React.createElement(
              SubMenu,
              {
                key: a.key,
                title: a.schema.title || a.name,
              },
              a.children.map((b) =>
                /*#__PURE__*/ React.createElement(
                  Item,
                  {
                    key: b.key,
                    onClick: () => this.onAddNode(b),
                  },
                  b.schema.title || b.name
                )
              )
            )
          : /*#__PURE__*/ React.createElement(
              Item,
              {
                key: a.key,
                onClick: () => this.onAddNode(a),
              },
              a.schema.title || a.name
            )
      )
    );
  }
}

export default connect(
  ({ menu, menuOpenKeys }) => ({
    menu,
    menuOpenKeys,
  }),
  (dispatch, { node }) => ({
    addNode: (node2add) =>
      dispatch({
        type: "TREE_ADD_NODE",
        payload: {
          targetNodeKey: node.key,
          position: 0,
          node2add,
        },
      }),
    menuOpenChange: (keys) =>
      dispatch({
        type: "MENU_OPEN_KEYS_SET",
        payload: keys,
      }),
  })
)(AddItemMenu);
