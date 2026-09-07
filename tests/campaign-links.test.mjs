import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const html = readFileSync(new URL('../index.html', import.meta.url), 'utf8');
const script = readFileSync(new URL('../campaign-links.js', import.meta.url), 'utf8');
const anchors = [...html.matchAll(/<a\b[^>]*\bdata-app-store\b[^>]*>/g)];
const urls = anchors.map(([tag]) => tag.match(/href="([^"]+)"/)[1].replaceAll('&amp;', '&'));

test('all five download links work without JavaScript and point to the Brazilian App Store', () => {
  assert.equal(urls.length, 5);
  for (const href of urls) {
    const url = new URL(href);
    assert.equal(url.origin, 'https://apps.apple.com');
    assert.ok(url.pathname.startsWith('/br/app/'));
    assert.ok(url.pathname.endsWith('/id6758546862'));
    assert.equal(url.searchParams.get('pt'), '128504330');
    assert.equal(url.searchParams.get('ct'), 'fm_ios_site_v2_202609');
    assert.equal(url.searchParams.get('mt'), '8');
  }
});

for (const [query, expected] of [
  ['', 'fm_ios_site_v2_202609'],
  ['?campaign=meta_c01', 'fm_ios_meta_c01_202609'],
  ['?campaign=meta_c02', 'fm_ios_meta_c02_202609'],
  ['?campaign=unknown', 'fm_ios_site_v2_202609'],
  ['?campaign=__proto__', 'fm_ios_site_v2_202609'],
  ['?campaign=constructor', 'fm_ios_site_v2_202609'],
  ['?campaign=https%3A%2F%2Fevil.example', 'fm_ios_site_v2_202609'],
  ['?campaign=meta_c01&email=private%40example.com&fbclid=tracking', 'fm_ios_meta_c01_202609'],
]) {
  test(`safe campaign selection for ${query || 'default'}`, () => {
    const links = urls.map((href) => ({ href }));
    const context = {
      URL, URLSearchParams,
      window: { location: { search: query } },
      document: { querySelectorAll: (selector) => {
        assert.equal(selector, 'a[data-app-store]');
        return links;
      } },
    };
    vm.runInNewContext(script, context, { timeout: 1000 });
    for (const link of links) {
      const url = new URL(link.href);
      assert.equal(url.searchParams.get('ct'), expected);
      assert.equal(url.searchParams.get('pt'), '128504330');
      assert.equal(url.origin, 'https://apps.apple.com');
      assert.deepEqual([...url.searchParams.keys()].sort(), ['ct', 'mt', 'pt']);
    }
  });
}

test('all three promotional images are inside accessible links', () => {
  assert.match(html, /img\s*\{\s*height:\s*auto;/);
  const imageLinks = [...html.matchAll(/<a\b[^>]*class="image-link[^>]*>[\s\S]*?<\/a>/g)];
  assert.equal(imageLinks.length, 3);
  for (const [markup] of imageLinks) {
    assert.match(markup, /data-app-store/);
    assert.match(markup, /aria-label="Baixar Fecha Mês grátis/);
    assert.match(markup, /<img\b/);
  }
});

test('local assets exist, no remote scripts or forms, optional PRO is clear before the gallery', () => {
  for (const [, source] of html.matchAll(/\bsrc="([^"]+)"/g)) {
    assert.ok(!source.startsWith('http'));
    assert.ok(existsSync(fileURLToPath(new URL(`../${source}`, import.meta.url))));
  }
  assert.doesNotMatch(html, /<form\b/);
  assert.match(html.split('<main>')[0], /PRO opcional: compra única, sem assinatura/);
  assert.doesNotMatch(script, /\b(fetch|XMLHttpRequest|localStorage|sessionStorage|sendBeacon)\b|document\.cookie/);
});
