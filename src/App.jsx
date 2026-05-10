import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, ReferenceLine } from "recharts";

const B={red:"#CC2027",charcoal:"#2D2D2D",dark:"#141413",white:"#FFFFFF",offWhite:"#faf9f5",cream:"#f5f3ec",lightGray:"#e8e6dc",medGray:"#b0aea5",accent:"#d97757",blue:"#6a9bcc",green:"#788c5d",success:"#2E7D4F",danger:"#CC2027",bg:"#faf9f5",card:"#FFFFFF",border:"#e0ded6",text:"#141413",muted:"#6b6960"};

const S={"10":{"parl":{"pn_orig":74,"pn_flip":20,"pre":{"PH":82,"PN":74,"BN":30,"GPS":23,"ALONE":7,"GRS":6},"post":{"PN":94,"PH":70,"BN":23,"GPS":22,"ALONE":7,"GRS":6},"gainer":{"co":"PN","d":20},"loser":{"co":"PH","d":-12},"states":{"Johor":{"t":26,"o":2,"f":6},"Selangor":{"t":22,"o":6,"f":4},"Perak":{"t":24,"o":10,"f":3},"Pahang":{"t":14,"o":7,"f":3},"Kedah":{"t":15,"o":14,"f":1},"Pulau Pinang":{"t":13,"o":3,"f":1},"W.P. Kuala Lumpur":{"t":11,"o":0,"f":1},"Sarawak":{"t":31,"o":1,"f":1},"Kelantan":{"t":14,"o":14,"f":0},"Terengganu":{"t":8,"o":8,"f":0},"Perlis":{"t":3,"o":3,"f":0},"N. Sembilan":{"t":8,"o":0,"f":0},"Melaka":{"t":6,"o":3,"f":0},"Sabah":{"t":25,"o":1,"f":0}}},"dun":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":266,"PH":111,"BN":76,"ALONE":36,"GRS":29},"gainer":{"co":"PN","d":57},"loser":{"co":"BN","d":-36},"states":{"Perlis":{"t":15,"o":14,"f":0,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":2,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":10,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":11,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":8,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":13,"m":19,"g":false},"Melaka":{"t":28,"o":2,"f":4,"m":15,"g":false},"Johor":{"t":56,"o":3,"f":4,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":1,"m":37,"g":false}},"govt_count":7}},"15":{"parl":{"pn_orig":74,"pn_flip":29,"pre":{"PH":82,"PN":74,"BN":30,"GPS":23,"ALONE":7,"GRS":6},"post":{"PN":103,"PH":65,"BN":19,"GPS":22,"ALONE":7,"GRS":6},"gainer":{"co":"PN","d":29},"loser":{"co":"PH","d":-17},"states":{"Johor":{"t":26,"o":2,"f":8},"Pahang":{"t":14,"o":7,"f":5},"Selangor":{"t":22,"o":6,"f":5},"Perak":{"t":24,"o":10,"f":4},"W.P. Kuala Lumpur":{"t":11,"o":0,"f":2},"Kedah":{"t":15,"o":14,"f":1},"Pulau Pinang":{"t":13,"o":3,"f":1},"N. Sembilan":{"t":8,"o":0,"f":1},"Melaka":{"t":6,"o":3,"f":1},"Sarawak":{"t":31,"o":1,"f":1},"Kelantan":{"t":14,"o":14,"f":0},"Terengganu":{"t":8,"o":8,"f":0},"Perlis":{"t":3,"o":3,"f":0},"Sabah":{"t":25,"o":1,"f":0}}},"dun":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":297,"PH":102,"BN":57,"ALONE":36,"GRS":26},"gainer":{"co":"PN","d":88},"loser":{"co":"BN","d":-55},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":10,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":13,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":14,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":14,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":13,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":11,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":4,"m":37,"g":false}},"govt_count":9}},"20":{"parl":{"pn_orig":74,"pn_flip":40,"pre":{"PH":82,"PN":74,"BN":30,"GPS":23,"ALONE":7,"GRS":6},"post":{"PN":114,"PH":59,"BN":14,"GPS":22,"ALONE":7,"GRS":6},"gainer":{"co":"PN","d":40},"loser":{"co":"PH","d":-23},"states":{"Johor":{"t":26,"o":2,"f":13},"Selangor":{"t":22,"o":6,"f":7},"Pahang":{"t":14,"o":7,"f":5},"Perak":{"t":24,"o":10,"f":4},"W.P. Kuala Lumpur":{"t":11,"o":0,"f":3},"N. Sembilan":{"t":8,"o":0,"f":3},"Melaka":{"t":6,"o":3,"f":2},"Kedah":{"t":15,"o":14,"f":1},"Pulau Pinang":{"t":13,"o":3,"f":1},"Sarawak":{"t":31,"o":1,"f":1},"Kelantan":{"t":14,"o":14,"f":0},"Terengganu":{"t":8,"o":8,"f":0},"Perlis":{"t":3,"o":3,"f":0},"Sabah":{"t":25,"o":1,"f":0}}},"dun":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":324,"PH":95,"BN":41,"ALONE":33,"GRS":25},"gainer":{"co":"PN","d":115},"loser":{"co":"BN","d":-71},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":2,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":12,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":16,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":17,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":17,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":16,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":19,"m":29,"g":false},"Sabah":{"t":73,"o":1,"f":9,"m":37,"g":false}},"govt_count":9}},"25":{"parl":{"pn_orig":74,"pn_flip":50,"pre":{"PH":82,"PN":74,"BN":30,"GPS":23,"ALONE":7,"GRS":6},"post":{"PN":124,"PH":53,"BN":10,"GPS":22,"ALONE":7,"GRS":6},"gainer":{"co":"PN","d":50},"loser":{"co":"PH","d":-29},"states":{"Johor":{"t":26,"o":2,"f":15},"Selangor":{"t":22,"o":6,"f":8},"Pahang":{"t":14,"o":7,"f":5},"Perak":{"t":24,"o":10,"f":5},"W.P. Kuala Lumpur":{"t":11,"o":0,"f":5},"N. Sembilan":{"t":8,"o":0,"f":6},"Melaka":{"t":6,"o":3,"f":2},"Pulau Pinang":{"t":13,"o":3,"f":2},"Kedah":{"t":15,"o":14,"f":1},"Sarawak":{"t":31,"o":1,"f":1},"Kelantan":{"t":14,"o":14,"f":0},"Terengganu":{"t":8,"o":8,"f":0},"Perlis":{"t":3,"o":3,"f":0},"Sabah":{"t":25,"o":1,"f":0}}},"dun":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":353,"PH":88,"BN":27,"ALONE":29,"GRS":21},"gainer":{"co":"PN","d":144},"loser":{"co":"BN","d":-85},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":3,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":14,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":19,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":17,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":19,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":17,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":30,"m":29,"g":true},"Sabah":{"t":73,"o":1,"f":18,"m":37,"g":false}},"govt_count":10}},"30":{"parl":{"pn_orig":74,"pn_flip":61,"pre":{"PH":82,"PN":74,"BN":30,"GPS":23,"ALONE":7,"GRS":6},"post":{"PN":135,"PH":48,"BN":7,"GPS":21,"ALONE":5,"GRS":6},"gainer":{"co":"PN","d":61},"loser":{"co":"PH","d":-34},"states":{"Johor":{"t":26,"o":2,"f":16},"Selangor":{"t":22,"o":6,"f":9},"Pahang":{"t":14,"o":7,"f":7},"Perak":{"t":24,"o":10,"f":7},"W.P. Kuala Lumpur":{"t":11,"o":0,"f":6},"N. Sembilan":{"t":8,"o":0,"f":6},"Sabah":{"t":25,"o":1,"f":3},"Melaka":{"t":6,"o":3,"f":2},"Pulau Pinang":{"t":13,"o":3,"f":2},"Sarawak":{"t":31,"o":1,"f":2},"Kedah":{"t":15,"o":14,"f":1},"Kelantan":{"t":14,"o":14,"f":0},"Terengganu":{"t":8,"o":8,"f":0},"Perlis":{"t":3,"o":3,"f":0}}},"dun":{"pre":{"PN":209,"PH":131,"BN":112,"ALONE":37,"GRS":29},"post":{"PN":387,"PH":80,"BN":16,"GRS":15,"ALONE":20},"gainer":{"co":"PN","d":178},"loser":{"co":"BN","d":-96},"states":{"Perlis":{"t":15,"o":14,"f":1,"m":8,"g":true},"Kedah":{"t":36,"o":33,"f":3,"m":19,"g":true},"Kelantan":{"t":45,"o":43,"f":2,"m":23,"g":true},"Terengganu":{"t":32,"o":32,"f":0,"m":17,"g":true},"P. Pinang":{"t":40,"o":11,"f":4,"m":21,"g":false},"Perak":{"t":59,"o":26,"f":15,"m":30,"g":true},"Pahang":{"t":42,"o":17,"f":21,"m":22,"g":true},"Selangor":{"t":56,"o":22,"f":18,"m":29,"g":true},"N. Sembilan":{"t":36,"o":5,"f":22,"m":19,"g":true},"Melaka":{"t":28,"o":2,"f":19,"m":15,"g":true},"Johor":{"t":56,"o":3,"f":38,"m":29,"g":true},"Sabah":{"t":73,"o":1,"f":35,"m":37,"g":false}},"govt_count":10}}};

const SeatBar=({pn,total,maj,flips})=>(
  <div style={{height:14,background:B.lightGray,borderRadius:2,overflow:"hidden",position:"relative"}}>
    <div style={{height:"100%",width:`${(pn-flips)/total*100}%`,background:B.red,position:"absolute",left:0}}/>
    <div style={{height:"100%",width:`${flips/total*100}%`,background:B.accent,position:"absolute",left:`${(pn-flips)/total*100}%`}}/>
    <div style={{position:"absolute",left:`${maj/total*100}%`,top:0,bottom:0,width:2,background:B.dark,zIndex:2}}/>
  </div>
);

const CoRow=({co,pre,post,isG,isL})=>{
  const d=post-pre;
  return(
    <div style={{display:"flex",alignItems:"center",padding:"5px 0",borderBottom:`1px solid ${B.lightGray}`,background:isG?"rgba(120,140,93,0.08)":isL?"rgba(204,32,39,0.05)":"transparent"}}>
      <span style={{width:45,fontSize:11,fontWeight:700,fontFamily:"'Poppins',sans-serif"}}>{co}</span>
      {(isG||isL)&&<span style={{fontSize:7,background:isG?B.green:B.danger,color:B.white,padding:"1px 5px",borderRadius:6,fontWeight:700,marginRight:4}}>{isG?"▲ GAINER":"▼ LOSER"}</span>}
      <span style={{flex:1}}/>
      <span style={{fontSize:10,color:B.muted,width:30,textAlign:"center"}}>{pre}</span>
      <span style={{fontSize:10,color:B.muted,margin:"0 4px"}}>→</span>
      <span style={{fontSize:11,fontWeight:700,color:d>0?B.success:d<0?B.danger:B.muted,width:30,textAlign:"center"}}>{post}</span>
      <span style={{fontSize:10,width:40,textAlign:"right",color:d>0?B.success:d<0?B.danger:B.muted,fontWeight:600}}>{d>0?`+${d}`:d}</span>
    </div>
  );
};

export default function App(){
  const [swing,setSwing]=useState("15");
  const [tab,setTab]=useState("parliament");
  const d=S[swing];
  const p=d.parl; const dn=d.dun;
  const pnNew=p.pn_orig+p.pn_flip;
  const hasMaj=pnNew>=112;
  const gc=dn.govt_count;
  const coOrder=["PN","PH","BN","GPS","ALONE","GRS"];

  const parlChart=Object.entries(p.states).map(([st,v])=>({name:st.replace("W.P. ","").replace("Pulau Pinang","P.Pinang").replace("Negeri Sembilan","N.Sembilan").replace("N. Sembilan","N.Semb"),orig:v.o,flip:v.f,other:v.t-v.o-v.f})).filter(d=>(d.orig+d.flip)>0).sort((a,b)=>(b.orig+b.flip)-(a.orig+a.flip));

  const dunChart=Object.entries(dn.states).map(([st,v])=>({name:st.replace("P. Pinang","P.Pinang").replace("N. Sembilan","N.Semb"),orig:v.o,flip:v.f,total:v.t,maj:v.m,other:v.t-v.o-v.f,fg:v.g})).sort((a,b)=>(b.orig+b.flip)/b.total-(a.orig+a.flip)/a.total);

  // Comparison data for all scenarios
  const compData=[10,15,20,25,30].map(s=>{const sc=S[String(s)];return{name:`${s}%`,pn:sc.parl.pn_orig+sc.parl.pn_flip,flip:sc.parl.pn_flip,states:sc.dun.govt_count,phLoss:sc.parl.loser.d,bnDunLoss:sc.dun.loser.d};});

  return(
    <div style={{fontFamily:"'Lora',Georgia,serif",background:B.bg,color:B.text,minHeight:"100vh",padding:"16px 14px"}}>
      {/* Header */}
      <div style={{borderBottom:`3px solid ${B.red}`,paddingBottom:12,marginBottom:14}}>
        <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:4}}>
          <div style={{width:20,height:20,background:B.red,borderRadius:2,display:"flex",alignItems:"center",justifyContent:"center"}}>
            <span style={{color:B.white,fontSize:12,fontWeight:900,fontFamily:"sans-serif"}}>▲</span>
          </div>
          <span style={{fontSize:8,letterSpacing:3,color:B.red,textTransform:"uppercase",fontFamily:"'Poppins',sans-serif",fontWeight:700}}>Scenario Analysis</span>
        </div>
        <h1 style={{fontSize:19,fontWeight:400,margin:"0 0 3px",color:B.charcoal}}>Malay Vote Swing to PN — <span style={{color:B.accent,fontWeight:700}}>{swing}%</span></h1>
        <p style={{fontSize:9,color:B.muted,margin:0,fontFamily:"'Poppins',sans-serif"}}>Race-weighted model · DOSM Census 2020 · MECo (CC0) · GE-15 + SE-15</p>
      </div>

      {/* SWING TOGGLE */}
      <div style={{display:"flex",gap:0,marginBottom:14,borderRadius:4,overflow:"hidden",border:`2px solid ${B.red}`}}>
        {["10","15","20","25","30"].map(s=>(
          <button key={s} onClick={()=>setSwing(s)} style={{flex:1,padding:"10px 0",background:swing===s?B.red:"transparent",color:swing===s?B.white:B.text,border:"none",cursor:"pointer",fontSize:13,fontWeight:swing===s?800:400,fontFamily:"'Poppins',sans-serif",transition:"all 0.2s"}}>
            {s}%
          </button>
        ))}
      </div>

      {/* Key Metrics */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:6,marginBottom:12}}>
        {[
          {val:pnNew,l:"PN Seats",s:hasMaj?"✓ MAJORITY":`${112-pnNew} short`,c:hasMaj?B.success:B.accent},
          {val:`+${p.pn_flip}`,l:"Flipped",s:"Parliament",c:B.accent},
          {val:`${gc}/12`,l:"States",s:"PN govt",c:gc>=9?B.success:B.accent},
          {val:dn.loser.d,l:"BN DUN",s:"seats lost",c:B.danger},
        ].map((m,i)=>(
          <div key={i} style={{background:B.card,border:`1px solid ${B.border}`,borderTop:`3px solid ${m.c}`,padding:"10px 4px",textAlign:"center"}}>
            <div style={{fontSize:22,fontWeight:400,color:m.c}}>{m.val}</div>
            <div style={{fontSize:8,fontWeight:700,fontFamily:"'Poppins',sans-serif"}}>{m.l}</div>
            <div style={{fontSize:7,color:B.muted,fontFamily:"'Poppins',sans-serif"}}>{m.s}</div>
          </div>
        ))}
      </div>

      {/* Gainer/Loser Banner */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:12}}>
        <div style={{background:"rgba(120,140,93,0.1)",border:`1px solid ${B.green}`,borderLeft:`4px solid ${B.green}`,padding:"8px 10px"}}>
          <div style={{fontSize:7,color:B.green,fontWeight:700,fontFamily:"'Poppins',sans-serif",letterSpacing:1}}>▲ BIGGEST GAINER</div>
          <div style={{fontSize:14,fontWeight:700,color:B.success,fontFamily:"'Poppins',sans-serif"}}>{p.gainer.co} <span style={{fontSize:11}}>+{p.gainer.d}</span></div>
        </div>
        <div style={{background:"rgba(204,32,39,0.06)",border:`1px solid ${B.danger}`,borderLeft:`4px solid ${B.danger}`,padding:"8px 10px"}}>
          <div style={{fontSize:7,color:B.danger,fontWeight:700,fontFamily:"'Poppins',sans-serif",letterSpacing:1}}>▼ BIGGEST LOSER</div>
          <div style={{fontSize:14,fontWeight:700,color:B.danger,fontFamily:"'Poppins',sans-serif"}}>{p.loser.co} <span style={{fontSize:11}}>{p.loser.d}</span></div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{display:"flex",gap:0,marginBottom:12,borderBottom:`2px solid ${B.lightGray}`}}>
        {[{k:"parliament",l:"Parliament"},{k:"states",l:"State DUN"},{k:"compare",l:"Compare All"}].map(t=>(
          <button key={t.k} onClick={()=>setTab(t.k)} style={{padding:"7px 12px",background:"transparent",color:tab===t.k?B.red:B.muted,border:"none",borderBottom:tab===t.k?`3px solid ${B.red}`:"3px solid transparent",cursor:"pointer",fontSize:10,fontWeight:700,fontFamily:"'Poppins',sans-serif",textTransform:"uppercase",letterSpacing:1,marginBottom:-2}}>{t.l}</button>
        ))}
      </div>

      {tab==="parliament"?(
        <div>
          {/* Parliament seat bar */}
          <div style={{background:B.card,border:`1px solid ${B.border}`,padding:14,marginBottom:10}}>
            <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
              <span style={{fontSize:11,fontWeight:600}}>PN {pnNew}/222</span>
              <span style={{fontSize:10,color:hasMaj?B.success:B.accent,fontWeight:700}}>{hasMaj?"✓ MAJORITY":`Need ${112-pnNew} more`}</span>
            </div>
            <SeatBar pn={pnNew} total={222} maj={112} flips={p.pn_flip}/>
            <div style={{display:"flex",gap:10,marginTop:4,fontSize:8,color:B.muted,fontFamily:"'Poppins',sans-serif"}}>
              <span><span style={{display:"inline-block",width:7,height:7,background:B.red,marginRight:2}}/>Held</span>
              <span><span style={{display:"inline-block",width:7,height:7,background:B.accent,marginRight:2}}/>Gained</span>
              <span><span style={{display:"inline-block",width:7,height:2,background:B.dark,marginRight:2,verticalAlign:"middle"}}/>Majority</span>
            </div>
          </div>

          {/* Coalition changes */}
          <div style={{background:B.card,border:`1px solid ${B.border}`,padding:14,marginBottom:10}}>
            <h3 style={{fontSize:11,margin:"0 0 6px",fontFamily:"'Poppins',sans-serif",fontWeight:700}}>Coalition Seat Changes</h3>
            {coOrder.map(co=><CoRow key={co} co={co} pre={p.pre[co]||0} post={p.post[co]||0} isG={co===p.gainer.co} isL={co===p.loser.co}/>)}
          </div>

          {/* State chart */}
          <div style={{background:B.card,border:`1px solid ${B.border}`,padding:14}}>
            <h3 style={{fontSize:11,margin:"0 0 8px",fontFamily:"'Poppins',sans-serif",fontWeight:700}}>PN Gains by State</h3>
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={parlChart} layout="vertical" margin={{left:65,right:8,top:2,bottom:2}}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray}/>
                <XAxis type="number" tick={{fill:B.muted,fontSize:8}}/>
                <YAxis type="category" dataKey="name" tick={{fill:B.text,fontSize:8}} width={62}/>
                <Tooltip contentStyle={{background:B.card,border:`1px solid ${B.border}`,fontSize:9}} formatter={(v,n)=>[v,n==="orig"?"PN Held":n==="flip"?"Gained":"Others"]}/>
                <Bar dataKey="orig" stackId="a" fill={B.red}/><Bar dataKey="flip" stackId="a" fill={B.accent}/><Bar dataKey="other" stackId="a" fill={B.lightGray} radius={[0,2,2,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      ):tab==="states"?(
        <div>
          {/* DUN gainer/loser */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginBottom:10}}>
            <div style={{background:"rgba(120,140,93,0.1)",border:`1px solid ${B.green}`,padding:"7px 10px"}}>
              <div style={{fontSize:7,color:B.green,fontWeight:700,fontFamily:"'Poppins',sans-serif"}}>▲ DUN GAINER</div>
              <div style={{fontSize:13,fontWeight:700,color:B.success,fontFamily:"'Poppins',sans-serif"}}>{dn.gainer.co} +{dn.gainer.d}</div>
            </div>
            <div style={{background:"rgba(204,32,39,0.06)",border:`1px solid ${B.danger}`,padding:"7px 10px"}}>
              <div style={{fontSize:7,color:B.danger,fontWeight:700,fontFamily:"'Poppins',sans-serif"}}>▼ DUN LOSER</div>
              <div style={{fontSize:13,fontWeight:700,color:B.danger,fontFamily:"'Poppins',sans-serif"}}>{dn.loser.co} {dn.loser.d}</div>
            </div>
          </div>
          {/* DUN coalition */}
          <div style={{background:B.card,border:`1px solid ${B.border}`,padding:14,marginBottom:10}}>
            <h3 style={{fontSize:11,margin:"0 0 6px",fontFamily:"'Poppins',sans-serif",fontWeight:700}}>DUN Coalition Changes (518 seats)</h3>
            {["PN","PH","BN","ALONE","GRS"].map(co=><CoRow key={co} co={co} pre={dn.pre[co]||0} post={dn.post[co]||0} isG={co===dn.gainer.co} isL={co===dn.loser.co}/>)}
          </div>
          {/* State cards */}
          <div style={{background:B.card,border:`1px solid ${B.border}`,padding:14}}>
            <h3 style={{fontSize:11,margin:"0 0 8px",fontFamily:"'Poppins',sans-serif",fontWeight:700}}>State Assemblies</h3>
            <div style={{display:"grid",gap:5}}>
              {dunChart.map(d=>{const pnN=d.orig+d.flip;return(
                <div key={d.name} style={{background:B.offWhite,padding:8,border:`1px solid ${d.fg?B.success:B.border}`,borderLeft:`3px solid ${d.fg?B.success:B.lightGray}`}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:3}}>
                    <span style={{fontSize:10,fontWeight:700,fontFamily:"'Poppins',sans-serif"}}>{d.name}</span>
                    <span style={{fontSize:8,color:d.fg?B.success:B.danger,fontWeight:700,fontFamily:"'Poppins',sans-serif"}}>{d.fg?"✓ PN":"✗"} {pnN}/{d.total}</span>
                  </div>
                  <SeatBar pn={pnN} total={d.total} maj={d.maj} flips={d.flip}/>
                </div>
              );})}
            </div>
          </div>
        </div>
      ):(
        <div>
          {/* Comparison across all scenarios */}
          <div style={{background:B.card,border:`1px solid ${B.border}`,padding:14,marginBottom:10}}>
            <h3 style={{fontSize:11,margin:"0 0 8px",fontFamily:"'Poppins',sans-serif",fontWeight:700}}>PN Parliament Seats by Swing %</h3>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={compData} margin={{left:0,right:10,top:4,bottom:4}}>
                <CartesianGrid strokeDasharray="3 3" stroke={B.lightGray}/>
                <XAxis dataKey="name" tick={{fill:B.text,fontSize:10,fontFamily:"'Poppins',sans-serif"}}/>
                <YAxis tick={{fill:B.muted,fontSize:9}} domain={[0,150]}/>
                <Tooltip contentStyle={{background:B.card,border:`1px solid ${B.border}`,fontSize:10}}/>
                <ReferenceLine y={112} stroke={B.dark} strokeDasharray="6 3" label={{value:"Majority 112",fill:B.muted,fontSize:9}}/>
                <Bar dataKey="pn" fill={B.red} name="PN Seats" radius={[3,3,0,0]}>
                  {compData.map((e,i)=>(<Cell key={i} fill={e.pn>=112?B.success:B.red}/>))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={{background:B.card,border:`1px solid ${B.border}`,padding:14}}>
            <h3 style={{fontSize:11,margin:"0 0 6px",fontFamily:"'Poppins',sans-serif",fontWeight:700}}>Scenario Comparison Table</h3>
            <div style={{overflowX:"auto"}}>
              <table style={{width:"100%",borderCollapse:"collapse",fontSize:9,fontFamily:"'Poppins',sans-serif"}}>
                <thead><tr style={{borderBottom:`2px solid ${B.red}`}}>
                  <th style={{textAlign:"left",padding:"5px 4px",color:B.red}}>Swing</th>
                  <th style={{textAlign:"center",padding:"5px 2px"}}>PN Seats</th>
                  <th style={{textAlign:"center",padding:"5px 2px"}}>Flipped</th>
                  <th style={{textAlign:"center",padding:"5px 2px"}}>Majority?</th>
                  <th style={{textAlign:"center",padding:"5px 2px"}}>States</th>
                  <th style={{textAlign:"center",padding:"5px 2px"}}>PH Loss</th>
                  <th style={{textAlign:"center",padding:"5px 2px"}}>BN DUN</th>
                </tr></thead>
                <tbody>{compData.map((r,i)=>(
                  <tr key={i} style={{borderBottom:`1px solid ${B.lightGray}`,background:r.name===`${swing}%`?"rgba(217,119,87,0.12)":i%2===0?B.offWhite:"transparent",fontWeight:r.name===`${swing}%`?700:400}}>
                    <td style={{padding:"5px 4px",fontWeight:700}}>{r.name}</td>
                    <td style={{textAlign:"center",color:r.pn>=112?B.success:B.text}}>{r.pn}</td>
                    <td style={{textAlign:"center",color:B.accent}}>+{r.flip}</td>
                    <td style={{textAlign:"center",color:r.pn>=112?B.success:B.danger,fontWeight:700}}>{r.pn>=112?"YES":"NO"}</td>
                    <td style={{textAlign:"center"}}>{r.states}/12</td>
                    <td style={{textAlign:"center",color:B.danger}}>{r.phLoss}</td>
                    <td style={{textAlign:"center",color:B.danger}}>{r.bnDunLoss}</td>
                  </tr>
                ))}</tbody>
              </table>
            </div>
            <div style={{marginTop:8,padding:8,background:B.cream,borderLeft:`3px solid ${B.accent}`,fontSize:9,fontFamily:"'Poppins',sans-serif",lineHeight:1.5}}>
              <b>Tipping point:</b> PN crosses federal majority at <b>~20% Malay swing</b> (114 seats). Below 20%, PN needs coalition partners (GPS/GRS). At 25%+, PN has a comfortable standalone majority. BN/UMNO is effectively destroyed at state level beyond 25% swing.
            </div>
          </div>
        </div>
      )}

      <div style={{textAlign:"center",marginTop:12,padding:6,fontSize:7,color:B.muted,borderTop:`1px solid ${B.border}`,fontFamily:"'Poppins',sans-serif",lineHeight:1.5}}>
        MECo (CC0) · DOSM Kawasanku Census 2020 · GE-15 + SE-15 (2021–2025) · Malay/Bumi vote swing only · Hypothetical
      </div>
    </div>
  );
}


