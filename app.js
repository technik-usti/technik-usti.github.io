(function(){
  const lang="cs";
  const dict=window.SITE_I18N[lang];
  const page=document.body.dataset.page||"index";
  const service=document.body.dataset.service;
  const get=(path)=>path.split(".").reduce((o,k)=>o&&o[k],dict);
  document.documentElement.lang=lang;
  document.querySelectorAll("[data-i18n]").forEach(el=>{
    const value=get(el.dataset.i18n);
    if(Array.isArray(value)) return;
    if(value) el.textContent=value;
  });
  document.querySelectorAll("[data-i18n-attr]").forEach(el=>{
    el.dataset.i18nAttr.split(";").forEach(item=>{
      const [attr,path]=item.split(":").map(part=>part.trim());
      const value=attr && path && get(path);
      if(value) el.setAttribute(attr,value);
    });
  });
  document.querySelectorAll("[data-i18n-html]").forEach(el=>{
    const value=get(el.dataset.i18nHtml);
    if(value) el.innerHTML=value;
  });
  document.querySelectorAll("[data-service-field]").forEach(el=>{
    if(!service) return;
    const value=dict.services[service] && dict.services[service][el.dataset.serviceField];
    if(value) el.textContent=value;
  });
  if(service && dict.services[service]){
    const current=dict.services[service];
    const imageSlug=current.image||service;
    document.title=`${current.title} — ${dict.meta.brand}`;
    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute("content",current.metaDescription||current.short||dict.meta.tagline);
    document.querySelectorAll("[data-service-img]").forEach(img=>{
      const variant=img.dataset.serviceImg||"hover";
      img.src=`./img/${imageSlug}--${variant}.png`;
    });
  }else if(dict.pages && dict.pages[page]){
    document.title=dict.pages[page].title;
    const meta=document.querySelector('meta[name="description"]');
    if(meta) meta.setAttribute("content",dict.pages[page].description||dict.meta.tagline);
  }
  const navLinks=document.querySelector(".site-header .nav-links");
  if(navLinks && service && window.SERVICE_GROUPS && dict.services[service]){
    const group=Object.values(window.SERVICE_GROUPS).find(items=>items.includes(service)) || window.SERVICE_GROUPS[service];
    if(group){
      const links=group
        .filter(slug=>slug!==service && dict.services[slug])
        .map(slug=>`<a class="service-peer-link" href="./${slug}.html">${dict.services[slug].title}</a>`)
        .join("");
      if(links) navLinks.insertAdjacentHTML("afterbegin",links);
    }
  }
  const serviceNav=document.querySelector("[data-service-nav]");
  if(serviceNav && service){
    const order=window.SERVICE_ORDER||[];
    const idx=order.indexOf(service);
    const prevSlug=idx>0 ? order[idx-1] : null;
    const nextSlug=idx>=0 && idx<order.length-1 ? order[idx+1] : null;
    const prev=prevSlug
      ? {href:`./${prevSlug}.html`, text:`← ${dict.services[prevSlug].title}`}
      : {href:"./index.html#sluzby", text:dict.common.back};
    const next=nextSlug
      ? {href:`./${nextSlug}.html`, text:`${dict.services[nextSlug].title} →`}
      : {href:"./kontakt.html", text:`${dict.nav.contact} →`};
    serviceNav.innerHTML=`<a class="btn secondary" href="${prev.href}">${prev.text}</a><a class="btn" href="${next.href}">${next.text}</a>`;
  }
  const grids=document.querySelectorAll("[data-services-grid]");
  if(grids.length){
    grids.forEach(grid=>{
      const group=grid.dataset.serviceGroup;
      const order=(group && window.SERVICE_GROUPS && window.SERVICE_GROUPS[group]) || window.SERVICE_ORDER;
      grid.innerHTML=order.map((slug)=> {
      const s=dict.services[slug];
      const imageSlug=s.image||slug;
      return `<a class="service-card" href="./${slug}.html">
        <div class="service-media" aria-hidden="true">
          <img class="main" src="./img/${imageSlug}--main.png" alt="" loading="lazy">
          <img class="hover" src="./img/${imageSlug}--hover.png" alt="" loading="lazy">
        </div>
        <div class="service-body">
          <h3>${s.title}</h3>
          <p>${s.short}</p>
        </div>
      </a>`;
      }).join("");
    });
  }
  const strip=document.querySelector("[data-strip]");
  if(strip){
    strip.innerHTML=dict.strips.map(item=>{
      const title=Array.isArray(item) ? item[0] : item.title;
      const text=Array.isArray(item) ? item[1] : item.text;
      const image=Array.isArray(item) ? item[2] : item.image;
      const media=image ? `<img class="info-card-icon" src="./img/${image}" alt="" aria-hidden="true" loading="lazy">` : "";
      return `<div class="info-card">${media}<div><strong>${title}</strong><span>${text}</span></div></div>`;
    }).join("");
  }
  document.querySelectorAll("[data-current-year]").forEach(el=>el.textContent=new Date().getFullYear());
  const cards=document.querySelectorAll(".service-card");
  if("IntersectionObserver" in window){
    const io=new IntersectionObserver(entries=>{
      entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add("is-visible"); io.unobserve(e.target); }});
    },{threshold:.12});
    cards.forEach(card=>io.observe(card));
  }else cards.forEach(card=>card.classList.add("is-visible"));
})();
