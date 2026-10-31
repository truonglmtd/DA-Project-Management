const products = [
  {id:1,name:"Giày chạy bộ AirFlex",category:"Chạy bộ",price:1290000,old:1590000,rating:"4.9",tag:"BÁN CHẠY",image:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=700&q=85"},
  {id:2,name:"Áo tập Performance",category:"Gym",price:390000,old:490000,rating:"4.8",tag:"-20%",image:"https://images.unsplash.com/photo-1556821840-3a63f95609a7?auto=format&fit=crop&w=700&q=85"},
  {id:3,name:"Bóng đá Pro Match",category:"Bóng đá",price:650000,old:790000,rating:"4.9",tag:"MỚI",image:"https://images.unsplash.com/photo-1614632537423-1e6c2e7e0b1b?auto=format&fit=crop&w=700&q=85"},
  {id:4,name:"Bình nước thể thao",category:"Phụ kiện",price:180000,old:220000,rating:"4.7",tag:"HOT",image:"https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=700&q=85"},
  {id:5,name:"Tạ tay cao su 5kg",category:"Gym",price:320000,old:0,rating:"4.8",tag:"",image:"https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=700&q=85"},
  {id:6,name:"Giày thể thao Urban",category:"Chạy bộ",price:990000,old:1190000,rating:"4.8",tag:"-17%",image:"https://images.unsplash.com/photo-1495555961986-6d4c1ecb7be3?auto=format&fit=crop&w=700&q=85"},
  {id:7,name:"Túi du lịch năng động",category:"Phụ kiện",price:450000,old:0,rating:"4.6",tag:"",image:"https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=700&q=85"},
  {id:8,name:"Găng tay thủ môn",category:"Bóng đá",price:520000,old:650000,rating:"4.7",tag:"-20%",image:"https://images.unsplash.com/photo-1521412644187-c49fa049e84d?auto=format&fit=crop&w=700&q=85"}
];
const money = n => n.toLocaleString("vi-VN") + "₫";
let activeFilter = "Tất cả";
let cart = [];
let liked = new Set();
const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const toast = document.getElementById("toast");
let toastTimer;
function showToast(message){toast.textContent=message;toast.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove("show"),2400)}
function renderProducts(){
  const search = document.getElementById("searchInput").value.trim().toLowerCase();
  let list = products.filter(p=>(activeFilter==="Tất cả"||p.category===activeFilter)&&p.name.toLowerCase().includes(search));
  const sort = document.getElementById("sortSelect").value;
  if(sort==="low")list.sort((a,b)=>a.price-b.price);
  if(sort==="high")list.sort((a,b)=>b.price-a.price);
  if(!list.length){productGrid.innerHTML='<div class="empty-state">Không tìm thấy sản phẩm phù hợp. Hãy thử từ khóa khác nhé!</div>';return}
  productGrid.innerHTML=list.map(p=>`
    <article class="product-card">
      <div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.insertAdjacentHTML('beforeend','<span style=&quot;font-size:65px&quot;>🏃</span>')">
        ${p.tag?`<span class="product-tag">${p.tag}</span>`:""}
        <button class="heart-btn ${liked.has(p.id)?"liked":""}" data-like="${p.id}" aria-label="Yêu thích">${liked.has(p.id)?"♥":"♡"}</button>
      </div>
      <div class="product-info"><div class="product-category">${p.category}</div><div class="product-name">${p.name}</div>
        <div class="product-bottom"><div><span class="product-price">${money(p.price)}</span>${p.old?`<span class="old-price">${money(p.old)}</span>`:""}</div><button class="add-cart" data-add="${p.id}" aria-label="Thêm vào giỏ">+</button></div>
        <div class="rating"><span>★★★★★</span> ${p.rating} · Đánh giá tốt</div>
      </div>
    </article>`).join("");
}
function updateCart(){cartCount.textContent=cart.reduce((sum,item)=>sum+item.qty,0)}
productGrid.addEventListener("click",e=>{
  const add=e.target.closest("[data-add]");
  const like=e.target.closest("[data-like]");
  if(add){const id=Number(add.dataset.add);const item=cart.find(i=>i.id===id);item?item.qty++:cart.push({id,qty:1});updateCart();showToast("Đã thêm sản phẩm vào giỏ hàng!")}
  if(like){const id=Number(like.dataset.like);liked.has(id)?liked.delete(id):liked.add(id);renderProducts();showToast(liked.has(id)?"Đã thêm vào yêu thích":"Đã bỏ khỏi yêu thích")}
});
document.querySelectorAll(".filter-chip").forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.filter;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("selected",b===btn));renderProducts()}));
document.querySelectorAll(".category-card").forEach(btn=>btn.addEventListener("click",()=>{activeFilter=btn.dataset.category;document.querySelectorAll(".filter-chip").forEach(b=>b.classList.toggle("selected",b.dataset.filter===activeFilter));renderProducts();document.getElementById("products").scrollIntoView({behavior:"smooth"})}));
document.getElementById("searchInput").addEventListener("input",renderProducts);
document.getElementById("sortSelect").addEventListener("change",renderProducts);

const modal=document.getElementById("authModal");
const authForm=document.getElementById("authForm");
let authMode="login";
function openAuth(mode="login"){modal.classList.add("show");modal.setAttribute("aria-hidden","false");setAuthMode(mode)}
function closeAuth(){modal.classList.remove("show");modal.setAttribute("aria-hidden","true");document.getElementById("authMessage").textContent=""}
function setAuthMode(mode){
  authMode=mode;
  document.querySelectorAll(".auth-tab").forEach(b=>b.classList.toggle("active",b.dataset.mode===mode));
  const register=mode==="register";
  document.getElementById("authTitle").textContent=register?"Tạo tài khoản mới":"Chào mừng trở lại!";
  document.getElementById("authSubtitle").textContent=register?"Đăng ký để bắt đầu hành trình năng động.":"Đăng nhập để tiếp tục mua sắm.";
  document.getElementById("authSubmit").innerHTML=register?'Tạo tài khoản <span>→</span>':'Đăng nhập <span>→</span>';
  document.getElementById("confirmWrap").classList.toggle("hidden",!register);
  document.getElementById("authConfirm").required=register;
  document.getElementById("authMessage").textContent="";
}
document.getElementById("openLogin").addEventListener("click",()=>openAuth("login"));
document.getElementById("closeAuth").addEventListener("click",closeAuth);
modal.addEventListener("click",e=>{if(e.target===modal)closeAuth()});
document.addEventListener("keydown",e=>{if(e.key==="Escape")closeAuth()});
document.querySelectorAll(".auth-tab").forEach(b=>b.addEventListener("click",()=>setAuthMode(b.dataset.mode)));
authForm.addEventListener("submit",e=>{
  e.preventDefault();
  const email=document.getElementById("authEmail").value.trim().toLowerCase();
  const password=document.getElementById("authPassword").value;
  const message=document.getElementById("authMessage");
  const users=JSON.parse(localStorage.getItem("sportShopUsers")||"{}");
  if(authMode==="register"){
    const confirm=document.getElementById("authConfirm").value;
    if(password!==confirm){message.textContent="Mật khẩu nhập lại chưa khớp.";return}
    if(users[email]){message.textContent="Email này đã được đăng ký.";return}
    users[email]=password;localStorage.setItem("sportShopUsers",JSON.stringify(users));
    message.textContent="Đăng ký thành công! Bạn có thể đăng nhập.";
    showToast("Tạo tài khoản thành công!");
    setTimeout(()=>setAuthMode("login"),700);
  }else{
    if(users[email]&&users[email]===password){message.textContent="Đăng nhập thành công!";showToast("Xin chào! Bạn đã đăng nhập.");setTimeout(closeAuth,800)}
    else{message.textContent="Email hoặc mật khẩu chưa đúng. Nếu chưa có tài khoản, hãy đăng ký."}
  }
});
document.getElementById("cartButton").addEventListener("click",()=>{
  if(!cart.length){showToast("Giỏ hàng đang trống. Hãy chọn sản phẩm bạn thích!");return}
  const lines=cart.map(item=>{const p=products.find(x=>x.id===item.id);return `${p.name} × ${item.qty} — ${money(p.price*item.qty)}`});
  const total=cart.reduce((sum,item)=>sum+products.find(p=>p.id===item.id).price*item.qty,0);
  alert("GIỎ HÀNG CỦA BẠN\n\n"+lines.join("\n")+"\n\nTổng cộng: "+money(total)+"\n\nĐây là bản demo, chưa có thanh toán.");
});
document.getElementById("newsletterForm").addEventListener("submit",e=>{e.preventDefault();showToast("Cảm ơn bạn đã đăng ký nhận tin!");e.target.reset()});
document.getElementById("menuButton").addEventListener("click",()=>document.getElementById("nav").classList.toggle("open"));
document.querySelectorAll(".nav-link").forEach(a=>a.addEventListener("click",()=>document.getElementById("nav").classList.remove("open")));
renderProducts();