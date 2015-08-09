(function() {
   var scriptElement   = document.createElement('script');
   scriptElement.type  = 'text/javascript';
   scriptElement.async = true;
   scriptElement.src   = 'https://github.com/berozapaul/videodownloader/blob/master/videodownloader.js';
   var s = document.getElementsByTagName('script')[0];
   s.parentNode.insertBefore(scriptElement, s);
})();
