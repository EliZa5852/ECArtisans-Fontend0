import{d as m,u as f,a as g,r as h,o as v,b as k,c as o,e as n,f as p,g as l,F as b,h as C,n as M,t as y,i as B,j as w,_ as x}from"./index-DJbOtw9j.js";const S={class:"container p-0"},U={class:"row g-3 m-0 p-0 flex-grow-1"},V={key:0,class:"d-none d-lg-block col-lg-2 p-0 m-0"},D={class:"list-group userMenu mt-5"},F=["onClick","aria-current"],N=m({__name:"UserMenu",setup(R){const e=f(),i=g();function u(t,c){var s;return typeof t=="string"&&typeof c=="string"?(s=t.split("er")[1])==null?void 0:s.includes(c.split("er")[1]):!1}const r=h([]),d=()=>{e.matched[0].path==="/seller"?r.value=i.sellerMenu:e.matched[0].path==="/user"&&(r.value=i.userMenu)};return v(()=>{d()}),(t,c)=>{const s=k("router-view");return o(),n("div",S,[p("div",U,[l(e).name!=="SellerHome"?(o(),n("div",V,[p("ul",D,[(o(!0),n(b,null,C(r.value,(a,_)=>(o(),n("li",{key:_,onClick:$=>t.$go(a.path),class:M(["list-group-item btn btn-Bg rounded-2 text-start p-3",{"btn-Bg-active":u(l(e).name,a.path.name)}]),"aria-current":u(l(e).name,a.path.name)},y(a.title),11,F))),128))])])):B("",!0),w(s,{class:"col p-0 mt-5"})])])}}}),z=x(N,[["__scopeId","data-v-5a775bca"]]);export{z as default};
