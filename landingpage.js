const WA="6281234567890",$=s=>document.querySelector(s),rp=n=>"Rp"+n.toLocaleString("id-ID");
const P=[
{id:1,n:"Classic Beef Burger",p:22000,t:"burger",i:"b-classic",d:"Patty sapi juicy, selada, tomat, dan saus spesial."},
{id:2,n:"Cheese Burger",p:25000,t:"burger",i:"b-cheese",d:"Daging panggang dengan lelehan keju yang gurih."},
{id:3,n:"Big Mac Style Burger",p:30000,t:"burger",i:"b-mac",d:"Tiga roti, dua patty, keju, dan saus ala big burger."},
{id:4,n:"Double Beef Burger",p:35000,t:"burger",i:"b-double",d:"Dua patty sapi dan dua keju untuk yang super lapar."},
{id:5,n:"Chicken Burger",p:23000,t:"burger",i:"b-chick",d:"Ayam crispy renyah dengan selada segar."},
{id:6,n:"French Fries",p:12000,t:"fries",i:"fries",v:"0 0 160 180",d:"Kentang goreng garing, pas buat cemilan bareng."},
{id:7,n:"Chicken Nuggets",p:15000,t:"side",i:"nug",v:"0 0 200 150",d:"Nugget ayam emas, lembut di dalam, garing di luar."},
{id:8,n:"Coca-Cola",p:8000,t:"drink",i:"cola",v:"0 0 120 190",d:"Dingin, bersoda, penutup yang menyegarkan."}];
let cart={},promo=null;
try{cart=JSON.parse(sessionStorage.getItem("mb_cart")||"{}");for(const k in cart)if(!P.some(x=>x.id==k))delete cart[k];promo=sessionStorage.getItem("mb_promo")}catch(e){}
const save=()=>{try{sessionStorage.setItem("mb_cart",JSON.stringify(cart));promo?sessionStorage.setItem("mb_promo",promo):sessionStorage.removeItem("mb_promo")}catch(e){}};
const IM={
 "1": "menu-classic-beef-burger.jpg",
 "2": "menu-cheese-burger.jpg",
 "3": "menu-big-mac-style-burger.jpg",
 "4": "menu-double-beef-burger.jpg",
 "5": "menu-chicken-burger.jpg",
 "6": "menu-french-fries.jpg",
 "7": "menu-chicken-nuggets.jpg",
 "8": "menu-coca-cola.jpg"
};
$("#grid").innerHTML=P.map(x=>`<article class="card reveal"><div class="pic"><img src="${IM[x.id]}" alt="${x.n}" loading="lazy"></div><div class="body"><h3>${x.n}</h3><p>${x.d}</p><div class="price"><b>${rp(x.p)}</b><button class="add" data-add="${x.id}">+ Keranjang</button></div></div></article>`).join("");
let tt;const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2200)};
const pr=id=>P.find(x=>x.id==id);
function calc(){let sub=0,burgers=[],c={burger:0,fries:0,drink:0};
for(const id in cart){const x=pr(id),q=cart[id];sub+=x.p*q;if(x.t=="burger")for(let k=0;k<q;k++)burgers.push(x.p);if(c[x.t]!=null)c[x.t]+=q}
let off=0,label="";
if(promo=="b21"){burgers.sort((a,b)=>a-b);const f=Math.floor(burgers.length/3);for(let k=0;k<f;k++)off+=burgers[k];label="Buy 2 Get 1"}
if(promo=="hemat"){off=5000*Math.min(c.burger,c.fries,c.drink);label="Paket Hemat"}
if(promo=="d20"&&sub>=50000){off=Math.round(sub*.2);label="Diskon 20%"}
return{sub,off,label,total:sub-off}}
function render(){const n=Object.values(cart).reduce((a,b)=>a+b,0);$("#count").textContent=n;const r=calc();
$("#items").innerHTML=n?Object.keys(cart).map(id=>{const x=pr(id);return`<div class="li"><div><b>${x.n}</b><small>${rp(x.p)} · <button class="del" data-del="${id}">Hapus</button></small></div><div class="qty"><button data-dec="${id}" aria-label="Kurangi">−</button><span>${cart[id]}</span><button data-inc="${id}" aria-label="Tambah">+</button></div><b>${rp(x.p*cart[id])}</b></div>`}).join(""):'<p class="empty">Keranjangmu masih kosong. Yuk pilih burger dulu!</p>';
$("#sums").innerHTML=n?`<div class="tot"><span>Subtotal</span><span>${rp(r.sub)}</span></div>${r.off?`<div class="tot" style="color:var(--red)"><span>Promo ${r.label}</span><span>−${rp(r.off)}</span></div>`:promo?`<div class="tot" style="color:var(--mut)"><span>Promo belum memenuhi syarat</span><span></span></div>`:""}<div class="tot g"><span>Total</span><span>${rp(r.total)}</span></div>`:"";save()}
const add=(id,q=1)=>{cart[id]=(cart[id]||0)+q};
const open=()=>{render();$("#ov").classList.add("open");document.body.style.overflow="hidden"},shut=()=>{$("#ov").classList.remove("open");document.body.style.overflow=""};
document.addEventListener("click",e=>{const t=e.target.closest("button,a");if(!t)return;const d=t.dataset;
if(d.add){add(d.add);render();toast(pr(d.add).n+" ditambahkan ke keranjang")}
else if(d.inc){add(d.inc);render()}else if(d.dec){if(--cart[d.dec]<=0)delete cart[d.dec];render()}
else if(d.del){delete cart[d.del];render()}
else if(d.promo){cart={};promo=d.promo;if(promo=="b21"){add(1,2);add(5,1)}else if(promo=="hemat"){add(2);add(6);add(8)}else{add(3);add(4);add(7)}render();toast("Promo aktif! Keranjang sudah diisi.");open()}
else if(d.order!==undefined&&!Object.keys(cart).length){}
});
$("#cartBtn").onclick=open;$("#close").onclick=shut;$("#ov").onclick=e=>{if(e.target.id=="ov")shut()};
document.addEventListener("keydown",e=>{if(e.key=="Escape")shut()});
$("#co").onclick=()=>{if(!Object.keys(cart).length)return toast("Keranjang masih kosong");const nm=$("#nm").value.trim();if(!nm){$("#nm").focus();return toast("Isi nama pelanggan dulu ya")}
const r=calc();let m=`Halo McBurger, saya mau pesan:%0A`+Object.keys(cart).map(id=>`- ${pr(id).n} x${cart[id]} = ${rp(pr(id).p*cart[id])}`).join("%0A");
m+=`%0A%0ASubtotal: ${rp(r.sub)}`+(r.off?`%0APromo ${r.label}: -${rp(r.off)}`:"")+`%0ATotal: ${rp(r.total)}%0A%0ANama: ${nm}`;const nt=$("#nt").value.trim();if(nt)m+=`%0ACatatan: ${nt}`;
window.open(`https://wa.me/${WA}?text=${m}`,"_blank","noopener")};
const B=$("#burger"),L=$("#links");B.onclick=()=>{const o=L.classList.toggle("open");B.setAttribute("aria-expanded",o)};L.onclick=e=>{if(e.target.tagName=="A")L.classList.remove("open")};
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add("in");io.unobserve(e.target)}}),{threshold:.12});document.querySelectorAll(".reveal").forEach(x=>io.observe(x));
const tp=$("#top");addEventListener("scroll",()=>tp.classList.toggle("show",scrollY>500),{passive:true});tp.onclick=()=>scrollTo({top:0,behavior:"smooth"});
const sl=[...document.querySelectorAll(".slide")];let si=0,sh;const go=n=>{sl[si].classList.remove("on");si=(n+sl.length)%sl.length;sl[si].classList.add("on")},rs=()=>{clearInterval(sh);sh=setInterval(()=>go(si+1),6000)};
document.querySelector(".prev").onclick=()=>{go(si-1);rs()};document.querySelector(".next").onclick=()=>{go(si+1);rs()};rs();
render();
