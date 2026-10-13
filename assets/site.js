(() => {
  "use strict";
  const p = window.PROFILE;
  const lang = document.body.dataset.language;
  const base = document.body.dataset.base;
  const labels = {about:"About",research:"Research interests",publications:"Publications",projects:"Project",education:"Education",contact:"Contact",cv:"Download CV",paper:"Paper",code:"Code",project:"Project",lab:"Laboratory",updated:"Updated",missing:"TODO: Add your academic email"};
  const t = value => typeof value === "string" ? value : (value?.en || "");
  const el = (tag, text, className) => { const n = document.createElement(tag); if(text) n.textContent = text; if(className) n.className = className; return n; };
  const safeUrl = (value, local=false) => { if(!value || /^(javascript|data):/i.test(value)) return ""; if(/^https?:\/\//i.test(value)) return value; if(local && !/^[a-z]+:/i.test(value) && !value.startsWith("//")) return base + value.replace(/^\//, ""); return ""; };
  const link = (text, url, local=false) => { const href=safeUrl(url,local); if(!href) return null; const a=el("a",text); a.href=href; if(/^https?:/.test(href)) {a.target="_blank"; a.rel="noopener noreferrer";} return a; };
  const add = (parent,node) => {if(node) parent.append(node);};
  document.title = `${t(p.name)} | ${"Academic Homepage"}`;
  for(const key of ["name"]) document.getElementById(key).textContent=t(p[key]);
  document.getElementById("brand").textContent=t(p.name);
  const links=document.getElementById("links");
  const emails = (p.emails || (p.email ? [{label: labels.contact, address: p.email}] : [])).filter(item => item.address?.trim());
  const emailLink = item => { const a=el("a", item.address); a.href="mailto:"+item.address.trim(); return a; };
  const separated = (parent, items) => { items.forEach((item,i) => { if(i) {const separator=el("span","｜","contact-separator"); separator.setAttribute("aria-hidden","true"); parent.append(separator);} parent.append(item); }); };
  separated(document.getElementById("hero-emails"),emails.map(emailLink));
  for(const [key,title] of [["scholar","Google Scholar"],["orcid","ORCID"],["lab",labels.lab]]) add(links,link(title,p.links?.[key]));
  add(links,link(labels.cv,t(p.cv),true));
  const phoneItems=(p.phones || []).map(item => {if(item.number) {const a=el("a",item.number); a.href="tel:"+item.number.replace(/[^+0-9]/g, ""); return a;} return el("span","TODO: "+t(item.label),"todo-contact");});
  separated(document.getElementById("hero-phones"),phoneItems);
  const githubUrl=p.links?.github || "";
  document.getElementById("hero-github").append(link("GitHub",githubUrl) || el("span","TODO: GitHub account","todo-contact"));
  const photo=safeUrl(p.photo,true);
  if(photo) { const img=el("img"); img.src=photo; img.alt=t(p.name); img.width=210; img.height=280; img.addEventListener("load",()=>document.getElementById("portrait").replaceChildren(img)); }
  const section = key => {const s=el("section",null,"content-section"); s.id=key; const h=el("h2",labels[key]); s.append(h); const body=el("div",null,"section-body"); s.append(body); document.getElementById("sections").append(s); const a=el("a",labels[key]); a.href="#"+key; document.getElementById("nav").append(a); return body;};
  const about=section("about"); about.append(el("p",t(p.intro),"intro"));
  const education=section("education");
  for(const item of p.education || []) { const entry=el("article",null,"education-entry"); entry.append(el("p",item.period,"period")); const details=el("div"); details.append(el("h3",t(item.institution)),el("p",t(item.degree))); entry.append(details); education.append(entry); }
  const projectBody=section("projects");
  for(const item of p.projects || []) { const article=el("article",null,"entry"); article.append(el("h3",t(item.title)),el("p",t(item.description))); add(article,link(labels.project,item.url)); projectBody.append(article); }
  if(p.interests?.length) {const body=section("research"); const list=el("ul",null,"interests"); p.interests.forEach(item=>list.append(el("li",t(item)))); body.append(list);}
  if(p.publications?.length) {const body=section("publications"); p.publications.forEach(item=>{const article=el("article",null,"entry"); article.append(el("h3",item.title),el("p",item.authors,"muted"),el("p",item.venue,"venue")); const row=el("div",null,"entry-links"); add(row,link(labels.paper,item.url)); add(row,link(labels.code,item.code)); article.append(row); body.append(article);});}
  document.getElementById("copyright").textContent=`© ${new Date().getFullYear()} ${t(p.name)}`;
  document.getElementById("updated").textContent=`${labels.updated} ${p.updated}`;
})();
