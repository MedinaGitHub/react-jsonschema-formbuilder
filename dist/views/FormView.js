import React from "react";
import { connect } from "react-redux";
import Form from "../rjsf-patch/Form";
import { FieldTemplate, ObjectFieldTemplate } from "../Template";

class FormView extends React.Component {
  render() {
    if (!this.props.schema) {
      return null;
    }

    const {
      name,
      schema,
      uiSchema,
      formData,
      setFormData,
      liveValidate,
    } = this.props;

    function checkRut(rut) {
      // Despejar Puntos
      rut.value = rut.value.replace(".", "");
      var valor = rut.value.replace(".", ""); // Despejar Guión

      valor = valor.replace("-", ""); // Aislar Cuerpo y Dígito Verificador

      var cuerpo = valor.slice(0, -1);
      var dv = valor.slice(-1).toUpperCase(); // Formatear RUN

      rut.value = cuerpo + "-" + dv; // Si no cumple con el mínimo ej. (n.nnn.nnn)

      if (cuerpo.length < 7) {
        return false;
      } // Calcular Dígito Verificador

      var suma = 0;
      var multiplo = 2; // Para cada dígito del Cuerpo

      for (let i = 1; i <= cuerpo.length; i++) {
        // Obtener su Producto con el Múltiplo Correspondiente
        let index = multiplo * valor.charAt(cuerpo.length - i); // Sumar al Contador General

        suma = suma + index; // Consolidar Múltiplo dentro del rango [2,7]

        if (multiplo < 7) {
          multiplo = multiplo + 1;
        } else {
          multiplo = 2;
        }
      } // Calcular Dígito Verificador en base al Módulo 11

      var dvEsperado = 11 - (suma % 11); // Casos Especiales (0 y K)

      dv = dv == "K" ? 10 : dv;
      dv = dv == 0 ? 11 : dv; // Validar que el Cuerpo coincide con su Dígito Verificador

      if (dvEsperado != dv) {
        return false;
      } // Si todo sale bien, eliminar errores (decretar que es válido)

      return true;
    }

    function validate(formData, errors) {
      console.log("errors", errors);
      console.log("formData", formData);

      for (let key in formData) {
        if (key.search("rut") != -1) {
          var hola = checkRut({
            value: formData[key],
          });
          console.log("hola", hola);
        }

        console.log(key, formData[key]);
      }

      return errors;
    }

    return /*#__PURE__*/ React.createElement(Form, {
      validate: validate,
      schema: schema,
      uiSchema: uiSchema,
      formData: formData,
      liveValidate: liveValidate,
      FieldTemplate: FieldTemplate,
      ObjectFieldTemplate: ObjectFieldTemplate,
      idPrefix: name,
      onChange: setFormData,
    });
  }
}

export default connect(
  ({
    tree: {
      present: [{ name, schema, uiSchema, customFormats }],
    },
    formData,
    settings: { isLiveValidate },
  }) => ({
    name,
    schema,
    uiSchema,
    customFormats,
    formData,
    liveValidate: isLiveValidate,
  }),
  (dispatch) => ({
    setFormData: ({ formData }) =>
      dispatch({
        type: "FORM_DATA_SET",
        payload: formData,
      }),
  })
)(FormView);
