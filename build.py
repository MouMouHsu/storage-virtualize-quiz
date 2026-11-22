import json, glob, os, random, html, sys
os.chdir(os.path.dirname(os.path.abspath(__file__)))
os.makedirs('data', exist_ok=True)
chapters = []
for f in sorted(glob.glob('src/CH*.json')):
    d = json.load(open(f, encoding='utf-8'))
    items = d['items']
    if len(items) != 50:
        print('WARN', d['id'], len(items), 'items', file=sys.stderr)
    rnd = random.Random(d['id'])
    slots = [i % 4 for i in range(len(items))]
    rnd.shuffle(slots)
    qs = []
    seen = set()
    for i, (q, opts, e, r) in enumerate(items):
        assert len(opts) == 4 and len(set(opts)) == 4, (d['id'], i, q)
        assert q not in seen, (d['id'], 'dup', q); seen.add(q)
        wrong = opts[1:]
        rnd.shuffle(wrong)
        a = slots[i]
        o = wrong[:a] + [opts[0]] + wrong[a:]
        qs.append({'q': q, 'o': o, 'a': a, 'e': e, 'r': r})
    low = d['id'].lower()
    data = {'id': d['id'], 'title': d['title'], 'questions': qs}
    open(f'data/{low}.js', 'w', encoding='utf-8').write('window.QUIZ=' + json.dumps(data, ensure_ascii=False) + ';\n')
    page = open('templates/chapter.html', encoding='utf-8').read().replace('{{DATA}}', f'data/{low}.js').replace('{{TITLE}}', html.escape(d['id'] + ' ' + d['title']))
    open(f'{low}.html', 'w', encoding='utf-8').write(page)
    chapters.append((d['id'], d['title'], d.get('zh', ''), len(qs), low))
cards = '\n'.join(f'<a class="card" href="{l}.html"><div class="ch">{i}</div><div class="t">{html.escape(t)}</div><div class="m">{html.escape(z)} · {n} 題</div></a>' for i, t, z, n, l in chapters)
idx = open('templates/index.html', encoding='utf-8').read().replace('{{CARDS}}', cards).replace('{{TOTAL}}', str(sum(c[3] for c in chapters))).replace('{{N}}', str(len(chapters)))
open('index.html', 'w', encoding='utf-8').write(idx)
print('built', len(chapters), 'chapters,', sum(c[3] for c in chapters), 'questions')
