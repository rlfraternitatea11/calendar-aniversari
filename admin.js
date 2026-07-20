let people=[];const q=s=>document.querySelector(s),list=q("#list"),dlg=q("#dlg");
async function load(){try{people=await (await fetch("data.json",{cache:"no-store"})).json()}catch{people=[]}render()}
function esc(s){return s.replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]))}
function render(){const f=q("#search").value.toLowerCase();list.innerHTML=people.filter(p=>p.name.toLowerCase().includes(f)).sort((a,b)=>a.name.localeCompare(b,"ro")).map(p=>`<div class="row"><div><strong>${esc(p.name)}</strong><br><small>${p.birthdate.split("-").reverse().join(".")}</small></div><div><button onclick="editP('${p.id}')">Editează</button> <button onclick="delP('${p.id}')">Șterge</button></div></div>`).join("")}
q("#add").onclick=()=>{q("#form").reset();q("#id").value="";q("#title").textContent="Adaugă persoană";dlg.showModal()}
q("#cancel").onclick=()=>dlg.close();q("#search").oninput=render;
window.editP=id=>{const p=people.find(x=>x.id===id);q("#id").value=p.id;q("#name").value=p.name;q("#birth").value=p.birthdate;q("#title").textContent="Editează persoana";dlg.showModal()}
window.delP=id=>{if(confirm("Ștergi această persoană?")){people=people.filter(p=>p.id!==id);render()}}
q("#form").onsubmit=e=>{e.preventDefault();const id=q("#id").value||crypto.randomUUID(),p={id,name:q("#name").value.trim(),birthdate:q("#birth").value},i=people.findIndex(x=>x.id===id);i>=0?people[i]=p:people.push(p);dlg.close();render()}
function dl(n,c,t){const a=document.createElement("a"),u=URL.createObjectURL(new Blob([c],{type:t}));a.href=u;a.download=n;a.click();URL.revokeObjectURL(u)}
q("#json").onclick=()=>dl("data.json",JSON.stringify(people,null,2),"application/json");
function ie(s){return s.replace(/\\/g,"\\\\").replace(/;/g,"\\;").replace(/,/g,"\\,").replace(/\n/g,"\\n")}
function ics(){const d=new Date().toISOString().replace(/[-:]/g,"").replace(/\.\d{3}Z$/,"Z"),L=["BEGIN:VCALENDAR","VERSION:2.0","PRODID:-//RL Fraternitatea//RO","CALSCALE:GREGORIAN","METHOD:PUBLISH","X-WR-CALNAME:Aniversări RL Fraternitatea"];
for(const p of people){const[,m,z]=p.birthdate.split("-"),s=`2026${m}${z}`,nd=new Date(`2026-${m}-${z}T12:00:00`);nd.setDate(nd.getDate()+1);const e=`${nd.getFullYear()}${String(nd.getMonth()+1).padStart(2,"0")}${String(nd.getDate()).padStart(2,"0")}`;L.push("BEGIN:VEVENT",`UID:${p.id}@rl-fraternitatea`,`DTSTAMP:${d}`,`DTSTART;VALUE=DATE:${s}`,`DTEND;VALUE=DATE:${e}`,"RRULE:FREQ=YEARLY",`SUMMARY:${ie("🎂 "+p.name)}`,"TRANSP:TRANSPARENT","BEGIN:VALARM","TRIGGER:PT9H","ACTION:DISPLAY",`DESCRIPTION:${ie("Astăzi este aniversarea lui "+p.name)}`,"END:VALARM","END:VEVENT")}L.push("END:VCALENDAR");return L.join("\r\n")+"\r\n"}
q("#ics").onclick=()=>dl("aniversari.ics",ics(),"text/calendar;charset=utf-8");load();