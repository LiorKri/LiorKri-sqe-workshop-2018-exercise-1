import $ from 'jquery';
import { parseCode } from './code-analyzer';
import { parser } from './code-analyzer';

$(document).ready(() => {
  $('#codeSubmissionButton').click(() => {
    const codeToParse = $('#codePlaceholder').val();
    const parsedCode = parseCode(codeToParse);
    $('#parsedCode').val(JSON.stringify(parsedCode, null, 2));
    const tlb = parser(codeToParse);
    createTable(tlb);
  });
});

function createTable(tableArr) {
  const columns = ['Line', 'Type', 'Name', 'Condition', 'Value'];
  const table = document.getElementById('parsed_table');
  table.innerHTML = '';
  let tableRow = table.insertRow(-1);
  for (let i = 0; i < columns.length; i++) {
    const tableHeader = document.createElement('th');
    tableHeader.innerHTML = columns[i];
    tableRow.appendChild(tableHeader);
  }
  for (let i = 0; i < tableArr.length; i++) {
    tableRow = table.insertRow(-1);
    for (let j = 0; j < columns.length; j++) {
      const tabCell = tableRow.insertCell(-1);
      tabCell.innerHTML = tableArr[i][columns[j]];
    }
  }
}
