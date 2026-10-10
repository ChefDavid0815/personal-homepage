// AXIOM: Figure 01 becomes a working instrument. Drag an observation (or focus it and use the arrow
// keys) and the least-squares line, the gradient triangle, k and R² recompute, as in AXIOM itself.
import {getLanguage} from './i18n.js';

const X0=40,PXM=2600,Y0=230,PXN=31;
const px=x=>X0+x*PXM,py=f=>Y0-f*PXN,fy=y=>(Y0-y)/PXN;
function ols(xs,ys){
  const n=xs.length,mx=xs.reduce((a,b)=>a+b)/n,my=ys.reduce((a,b)=>a+b)/n;
  let sxy=0,sxx=0,syy=0;for(let i=0;i<n;i++){sxy+=(xs[i]-mx)*(ys[i]-my);sxx+=(xs[i]-mx)**2;syy+=(ys[i]-my)**2;}
  const m=sxy/sxx,b=my-m*mx,r2=syy?sxy*sxy/(sxx*syy):1;return {m,b,r2};
}
function mount(fig){
  if(fig.dataset.fit)return;fig.dataset.fit='on';
  const svg=fig.querySelector('.axiom-plot');if(!svg)return;
  const en=getLanguage()==='en';
  fig.removeAttribute('aria-hidden');svg.removeAttribute('aria-hidden');svg.setAttribute('role','group');
  svg.setAttribute('aria-label',en?'Hooke’s law figure: drag an observation or use the arrow keys to move it':'胡克定律示例图：拖动观测点，或用方向键调整');
  const groups=[...svg.querySelectorAll('.axiom-observations>g')],original=[],xs=[],ys=[];
  groups.forEach((g,i)=>{const c=g.querySelector('circle');xs.push((+c.getAttribute('cx')-X0)/PXM);ys.push(fy(+c.getAttribute('cy')));original.push(ys[i]);
    g.setAttribute('tabindex','0');g.setAttribute('role','slider');g.setAttribute('aria-valuemin','0');g.setAttribute('aria-valuemax','7');
    g.setAttribute('aria-label',en?`Observation ${i+1}, x = ${xs[i].toFixed(2)} m`:`观测点 ${i+1}，x = ${xs[i].toFixed(2)} m`);});
  const fit=svg.querySelector('.axiom-fit'),tri=svg.querySelector('.axiom-gradient'),label=svg.querySelector('.axiom-gradient-label');
  const read=document.createElement('div');read.className='axx-readout';read.innerHTML=`<p aria-live="polite"></p><button type="button">${en?'Reset data':'复位数据'}</button>`;
  svg.after(read);const out=read.querySelector('p'),reset=read.querySelector('button');
  function render(){
    const {m,b,r2}=ols(xs,ys),xa=0,xb=.125,x1=.04,x2=.1;
    fit.setAttribute('d',`M${px(xa)} ${py(m*xa+b).toFixed(2)}L${px(xb)} ${py(m*xb+b).toFixed(2)}`);
    tri.setAttribute('d',`M${px(x1)} ${py(m*x1+b).toFixed(1)}H${px(x2)}V${py(m*x2+b).toFixed(1)}`);
    label.setAttribute('x',String((px(x1)+px(x2))/2-28));label.setAttribute('y',String(py(m*x1+b)+21));
    groups.forEach((g,i)=>{const y=py(ys[i]),x=px(xs[i]);g.querySelector('circle').setAttribute('cy',y.toFixed(1));g.querySelector('path').setAttribute('d',`M${x-4} ${y.toFixed(1)}h8M${x} ${(y-4).toFixed(1)}v8`);g.setAttribute('aria-valuenow',ys[i].toFixed(2));g.setAttribute('aria-valuetext',`F = ${ys[i].toFixed(2)} N`);});
    out.innerHTML=`<span>k = <b>${m.toFixed(2)}</b> N/m</span><span>F = ${m.toFixed(2)}x ${b<0?'−':'+'} ${Math.abs(b).toFixed(3)}</span><span>R² = <b>${r2.toFixed(4)}</b></span>`;
    fig.classList.toggle('is-edited',ys.some((v,i)=>Math.abs(v-original[i])>.001));
  }
  let drag=-1;
  const toLocal=e=>{const p=svg.createSVGPoint();p.x=e.clientX;p.y=e.clientY;return p.matrixTransform(svg.getScreenCTM().inverse());};
  groups.forEach((g,i)=>{
    g.addEventListener('pointerdown',e=>{drag=i;g.setPointerCapture(e.pointerId);g.classList.add('is-dragging');e.preventDefault();});
    g.addEventListener('pointermove',e=>{if(drag!==i)return;ys[i]=Math.max(0,Math.min(7,fy(toLocal(e).y)));render();});
    const end=e=>{if(drag!==i)return;drag=-1;g.classList.remove('is-dragging');if(g.hasPointerCapture(e.pointerId))g.releasePointerCapture(e.pointerId);};
    g.addEventListener('pointerup',end);g.addEventListener('pointercancel',end);
    g.addEventListener('keydown',e=>{const d={ArrowUp:.1,ArrowRight:.1,ArrowDown:-.1,ArrowLeft:-.1,PageUp:.5,PageDown:-.5}[e.key];if(d===undefined)return;e.preventDefault();ys[i]=Math.max(0,Math.min(7,ys[i]+d));render();});
  });
  reset.addEventListener('click',()=>{original.forEach((v,i)=>ys[i]=v);render();});
  render();
}
const scan=()=>document.querySelectorAll('.axx-figure').forEach(mount);
let queued=false;new MutationObserver(()=>{if(queued)return;queued=true;requestAnimationFrame(()=>{queued=false;scan();});}).observe(document.documentElement,{childList:true,subtree:true});
requestAnimationFrame(scan);
