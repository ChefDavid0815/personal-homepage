// Folio: the loose pages turn like a journal. Choosing an index entry lifts the old top page off its
// spine (a 3D page turn) before it settles back into the stack; hovering fans the pages slightly.
import {isMotionPaused} from './motion-state.js';
document.addEventListener('click',e=>{
  const button=e.target.closest?.('[data-fox-show]');if(!button||isMotionPaused())return;
  const stack=button.closest('.xr--folio')?.querySelector('.fox-stack');if(!stack||stack.dataset.foxFront===button.dataset.foxShow)return;
  const old=stack.querySelector(`[data-fox-page="${stack.dataset.foxFront}"]`),next=stack.querySelector(`[data-fox-page="${button.dataset.foxShow}"]`);
  if(old){old.style.zIndex='5';const a=old.animate([{transform:'perspective(1800px) translate(0,0) rotateY(0deg)',filter:'brightness(1)'},{transform:'perspective(1800px) translate(-6%,-3%) rotateY(-62deg)',filter:'brightness(.86)',offset:.45},{transform:'perspective(1800px) translate(-2%,2%) rotateY(-8deg)',filter:'brightness(.97)',offset:.8},{transform:'translate(var(--x),var(--y)) rotate(var(--r))',filter:'brightness(1)'}],{duration:1050,easing:'cubic-bezier(.45,0,.2,1)'});
    old.style.transformOrigin='0% 50%';a.finished.catch(()=>{}).then(()=>{old.style.zIndex='';old.style.transformOrigin='';});}
  if(next)next.animate([{filter:'brightness(.92)'},{filter:'brightness(1)'}],{duration:900,easing:'ease-out'});
},true);
