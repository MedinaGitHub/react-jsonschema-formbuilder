import React from "react";
import JsonEditor from "../JsonEditor";
import { Input } from "antd";
export default class NodeJsonEditor extends React.Component {
  static get key() {
    return "json-editor";
  }

  static get name() {
    return "Json";
  }

  static filter(node) {
    return true;
  }

  constructor(props) {
    super(props);
    const { schema, uiSchema } = props;
    this.state = {
      schemaJsonString: JSON.stringify(schema, null, 2),
      uiSchemaJsonString: JSON.stringify(schema, null, 2),
      schema,
      uiSchema,
    };
  }

  render() {
    const { node, updateNode } = this.props;
    const { schema, uiSchema } = node;
    const { properties, items, additionalItems, ...rschema } = schema;
    return /*#__PURE__*/ React.createElement(
      "div",
      null,
      /*#__PURE__*/ React.createElement(Input, {
        value: node.name,
        onChange: (e) =>
          updateNode({
            name: e.target.value,
          }),
      }),
      /*#__PURE__*/ React.createElement(JsonEditor, {
        value: rschema,
        onChange: (schema) =>
          updateNode({
            schema,
          }),
        autoSize: true,
      }),
      /*#__PURE__*/ React.createElement(JsonEditor, {
        value: uiSchema,
        onChange: (uiSchema) =>
          updateNode({
            uiSchema,
          }),
        autoSize: true,
      })
    );
  }
}
