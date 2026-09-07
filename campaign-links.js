// Only these public campaign names may be propagated to the App Store.
// No cookies, storage, fingerprinting, pixel, or network requests are used here.
(() => {
  const campaignNames = Object.freeze({
    meta_c01: 'fm_ios_meta_c01_202609',
    meta_c02: 'fm_ios_meta_c02_202609',
  });
  const source = new URLSearchParams(window.location.search).get('campaign');
  const campaign = Object.prototype.hasOwnProperty.call(campaignNames, source)
    ? campaignNames[source]
    : 'fm_ios_site_v2_202609';

  document.querySelectorAll('a[data-app-store]').forEach((link) => {
    const destination = new URL(link.href);
    destination.searchParams.set('ct', campaign);
    link.href = destination.href;
  });
})();
