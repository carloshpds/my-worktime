import jquery from 'jquery'

(function($) {
  $.fn.observe = function(cb, e) {
    e = e || { subtree:true, childList:true, characterData:true };
    $(this).each(function() {
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const node = this;
      function callback(changes) { cb.call(node, changes, this); }

      (new MutationObserver(callback)).observe(node, e);
    });
  };
})(jquery)