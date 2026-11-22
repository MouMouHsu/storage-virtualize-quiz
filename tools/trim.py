import json,sys
f=sys.argv[1]; d=json.load(open(f))
for s in sys.argv[2:]:
    n=len(d['items']); d['items']=[i for i in d['items'] if s not in i[0]]; assert len(d['items'])==n-1,s
json.dump(d,open(f,'w'),ensure_ascii=False,indent=0)
print(len(d['items']))
