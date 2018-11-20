import assert from 'assert';
import { Line, parser, parseCode } from '../src/js/code-analyzer';

describe('The javascript parser', () => {
  it('is parsing an empty function correctly', () => {
    assert.equal(
      JSON.stringify(parseCode('')),
      '{"type":"Program","body":[],"sourceType":"script"}',
    );
  });

  it('is parsing a simple variable declaration correctly', () => {
    assert.equal(
      JSON.stringify(parseCode('let a = 1;')),
      '{"type":"Program","body":[{"type":"VariableDeclaration","declarations":[{"type":"VariableDeclarator","id":{"type":"Identifier","name":"a"},"init":{"type":"Literal","value":1,"raw":"1"}}],"kind":"let"}],"sourceType":"script"}',
    );
  });


  it('is parsing an simple while', () => {
    const tbl = [];
    tbl.push(new Line(1, 'While Statement', '', 'low <= high', ''));
    tbl.push(new Line(1, 'Assignment Expression', 'mid', '', 'low + high / 2'));
    assert.deepEqual(
      parser('while (low <= high)'
                + '{mid = (low + high)/2;}'),
      tbl,
    );
  });

  it('is parsing an simple if- without else', () => {
    const tbl = [];
    tbl.push(new Line(1, 'If Statement', '', 'X < V[mid]', ''));
    tbl.push(new Line(2, 'Assignment Expression', 'high', '', 'mid - 1'));
    assert.deepEqual(parser('if (X < V[mid])\n'
                + '            high = mid - 1;\n'), tbl);
  });

  it('is parsing an simple if-else', () => {
    const tbl = [];
    tbl.push(new Line(1, 'If Statement', '', 'X < V[mid]', ''));
    tbl.push(new Line(2, 'Assignment Expression', 'high', '', 'mid - 1'));
    tbl.push(new Line(3, 'Else If statement', '', 'X > V[mid]', ''));
    tbl.push(new Line(4, 'Assignment Expression', 'low', '', 'mid + 1'));
    assert.deepEqual(parser('if (X < V[mid])\n'
                + '            high = mid - 1;\n'
                + '        else if (X > V[mid])\n'
                + '            low = mid + 1;'), tbl);
  });

  it('is parsing a simple return statement', () => {
    const tbl = [];
    tbl.push(new Line(1, 'Function Declaration', 'binarySearch', '', ''));
    tbl.push(new Line(1, 'Return Statement', '', '', '-1'));
    assert.deepEqual(parser('function binarySearch(){return -1}'), tbl);
  });

  it('is parsing a function with multiple statement', () => {
    const tbl = [];
    tbl.push(new Line(1, 'Function Declaration', 'binarySearch', '', ''));
    tbl.push(new Line(1, 'If Statement', '', 'X < V[mid]', ''));
    tbl.push(new Line(2, 'Assignment Expression', 'high', '', 'mid - 1'));
    tbl.push(new Line(3, 'Else If statement', '', 'X > V[mid]', ''));
    tbl.push(new Line(4, 'Assignment Expression', 'low', '', 'mid + 1'));
    assert.deepEqual(parser('function binarySearch(){\n'
              + '         if (X < V[mid])\n'
              + '            high = mid - 1;\n'
              + '        else if (X > V[mid])\n'
              + '            low = mid + 1;}'), tbl);
  });


  it('is parsing sipmle assignment expression ', () => {
    const tbl = [];
    tbl.push(new Line(1, 'Assignment Expression', 'a', '', 'a+5'));
    assert.deepEqual(parser('a = a+5'),
      tbl);
  });

  it('is parsing an assignment expression with array', () => {
    const tbl = [];
    tbl.push(new Line(1, 'Assignment Expression', 'a', '', '[23,43,23]'));
    assert.deepEqual(parser('a = [23,43,23]'),
      tbl);
  });
});
