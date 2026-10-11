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
    const cs=data.published_content.canvasStyle||{};const canvasBg=cs.bgMode==="linear"?"linear-gradient("+(+cs.gradientAngle||135)+"deg, "+(cs.gradientStart||cs.bgColor||"#f7f3eb")+", "+(cs.gradientEnd||"#d8d0c2")+")":cs.bgMode==="radial"?"radial-gradient(circle, "+(cs.gradientStart||cs.bgColor||"#f7f3eb")+", "+(cs.gradientEnd||"#d8d0c2")+")":(cs.bgColor||"#f7f3eb");const items=data.published_content.elements.map(item=>{
      const x=Number.isFinite(Number(item.x))?Number(item.x):0,y=Number.isFinite(Number(item.y))?Number(item.y):0,width=Number.isFinite(Number(item.width))?Number(item.width):50;
      const common='left:'+x+'%;top:'+y+'%;width:'+width+'%;';
      if(item.type==="image"){
        const height=Number.isFinite(Number(item.height))?Number(item.height):50;
        const url=/^https:\/\//i.test(item.url||"")?item.url:"";
        const zoom=Math.max(1,Math.min(2.5,Number(item.scale||100)/100)),fx=Math.max(0,Math.min(100,Number(item.focalX??50))),fy=Math.max(0,Math.min(100,Number(item.focalY??50)));const imageStyle="object-fit:"+(item.fit==="contain"?"contain":"cover")+";object-position:"+fx+"% "+fy+"%;position:absolute;width:"+(zoom*100)+"%;height:"+(zoom*100)+"%;max-width:none;max-height:none;left:"+(-(zoom-1)*fx)+"%;top:"+(-(zoom-1)*fy)+"%;transform:none;filter:"+(/^(none|grayscale\(100%\)|sepia\(30%\)|contrast\(1\.12\) saturate\(\.82\))$/.test(item.filter||"none")?item.filter:"none");return '<figure class="live-magazine-element live-magazine-image" style="'+common+'height:'+height+'%;"><img src="'+esc(url)+'" alt="'+esc(item.alt||"Editorial photograph")+'" style="'+imageStyle+'"></figure>';
      }
      const font=["Playfair Display","DM Sans","Cormorant Garamond","Libre Baskerville","Montserrat","Oswald","Prata","Raleway","Space Grotesk","Georgia","Arial"].includes(item.fontFamily)?item.fontFamily:"DM Sans";
      const size=Math.max(9,Math.min(120,Number(item.fontSize)||16));
      const color=/^#[0-9a-f]{6}$/i.test(item.color||"")?item.color:"#22221f";const ta=item.textGradientStart||color,tb=item.textGradientEnd||"#a17b55",ba=item.bgStart||"#f1e5d4",bb=item.bgEnd||"#c4b6d9";const bg=item.bgMode==="solid"?ba:item.bgMode==="linear"?"linear-gradient("+(+item.bgAngle||135)+"deg, "+ba+", "+bb+")":item.bgMode==="radial"?"radial-gradient(circle, "+ba+", "+bb+")":"transparent";const grad=item.colorMode==="linear"?"background-image:linear-gradient(90deg, "+ta+", "+tb+");background-clip:text;-webkit-background-clip:text;color:transparent;":"";
      return '<div class="live-magazine-element live-magazine-text '+(item.kind==="heading"?"is-heading":"")+'" style="'+common+'font-family:'+font+';font-size:'+size+'px;color:'+color+';background:'+bg+';padding:'+(item.bgMode&&item.bgMode!=="transparent"?"10px":"3px")+';'+grad+'line-height:'+Math.max(.8,Math.min(3,Number(item.lineHeight)||(item.kind==='heading'?1.02:1.45)))+';text-align:'+(['left','center','right'].includes(item.textAlign)?item.textAlign:'left')+';letter-spacing:'+Math.max(-5,Math.min(20,Number(item.letterSpacing)||0))+'px;font-weight:'+(['400','500','600','700'].includes(String(item.fontWeight))?item.fontWeight:(item.kind==='heading'?'500':'400'))+';">'+esc(item.text).replace(/\n/g,"<br>")+'</div>';
    }).join("");
    main.className="live-magazine-main";
    main.innerHTML='<section class="live-magazine-canvas" style="background:'+esc(canvasBg)+'" aria-label="'+(brand==="pixel"?"Pixel Studios":"Nira Editorial")+' published page"><div class="live-magazine-masthead"><span>INDEPENDENT CREATIVE JOURNAL</span><strong>'+(brand==="pixel"?"PIXEL STUDIOS":"NIRA EDITORIAL")+'</strong><span>VOL. 01</span></div>'+items+'</section><footer class="live-magazine-footer"><span>PIXEL STUDIOS × NIRA EDITORIAL</span><a href="https://www.instagram.com/'+(brand==="pixel"?"pixelstudios.inc":"nira.editorial")+'/" target="_blank" rel="noreferrer">FOLLOW ON INSTAGRAM ↗</a></footer>';
  }catch(error){console.error("Unable to load published magazine page.",error);}
})();