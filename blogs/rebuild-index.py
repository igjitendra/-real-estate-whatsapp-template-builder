#!/usr/bin/env python3
"""Rebuild blog listing data, RSS feed and sitemap after adding HTML posts."""
from pathlib import Path
from bs4 import BeautifulSoup
import json, re, html
blogs=Path(__file__).resolve().parent
root=blogs.parent
posts=[]
for page in sorted(blogs.glob('*.html')):
    if page.name in {'blog-template.html','index.html'}: continue
    soup=BeautifulSoup(page.read_text(encoding='utf-8'),'html.parser')
    article=soup.select_one('[data-blog-article]')
    if not article: continue
    title=(soup.title.get_text(' ',strip=True).split(' | ')[0] if soup.title else page.stem.replace('-',' ').title())
    desc=soup.find('meta',attrs={'name':'description'})
    category=soup.select_one('.article-hero .eyebrow')
    meta=[x.get_text(' ',strip=True) for x in soup.select('.article-meta span')]
    image=soup.select_one('.article-cover')
    minutes=next((int(x.split()[0]) for x in meta if re.match(r'^\d+\s+min',x)),8)
    posts.append({'slug':article.get('data-slug',page.stem),'file':page.name,'title':title,'description':desc.get('content','') if desc else '','category':category.get_text(' ',strip=True) if category else 'Real Estate WhatsApp','tags':[category.get_text(' ',strip=True) if category else 'guide'],'date':soup.find('meta',attrs={'name':'article:published_time'}).get('content','') if soup.find('meta',attrs={'name':'article:published_time'}) else '','dateLabel':meta[0] if meta else '','minutes':minutes,'author':meta[2] if len(meta)>2 else 'Jitendra Kumar','image':image.get('src','assets/images/approval-guide.svg') if image else 'assets/images/approval-guide.svg'})
posts.sort(key=lambda x:x['date'],reverse=True)
(blogs/'data/posts.json').write_text(json.dumps(posts,ensure_ascii=False,indent=2),encoding='utf-8')
(blogs/'data/posts.js').write_text('window.BLOG_POSTS='+json.dumps(posts,ensure_ascii=False,separators=(',',':'))+';',encoding='utf-8')
base='https://realestatewhatsappflowbuilder.com'
items=''.join(f'<item><title>{html.escape(x["title"])}</title><link>{base}/blogs/{x["file"]}</link><description>{html.escape(x["description"])}</description></item>' for x in posts)
(blogs/'feed.xml').write_text(f'<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Real Estate WhatsApp Blog</title><link>{base}/blog.html</link><description>Practical real estate WhatsApp guides.</description>{items}</channel></rss>',encoding='utf-8')
pages=sorted(p.relative_to(root).as_posix() for p in root.rglob('*.html') if p.name not in {'404.html','blog-template.html'})
urls=''.join(f'<url><loc>{base}/{"" if x=="index.html" else x}</loc><changefreq>{"weekly" if x.startswith("blog") else "monthly"}</changefreq></url>\n' for x in pages)
(root/'sitemap.xml').write_text('<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/sitemap/0.9">\n'+urls+'</urlset>',encoding='utf-8')
print(json.dumps({'posts':len(posts),'feed':'updated','sitemap':'updated'}))
