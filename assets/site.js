// Renders news, projects, publications and group from the JSON files in /data.
// To add content, edit the JSON files only (see HOW_TO_UPDATE.md).
async function load(name){const r=await fetch('data/'+name+'.json');return r.json();}
function esc(s){return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');}
function pubHTML(p){
  const links=[];
  if(p.doi) links.push(`<a href="https://doi.org/${p.doi}">DOI</a>`);
  if(p.pdf) links.push(`<a href="${p.pdf}">PDF</a>`);
  if(p.code) links.push(`<a href="${p.code}">Code</a>`);
  const st=p.status==='accepted'?'<span class="badge">accepted</span>':'';
  const tags=(p.tags||[]).map(t=>`<span class="tag-chip" data-tag="${t}">${t}</span>`).join('');
  const cite=p.bibtex?`<details class="cite"><summary>Cite</summary><pre>${esc(p.bibtex)}</pre><button class="copy">Copy BibTeX</button></details>`:'';
  const img=p.thumb?`<img src="${p.thumb}" alt="" loading="lazy">`:'';
  return `<div class="pub ${p.thumb?'':'nothumb'}">${img}<div><span class="n">[${p.num}]</span>${p.html}${st}
    <div class="acts">${links.join('')}${tags}</div>${cite}</div></div>`;
}
document.addEventListener('click',e=>{
  if(e.target.classList.contains('copy')){const t=e.target.previousElementSibling.textContent;
    navigator.clipboard.writeText(t).then(()=>{e.target.textContent='Copied';setTimeout(()=>e.target.textContent='Copy BibTeX',1500);});}
});
async function renderNews(el,limit){const n=await load('news');
  el.innerHTML='<ul class="news">'+n.slice(0,limit||n.length).map(x=>`<li><span class="d">${x.date}</span><span>${x.link?`<a href="${x.link}">${x.text}</a>`:x.text}</span></li>`).join('')+'</ul>';}
async function renderSelected(el){const p=await load('publications');el.innerHTML=p.filter(x=>x.selected).map(pubHTML).join('');}
async function renderPubs(el,fl,search){const p=await load('publications');
  const cats={all:'All',first:'First author',coauthor:'Co-author (computational)',collab:'Experimental collaborations',msc:'M.Sc.'};
  let cur='all',tag=null,q='',area='all';
  const areas={all:'All areas',ml:'AI & machine learning',thermal:'Thermal-energy materials',catalysis:'Electrocatalysis',films:'Thin films'};
  const acount=k=>k==='all'?p.length:p.filter(x=>(x.areas||[]).includes(k)).length;
  const count=k=>k==='all'?p.length:p.filter(x=>x.category===k).length;
  fl.innerHTML='<div class="frow" id="arow"><span class="flabel">Research area</span>'+Object.entries(areas).map(([k,v])=>`<button data-a="${k}" class="${k==='all'?'on':''}">${v} <span class="c">${acount(k)}</span></button>`).join('')+'</div><div class="frow" id="crow"><span class="flabel">Authorship</span>'+Object.entries(cats).map(([k,v])=>`<button data-k="${k}" class="${k==='all'?'on':''}">${v} <span class="c">${count(k)}</span></button>`).join('')+'</div>';
  function draw(){
    const list=p.filter(x=>(cur==='all'||x.category===cur)&&(area==='all'||(x.areas||[]).includes(area))&&(!tag||(x.tags||[]).includes(tag))&&
      (!q||(x.html+' '+(x.tags||[]).join(' ')).toLowerCase().includes(q))).sort((a,b)=>b.year-a.year||b.num-a.num);
    let html=tag?`<p class="active-tag">Topic: <b>${tag}</b> <a href="#" id="cleartag">clear</a></p>`:'';
    let yr=null;for(const x of list){if(x.year!==yr){yr=x.year;html+=`<div class="year">${yr}</div>`;}html+=pubHTML(x);}
    if(!list.length) html+='<p>No papers match.</p>';
    el.innerHTML=html; const c=document.getElementById('cleartag'); if(c) c.onclick=ev=>{ev.preventDefault();tag=null;draw();};}
  fl.addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;
    if(b.dataset.a){area=b.dataset.a;fl.querySelectorAll('button[data-a]').forEach(x=>x.classList.toggle('on',x.dataset.a===area));}
    else{cur=b.dataset.k;fl.querySelectorAll('button[data-k]').forEach(x=>x.classList.toggle('on',x.dataset.k===cur));}
    draw();});
  const h=location.hash.slice(1); if(areas[h]&&h!=='all'){area=h;fl.querySelectorAll('button[data-a]').forEach(x=>x.classList.toggle('on',x.dataset.a===area));}
  el.addEventListener('click',e=>{if(e.target.classList.contains('tag-chip')){tag=e.target.dataset.tag;draw();window.scrollTo({top:el.offsetTop-80,behavior:'smooth'});}});
  if(search) search.addEventListener('input',()=>{q=search.value.trim().toLowerCase();draw();});
  draw();}
async function renderProjects(el){const p=await load('projects');
  el.innerHTML='<div class="cards">'+p.map(x=>`<div class="card"><h3><a href="${x.url}">${x.name}</a></h3><p>${x.text}</p>${x.paper?`<p class="paper">${x.paper}</p>`:''}</div>`).join('')+'</div>';}
async function renderGroup(el){const g=await load('group');
  if(!g.length){el.innerHTML='<p>No group members yet.</p>';return;}
  el.innerHTML='<div class="cards">'+g.map(x=>`<div class="card"><h3>${x.name}</h3><p>${x.role}</p><p class="paper">${x.topic||''}</p></div>`).join('')+'</div>';}

async function renderGallery(el){let g=[];try{g=await load('gallery');}catch(e){return;}
  if(!g.length) return; document.getElementById('gallery-wrap').hidden=false;
  el.innerHTML=g.map(x=>`<figure><img src="${x.img}" alt="${x.caption}" loading="lazy"><figcaption><b>${x.caption}</b>${x.date?` &middot; ${x.date}`:''}</figcaption></figure>`).join('');}
