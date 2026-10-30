const CACHE='kanji-rush-v4';
const ASSETS=['./manifest.json'];
const REVIEW_STYLE=`<style id="review-v4">
#review .card{max-width:460px;padding:22px 18px}
.reviewKanji{font-family:"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic",sans-serif!important;font-size:138px!important;font-weight:700!important;line-height:.95!important;margin:0 0 10px!important;color:#fff!important}
.reviewReading{font-size:34px!important;font-weight:900!important;line-height:1.1!important;margin-bottom:12px!important}
.reviewMeaning{font-size:24px!important;font-weight:850!important;line-height:1.25!important;margin:12px 0 16px!important}
.reviewContext{font-family:"Hiragino Kaku Gothic ProN","Hiragino Sans","Yu Gothic",sans-serif!important;font-size:27px!important;font-weight:700!important;line-height:1.55!important;color:#f4f7ff!important;background:#0a1222!important;border:1px solid #31466d!important;border-radius:16px!important;padding:16px 12px!important;letter-spacing:.01em!important}
.reviewStat{font-size:14px!important;margin-top:13px!important}
#review .go{font-size:20px!important;min-height:64px!important;margin-top:16px!important}
@media(max-height:740px){.reviewKanji{font-size:112px!important}.reviewContext{font-size:23px!important;line-height:1.4!important}.reviewReading{font-size:30px!important}.reviewMeaning{font-size:21px!important}}
</style>`;
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(Promise.all([caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))),self.clients.claim()])));
self.addEventListener('fetch',e=>{
  if(e.request.mode==='navigate'){
    e.respondWith(fetch(e.request,{cache:'no-store'}).then(async res=>{
      const type=res.headers.get('content-type')||'';
      if(!type.includes('text/html')) return res;
      let html=await res.text();
      html=html.replace('</head>',REVIEW_STYLE+'</head>');
      return new Response(html,{status:res.status,statusText:res.statusText,headers:{'content-type':'text/html; charset=utf-8','cache-control':'no-store'}});
    }).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(e.request).then(res=>{if(e.request.method==='GET'){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));}return res;}).catch(()=>caches.match(e.request)));
});