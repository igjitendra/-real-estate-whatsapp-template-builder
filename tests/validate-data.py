#!/usr/bin/env python3
from pathlib import Path
import json,re,sys
root=Path(__file__).resolve().parents[1]
t=json.loads((root/'data/templates.json').read_text())
f=json.loads((root/'data/chat-flows.json').read_text())
v=json.loads((root/'data/variables.json').read_text())
known={x['key'] for x in v['variables']}; errors=[]
for item in t['templates']:
    used=set(re.findall(r'\{\{([A-Za-z][A-Za-z0-9]*)\}\}',item['message']))
    if not used.issubset(known): errors.append(f"{item['id']}: unknown tokens {sorted(used-known)}")
    if set(item['variables']) != used: errors.append(f"{item['id']}: declared/used variable mismatch")
ids=[x['id'] for x in t['templates']]
if len(ids)!=len(set(ids)): errors.append('Duplicate template IDs')
flow_ids=[x['id'] for x in f['flows']]
if len(flow_ids)!=33 or len(flow_ids)!=len(set(flow_ids)): errors.append('Flow count/IDs invalid')
for flow in f['flows']:
    orders=[s['order'] for s in flow['steps']]
    if orders!=list(range(1,len(orders)+1)): errors.append(f"{flow['id']}: step order invalid")
print(json.dumps({'templates':len(ids),'flows':len(flow_ids),'variables':len(known),'errors':errors},indent=2))
sys.exit(1 if errors else 0)
