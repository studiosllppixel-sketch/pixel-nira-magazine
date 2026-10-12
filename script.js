const menuButton=document.querySelector(".menu-toggle");
const navigation=document.querySelector(".main-nav");
if(menuButton&&navigation){menuButton.addEventListener("click",()=>{const isOpen=navigation.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(isOpen));menuButton.setAttribute("aria-label",isOpen?"Close navigation":"Open navigation");menuButton.textContent=isOpen?"×":"☰";});navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navigation.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open navigation");menuButton.textContent="☰";}));}
const newsletterForm=document.querySelector("#newsletter-form");
if(newsletterForm)newsletterForm.addEventListener("submit",event=>{event.preventDefault();const note=document.querySelector("#form-note");note.textContent="Thank you — newsletter signup will be connected when the backend is built.";newsletterForm.reset();});

(async function loadPublishedMagazine(){
const cfg=window.PIXEL_NIRA_CONFIG||{};if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase)return;
const brand=new URLSearchParams(location.search).get("brand")==="pixel"?"pixel":"nira";
try{
const response=await fetch(cfg.supabaseUrl.replace(/\/+$/,"")+"/functions/v1/published-magazine-images?brand="+encodeURIComponent(brand),{headers:{apikey:cfg.supabaseAnonKey}});if(!response.ok)return;
const data=await response.json();if(!data?.published_content)return;const published=data.published_content,view=matchMedia("(max-width: 720px)").matches?"mobile":"desktop";
const pages=Array.isArray(published.canvasPages)&&published.canvasPages.length?published.canvasPages:[{title:brand==="pixel"?"Pixel Studios":"Nira Editorial",layout:published.layout,layouts:published.layouts,elements:published.elements,canvasStyle:published.canvasStyle}];
const main=document.querySelector("main");if(!main)return;const preservedSections=Array.from(main.children).filter(el=>!el.classList.contains("hero")).map(el=>el.outerHTML).join("");document.title=(brand==="pixel"?"Pixel Studios":"Nira Editorial")+" — Pixel × Nira";
const nav=document.querySelector(".main-nav");if(nav)nav.innerHTML='<a href="?brand=nira">Nira Editorial</a><a href="?brand=pixel">Pixel Studios</a>';
const mark=document.querySelector(".wordmark");if(mark){mark.innerHTML=brand==="pixel"?'PIXEL<span>®</span>':'NIRA<span>®</span>';mark.setAttribute("aria-label",brand==="pixel"?"Pixel Studios home":"Nira Editorial home")}
const esc=v=>String(v??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
const sections=[];
for(let pi=0;pi<pages.length;pi++){
const page=pages[pi],layouts=page.layouts||{},req=layouts[view],active=Array.isArray(req?.elements)&&req.elements.length?req:(Array.isArray(layouts.desktop?.elements)&&layouts.desktop.elements.length?layouts.desktop:page);
if(!Array.isArray(active.elements)||!active.elements.length)continue;
const cs=active.canvasStyle||page.canvasStyle||{},cw=Math.max(280,Math.min(2400,Number(cs.canvasWidth)||(view==="mobile"?375:1440))),ch=Math.max(400,Math.min(2400,Number(cs.canvasHeight)||(view==="mobile"?760:850)));
const bg=cs.bgMode==="linear"?"linear-gradient("+(+cs.gradientAngle||135)+"deg, "+(cs.gradientStart||cs.bgColor||"#f7f3eb")+", "+(cs.gradientEnd||"#d8d0c2")+")":cs.bgMode==="radial"?"radial-gradient(circle, "+(cs.gradientStart||cs.bgColor||"#f7f3eb")+", "+(cs.gradientEnd||"#d8d0c2")+")":cs.bgColor||"#f7f3eb";
const items=active.elements.map((it,i)=>{const anim=["none","fade-up","fade-in","slide-left","slide-right","zoom-in","reveal"].includes(it.animation)?it.animation:"none",trigger=it.animationTrigger==="scroll"?"scroll":"load",duration=Math.max(200,Math.min(3000,Number(it.animationDuration)||800)),delay=Math.max(0,Math.min(3000,Number(it.animationDelay)||0)),x=Number.isFinite(Number(it.x))?Number(it.x):0,y=Number.isFinite(Number(it.y))?Number(it.y):0,w=Number.isFinite(Number(it.width))?Number(it.width):50,common=it.isBackground?'left:0%;top:0%;width:100%;z-index:0;':'left:'+x+'%;top:'+y+'%;width:'+w+'%;z-index:'+(i+2)+';--anim-duration:'+duration+'ms;--anim-delay:'+delay+'ms;';
if(it.type==="image"){const h=Number.isFinite(Number(it.height))?Number(it.height):50,url=/^https:\/\//i.test(it.url||"")?it.url:"",zoom=Math.max(1,Math.min(2.5,Number(it.scale||100)/100)),fx=Math.max(0,Math.min(100,Number(it.focalX??50))),fy=Math.max(0,Math.min(100,Number(it.focalY??50))),filter=/^(none|grayscale\(100%\)|sepia\(30%\)|contrast\(1\.12\) saturate\(\.82\))$/.test(it.filter||"none")?it.filter:"none",style="object-fit:"+(it.fit==="contain"?"contain":"cover")+";object-position:"+fx+"% "+fy+"%;position:absolute;width:"+(zoom*100)+"%;height:"+(zoom*100)+"%;max-width:none;max-height:none;left:"+(-(zoom-1)*fx)+"%;top:"+(-(zoom-1)*fy)+"%;transform:none;filter:"+filter;return '<figure class="live-magazine-element live-magazine-image" data-animation="'+anim+'" data-trigger="'+trigger+'" style="'+common+'height:'+(it.isBackground?100:h)+'%;"><img src="'+esc(url)+'" alt="'+esc(it.alt||"Editorial photograph")+'" style="'+style+'"></figure>'}
const fonts=["Playfair Display","DM Sans","Cormorant Garamond","Libre Baskerville","Montserrat","Oswald","Prata","Raleway","Space Grotesk","Georgia","Arial"],font=fonts.includes(it.fontFamily)?it.fontFamily:"DM Sans",size=Math.max(9,Math.min(120,Number(it.fontSize)||16)),color=/^#[0-9a-f]{6}$/i.test(it.color||"")?it.color:"#22221f",ta=it.textGradientStart||color,tb=it.textGradientEnd||"#a17b55",ba=it.bgStart||"#f1e5d4",bb=it.bgEnd||"#c4b6d9",ebg=it.bgMode==="solid"?ba:it.bgMode==="linear"?"linear-gradient("+(+it.bgAngle||135)+"deg, "+ba+", "+bb+")":it.bgMode==="radial"?"radial-gradient(circle, "+ba+", "+bb+")":"transparent",grad=it.colorMode==="linear"?"background-image:linear-gradient(90deg, "+ta+", "+tb+");background-clip:text;-webkit-background-clip:text;color:transparent;":"";
return '<div class="live-magazine-element live-magazine-text '+(it.kind==="heading"?"is-heading":"")+'" data-animation="'+anim+'" data-trigger="'+trigger+'" style="'+common+'font-family:'+font+';font-size:'+size+'px;color:'+color+';background:'+ebg+';padding:'+(it.bgMode&&it.bgMode!=="transparent"?"10px":"3px")+';'+grad+'line-height:'+Math.max(.8,Math.min(3,Number(it.lineHeight)||(it.kind==="heading"?1.02:1.45)))+';text-align:'+(['left','center','right'].includes(it.textAlign)?it.textAlign:'left')+';letter-spacing:'+Math.max(-5,Math.min(20,Number(it.letterSpacing)||0))+'px;font-weight:'+(['400','500','600','700'].includes(String(it.fontWeight))?it.fontWeight:(it.kind==="heading"?'500':'400'))+';">'+esc(it.text).replace(/\n/g,"<br>")+'</div>';
}).join("");
const mast='<div class="live-magazine-masthead"><span>INDEPENDENT CREATIVE JOURNAL</span><strong>'+(brand==="pixel"?"PIXEL STUDIOS":"NIRA EDITORIAL")+'</strong><span>VOL. '+String(pi+1).padStart(2,"0")+'</span></div>';
sections.push('<div class="live-magazine-stage" data-canvas-width="'+cw+'" data-canvas-height="'+ch+'" style="width:100%;max-width:'+cw+'px;height:'+ch+'px;margin:0 auto 28px;position:relative;overflow:hidden"><section class="live-magazine-canvas" style="position:absolute;left:0;top:0;width:'+cw+'px;height:'+ch+'px;background:'+esc(bg)+';transform-origin:top left" aria-label="'+esc(page.title||("Canvas "+(pi+1)))+'">'+mast+items+'</section></div>');
}
if(!sections.length)return;main.classList.add("live-magazine-main");main.innerHTML=sections.join("")+preservedSections;
const scale=()=>main.querySelectorAll(".live-magazine-stage").forEach(stage=>{const w=Number(stage.dataset.canvasWidth),h=Number(stage.dataset.canvasHeight),canvas=stage.querySelector(".live-magazine-canvas"),factor=Math.min(1,stage.clientWidth/w);canvas.style.transform="scale("+factor+")";stage.style.height=(h*factor)+"px"});scale();const motionItems=main.querySelectorAll(".live-magazine-element[data-animation]:not([data-animation=none])");if(!matchMedia("(prefers-reduced-motion: reduce)").matches){if("IntersectionObserver" in window){const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.target.dataset.trigger!=="scroll")return;if(entry.isIntersecting){entry.target.classList.add("is-visible")}else{entry.target.classList.remove("is-visible")}}),{threshold:.12,rootMargin:"-4% 0px -4% 0px"});motionItems.forEach(item=>{if(item.dataset.trigger==="scroll")observer.observe(item);else item.classList.add("is-visible")})}else motionItems.forEach(item=>item.classList.add("is-visible"))}if(typeof ResizeObserver!=="undefined")new ResizeObserver(scale).observe(main);else addEventListener("resize",scale);
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
