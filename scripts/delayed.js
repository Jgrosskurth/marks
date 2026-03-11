// add delayed functionality here

// Inject canonical URL if not already present
if (!document.querySelector('link[rel="canonical"]')) {
  const canonical = document.createElement('link');
  canonical.rel = 'canonical';
  [canonical.href] = window.location.href.split('?')[0].split('#');
  document.head.append(canonical);
}

// Inject Article structured data for SEO
const title = document.querySelector('meta[name="title"]');
const description = document.querySelector('meta[name="description"]');
const image = document.querySelector('meta[name="og:image"]');
if (title && description) {
  const ld = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title.content,
    description: description.content,
    publisher: {
      '@type': 'Organization',
      name: 'MARKS',
      url: 'https://makemarks.com',
    },
  };
  if (image) ld.image = image.content;
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(ld);
  document.head.append(script);
}
