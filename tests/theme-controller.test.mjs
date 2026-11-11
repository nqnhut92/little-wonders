// Controller contract from the frontend-theme-behavior skill; run with `node --test`.
import test from 'node:test';
import assert from 'node:assert/strict';
import {createThemeController, themeLabel} from '../src/ui/theme-controller.js';
function setup(saved, blocked=false) {
  const windowEvents=new EventTarget(),media=new EventTarget();media.matches=false;
  let value=saved;const root={dataset:{},style:{}};
  globalThis.window=Object.assign(windowEvents,{matchMedia:()=>media});
  globalThis.document={documentElement:root,querySelector:()=>null};
  globalThis.localStorage={getItem(){if(blocked)throw Error('blocked');return value},setItem(k,v){if(blocked)throw Error('blocked');value=v}};
  const controller=createThemeController({storageKey:'theme'});
  const system=dark=>{media.matches=dark;media.dispatchEvent(new Event('change'))};
  const storage=next=>{value=next;const event=new Event('storage');Object.assign(event,{key:next===null?null:'theme'});windowEvents.dispatchEvent(event)};
  return{controller,root,system,storage,saved:()=>value};
}
test('all preferences cycle, persist, and System follows the live OS',()=>{
 const x=setup(null);assert.equal(x.root.dataset.themePreference,'system');
 x.system(true);assert.equal(x.root.dataset.theme,'dark');
 x.controller.cycle();assert.equal(x.saved(),'light');x.system(false);x.system(true);assert.equal(x.root.dataset.theme,'light');
 x.controller.cycle();assert.equal(x.root.dataset.themePreference,'dark');
 x.controller.cycle();assert.equal(x.saved(),'system');assert.equal(x.root.dataset.theme,'dark');
 x.system(false);assert.equal(x.root.style.colorScheme,'light');x.controller.destroy();
});
test('restore each preference, reject invalid values and synchronize tabs and clearing',()=>{
 for(const pref of ['system','light','dark']){const x=setup(pref);assert.equal(x.controller.state().preference,pref);x.controller.destroy()}
 const x=setup('invalid');assert.equal(x.controller.state().preference,'system');x.storage('dark');assert.equal(x.root.dataset.theme,'dark');x.storage(null);assert.equal(x.root.dataset.themePreference,'system');x.controller.destroy();
});
test('blocked storage preserves explicit choices and cleanup removes listeners',()=>{
 const x=setup(null,true);x.controller.choose('light');x.system(true);assert.equal(x.root.dataset.theme,'light');x.controller.choose('system');assert.equal(x.root.dataset.theme,'dark');x.controller.destroy();x.system(false);assert.equal(x.root.dataset.theme,'dark');
});
test('accessible labels announce current and next modes in both languages',()=>{
 assert.equal(themeLabel('system'),'Appearance: System. Switch to Light');assert.equal(themeLabel('dark','vi'),'Giao diện: Tối. Chuyển sang Theo hệ thống');
});
