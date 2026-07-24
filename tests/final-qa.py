from pathlib import Path
from bs4 import BeautifulSoup
import json,sys
r=Path(__file__).resolve().parents[1];errors=[];pages=list(r.rglob("*.html"))
for p in pages:
 s=BeautifulSoup(p.read_text(),"html.parser");rel=p.relative_to(r)
 if not s.title:errors.append(f"{rel}: title")
 if not s.find("meta",attrs={"name":"description"}):errors.append(f"{rel}: description")
 if not s.find("link",rel="canonical"):errors.append(f"{rel}: canonical")
 for tag,attr in [("a","href"),("link","href"),("script","src"),("img","src")]:
  for n in s.find_all(tag):
   u=n.get(attr)
   if not u or u.startswith(("http:","https:","mailto:","tel:","#","data:")):continue
   u=u.split("?")[0].split("#")[0]
   if not (p.parent/u).resolve().exists():errors.append(f"{rel}: missing {u}")
for x in ["robots.txt","sitemap.xml","site.webmanifest","404.html","privacy-policy.html","disclaimer.html"]:
 if not (r/x).exists():errors.append(f"missing {x}")
for f in (r/"data").glob("*.json"):json.loads(f.read_text())
print({"htmlPages":len(pages),"errors":errors});sys.exit(bool(errors))
