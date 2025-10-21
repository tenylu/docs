// content/salesiq.js
window.$zoho = window.$zoho || {};
$zoho.salesiq = $zoho.salesiq || { ready: function () {} };

(function () {
  if (document.getElementById('zsiqscript')) return;
  var s = document.createElement('script');
  s.id = 'zsiqscript';
  s.src = 'https://salesiq.zohopublic.com/widget?wc=siq661b3c690233e140e667eb2011f71bacbde8e0374600c18ca43af18d499fa838';
  s.defer = true;
  (document.body || document.head).appendChild(s);
})();