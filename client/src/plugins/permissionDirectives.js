import Vue from 'vue';

export default function permissionDirectives(user) {
  Vue.directive('can', (el, binding, vnode) => {
    if(user.permissions.includes(binding.value)) {
      return vnode.elm.hidden = false;
    } else {
      return vnode.elm.hidden = true;
    }
  });
  
  Vue.directive('is', (el, binding, vnode) => {
    if(user.roles.indexOf(binding.value) !== -1) {
      return vnode.elm.hidden = false;
    } else {
      return vnode.elm.hidden = true;
    }
  });
}