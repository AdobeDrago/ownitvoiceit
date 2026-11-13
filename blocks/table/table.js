/**
 * Plain data table: every authored row becomes a table row, every cell a table cell.
 * @param {Element} block The table block element
 */
export default function decorate(block) {
  const table = document.createElement('table');
  const tbody = document.createElement('tbody');
  [...block.children].forEach((row) => {
    const tr = document.createElement('tr');
    [...row.children].forEach((cell) => {
      const td = document.createElement('td');
      // EDS wraps loose cell text in a <p>. Cells hold their first text directly, as authored on
      // the source: one paragraph becomes plain cell content; with more, the first is followed by
      // an empty spacer paragraph (its 8px margin separates it from the next one)
      const paras = [...cell.children].filter((c) => c.tagName === 'P');
      const first = paras.length === cell.children.length ? paras[0] : null;
      if (first) {
        td.append(...first.childNodes);
        if (paras.length > 1) td.append(document.createElement('p'), ...paras.slice(1));
      } else td.append(...cell.childNodes);
      tr.append(td);
    });
    tbody.append(tr);
  });
  table.append(tbody);
  block.replaceChildren(table);
}
