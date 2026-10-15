const menuButton=document.querySelector(".menu-toggle");
const navigation=document.querySelector(".main-nav");
if(menuButton&&navigation){menuButton.addEventListener("click",()=>{const isOpen=navigation.classList.toggle("open");menuButton.setAttribute("aria-expanded",String(isOpen));menuButton.setAttribute("aria-label",isOpen?"Close navigation":"Open navigation");menuButton.textContent=isOpen?"×":"☰";});navigation.querySelectorAll("a").forEach(link=>link.addEventListener("click",()=>{navigation.classList.remove("open");menuButton.setAttribute("aria-expanded","false");menuButton.setAttribute("aria-label","Open navigation");menuButton.textContent="☰";}));}
const newsletterForm=document.querySelector("#newsletter-form");
if(newsletterForm)newsletterForm.addEventListener("submit",event=>{event.preventDefault();const note=document.querySelector("#form-note");note.textContent="Thank you — newsletter signup will be connected when the backend is built.";newsletterForm.reset();});

(async function loadPublishedMagazine(){
  const cfg=window.PIXEL_NIRA_CONFIG||{};
  if(!cfg.supabaseUrl||!cfg.supabaseAnonKey||!window.supabase)return;
  const params=new URLSearchParams(window.location.search);
  const brand=params.get("brand")==="pixel"?"pixel":"nira";
  try{
    const client=window.supabase.createClient(cfg.supabaseUrl,cfg.supabaseAnonKey);
    const {data,error}=await client.from("magazine_pages").select("brand,slug,published_content,status").eq("brand",brand).eq("status","published").maybeSingle();
    if(error||!data||!Array.isArray(data.published_content?.elements)||!data.published_content.elements.length)return;
    const main=document.querySelector("main");
    if(!main)return;
    document.title=(brand==="pixel"?"Pixel Studios":"Nira Editorial")+" — Pixel × Nira";
    const nav=document.querySelector(".main-nav");
    if(nav)nav.innerHTML='<a href="?brand=nira">Nira Editorial</a><a href="?brand=pixel">Pixel Studios</a>';
    const headerMark=document.querySelector(".wordmark");
    if(headerMark){headerMark.innerHTML=brand==="pixel"?'PIXEL<span>®</span>':'NIRA<span>®</span>';headerMark.setAttribute("aria-label",brand==="pixel"?"Pixel Studios home":"Nira Editorial home");}
    const esc=value=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
    const items=data.published_content.elements.map(item=>{
      const x=Math.max(0,Math.min(100,Number(item.x)||0)),y=Math.max(0,Math.min(100,Number(item.y)||0)),width=Math.max(5,Math.min(100,Number(item.width)||40));
      const common='left:'+x+'%;top:'+y+'%;width:'+width+'%;';
      if(item.type==="image"){
        const height=Math.max(8,Math.min(100,Number(item.height)||50));
        const url=/^https:\/\//i.test(item.url||"")?item.url:"";
        return '<figure class="live-magazine-element live-magazine-image" style="'+common+'height:'+height+'%;"><img src="'+esc(url)+'" alt="'+esc(item.alt||"Editorial photograph")+'" style="object-fit:'+(item.fit==="contain"?"contain":"cover")+';object-position:'+Math.max(0,Math.min(100,Number(item.focalX)||0))+'% '+Math.max(0,Math.min(100,Number(item.focalY)||0))+'%;transform:scale('+Math.max(1,Math.min(1.8,Number(item.scale||100)/100))+');filter:'+(/^(none|grayscale\(100%\)|sepia\(30%\)|contrast\(1\.12\) saturate\(\.82\))$/.test(item.filter||"none")?item.filter:"none")+'"></figure>';
      }
      const font=["Playfair Display","DM Sans","Georgia","Arial"].includes(item.fontFamily)?item.fontFamily:"DM Sans";
      const size=Math.max(9,Math.min(120,Number(item.fontSize)||16));
      const color=/^#[0-9a-f]{6}$/i.test(item.color||"")?item.color:"#22221f";
      return '<div class="live-magazine-element live-magazine-text '+(item.kind==="heading"?"is-heading":"")+'" style="'+common+'font-family:'+font+';font-size:'+size+'px;color:'+color+';">'+esc(item.text).replace(/\n/g,"<br>")+'</div>';
    }).join("");
    main.className="live-magazine-main";
    main.innerHTML='<section class="live-magazine-canvas" aria-label="'+(brand==="pixel"?"Pixel Studios":"Nira Editorial")+' published page"><div class="live-magazine-masthead"><span>INDEPENDENT CREATIVE JOURNAL</span><strong>'+(brand==="pixel"?"PIXEL STUDIOS":"NIRA EDITORIAL")+'</strong><span>VOL. 01</span></div>'+items+'</section><footer class="live-magazine-footer"><span>PIXEL STUDIOS × NIRA EDITORIAL</span><a href="https://www.instagram.com/'+(brand==="pixel"?"pixelstudios.inc":"nira.editorial")+'/" target="_blank" rel="noreferrer">FOLLOW ON INSTAGRAM ↗</a></footer>';
  }catch(error){console.error("Unable to load published magazine page.",error);}
})();
/* Gentle, one-time section reveals; preserve reduced-motion accessibility. */
(function initEditorialReveal(){
  const sections=[...document.querySelectorAll("[data-reveal]:not([data-reveal='hero'])")];
  if(!sections.length)return;
  if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){sections.forEach(el=>el.classList.add("is-visible"));return;}
  if(!("IntersectionObserver" in window)){sections.forEach(el=>el.classList.add("is-visible"));return;}
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
  }),{threshold:.08,rootMargin:"0px 0px -35px 0px"});
  sections.forEach(el=>observer.observe(el));
})();
