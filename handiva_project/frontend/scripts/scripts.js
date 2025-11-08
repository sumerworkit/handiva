// Basic frontend interactions and demo data
document.addEventListener('DOMContentLoaded', ()=> {
  const highlights = [
    {title:'Pochampally Ikat Saree', img:'assets/pochampally.jpg', origin:'Telangana', tags:['textile','ikat']},
    {title:'Terracotta Pot (Mud Craft)', img:'assets/terracotta.jpg', origin:'Telangana', tags:['pottery','mud']},
    {title:'Jute Tote Bag', img:'assets/jute.jpg', origin:'Telangana', tags:['jute','eco']},
    {title:'Handknit Woolen Shawl', img:'assets/wool_shawl.jpg', origin:'Himachal', tags:['wool','knit']}
  ];
  const cont = document.getElementById('highlights');
  if(cont){
    highlights.forEach(h=>{
      const el = document.createElement('div');
      el.className = 'card';
      el.innerHTML = `<img src="${h.img}" alt="${h.title}" /><strong>${h.title}</strong><small>${h.origin}</small><p style="color:#666;margin:6px 0">${h.tags.join(', ')}</p>`;
      cont.appendChild(el);
    });
  }

  // Search button triggers API call
  const searchBtn = document.getElementById('searchBtn');
  searchBtn && searchBtn.addEventListener('click', async ()=>{
    const q = document.getElementById('search').value.trim();
    if(!q) return alert('Type a search term');
    const res = await fetch(`/api/products?q=${encodeURIComponent(q)}`);
    const data = await res.json();
    window.location.href = 'catalog.html?q=' + encodeURIComponent(q);
  });
});


// Simple demo chatbot (rule-based) and translator (client-side mock)
window.demoBot = {
  respond: function(text){
    text = text.toLowerCase();
    if(text.includes('shipping')) return 'Standard shipping takes 5-8 business days. For Telangana local deliveries expect 2-4 days.';
    if(text.includes('return')) return 'We accept returns within 7 days on eligible handmade items. Check seller policy.';
    if(text.includes('tribe') || text.includes('contact')) return 'Use the "Contact Tribes" page to reach our tribal liaison team.';
    return 'Sorry, I did not understand. Try asking about shipping, returns, or catalog.';
  }
};
window.translateMock = async function(text, to){
  // very basic word-replacement demo for Telugu/Hindi (not a real translator)
  if(!text) return '';
  if(to==='te') return text + ' (Telugu translation placeholder)';
  if(to==='hi') return text + ' (Hindi translation placeholder)';
  return text + ' (translated)';
};
