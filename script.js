const menuButton=document.querySelector(".menu-toggle");
const navigation=document.querySelector(".main-nav");
if(menuButton&&navigation){menuButton.addEventListener("click",()=>{const isOpen=navigation.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(isOpen));menuButton.setAttribute("aria-label",isOpen?"Close navigation":"Open navigation");menuButton.textContent=isOpen?"×":"☰";});navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navigation.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open navigation");menuButton.textContent="☰";}));}
const newsletterForm=document.querySelector("#newsletter-form");
if(newsletterForm)newsletterForm.addEventListener("submit",event=>{event.preventDefault();const note=document.querySelector("#form-note");note.textContent="Thank you — newsletter signup will be connected when the backend is built.";newsletterForm.reset();});

(async function loadPublishedMagazine(){
const cfg=window.PIXEL_NIRA_CONFIG||{};if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase)return;
const brand=new URLSearchParams(location.search).get("brand")==="pixel"?"pixel":"nira";
document.documentElement.setAttribute("data-brand",brand);
try{
const response=await fetch(cfg.supabaseUrl.replace(/\/+$/,"")+"/functions/v1/published-magazine-images?brand="+encodeURIComponent(brand),{headers:{apikey:cfg.supabaseAnonKey}});if(!response.ok)return;
const data=await response.json();if(!data?.published_content)return;const published=data.published_content,view=matchMedia("(max-width: 720px)").matches?"mobile":"desktop";
const pages=Array.isArray(published.canvasPages)&&published.canvasPages.length?published.canvasPages:[{title:brand==="pixel"?"Pixel Studios":"Nira Editorial",layout:published.layout,layouts:published.layouts,elements:published.elements,canvasStyle:published.canvasStyle}];
const main=document.querySelector("main");if(!main)return;document.title=(brand==="pixel"?"Pixel Studios":"Nira Editorial")+" — Photo Stories";
const nav=document.querySelector(".main-nav");if(nav)nav.innerHTML='<a href="?brand=nira">Nira Editorial</a><a href="?brand=pixel">Pixel Studios</a>';
const mark=document.querySelector(".wordmark");if(mark){mark.innerHTML=brand==="pixel"?'PIXEL<span>®</span>':'NIRA<span>®</span>';mark.setAttribute("aria-label",brand==="pixel"?"Pixel Studios home":"Nira Editorial home")}
const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const safeImage=url=>typeof url==="string"&&/^https:\/\//i.test(url)&&!/images\.unsplash\.com|source\.unsplash\.com|images\.pexels\.com|picsum\.photos/i.test(url)&&url.includes("supabase.co/storage/");
const stories=[];
pages.forEach((page,pi)=>{
 const layouts=page.layouts||{},desktop=layouts.desktop||page,mobile=layouts.mobile||page;
 const getElements=layout=>Array.isArray(layout.elements)?layout.elements:[];
 const desktopElements=getElements(desktop),mobileElements=getElements(mobile);
 const photos=desktopElements.filter(e=>e.type==="image"&&safeImage(e.url));
 const mobilePhotos=mobileElements.filter(e=>e.type==="image"&&safeImage(e.url));
 const merged=[...photos];
 mobilePhotos.forEach(m=>{if(!merged.some(d=>d.id&&d.id===m.id||d.url===m.url))merged.push(m)});
 if(!merged.length)return;
 const textElements=desktopElements.filter(e=>e.type==="text"&&String(e.text||"").trim());
 const title=textElements.find(e=>e.kind==="heading")?.text||page.title||("Photo story "+String(pi+1).padStart(2,"0"));
 const description=textElements.find(e=>e.kind==="body")?.text||textElements.find(e=>e.kind==="paragraph")?.text||"A photographic story by "+(brand==="pixel"?"Pixel Studios":"Nira Editorial")+".";
 stories.push({id:"story-"+pi,title:String(title).replace(/\n/g," ").trim(),description:String(description).replace(/\n/g," ").trim(),photos:merged.map(p=>({url:p.url,alt:p.alt||"Editorial photograph",fit:p.fit||"cover",focalX:p.focalX??50,focalY:p.focalY??50})),brand});
});
const pageTitle=brand==="pixel"?"Pixel Studios":"Nira Editorial";
const hero='<section class="gallery-intro"><p class="gallery-kicker">'+pageTitle+' · PHOTO STORIES</p><h1>Images with <em>intention.</em></h1><p>Explore the photographs. Open a story to discover the full shoot.</p></section>';
const cards=stories.map((story,i)=>'<button class="gallery-card gallery-card-'+(i%5+1)+'" data-story="'+i+'" aria-label="Open '+esc(story.title)+'"><span class="gallery-card-image"><img loading="lazy" src="'+esc(story.photos[0].url)+'" alt="'+esc(story.photos[0].alt)+'" style="object-position:'+story.photos[0].focalX+'% '+story.photos[0].focalY+'%"></span><span class="gallery-card-meta"><span class="gallery-card-index">'+String(i+1).padStart(2,"0")+' / '+String(stories.length).padStart(2,"0")+'</span><span class="gallery-card-title">'+esc(story.title)+'</span><span class="gallery-card-count">'+story.photos.length+' '+(story.photos.length===1?"PHOTOGRAPH":"PHOTOGRAPHS")+' ↗</span></span></button>').join("");
main.classList.add("photo-gallery-main");main.innerHTML=hero+(stories.length?'<section class="photo-gallery-grid" aria-label="'+pageTitle+' gallery">'+cards+'</section>':'<section class="gallery-empty"><p>Your gallery is ready for its first published photo story.</p><p>Upload images and publish a story in Admin to display it here.</p></section>')+'<footer class="gallery-bottom"><span>'+pageTitle+'</span><span>AN INDEPENDENT IMAGE JOURNAL</span></footer><div class="story-overlay" hidden role="dialog" aria-modal="true" aria-label="Photo story"><button class="story-close" aria-label="Close story">×</button><div class="story-dialog"><div class="story-copy"><p class="gallery-kicker">'+pageTitle+' · EDITORIAL</p><h2 class="story-title"></h2><p class="story-description"></p><p class="story-position"></p></div><div class="story-photos"></div></div></div><div class="photo-lightbox" hidden role="dialog" aria-modal="true" aria-label="Full-screen photo viewer"><button class="lightbox-close" aria-label="Close photo viewer">×</button><button class="lightbox-prev" aria-label="Previous photo">‹</button><img class="lightbox-image" alt=""><button class="lightbox-next" aria-label="Next photo">›</button><div class="lightbox-counter"></div></div>';
const overlay=main.querySelector(".story-overlay"),lightbox=main.querySelector(".photo-lightbox");
let activeStory=0,activePhoto=0,lastFocus=null;
const openLightbox=index=>{const story=stories[activeStory];if(!story)return;activePhoto=(index+story.photos.length)%story.photos.length;const p=story.photos[activePhoto];lightbox.querySelector(".lightbox-image").src=p.url;lightbox.querySelector(".lightbox-image").alt=p.alt;lightbox.querySelector(".lightbox-counter").textContent=(activePhoto+1)+" / "+story.photos.length;lightbox.hidden=false;document.body.classList.add("gallery-modal-open")};
const closeLightbox=()=>{lightbox.hidden=true;if(overlay.hidden)document.body.classList.remove("gallery-modal-open")};
const openStory=index=>{activeStory=index;const story=stories[index];if(!story)return;lastFocus=document.activeElement;overlay.querySelector(".story-title").textContent=story.title;overlay.querySelector(".story-description").textContent=story.description;overlay.querySelector(".story-position").textContent=story.photos.length+" PHOTOGRAPHS · "+story.brand.toUpperCase();overlay.querySelector(".story-photos").innerHTML=story.photos.map((p,i)=>'<button class="story-photo" data-photo="'+i+'" aria-label="View photograph '+(i+1)+'"><img loading="lazy" src="'+esc(p.url)+'" alt="'+esc(p.alt)+'" style="object-position:'+p.focalX+'% '+p.focalY+'%"><span>VIEW FULL SCREEN ↗</span></button>').join("");overlay.hidden=false;document.body.classList.add("gallery-modal-open");overlay.querySelector(".story-close").focus()};
main.querySelectorAll("[data-story]").forEach(card=>card.addEventListener("click",()=>openStory(Number(card.dataset.story))));
overlay.addEventListener("click",e=>{if(e.target===overlay||e.target.closest(".story-close")){overlay.hidden=true;document.body.classList.remove("gallery-modal-open");if(lastFocus)lastFocus.focus();return}const photo=e.target.closest("[data-photo]");if(photo)openLightbox(Number(photo.dataset.photo))});
lightbox.querySelector(".lightbox-close").addEventListener("click",closeLightbox);
lightbox.querySelector(".lightbox-prev").addEventListener("click",()=>openLightbox(activePhoto-1));
lightbox.querySelector(".lightbox-next").addEventListener("click",()=>openLightbox(activePhoto+1));
document.addEventListener("keydown",e=>{if(lightbox.hidden===false){if(e.key==="Escape")closeLightbox();if(e.key==="ArrowLeft")openLightbox(activePhoto-1);if(e.key==="ArrowRight")openLightbox(activePhoto+1)}else if(overlay.hidden===false&&e.key==="Escape"){overlay.hidden=true;document.body.classList.remove("gallery-modal-open");if(lastFocus)lastFocus.focus()}});
}catch(error){console.error("Unable to load published magazine page.",error)}
})();
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
