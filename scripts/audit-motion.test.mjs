import fs from 'node:fs';
import vm from 'node:vm';
import assert from 'node:assert/strict';
const source=fs.readFileSync('src/interactions.js','utf8');
const timers=new Map(), listeners={}, observers=[];
let serial=0;
function frame(text){
  const display={innerHTML:text,textContent:text};
  return {active:false,hidden:false,querySelector:()=>display,classList:{toggle(name,value){this.owner.active=value;}},setAttribute(name,value){if(name==='aria-hidden')this.hidden=value==='true';}};
}
const titles=['Primeira','Segunda','Terceira'].map(frame),descriptions=['Apoio 1','Apoio 2','Apoio 3'].map(frame);
[...titles,...descriptions].forEach(f=>f.classList.owner=f);
const heading={label:'',setAttribute(name,value){this.label=value;}};
const group={dataset:{textCycle:'hero',cycleInterval:'3000'},querySelectorAll:s=>s.startsWith('.cycle-title')?titles:descriptions,querySelector:()=>heading};
const preference={matches:true,addEventListener(name,callback){listeners.motion=callback;}};
const document={hidden:false,documentElement:{classList:{add(){}}},querySelectorAll:()=>[group],addEventListener(name,callback){listeners[name]=callback;}};
const context={document,window:{addEventListener(){}},matchMedia:()=>preference,IntersectionObserver:class{constructor(callback){observers.push(callback);}observe(){}},setTimeout(callback,delay){timers.set(++serial,{callback,delay});return serial;},clearTimeout:id=>timers.delete(id),cancelAnimationFrame(){},requestAnimationFrame(){throw Error('Unexpected decode animation');}};
vm.runInNewContext(source.slice(0,source.indexOf('const counters=')),context);
observers[0]([{isIntersecting:true}]);
assert.equal(timers.size,0,'Reduced motion must not schedule rotation');
assert.equal(titles[0].active,true);assert.equal(titles[1].hidden,true);assert.equal(descriptions[0].active,true);
preference.matches=false;listeners.motion();
assert.equal([...timers.values()][0].delay,3000);
for(const expected of [1,2,0]){
  const [id,timer]=[...timers][0];timers.delete(id);timer.callback();
  assert.equal(titles.findIndex(f=>f.active),expected);
  assert.equal(descriptions.findIndex(f=>f.active),expected);
  assert.equal(heading.label,['Primeira','Segunda','Terceira'][expected]);
}
document.hidden=true;listeners.visibilitychange();assert.equal(timers.size,0,'Hidden tab must stop timers');
document.hidden=false;listeners.visibilitychange();assert.equal(timers.size,1);
observers[0]([{isIntersecting:false}]);assert.equal(timers.size,0,'Offscreen text must stop timers');
preference.matches=true;listeners.motion();assert.equal(timers.size,0);assert.equal(titles[0].active,true);
console.log('PASS: synchronized 3-second loop, reduced motion, tab visibility and offscreen timers.');
