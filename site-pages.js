(async function loadStandalonePageSettings(){
 const cfg=window.PIXEL_NIRA_CONFIG||{},brand=new URLSearchParams(location.search).get("brand")==="pixel"?"pixel":"nira";
 document.documentElement.dataset.brand=brand;
 const $=id=>document.getElementById(id),put=(id,value)=>{const n=$(id);if(n&&typeof value==="string")n.textContent=value};
 const safeUrl=value=>{try{const u=new URL(value);return u.protocol==="https:"||u.protocol==="mailto:"||u.protocol==="tel:"?u.href:"#"}catch{return "#"}};
 const defaultsHeader={announcement:"PIXEL STUDIOS × NIRA EDITORIAL",wordmark:brand==="pixel"?"PIXEL":"NIRA",journalLabel:"Journal",niraLabel:"Nira Editorial",pixelLabel:"Pixel Studios",aboutLabel:"About Us",contactLabel:"Contact Us"};
 const applyHeader=h=>{h={...defaultsHeader,...(h||{})};put("announcementText",h.announcement);put("wordmarkText",h.wordmark);put("navJournal",h.journalLabel);put("navNira",h.niraLabel);put("navPixel",h.pixelLabel);put("navAbout",h.aboutLabel);put("navContact",h.contactLabel);const mark=$("siteWordmark");if(mark){mark.innerHTML=(brand==="pixel"?"PIXEL":"NIRA")+"<span>®</span>";mark.href="index.html?brand="+brand}const links={navJournal:"index.html#editorial-cover",navNira:"index.html?brand=nira",navPixel:"index.html?brand=pixel",navAbout:"about.html?brand="+brand,navContact:"contact.html?brand="+brand};Object.entries(links).forEach(([id,url])=>{const n=$(id);if(n)n.href=url})};
 const applyFooter=f=>{f=f||{};put("footerToplineBrand",f.toplineBrand||"PIXEL STUDIOS × NIRA EDITORIAL");put("footerToplineIssue",f.toplineIssue||"INDEPENDENT IMAGE JOURNAL · VOL. 01");put("footerBackToTop",f.backToTop||"BACK TO TOP ↑");put("footerTagline",f.tagline||(brand==="pixel"?"The art of image-making.":"The art of being seen."));put("footerDescriptor",f.descriptor||"Fashion · Photography · Stories");put("footerLocation",f.location||"Independent image journal");put("footerCopyright",f.copyright||"© 2026 PIXEL STUDIOS × NIRA EDITORIAL");const n=$("footerNiraInstagram"),p=$("footerPixelInstagram");if(n)n.href=safeUrl(f.niraInstagramUrl||"https://www.instagram.com/nira.editorial/");if(p)p.href=safeUrl(f.pixelInstagramUrl||"https://www.instagram.com/pixelstudios.inc/");const mark=$("footerMark");if(mark)mark.innerHTML=(brand==="pixel"?"PIXEL":"NIRA")+"<span>®</span>"};
 applyHeader();applyFooter();
 const kind=document.body.dataset.sitePage;
 try{
  if(!cfg.supabaseUrl||!cfg.supabaseAnonKey)return;
  const res=await fetch(cfg.supabaseUrl.replace(/\/+$/,"")+"/functions/v1/published-magazine-images?brand="+encodeURIComponent(brand),{headers:{apikey:cfg.supabaseAnonKey}});
  if(!res.ok)return;const data=await res.json(),content=data?.published_content;if(!content)return;
  applyHeader(content.headerSettings);applyFooter(content.footerSettings);
  if(kind==="about"){
   const a={eyebrow:"PIXEL STUDIOS × NIRA EDITORIAL",title:"About Us",lead:"",body:"",...(content.aboutSettings||{})};
   put("pageEyebrow",a.eyebrow);put("pageTitle",a.title);put("pageLead",a.lead);
   const body=$("pageBody");if(body){body.replaceChildren();String(a.body||"").split(/\n\s*\n|\n/).map(x=>x.trim()).filter(Boolean).forEach(paragraph=>{const p=document.createElement("p");p.className="info-body";p.textContent=paragraph;body.append(p)})}
  }else if(kind==="contact"){
   const d={eyebrow:"LET’S CONNECT",title:"Contact Us",lead:"For collaborations, editorial submissions, photography, production, and other enquiries, connect with the teams below.",email:"",phone:"",address:"",niraUrl:"https://www.instagram.com/nira.editorial/",pixelUrl:"https://www.instagram.com/pixelstudios.inc/"},v={...d,...(content.contactSettings||{})};
   put("pageEyebrow",v.eyebrow);put("pageTitle",v.title);put("pageLead",v.lead);
   const details=$("contactDetails");if(details){details.replaceChildren();const add=(label,value,href)=>{if(!value)return;const p=document.createElement("p");p.className="info-body";const strong=document.createElement("strong");strong.textContent=label+" ";p.append(strong);if(href){const a=document.createElement("a");a.href=safeUrl(href);a.textContent=value;p.append(a)}else p.append(document.createTextNode(value));details.append(p)};
    add("Email:",v.email,v.email?"mailto:"+v.email:"");add("Phone:",v.phone,v.phone?"tel:"+v.phone:"");add("Location:",v.address,"");
    const links=$("contactSocialLinks");if(links){links.replaceChildren();[[ "Nira Editorial",v.niraUrl ],[ "Pixel Studios",v.pixelUrl ]].forEach(([label,url])=>{if(!url)return;const a=document.createElement("a");a.href=safeUrl(url);a.target="_blank";a.rel="noreferrer";a.textContent=label+" ↗";links.append(a)})}
   }
  }
 }catch(e){console.warn("Could not load published site settings.",e)}
 const menuButton=$("menuToggle"),nav=$("mainNav");if(menuButton&&nav){menuButton.addEventListener("click",()=>{const open=nav.classList.toggle("open");menuButton.textContent=open?"×":"☰";menuButton.setAttribute("aria-expanded",String(open));menuButton.setAttribute("aria-label",open?"Close navigation":"Open navigation")});nav.addEventListener("click",e=>{if(!e.target.closest("a"))return;nav.classList.remove("open");menuButton.textContent="☰";menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open navigation")})}
})();

/* Keep page transitions consistent when navigating from About and Contact too. */
(function initStandalonePageTransitions(){
 const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const body=document.body;if(!body)return;
 if(!reduce){body.classList.add("page-content-reveal","page-arriving");requestAnimationFrame(()=>requestAnimationFrame(()=>body.classList.add("page-arrived")));window.setTimeout(()=>body.classList.remove("page-arriving"),1050);}
 const curtain=document.createElement("div");curtain.className="page-transition-curtain";curtain.setAttribute("aria-hidden","true");curtain.innerHTML='<span>PIXEL STUDIOS <i>×</i> NIRA EDITORIAL</span>';body.appendChild(curtain);
 let navigating=false;
 document.addEventListener("click",event=>{
  if(reduce||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest("a[href]");if(!link||link.target==="_blank"||link.hasAttribute("download")||link.getAttribute("aria-disabled")==="true")return;
  let next;try{next=new URL(link.href,location.href)}catch{return}
  if(next.origin!==location.origin||(next.pathname===location.pathname&&next.search===location.search)||(link.hash&&next.pathname===location.pathname&&next.search===location.search))return;
  if(navigating)return;event.preventDefault();navigating=true;body.classList.add("page-leaving");
  window.setTimeout(()=>{location.href=next.href},480);
 });
 window.addEventListener("pageshow",()=>{navigating=false;body.classList.remove("page-leaving")});
})();
