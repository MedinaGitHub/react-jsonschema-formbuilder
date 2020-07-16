const basic = {
  schema: {
    type: "object",
    title: "Opciones",
    properties: {
      object: {
        type: "object",
        title: "Nueva sección",
        properties: {},
      },
      text: {
        type: "string",
        title: "Entrada de Texto (Input)",
      },
      checkbox: {
        type: "boolean",
        title: "Casilla de verificación",
      },
      checkboxes: {
        type: "array",
        title: "Grupo de casilla de verificación",
        items: {
          type: "string",
          enum: ["opción-1", "opción-2", "opción-3"],
        },
        uniqueItems: true,
      },
      dropdown: {
        type: "string",
        title: "Selector",
        enum: ["option-1", "option-2", "option-3"],
        enumNames: ["Opción 1", "Opción 2", "Opción 3"],
      },
      number: {
        type: "number",
        title: "Entrada Numérica",
      },
      textarea: {
        type: "string",
        title: "Área de texto",
      },
      datetime: {
        type: "string",
        title: "Calendario",
      },
      file: {
        type: "string",
        title: "Archivo",
      },
      email: {
        type: "string",
        title: "Email",
        format: "email",
      },
      rut: {
        type: "string",
        title: "Rut",
      },
    },
  },
  uiSchema: {
    textarea: {
      "ui:widget": "textarea",
    },
    datetime: {
      "ui:widget": "date",
    },
    checkboxes: {
      "ui:widget": "checkboxes",
    },
    file: {
      "ui:widget": "file",
    },
  },
};
module.exports = {
  schema: {
    type: "object",
    properties: {
      basic: basic.schema,
    },
  },
  uiSchema: {
    basic: basic.uiSchema,
  },
};
