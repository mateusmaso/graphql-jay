'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

exports.simplifyAST = simplifyAST;
// https://github.com/mickhansen/graphql-sequelize/blob/master/src/simplifyAST.js

function deepMerge(a, b) {
  Object.keys(b).forEach(function (key) {
    if (['fields', 'args'].indexOf(key) !== -1) return;

    if (a[key] && b[key] && _typeof(a[key]) === 'object' && _typeof(b[key]) === 'object') {
      a[key] = deepMerge(a[key], b[key]);
    } else {
      a[key] = b[key];
    }
  });

  if (a.fields && b.fields) {
    a.fields = deepMerge(a.fields, b.fields);
  } else if (a.fields || b.fields) {
    a.fields = a.fields || b.fields;
  }

  return a;
}

function hasFragments(info) {
  return info.fragments && Object.keys(info.fragments).length > 0;
}

function isFragment(info, ast) {
  return hasFragments(info) && info.fragments[ast.name.value] && ast.kind !== 'FragmentDefinition';
}

function simplifyObjectValue(objectValue) {
  return objectValue.fields.reduce(function (memo, field) {
    memo[field.name.value] = field.value.kind === 'IntValue' ? parseInt(field.value.value, 10) : field.value.kind === 'FloatValue' ? parseFloat(field.value.value) : field.value.kind === 'ObjectValue' ? simplifyObjectValue(field.value) : field.value.value;

    return memo;
  }, {});
}

function simplifyValue(value, info) {
  if (value.values) {
    return value.values.map(function (value) {
      return simplifyValue(value, info);
    });
  }
  if ('value' in value) {
    return value.value;
  }
  if (value.kind === 'ObjectValue') {
    return simplifyObjectValue(value);
  }
  if (value.name) {
    return info.variableValues[value.name.value];
  }
}

function simplifyAST(ast, info, parent) {
  var selections;
  info = info || {};

  if (ast.selectionSet) selections = ast.selectionSet.selections;
  if (Array.isArray(ast)) {
    var _ret = function () {
      var simpleAST = {};
      ast.forEach(function (ast) {
        simpleAST = deepMerge(simpleAST, simplifyAST(ast, info));
      });

      return {
        v: simpleAST
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }

  if (isFragment(info, ast)) {
    return simplifyAST(info.fragments[ast.name.value], info);
  }

  if (!selections) return {
    fields: {},
    args: {}
  };

  return selections.reduce(function (simpleAST, selection) {
    if (selection.kind === 'FragmentSpread' || selection.kind === 'InlineFragment') {
      simpleAST = deepMerge(simpleAST, simplifyAST(selection, info));
      return simpleAST;
    }

    var name = selection.name.value,
        alias = selection.alias && selection.alias.value,
        key = alias || name;

    simpleAST.fields[key] = simpleAST.fields[key] || {};
    simpleAST.fields[key] = deepMerge(simpleAST.fields[key], simplifyAST(selection, info, simpleAST.fields[key]));

    if (alias) {
      simpleAST.fields[key].key = name;
    }

    simpleAST.fields[key].args = selection.arguments.reduce(function (args, arg) {
      args[arg.name.value] = simplifyValue(arg.value, info);
      return args;
    }, {});

    if (parent) {
      Object.defineProperty(simpleAST.fields[key], '$parent', { value: parent, enumerable: false });
    }

    return simpleAST;
  }, {
    fields: {},
    args: {}
  });
};