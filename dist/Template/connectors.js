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
import InlineEditor from "../InlineEditor";
import { connect } from "react-redux";
import { Input, Popconfirm, Tooltip } from "antd";
import { SelectOutlined, DeleteOutlined } from "@ant-design/icons";

const { getNodeByRjsfId } = require("../core");

const { TextArea } = Input;
const ACTIVE_STYLE = {
  backgroundColor: "#bae7ff",
};

class ExtendedInlineEditor extends InlineEditor {
  renderView() {
    return /*#__PURE__*/ React.createElement(
      "span",
      {
        className: "fb-test",
        onClick: this.onStartEditing,
      },
      this.props.children
    );
  }
}

class InlineTextAreaEditor extends ExtendedInlineEditor {
  renderEditing() {
    return /*#__PURE__*/ React.createElement(TextArea, {
      ref: (r) => (this.input = r),
      value: this.state.value,
      onBlur: this.onCompleteEditing,
      onChange: this.onChange,
      autoSize: true,
      onKeyUp: (e) => {
        if (e.keyCode === 27) {
          this.onCancelEditing();
        }
      },
    });
  }
}

const ButtonGroup = connect(null, (dispatch, { id }) => ({
  select: () =>
    dispatch({
      type: "ACTIVE_NODE_KEY_SET_BY_RJSF_ID",
      payload: id,
    }),
  remove: () =>
    dispatch({
      type: "TREE_REMOVE_NODE_BY_RJSF_ID",
      payload: id,
    }),
}))((props) => {
  const { select, remove, id } = props;
  return /*#__PURE__*/ React.createElement(
    Tooltip,
    {
      title: id,
      placement: "right",
    },
    /*#__PURE__*/ React.createElement(
      "a",
      {
        href: "#!",
      },
      /*#__PURE__*/ React.createElement(SelectOutlined, {
        onClick: select,
      })
    ),
    /*#__PURE__*/ React.createElement(
      Popconfirm,
      {
        title: `Remove ${id}?`,
        onConfirm: remove,
      },
      /*#__PURE__*/ React.createElement(
        "a",
        {
          href: "#!",
        },
        /*#__PURE__*/ React.createElement(DeleteOutlined, null)
      )
    )
  );
});
export function fieldTemplateConnector(FieldTemplate) {
  return connect(
    (
      { tree: { present }, activeNodeKey, settings: { isInlineMode } },
      { id }
    ) => {
      const n = getNodeByRjsfId(present, id);
      const active = n && n.key === activeNodeKey;
      return {
        tree: present,
        active,
        isInlineMode,
      };
    },
    (dispatch, { id, schema, uiSchema }) => ({
      updateTitle: (title) =>
        dispatch({
          type: "TREE_UPDATE_NODE_BY_RJSF_ID",
          payload: {
            rjsfId: id,
            nodeUpdate: {
              schema: { ...schema, title },
            },
          },
        }),
      updateDescription: (description) =>
        dispatch({
          type: "TREE_UPDATE_NODE_BY_RJSF_ID",
          payload: {
            rjsfId: id,
            nodeUpdate: {
              schema: { ...schema, description },
            },
          },
        }),
      updateHelp: (help) =>
        dispatch({
          type: "TREE_UPDATE_NODE_BY_RJSF_ID",
          payload: {
            rjsfId: id,
            nodeUpdate: {
              uiSchema: { ...uiSchema, "ui:help": help },
            },
          },
        }),
    })
  )((props) => {
    const {
      id,
      label,
      description,
      help,
      schema,
      updateTitle,
      updateDescription,
      updateHelp,
      active,
      classNames,
      isInlineMode,
    } = props;
    if (!isInlineMode)
      return /*#__PURE__*/ React.createElement(FieldTemplate, props);
    const labelElement =
      label &&
      /*#__PURE__*/ React.createElement(
        ExtendedInlineEditor,
        {
          value: label,
          onChange: updateTitle,
        },
        label
      );
    const descriptionElement =
      description &&
      /*#__PURE__*/ React.createElement(
        InlineTextAreaEditor,
        {
          value: description.props.description,
          onChange: updateDescription,
        },
        description
      );
    const helpElement =
      help &&
      /*#__PURE__*/ React.createElement(
        ExtendedInlineEditor,
        {
          value: help.props.help,
          onChange: updateHelp,
        },
        help
      );
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        className: classNames,
        style: active ? ACTIVE_STYLE : null,
      },
      ["object", "array"].includes(schema.type)
        ? null
        : /*#__PURE__*/ React.createElement(
            "div",
            {
              className: "pull-right",
            },
            " ",
            /*#__PURE__*/ React.createElement(ButtonGroup, {
              id: id,
            }),
            " "
          ),
      /*#__PURE__*/ React.createElement(
        FieldTemplate,
        _extends(
          {
            _label: label,
            _description: description,
            _help: help,
          },
          props,
          {
            classNames: null,
            label: labelElement,
            description: descriptionElement,
            help: helpElement,
          }
        )
      )
    );
  });
}
export function objectFieldTemplateConnector(ObjectFieldTemplate) {
  return connect(
    (
      { tree: { present }, activeNodeKey, settings: { isInlineMode } },
      { idSchema }
    ) => {
      const n =
        idSchema && idSchema.$id && getNodeByRjsfId(present, idSchema.$id);
      const active = n && n.key === activeNodeKey;
      return {
        tree: present,
        active,
        isInlineMode,
      };
    },
    (dispatch, { idSchema, schema }) => ({
      updateTitle: (title) =>
        dispatch({
          type: "TREE_UPDATE_NODE_BY_RJSF_ID",
          payload: {
            rjsfId: idSchema.$id,
            nodeUpdate: {
              schema: { ...schema, title },
            },
          },
        }),
      updateDescription: (description) =>
        dispatch({
          type: "TREE_UPDATE_NODE_BY_RJSF_ID",
          payload: {
            rjsfId: idSchema.$id,
            nodeUpdate: {
              schema: { ...schema, description },
            },
          },
        }),
    })
  )((props) => {
    const {
      idSchema,
      title,
      description,
      updateTitle,
      updateDescription,
      active,
      isInlineMode,
    } = props;
    if (!isInlineMode)
      return /*#__PURE__*/ React.createElement(ObjectFieldTemplate, props);
    const titleElement =
      title &&
      /*#__PURE__*/ React.createElement(
        "span",
        null,
        /*#__PURE__*/ React.createElement(
          ExtendedInlineEditor,
          {
            value: title,
            onChange: updateTitle,
          },
          title
        ),
        /*#__PURE__*/ React.createElement(
          "span",
          {
            className: "pull-right",
          },
          " ",
          /*#__PURE__*/ React.createElement(ButtonGroup, {
            id: idSchema.$id,
          }),
          " "
        )
      );
    const descriptionElement =
      description &&
      /*#__PURE__*/ React.createElement(
        InlineTextAreaEditor,
        {
          value: description,
          onChange: updateDescription,
        },
        description
      );
    return /*#__PURE__*/ React.createElement(
      "div",
      {
        style: active ? ACTIVE_STYLE : null,
      },
      /*#__PURE__*/ React.createElement(
        ObjectFieldTemplate,
        _extends(
          {
            _title: title,
            _description: description,
          },
          props,
          {
            title: titleElement,
            description: descriptionElement,
          }
        )
      )
    );
  });
}
