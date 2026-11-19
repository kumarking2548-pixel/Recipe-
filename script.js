/*
  ULTIMATE GADGETS — store settings
  1) Replace 919999999999 with your WhatsApp number including country code (91), no + or spaces.
  2) Replace sample products/prices with products confirmed by your supplier.
*/
const STORE_WHATSAPP = "919999999999"; // CHANGE THIS before publishing
const products = [
  {id:1,name:"Wireless Earbuds",category:"Audio",price:499,description:"Compact everyday audio companion.",image:"https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=700&auto=format&fit=crop&q=80"},
  {id:2,name:"Smart Watch",category:"Wearables",price:899,description:"A stylish wearable for daily use.",image:"https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=700&auto=format&fit=crop&q=80"},
  {id:3,name:"Portable Speaker",category:"Audio",price:699,description:"Small speaker for music on the go.",image:"https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=700&auto=format&fit=crop&q=80"},
  {id:4,name:"Fast Charging Cable",category:"Accessories",price:199,description:"Everyday charging accessory. Check connector type.",image:"https://images.unsplash.com/photo-1583394838336-acd977736f90?w=700&auto=format&fit=crop&q=80"},
  {id:5,name:"Power Bank",category:"Accessories",price:799,description:"Portable backup power. Confirm capacity with supplier.",image:"https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=700&auto=format&fit=crop&q=80"},
  {id:6,name:"Bluetooth Headphones",category:"Audio",price:999,description:"Over-ear style for everyday listening.",image:"https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=700&auto=format&fit=crop&q=80"},
  {id:7,name:"Fitness Band",category:"Wearables",price:599,description:"Lightweight wearable accessory.",image:"https://images.unsplash.com/photo-1576243345690-4e4b79b63288?w=700&auto=format&fit=crop&q=80"},
  {id:8,name:"Phone Stand",category:"Accessories",price:149,description:"Simple desk accessory for your phone.",image:"https://images.unsplash.com/photo-1612444530582-fc66183b16f2?w=700&auto=format&fit=crop&q=80"}
];
let cart = [];
let activeCategory = "All";
const ₹ = n => "₹" + Number(n).toLocaleString("en-IN");
const grid = document.getElementById("productGrid");
function renderProducts(){
  const q = document.getElementById("searchInput").value.trim().toLowerCase();
  const shown = products.filter(p=>(activeCategory==="All"||p.category===activeCategory)&&(p.name.toLowerCase().includes(q)||p.description.toLowerCase().includes(q)));
  grid.innerHTML = shown.length ? shown.map(p=>`<article class="product-card"><div class="product-image"><img src="${p.image}" alt="${p.name}" loading="lazy" onerror="this.style.display='none';this.parentElement.innerHTML='<span>Gadget image</span>'"></div><div class="product-info"><span class="category">${p.category}</span><h3>${p.name}</h3><p class="description">${p.description}</p><div class="price-row"><span class="price">${₹(p.price)}</span><button class="add-button" onclick="addToCart(${p.id})">Add +</button></div></div></article>`).join("") : "<p>No products found. Try another search.</p>";
}
function addToCart(id){const item=cart.find(x=>x.id===id);if(item)item.qty++;else cart.push({id,qty:1});renderCart();openCart();}
function renderCart(){
  const count=cart.reduce((s,x)=>s+x.qty,0),total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  document.getElementById("cartCount").textContent=count;document.getElementById("cartTotal").textContent=₹(total);
  document.getElementById("cartItems").innerHTML=cart.length?cart.map(x=>{const p=products.find(y=>y.id===x.id);return `<div class="cart-row"><div><b>${p.name}</b><small>${₹(p.price)} each</small></div><div class="qty"><button onclick="changeQty(${p.id},-1)">−</button>${x.qty}<button onclick="changeQty(${p.id},1)">+</button></div></div>`}).join(""):'<p class="empty">Your cart is empty.</p>';
  document.getElementById("checkoutSummary").textContent=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `${p.name} × ${x.qty}`}).join(" • ")+" | Subtotal: "+₹(total);
}
function changeQty(id,d){const x=cart.find(y=>y.id===id);if(x){x.qty+=d;if(x.qty<=0)cart=cart.filter(y=>y.id!==id)}renderCart();}
const drawer=document.getElementById("cartDrawer"),overlay=document.getElementById("overlay");
function openCart(){drawer.classList.add("show");overlay.classList.add("show")}
function closeCart(){drawer.classList.remove("show");overlay.classList.remove("show")}
document.getElementById("openCart").onclick=openCart;document.getElementById("closeCart").onclick=closeCart;overlay.onclick=closeCart;
document.getElementById("filters").addEventListener("click",e=>{if(e.target.matches("button[data-category]")){activeCategory=e.target.dataset.category;document.querySelectorAll(".filter").forEach(b=>b.classList.toggle("active",b===e.target));renderProducts()}});
document.getElementById("searchInput").addEventListener("input",renderProducts);
const modal=document.getElementById("checkoutModal");
document.getElementById("checkoutButton").onclick=()=>{if(!cart.length){alert("Please add a product first.");return}closeCart();renderCart();modal.classList.add("show")};
document.getElementById("closeCheckout").onclick=()=>modal.classList.remove("show");
document.getElementById("orderForm").addEventListener("submit",e=>{
  e.preventDefault();const f=new FormData(e.target),name=f.get("name").trim(),phone=f.get("phone").trim(),address=f.get("address").trim(),payment=f.get("payment");
  const err=document.getElementById("formError");err.textContent="";
  if(!/^[6-9][0-9]{9}$/.test(phone)){err.textContent="Enter a valid 10-digit Indian mobile number.";return}
  if(!cart.length){err.textContent="Your cart is empty.";return}
  const lines=cart.map(x=>{const p=products.find(y=>y.id===x.id);return `- ${p.name} x ${x.qty} = ${₹(p.price*x.qty)}`});
  const total=cart.reduce((s,x)=>s+products.find(p=>p.id===x.id).price*x.qty,0);
  const message=`NEW ORDER REQUEST — ULTIMATE GADGETS\nName: ${name}\nMobile: ${phone}\nAddress: ${address}\nPayment preference: ${payment}\nItems:\n${lines.join("\n")}\nSubtotal: ${₹(total)}\nPlease confirm stock, shipping charges, delivery estimate and final payable amount.`;
  if(STORE_WHATSAPP==="919999999999"){err.textContent="Store owner: first add your WhatsApp number in script.js, then publish the website.";return}
  window.open("https://wa.me/"+STORE_WHATSAPP+"?text="+encodeURIComponent(message),"_blank");
});
document.getElementById("year").textContent=new Date().getFullYear();
renderProducts();renderCart();
