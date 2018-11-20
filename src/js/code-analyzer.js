import * as esprima from 'esprima';
import $ from 'jquery';

let table = [];

const parseCode = (codeToParse) => {
  table = [];
  return esprima.parseScript(codeToParse);
};


class Line {
  constructor(line, type, name, condition, value) {
    this.Line = line;
    this.Type = type;
    this.Name = name;
    this.Condition = condition;
    this.Value = value;
  }
}

const literalExp = json => json.value;

const binaryExp = json => `${parseLiteral[json.left.type](json.left)} ${json.operator} ${parseLiteral[json.right.type](json.right)}`;

const identifierExp = json => json.name;

const memberExp = json => `${parseLiteral[json.object.type](json.object)}[${parseLiteral[json.property.type](json.property)}]`;

const unaryExp = json => json.operator + (parseLiteral[json.argument.type](json.argument));

const arrayExp = (json) => {
  let s = '[';
  let i;
  for (i = 0; i < json.elements.length - 1; i++) {
    s += parseLiteral[json.elements[i].type](json.elements[i]);
    s += ', ';
  }
  s += parseLiteral[json.elements[i].type](json.elements[i]);
  s += ']';
  return s;
};

const parseLiteral = {
  Literal: literalExp,
  Identifier: identifierExp,
  BinaryExpression: binaryExp,
  MemberExpression: memberExp,
  UnaryExpression: unaryExp,
  ArrayExpression: arrayExp,

};


function parseFunDec(json) {
  const line = json.loc.start.line;
  table.push(new Line(line, 'Function Declaration', json.id.name, '', ''));
  for (const param in json.params) parser(json.params[param]);
}

function parseIdentifier(json) {
  const line = json.loc.start.line;
  table.push(new Line(line, 'Variable Declaration', json.name, '', ''));
}

function parseVarDec(json) {
  for (const decl in json.declarations) parser(json.declarations[decl]);
}

function parseWhile(json) {
  const line = json.loc.start.line;
  table.push(new Line(line, 'While Statement', '', parseLiteral[json.test.type](json.test, false), ''));
}

function parseFor(json) {
  const line = json.loc.start.line;
  table.push(new Line(line, 'For Statement', '', `${parseLiteral[json.test.init](json.init, false)};${parseLiteral[json.test.type](json.test, false)};${ParseExp[json.test.update](json.update, false)}`, ''));
}

function parseIf(json, isElse) {
  const line = json.loc.start.line;
  let ifStr = 'If Statement';
  if (isElse) ifStr = 'Else If statement';
  table.push(new Line(line, ifStr, '', parseLiteral[json.test.type](json.test, false), ''));
  parser(json.consequent);
  parser(json.alternate, true);
}

function parseExpStatement(json) {
  const line = json.loc.start.line;
  table.push(new Line(line, 'Assignment Expression', json.expression.left.name, '', parseLiteral[json.expression.right.type](json.expression.right)));
}

function parseReturnStatement(json) {
  const line = json.loc.start.line;
  table.push(new Line(line, 'Return Statement', '', '', parseLiteral[json.argument.type](json.argument)));
}

function parseBody(json, table) {
  if (json.body.constructor === Array) {
    for (const line in json.body) parser(json.body[line]);
    if (json.type == 'Program') return table;
  } else parser(json.body);
}

const parseFunctions = {
  FunctionDeclaration: parseFunDec,
  Identifier: parseIdentifier,
  VariableDeclaration: parseVarDec,
  WhileStatement: parseWhile,
  IfStatement: parseIf,
  ExpressionStatement: parseExpStatement,
  ReturnStatement: parseReturnStatement,
  ForStatement: parseFor,
};

function parser(json, isElse = false) {
  if (json == null) return;
  if (typeof json === 'string') {
    json = esprima.parseScript(json, { loc: true });
    table = [];
  }
  if (parseFunctions.hasOwnProperty(json.type)) parseFunctions[json.type](json, isElse);
  if (json.hasOwnProperty('body')) {
    const res = parseBody(json, table);
    if (json.type == 'Program') return res;
  }
}
export { parseCode };
export { parser };
export { Line };
export { table };
