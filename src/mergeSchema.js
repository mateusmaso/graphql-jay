import clone from 'clone';
import {graphql, introspectionQuery, buildClientSchema} from 'graphql';

export function mergeSchema(...schemas) {
  return Promise.all(schemas.map((schema) => {
    return graphql(schema, introspectionQuery).then((response) => {
      return response.data;
    });
  })).then((schemasData) => {
    var rootSchemaData = {
      "__schema": {
        "queryType": {
          "name": "Query"
        },
        "types": []
      }
    };

    schemasData.forEach((schemaData) => {
      schemaData = clone(schemaData);
      schemaData.__schema.types.forEach((type) => {
        var rootType = rootSchemaData.__schema.types.find((rootType) => {
          return rootType.name == type.name;
        });

        if (rootType) {
          extendType(rootType, type);
        } else {
          rootSchemaData.__schema.types.push(type);
        }
      });
    });

    return buildClientSchema(rootSchemaData);
  });
}

function extendType(rootType, type) {
  (type.fields || []).forEach((field) => {
    var rootField = rootType.fields.find((rootField) => {
      return rootField.name == field.name;
    });

    if (rootField) {
      extendTypeField(rootField, field);
    } else {
      rootType.fields.push(field);
    }
  });
}

function extendTypeField(rootField, field) {
  (field.args || []).forEach((arg) => {
    var rootArg = rootField.args.find((rootArg) => {
      return rootArg.name == arg.name;
    });

    if (rootArg) {
      Object.assign(rootArg, arg);
    } else {
      rootField.args.push(arg);
    }
  });
}
