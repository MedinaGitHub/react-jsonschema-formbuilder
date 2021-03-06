import React from "react";
import { connect } from "react-redux";
import { Button, Tooltip, message, Select } from "antd";
import {
  FileAddOutlined,
  FolderOpenOutlined,
  SaveOutlined,
  UndoOutlined,
  RedoOutlined,
} from "@ant-design/icons";
import { ActionTypes } from "redux-undo";

function write(filename, json) {
  const a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(
    new Blob([JSON.stringify(json, null, 2)], {
      type: "application/json",
    })
  );
  a.download = `${filename}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function read(e) {
  var file = e.target.files[0];

  if (!file) {
    return;
  }

  var reader = new FileReader();
  const p = new Promise(function (resolve) {
    reader.onload = function (e) {
      var contents = e.target.result;
      resolve(contents);
    };
  });
  reader.readAsText(file);
  return p;
}

const buttonStyle = {
  marginLeft: 8,
};

class Toolbar extends React.Component {
  constructor(props) {
    super(props);

    this.save = () => {
      const { name, schema, uiSchema } = this.props.tree.present[0];
      console.log("this.props.tree.present[0]", this.props.tree.present[0]);
      console.log("this.props", this.props);
      var jsonSchemaString = JSON.stringify(
        {
          name,
          schema,
          uiSchema,
        },
        null,
        2
      );

      try {
        this.props.customProps.getJsonSchema.jsonSchema(jsonSchemaString);
      } catch (error) {
        console.log("error", error);
        this.props.customProps.getJsonSchema(jsonSchemaString);
      }

      write(name, {
        name,
        schema,
        uiSchema,
      });
    };

    this.open = async (e) => {
      const s = await read(e);

      try {
        const { name, schema, uiSchema } = JSON.parse(s);
        this.props.setTree({
          name,
          schema,
          uiSchema,
        });
      } catch (e) {
        message.error("Invalid json file!");
      }
    };

    this.state = {};
  }

  render() {
    const { tree, undo, redo, settings, updateSettings, newForm } = this.props;
    const { past, future } = tree;
    return /*#__PURE__*/ React.createElement(
      "span",
      null,
      /*#__PURE__*/ React.createElement("input", {
        ref: (ref) => (this.loadFile = ref),
        type: "file",
        accept: "application/json",
        onChange: this.open,
        hidden: true,
      }),
      /*#__PURE__*/ React.createElement(
        Tooltip,
        {
          title: "New",
        },
        /*#__PURE__*/ React.createElement(Button, {
          style: buttonStyle,
          onClick: newForm,
          icon: /*#__PURE__*/ React.createElement(FileAddOutlined, null),
        })
      ),
      /*#__PURE__*/ React.createElement(
        Tooltip,
        {
          title: "Open",
        },
        /*#__PURE__*/ React.createElement(Button, {
          style: buttonStyle,
          onClick: () => this.loadFile && this.loadFile.click(),
          icon: /*#__PURE__*/ React.createElement(FolderOpenOutlined, null),
        })
      ),
      /*#__PURE__*/ React.createElement(
        Tooltip,
        {
          title: "Save",
        },
        /*#__PURE__*/ React.createElement(Button, {
          style: buttonStyle,
          onClick: this.save,
          icon: /*#__PURE__*/ React.createElement(SaveOutlined, null),
        })
      ),
      /*#__PURE__*/ React.createElement(
        Tooltip,
        {
          title: "Undo",
        },
        /*#__PURE__*/ React.createElement(Button, {
          style: buttonStyle,
          onClick: undo,
          disabled: !past.length,
          icon: /*#__PURE__*/ React.createElement(UndoOutlined, null),
        })
      ),
      /*#__PURE__*/ React.createElement(
        Tooltip,
        {
          title: "Redo",
        },
        /*#__PURE__*/ React.createElement(Button, {
          style: buttonStyle,
          onClick: redo,
          disabled: !future.length,
          icon: /*#__PURE__*/ React.createElement(RedoOutlined, null),
        })
      ),
      /*#__PURE__*/ React.createElement(
        Select,
        {
          mode: "multiple",
          style: {
            width: 290,
            marginLeft: 12,
          },
          value: settings.subViews,
          onChange: updateSettings,
          placeholder: "Select sub views...",
        },
        /*#__PURE__*/ React.createElement(
          Select.Option,
          {
            key: "schema",
          },
          "Schema"
        ),
        /*#__PURE__*/ React.createElement(
          Select.Option,
          {
            key: "uiSchema",
          },
          "Ui Schema"
        ),
        /*#__PURE__*/ React.createElement(
          Select.Option,
          {
            key: "formData",
          },
          "Data"
        )
      )
    );
  }
}

export default connect(
  ({ tree, settings }) => ({
    tree,
    settings,
  }),
  (dispatch) => ({
    newForm: () =>
      dispatch({
        type: "TREE_CLEAR",
      }),
    setTree: (payload) =>
      dispatch({
        type: "TREE_SET_TREE",
        payload,
      }),
    undo: () =>
      dispatch({
        type: ActionTypes.UNDO,
      }),
    redo: () =>
      dispatch({
        type: ActionTypes.REDO,
      }),
    updateSettings: (subViews) =>
      dispatch({
        type: "SETTINGS_UPDATE",
        payload: {
          subViews,
        },
      }),
  })
)(Toolbar);
