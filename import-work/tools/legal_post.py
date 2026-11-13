#!/usr/bin/env python3
"""Post-process the verbatim extracted legal content: tables -> EDS table blocks, link and NBSP rules,
section style. Usage: python3 tools/legal_post.py  (run from import-work/, after extract.js)."""
import re, pathlib

PAGES = {'privacy': 'Privacy Policy and Your State Privacy Rights - Own It Voice It',
         'terms': 'Terms of Use - Own It Voice It',
         'sms': 'Text Messaging Policy - Own It Voice It'}
STYLE = '<div class="section-metadata"><div><div>Style</div><div>legal</div></div></div>'


def cell(html):
    html = html.replace('<p></p>', '')
    # bare inline text ahead of paragraphs: wrap it so the cell holds paragraphs only
    m = re.match(r'^(.*?)(<p>.*)$', html, re.S)
    if m and m.group(1).strip():
        html = f'<p>{m.group(1).strip()}</p>{m.group(2)}'
    return f'<div>{html}</div>'


def table(m):
    rows = re.findall(r'<tr>(.*?)</tr>', m.group(0), re.S)
    out = ''.join('<div>' + ''.join(cell(c) for c in re.findall(r'<td>(.*?)</td>', r, re.S)) + '</div>' for r in rows)
    return f'<div class="table">{out}</div>'


for name in PAGES:
    p = pathlib.Path(f'pages/{name}')
    src = (p / '10-content.html').read_text()
    html = re.sub(r'<table>.*?</table>', table, src, flags=re.S)
    # a link to the old privacy-policy page now points at the rebuilt page
    html = html.replace('href="https://prod.ownitvoiceit.com/privacy-policy/"', 'href="/privacy-policy"')
    # the pipeline turns "&nbsp;" next to an inline tag into NBSP + space: author a plain space
    html = re.sub(r'(</(?:strong|em|u|a)>)&nbsp;', r'\1 ', html)
    html = re.sub(r'&nbsp;(<(?:strong|em|u|a)[ >])', r' \1', html)
    (p / '10-content.html').write_text(html + STYLE)
    (p / '90-metadata.html').write_text(f'<div class="metadata"><div><div>Title</div><div>{PAGES[name]}</div></div></div>')
    print(name, len(src), '->', len(html), 'tables:', len(re.findall(r'<div class="table">', html)))
