import React from "react";
const REQUIRED_FIELD_SYMBOL = "*";

function Label(props) {
  const { label, required, id } = props;

  if (!label) {
    // See #312: Ensure compatibility with old versions of React.
    return /*#__PURE__*/ React.createElement("div", null);
  }

  return /*#__PURE__*/ React.createElement(
    "label",
    {
      className: "control-label",
      htmlFor: id,
    },
    label,
    required &&
      /*#__PURE__*/ React.createElement(
        "span",
        {
          className: "required",
        },
        REQUIRED_FIELD_SYMBOL
      )
  );
}

export function DefaultTemplate(props) {
  const {
    id,
    classNames,
    label,
    children,
    errors,
    help,
    description,
    hidden,
    required,
    displayLabel,
  } = props;

  if (hidden) {
    return children;
  }

  return /*#__PURE__*/ React.createElement(
    "div",
    {
      className: classNames,
    },
    displayLabel &&
      /*#__PURE__*/ React.createElement(Label, {
        label: label,
        required: required,
        id: id,
      }),
    displayLabel && description ? description : null,
    children,
    errors,
    help
  );
}
export function DefaultObjectFieldTemplate(props) {
  const { TitleField, DescriptionField } = props;
  return /*#__PURE__*/ React.createElement(
    "fieldset",
    null,
    (props.uiSchema["ui:title"] || props.title) &&
      /*#__PURE__*/ React.createElement(TitleField, {
        id: `${props.idSchema.$id}__title`,
        title: props.title || props.uiSchema["ui:title"],
        required: props.required,
        formContext: props.formContext,
      }),
    props.description &&
      /*#__PURE__*/ React.createElement(DescriptionField, {
        id: `${props.idSchema.$id}__description`,
        description: props.description,
        formContext: props.formContext,
      }),
    props.properties.map((prop) => prop.content)
  );
}
