function initEditorialMotion(root=document){
 const doc=root&&root.querySelectorAll?root:document;
 document.documentElement.classList.add("editorial-motion-ready");
 const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const targets=[];
 if(root===document)targets.push(...document.querySelectorAll(".editorial-footer,.site-header,.announcement"));
 targets.push(...doc.querySelectorAll(".gallery-intro,.gallery-card,.gallery-bottom,.story-photo"));
 if(reduce||!("IntersectionObserver" in window)){targets.forEach(el=>el.classList.add("motion-in"));return}
 if(!window.__pixelNiraMotionObserver){
  window.__pixelNiraMotionObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{
   if(!entry.isIntersecting)return;
   entry.target.classList.add("motion-in");
   window.__pixelNiraMotionObserver.unobserve(entry.target);
  }),{threshold:.12,rootMargin:"0px 0px -5% 0px"});
 }
 targets.forEach((el,index)=>{
  if(el.dataset.motionReady==="1")return;
  el.dataset.motionReady="1";el.classList.add("motion-reveal");
  el.style.setProperty("--motion-delay",Math.min(index%5,4)*85+"ms");
  if(el.getBoundingClientRect().top<window.innerHeight*.92)el.classList.add("motion-in");
  else window.__pixelNiraMotionObserver.observe(el);
 });
}
function applyEditorialHeader(settings={},brand=(new URLSearchParams(location.search).get("brand")==="pixel"?"pixel":"nira")){
 const d={announcement:"PIXEL STUDIOS × NIRA EDITORIAL",wordmark:brand==="pixel"?"PIXEL":"NIRA",journalLabel:"Journal",niraLabel:"Nira Editorial",pixelLabel:"Pixel Studios",aboutLabel:"About Us",contactLabel:"Contact Us"},h={...d,...(settings||{})};
 const announcement=document.querySelector(".announcement");if(announcement&&h.announcement)announcement.textContent=h.announcement;
 const mark=document.querySelector(".wordmark");if(mark){mark.innerHTML=(brand==="pixel"?"PIXEL":"NIRA")+"<span>®</span>";mark.setAttribute("aria-label",brand==="pixel"?"Pixel Studios home":"Nira Editorial home");mark.href="index.html?brand="+brand}
 const nav=document.querySelector(".main-nav");
 if(nav){const links=[["journalLabel","index.html#editorial-cover"],["niraLabel","index.html?brand=nira"],["pixelLabel","index.html?brand=pixel"],["aboutLabel","about.html?brand="+brand],["contactLabel","contact.html?brand="+brand]];
  const labels=links.map(([key])=>String(h[key]||d[key]));
  [...nav.querySelectorAll("a")].forEach((a,i)=>{if(!links[i])return;a.textContent=labels[i];a.href=links[i][1]});
 }
}
applyEditorialHeader();
function applyEditorialFooter(settings={},brand=(new URLSearchParams(location.search).get("brand")==="pixel"?"pixel":"nira")){
 const defaults={toplineBrand:"PIXEL STUDIOS × NIRA EDITORIAL",toplineIssue:"INDEPENDENT IMAGE JOURNAL · VOL. 01",backToTop:"BACK TO TOP ↑",tagline:brand==="pixel"?"The art of image-making.":"The art of being seen.",descriptor:"Fashion · Photography · Stories",location:"Independent image journal",copyright:"© 2026 PIXEL STUDIOS × NIRA EDITORIAL",niraInstagramUrl:"https://www.instagram.com/nira.editorial/",pixelInstagramUrl:"https://www.instagram.com/pixelstudios.inc/"};
 const f={...defaults,...(settings||{})},footer=document.querySelector(".editorial-footer");if(!footer)return;
 const put=(selector,value)=>{const node=footer.querySelector(selector);if(node&&typeof value==="string"&&value.trim())node.textContent=value};
 put(".footer-topline span:first-child",f.toplineBrand);put(".footer-topline span:last-child",f.toplineIssue);put(".footer-backtop",f.backToTop);put(".footer-tagline",f.tagline);put(".footer-description",f.descriptor);put(".footer-location",f.location);put(".footer-copyright",f.copyright);
 const nira=footer.querySelector(".footer-nira-instagram"),pixel=footer.querySelector(".footer-pixel-instagram");
 if(nira&&/^https:\/\//i.test(f.niraInstagramUrl||""))nira.href=f.niraInstagramUrl;
 if(pixel&&/^https:\/\//i.test(f.pixelInstagramUrl||""))pixel.href=f.pixelInstagramUrl;
 const mark=footer.querySelector(".footer-mark");if(mark)mark.innerHTML=(brand==="pixel"?"PIXEL":"NIRA")+'<span>®</span>';
}
applyEditorialFooter();
const menuButton=document.querySelector(".menu-toggle");
const navigation=document.querySelector(".main-nav");
if(menuButton&&navigation){menuButton.addEventListener("click",()=>{const isOpen=navigation.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(isOpen));menuButton.setAttribute("aria-label",isOpen?"Close navigation":"Open navigation");menuButton.textContent=isOpen?"×":"☰";});navigation.addEventListener("click",event=>{if(!event.target.closest("a"))return;navigation.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open navigation");menuButton.textContent="☰";});}
const newsletterForm=document.querySelector("#newsletter-form");
if(newsletterForm)newsletterForm.addEventListener("submit",event=>{event.preventDefault();const note=document.querySelector("#form-note");note.textContent="Thank you — newsletter signup will be connected when the backend is built.";newsletterForm.reset();});

(async function loadPublishedMagazine(){
const cfg=window.PIXEL_NIRA_CONFIG||{};if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase)return;
const brand=new URLSearchParams(location.search).get("brand")==="pixel"?"pixel":"nira";
document.documentElement.setAttribute("data-brand",brand);
try{
const response=await fetch(cfg.supabaseUrl.replace(/\/+$/,"")+"/functions/v1/published-magazine-images?brand="+encodeURIComponent(brand),{headers:{apikey:cfg.supabaseAnonKey}});if(!response.ok)return;
const data=await response.json();if(!data?.published_content)return;const published=data.published_content;applyEditorialHeader(published.headerSettings,brand);applyEditorialFooter(published.footerSettings,brand);const view=matchMedia("(max-width: 720px)").matches?"mobile":"desktop";
const pages=Array.isArray(published.canvasPages)&&published.canvasPages.length?published.canvasPages:[{title:brand==="pixel"?"Pixel Studios":"Nira Editorial",layout:published.layout,layouts:published.layouts,elements:published.elements,canvasStyle:published.canvasStyle}];
const main=document.querySelector("main");if(!main)return;document.title=(brand==="pixel"?"Pixel Studios":"Nira Editorial")+" — Photo Stories";
const nav=document.querySelector(".main-nav");if(nav)nav.innerHTML='<a href="index.html#editorial-cover">Journal</a><a href="index.html?brand=nira">Nira Editorial</a><a href="index.html?brand=pixel">Pixel Studios</a><a href="about.html?brand='+brand+'">About Us</a><a href="contact.html?brand='+brand+'">Contact Us</a>';
const mark=document.querySelector(".wordmark");if(mark){mark.innerHTML=(brand==="pixel"?'PIXEL':'NIRA')+'<span>®</span>';mark.setAttribute("aria-label",brand==="pixel"?"Pixel Studios home":"Nira Editorial home");mark.href="index.html?brand="+brand}
applyEditorialHeader(published.headerSettings,brand);
const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const safeImage=url=>typeof url==="string"&&/^https:\/\//i.test(url)&&!/images\.unsplash\.com|source\.unsplash\.com|images\.pexels\.com|picsum\.photos/i.test(url)&&url.includes("supabase.co/storage/");
const stories=[];
pages.forEach((page,pi)=>{
 const layouts=page.layouts||{},desktop=layouts.desktop||page,mobile=layouts.mobile||page;
 const getElements=layout=>Array.isArray(layout.elements)?layout.elements:[];
 const desktopElements=getElements(desktop),mobileElements=getElements(mobile);
 const photos=[...desktopElements.filter(e=>e.type==="image"&&safeImage(e.url))];
 mobileElements.filter(e=>e.type==="image"&&safeImage(e.url)).forEach(m=>{if(!photos.some(d=>d.id&&d.id===m.id||d.url===m.url))photos.push(m)});
 const textElements=desktopElements.filter(e=>e.type!=="image"&&String(e.text||"").trim());
 const title=textElements.find(e=>e.kind==="heading")?.text||page.title||("Photo story "+String(pi+1).padStart(2,"0"));
 const description=textElements.find(e=>e.kind==="body")?.text||textElements.find(e=>e.kind==="paragraph")?.text||"A photographic story by "+(brand==="pixel"?"Pixel Studios":"Nira Editorial")+".";
 photos.forEach((cover,photoIndex)=>{
  const galleryPhotos=cover.galleryEnabled===true&&Array.isArray(cover.galleryPhotos)?cover.galleryPhotos.filter(p=>safeImage(p.url)&&p.url!==cover.url):[];
  const allPhotos=[{url:cover.url,alt:cover.alt||"Editorial photograph",fit:cover.fit||"cover",focalX:cover.focalX??50,focalY:cover.focalY??50},...galleryPhotos.map(p=>({url:p.url,alt:p.alt||"Editorial photograph",fit:p.fit||"cover",focalX:p.focalX??50,focalY:p.focalY??50}))];
  stories.push({id:"story-"+pi+"-"+photoIndex,title:String(cover.storyTitle||title).replace(/\\n/g," ").trim(),description:String(cover.storyDescription||description).replace(/\\n/g," ").trim(),photos:allPhotos,brand,galleryEnabled:cover.galleryEnabled===true});
 });
});
const pageTitle=brand==="pixel"?"Pixel Studios":"Nira Editorial";
const hero='<section class="gallery-intro"><p class="gallery-kicker">'+pageTitle+' · PHOTO STORIES</p><h1>Images with <em>intention.</em></h1><p>Explore the photographs. Open a story to discover the full shoot.</p></section>';

const escStyle=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const renderLayoutPage=(page,pi)=>{
 const layouts=page.layouts||{},layout=layouts[view]||layouts.desktop||page;
 const elements=Array.isArray(layout.elements)?layout.elements:[];
 const style=layout.canvasStyle||page.canvasStyle||{};
 const cw=Math.max(280,Number(style.canvasWidth)||(view==="mobile"?375:1440));
 const ch=Math.max(400,Number(style.canvasHeight)||(view==="mobile"?760:850));
 let bg=style.bgColor||"#f7f3eb";
 if(style.bgMode==="gradient")bg="linear-gradient("+(Number(style.gradientAngle)||135)+"deg, "+(style.gradientStart||bg)+", "+(style.gradientEnd||"#d8d0c2")+")";
 const inner=elements.map((e,ei)=>{
  const x=e.isBackground?0:Number(e.x)||0,y=e.isBackground?0:Number(e.y)||0,w=e.isBackground?100:Number(e.width)||30;
  const z=e.isBackground?0:ei+1;
  const common='position:absolute;left:'+x+'%;top:'+y+'%;width:'+w+'%;z-index:'+z+';box-sizing:border-box;';
  if(e.type==="image"){
   if(!safeImage(e.url))return "";
   const h=e.isBackground?100:Number(e.height)||50,zoom=Math.max(1,Math.min(2.5,Number(e.scale||100)/100)),fx=Math.max(0,Math.min(100,Number(e.focalX??50))),fy=Math.max(0,Math.min(100,Number(e.focalY??50)));
   const storyIndex=stories.findIndex(s=>s.id==="story-"+pi+"-"+elements.filter((el,ix)=>ix<ei&&el.type==="image"&&safeImage(el.url)).length);
   return '<button type="button" class="published-canvas-image" data-canvas-story="'+storyIndex+'" aria-label="'+escStyle(e.alt||"View photograph")+'" style="'+common+'height:'+h+'%;padding:0;border:0;background:transparent;overflow:hidden;cursor:pointer;"><img loading="lazy" src="'+escStyle(e.url)+'" alt="'+escStyle(e.alt||"")+'" style="position:absolute;left:'+(-(zoom-1)*fx)+'%;top:'+(-(zoom-1)*fy)+'%;width:'+(zoom*100)+'%;height:'+(zoom*100)+'%;max-width:none;max-height:none;object-fit:'+escStyle(e.fit||"cover")+';object-position:'+fx+'% '+fy+'%;filter:'+escStyle(e.filter||"none")+';"></button>';
  }
  const fontSize=Math.max(9,Number(e.fontSize)||16);
  const color=e.color||"#22221f";
  let textBg="transparent";
  if(e.bgMode&&e.bgMode!=="transparent")textBg=e.bgMode==="gradient"?"linear-gradient("+(Number(e.bgAngle)||135)+"deg, "+(e.bgStart||"#f1e5d4")+", "+(e.bgEnd||"#c4b6d9")+")":(e.bgStart||"#f1e5d4");
  const textStyle=common+'font-family:'+escStyle(e.fontFamily||"DM Sans")+';font-size:'+fontSize/cw*100+'cqw;color:'+escStyle(color)+';font-weight:'+escStyle(e.fontWeight||(e.kind==="heading"?"500":"400"))+';line-height:'+(Number(e.lineHeight)||(e.kind==="heading"?1.02:1.45))+';letter-spacing:'+(Number(e.letterSpacing)||0)+'px;text-align:'+escStyle(e.textAlign||"left")+';background:'+textBg+';padding:'+(e.bgMode&&e.bgMode!=="transparent"?"10px":"3px")+';white-space:pre-wrap;overflow-wrap:anywhere;';
  return '<div class="published-canvas-text" style="'+textStyle+'">'+escStyle(e.text||"")+'</div>';
 }).join("");
 return '<section class="published-editorial-canvas" aria-label="'+escStyle(page.title||("Story "+(pi+1)))+'" style="--canvas-ratio:'+cw+'/'+ch+';aspect-ratio:'+cw+'/'+ch+';background:'+bg+';">'+inner+'</section>';
};
main.classList.add("published-layout-main");const coverImage=stories.find(story=>story.photos.length)?.photos[0]?.url||"";
const coverTitle=brand==="pixel"?"The art of image-making.":"The art of being seen.";
const coverIntro='<section class="editorial-cover" id="editorial-cover" aria-label="Magazine cover"><div class="cover-frame"><p class="cover-overline"><span>INDEPENDENT IMAGE JOURNAL</span><span>ISSUE 01 · 2026</span></p><div class="cover-main"><p class="cover-kicker">'+pageTitle+' PRESENTS</p><h1>'+coverTitle+'</h1><p class="cover-description">'+(brand==="pixel"?"Fashion, portraiture and image-making with a point of view.":"A considered collection of fashion, portraiture and visual stories.")+'</p><button type="button" class="cover-enter" id="enterJournal"><span>ENTER THE JOURNAL</span><span aria-hidden="true">↘</span></button></div><div class="cover-bottom"><span>PIXEL STUDIOS <i>×</i> NIRA EDITORIAL</span><span>SCROLL TO DISCOVER</span></div><span class="cover-index" aria-hidden="true">P / N</span></div></section>';
main.innerHTML=coverIntro+pages.map(renderLayoutPage).join("")+'<footer class="gallery-bottom"><span>'+pageTitle+'</span><span>AN INDEPENDENT IMAGE JOURNAL</span></footer><div class="story-overlay" hidden role="dialog" aria-modal="true" aria-label="Photo story"><button class="story-close" aria-label="Back to gallery"><span aria-hidden="true">←</span> <span>BACK TO GALLERY</span></button><div class="story-dialog"><div class="story-copy"><p class="gallery-kicker">'+pageTitle+' · EDITORIAL</p><h2 class="story-title"></h2><p class="story-description"></p><p class="story-position"></p></div><div class="story-photos"></div></div></div><div class="photo-lightbox" hidden role="dialog" aria-modal="true" aria-label="Full-screen photo viewer"><button class="lightbox-close" aria-label="Back to story"><span aria-hidden="true">←</span> <span>BACK TO STORY</span></button><button class="lightbox-dismiss" type="button" aria-label="Close image viewer" title="Close image viewer">×</button><button class="lightbox-prev" aria-label="Previous photo">‹</button><img class="lightbox-image" alt=""><button class="lightbox-next" aria-label="Next photo">›</button><div class="lightbox-counter"></div></div>';
initEditorialMotion(main);
const cover=main.querySelector(".editorial-cover");
if(coverImage&&cover)cover.style.setProperty("--cover-image",'url("'+coverImage+'")');
const enterJournal=main.querySelector("#enterJournal");
if(enterJournal)enterJournal.addEventListener("click",()=>{cover.classList.add("cover-leaving");const firstCanvas=main.querySelector(".published-editorial-canvas");const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;window.setTimeout(()=>{cover.hidden=true;if(firstCanvas)firstCanvas.scrollIntoView({behavior:reduced?"auto":"smooth",block:"start"});},reduced?0:480)});
const overlay=main.querySelector(".story-overlay"),lightbox=main.querySelector(".photo-lightbox");
let activeStory=0,activePhoto=0,lastFocus=null;
const openLightbox=index=>{const story=stories[activeStory];if(!story)return;activePhoto=(index+story.photos.length)%story.photos.length;const p=story.photos[activePhoto];lightbox.querySelector(".lightbox-image").src=p.url;lightbox.querySelector(".lightbox-image").alt=p.alt;lightbox.querySelector(".lightbox-counter").textContent=(activePhoto+1)+" / "+story.photos.length;lightbox.hidden=false;document.body.classList.add("gallery-modal-open")};
const closeLightbox=()=>{lightbox.hidden=true;if(overlay.hidden)document.body.classList.remove("gallery-modal-open");else overlay.querySelector(".story-close").focus()};
const openStory=index=>{activeStory=index;const story=stories[index];if(!story)return;lastFocus=document.activeElement;overlay.querySelector(".story-title").textContent=story.title;overlay.querySelector(".story-description").textContent=story.description;overlay.querySelector(".story-position").textContent=story.photos.length+" PHOTOGRAPHS · "+story.brand.toUpperCase();overlay.querySelector(".story-photos").innerHTML=story.photos.map((p,i)=>'<button class="story-photo" data-photo="'+i+'" aria-label="View photograph '+(i+1)+'"><img loading="lazy" src="'+esc(p.url)+'" alt="'+esc(p.alt)+'" style="object-position:'+p.focalX+'% '+p.focalY+'%"><span>VIEW FULL SCREEN ↗</span></button>').join("");initEditorialMotion(overlay);overlay.hidden=false;document.body.classList.add("gallery-modal-open");overlay.querySelector(".story-close").focus()};
main.querySelectorAll("[data-canvas-story]").forEach(card=>card.addEventListener("click",()=>{const index=Number(card.dataset.canvasStory);if(index<0)return;activeStory=index;if(stories[index]?.galleryEnabled)openStory(index);else openLightbox(0)}));
main.querySelectorAll(".published-editorial-canvas").forEach((canvas,index)=>{canvas.classList.add("gallery-enter");canvas.style.setProperty("--gallery-order",index);canvas.querySelectorAll(".published-canvas-image").forEach((image,i)=>{image.classList.add("gallery-image-enter");image.style.setProperty("--gallery-order",i);});canvas.querySelectorAll(".published-canvas-text").forEach((node,i)=>{node.classList.add("gallery-text-enter");node.style.setProperty("--gallery-order",i);});});
if("IntersectionObserver" in window){const galleryObserver=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("gallery-visible");entry.target.querySelectorAll(".gallery-image-enter,.gallery-text-enter").forEach(node=>node.classList.add("gallery-visible"));galleryObserver.unobserve(entry.target)}}),{threshold:.04});main.querySelectorAll(".published-editorial-canvas").forEach(canvas=>galleryObserver.observe(canvas));}else{main.querySelectorAll(".published-editorial-canvas,.gallery-image-enter,.gallery-text-enter").forEach(node=>node.classList.add("gallery-visible"));}
main.querySelectorAll(".published-canvas-image").forEach(image=>{image.addEventListener("pointerdown",()=>image.classList.add("gallery-image-pressed"));image.addEventListener("pointerup",()=>image.classList.remove("gallery-image-pressed"));});
overlay.addEventListener("click",e=>{if(e.target===overlay||e.target.closest(".story-close")){overlay.hidden=true;document.body.classList.remove("gallery-modal-open");if(lastFocus)lastFocus.focus();return}const photo=e.target.closest("[data-photo]");if(photo)openLightbox(Number(photo.dataset.photo))});
lightbox.querySelector(".lightbox-close").addEventListener("click",closeLightbox);
lightbox.querySelector(".lightbox-dismiss").addEventListener("click",closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click",()=>openLightbox(activePhoto-1));
lightbox.querySelector(".lightbox-next").addEventListener("click",()=>openLightbox(activePhoto+1));
document.addEventListener("keydown",e=>{if(lightbox.hidden===false){if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft")openLightbox(activePhoto-1);if(e.key==="ArrowRight")openLightbox(activePhoto+1)}else if(overlay.hidden===false&&e.key==="Escape"){overlay.hidden=true;document.body.classList.remove("gallery-modal-open");if(lastFocus)lastFocus.focus()}});
}catch(error){console.error("Unable to load published magazine page.",error)}
})();
initEditorialMotion(document);
/* Brand palette: Nira's plum-black and Pixel's studio-plum accent. */
(function applyBrandPalette(){
  const brand = new URLSearchParams(window.location.search).get("brand")==="pixel" ? "pixel" : "nira";
  document.documentElement.dataset.brand = brand;
  const mark = document.querySelector(".wordmark");
  if (mark && !mark.querySelector(".brand-name")) {
    const text = brand === "pixel" ? "PIXEL" : "NIRA";
    mark.innerHTML = '<span class="brand-name">'+text+'</span><span class="brand-tm">®</span>';
    mark.setAttribute("aria-label", brand === "pixel" ? "Pixel Studios home" : "Nira Editorial home");
  }
  const footerMark = document.querySelector(".footer-mark");
  if (footerMark) {
    footerMark.innerHTML = (brand === "pixel" ? "PIXEL" : "NIRA") + '<span>®</span>';
  }
  const stamp = document.querySelector(".hero-stamp");
  if (stamp && brand === "pixel") stamp.innerHTML = 'PIXEL<br><i>STUDIOS INC.</i>';
  const brandLockup = document.querySelector(".brand-lockup");
  if (brandLockup && brand === "pixel") brandLockup.innerHTML = 'PIXEL<br><em>STUDIOS INC.</em>';
  const eyebrow = document.querySelector(".hero-copy .eyebrow");
  if (eyebrow && brand === "pixel") eyebrow.textContent = "FASHION · EDITORIAL · PRODUCTION";
  const heroTitle = document.querySelector(".hero-copy h1");
  if (heroTitle && brand === "pixel") heroTitle.innerHTML = 'Images with<br><em>intention.</em>';
  const heroDesc = document.querySelector(".hero-description p");
  if (heroDesc && brand === "pixel") heroDesc.textContent = "A creative studio for fashion, editorial and production. Distinctive images, considered craft, a point of view.";
  if (brand === "pixel") document.title = "Pixel Studios — Images with Intention";
})();


/* Luxury editorial page transitions */
(function initPageTransitions(){
 const reduce=window.matchMedia&&window.matchMedia("(prefers-reduced-motion: reduce)").matches;
 const body=document.body;
 if(!body)return;
 if(!reduce){body.classList.add("page-content-reveal","page-arriving");requestAnimationFrame(()=>requestAnimationFrame(()=>body.classList.add("page-arrived")));window.setTimeout(()=>body.classList.remove("page-arriving"),1050);}
 const curtain=document.createElement("div");curtain.className="page-transition-curtain";curtain.setAttribute("aria-hidden","true");curtain.innerHTML='<span>PIXEL STUDIOS <i>×</i> NIRA EDITORIAL</span>';body.appendChild(curtain);
 let navigating=false;
 document.addEventListener("click",event=>{
  if(reduce||event.defaultPrevented||event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;
  const link=event.target.closest("a[href]");if(!link||link.target==="_blank"||link.hasAttribute("download")||link.getAttribute("aria-disabled")==="true")return;
  let next;try{next=new URL(link.href,location.href)}catch{return}
  if(next.origin!==location.origin||next.pathname===location.pathname&&next.search===location.search||link.hash&&next.pathname===location.pathname&&next.search===location.search)return;
  if(navigating)return;
  event.preventDefault();navigating=true;body.classList.add("page-leaving");
  window.setTimeout(()=>{location.href=next.href;},480);
 });
 window.addEventListener("pageshow",()=>{navigating=false;body.classList.remove("page-leaving");});
})();
