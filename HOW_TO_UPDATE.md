# How to update this website

The site is plain HTML. Lists (papers, news, code, group) are stored in `data/*.json`; the pages read them
automatically. You never need to touch the design to add content.

## Edit on GitHub (easiest)
Open the file on github.com, click the pencil icon, edit, then "Commit changes". The site updates in about a minute.

## Add a new paper — `data/publications.json`
Copy an existing entry, put it at the top, and change the fields:
```json
{"num": 27, "year": 2027, "category": "first",
 "html": "<b>Harpriya Minhas</b>, Co-Author, Title of the Paper, <i>Journal</i>, <b>2027</b>, 1, 100-110.",
 "doi": "10.xxxx/xxxxx", "status": "published", "thumb": "assets/img/toc_P27.jpg", "selected": true}
```
- `category`: `first`, `coauthor`, `collab` or `msc`
- `status`: `published` or `accepted` (accepted shows a badge; leave `doi` as `null` until published)
- `thumb`: optional picture (upload it to `assets/img/`), or `null`
- `selected`: `true` shows the paper on the home page (keep about 5-6 selected)
- optional: `"pdf": "assets/pdf/file.pdf"`, `"code": "https://github.com/..."`

## Add news — `data/news.json`
Add a line at the top: `{"date": "Jan 2027", "text": "What happened.", "link": "https://..."}`. The home page shows the latest 6.

## Add code/data — `data/projects.json`
`{"name": "repo_name", "text": "One sentence.", "paper": "Journal 2027", "url": "https://github.com/Harpriyaminhas/repo_name"}`

## Update the CV
The CV is kept private and is not published on the site (stored in ../Website_private_not_published).

## Change text on the About / Research pages
Edit `index.html` or `research.html` directly (the bio, research cards, honours, presentations, education).

## When you start your own group
1. Add members to `data/group.json`, e.g.
   `{"name": "Student Name", "role": "Ph.D. student (2027-)", "topic": "Bonding-aware ML potentials"}`
2. In every page's menu, add `<li><a href="group.html">Group</a></li>` (or ask a student to do it once).
3. Optional pages to add later: "Join us" (openings), "Teaching", "Talks". Copy `group.html` as a template.
4. You can also point a custom domain (e.g. a lab domain) to this site in the repository Settings > Pages.
