import React from "react";
import { Alert } from "antd";
import ArrayField from "./ArrayField";
import BooleanField from "./BooleanField";
import StringField from "./StringField";
import SchemaField from "./SchemaField";
import { getWidget as _getWidget } from "@rjsf/core/lib/utils";
export * from "@rjsf/core/lib/utils";

function Error(msg) {
  return () =>
    /*#__PURE__*/ React.createElement(Alert, {
      message: msg,
      type: "error",
      showIcon: true,
    });
}

export function getWidget(...args) {
  try {
    return _getWidget(...args);
  } catch (e) {
    return Error(e.toString());
  }
}

function TitleField(props) {
  const { id, title, required } = props;
  return /*#__PURE__*/ React.createElement(
    "legend",
    {
      id: id,
    },
    title,
    required ? "*" : null
  );
}

export function getDefaultRegistry() {
  const fields = {
    ...require("@rjsf/core/lib/components/fields").default,
    ArrayField,
    StringField,
    BooleanField,
    TitleField,
    SchemaField,
  };
  return {
    fields,
    widgets: require("@rjsf/core/lib/components/widgets").default,
    definitions: {},
    formContext: {},
  };
}
