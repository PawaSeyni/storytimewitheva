import { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { Link } from '../components/LocalizedLink';
import Seo from '../components/Seo';
import JsonLd from '../components/JsonLd';
import Breadcrumbs, { breadcrumbSchema } from '../components/Breadcrumbs';
import EmailSignup from '../components/EmailSignup';
import GuideLinks from '../components/GuideLinks';
import ReadAloudButton from '../components/ReadAloudButton';
import SaveResourceButton from '../components/SaveResourceButton';
import NotFound from './NotFound';
import { localizePath, useLanguage, useTranslation } from '../lib/language';
import { resources, resourcePath } from '../data/resources';
import { articleBody, hasAffiliateLinks, type BodyPart, type Section } from '../data/articleBodies';

// One parent guide per page at /resources/<slug> (and /es/…, /fr/…). Identity, card
// metadata and the related themes/printables come from the resource registry; the
// long-form body comes from src/data/articleBodies.ts. Until this page existed the six
// guides were anchors on /resources, so search engines saw one URL for six topics.
const SITE_URL = 'https://storytimewitheva.com';
const ARTICLES = resources.filter((r) => r.kind === 'article');

const TRANSLATIONS = {
  en: {
    homeCrumb: 'Home',
    resourcesCrumb: 'Parent Resources',
    moreGuides: 'More parent guides',
    allGuides: 'All parent resources',
    savedAria: 'Save this guide',
    disclosure: {
      heading: 'A note on affiliate links',
      body: 'This page contains affiliate links. If you purchase through these links I may earn a small commission at no extra cost to you. I only recommend products I genuinely use and trust.',
      amazon: 'As an Amazon Associate I earn from qualifying purchases.',
    },
  },
  es: {
    homeCrumb: 'Inicio',
    resourcesCrumb: 'Recursos para padres',
    moreGuides: 'Más guías para padres',
    allGuides: 'Todos los recursos para padres',
    savedAria: 'Guardar esta guía',
    disclosure: {
      heading: 'Sobre los enlaces de afiliados',
      body: 'Esta p\xe1gina contiene enlaces de afiliados. Si compras a trav\xe9s de ellos, podemos ganar una peque\xf1a comisi\xf3n sin coste adicional para ti. Solo recomendamos productos que de verdad usamos y nos gustan.',
      amazon: 'Como afiliados de Amazon, ganamos con compras que cumplen los requisitos.',
    },
  },
  fr: {
    homeCrumb: 'Accueil',
    resourcesCrumb: 'Ressources pour parents',
    moreGuides: 'Plus de guides pour parents',
    allGuides: 'Toutes les ressources pour parents',
    savedAria: 'Enregistrer ce guide',
    disclosure: {
      heading: '\xc0 propos des liens affili\xe9s',
      body: 'Cette page contient des liens affili\xe9s. Si vous achetez via ces liens, nous pouvons gagner une petite commission sans co\xfbt suppl\xe9mentaire pour vous. Nous ne recommandons que des produits que nous utilisons r\xe9ellement.',
      amazon: 'En tant qu’affili\xe9 Amazon, nous percevons une commission sur les achats \xe9ligibles.',
    },
  },
};

// Affiliate link -- rel="sponsored noopener" + target="_blank" + a small
// "(affiliate)" badge for FTC clarity. The tag itself is appended in lib/amazon.
function AffiliateLink({ href, children }: { href: string; children: React.ReactNode }) {
  const { language } = useLanguage();
  const badge = language === 'es' ? '(afiliado)' : language === 'fr' ? '(affilié)' : '(affiliate)';
  return (
    <a
      href={href}
      target="_blank"
      rel="sponsored noopener noreferrer"
      className="text-amber-700 hover:text-amber-900 underline decoration-amber-300 hover:decoration-amber-700 underline-offset-2 font-medium"
    >
      {children}
      <span className="ml-1 text-xs text-amber-800">{badge}</span>
    </a>
  );
}

function renderBody(parts: BodyPart[]) {
  return parts.map((p, i) =>
    typeof p === 'string' ? <span key={i}>{p}</span> : <AffiliateLink key={i} href={p.href}>{p.text}</AffiliateLink>,
  );
}

function Sections({ sections }: { sections: Section[] }) {
  return (
    <>
      {sections.map((s, i) => (
        <section key={i}>
          <h2 className="text-xl font-bold text-gray-800 mb-2">{s.title}</h2>
          <p>{renderBody(s.body)}</p>
        </section>
      ))}
    </>
  );
}

export default function Article() {
  const { slug = '' } = useParams<{ slug: string }>();
  const { language } = useLanguage();
  const t = useTranslation(TRANSLATIONS);

  const resource = ARTICLES.find((r) => r.slug === slug);
  const body = articleBody(slug, language);
  const path = `/resources/${slug}`;

  // schema.org Article: the same URL the canonical names (localized, trailing slash).
  // No datePublished: the guides carry no real publication date and inventing one
  // would be worse than omitting it.
  const articleLd = useMemo(() => {
    if (!resource || !body) return null;
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: resource.title[language],
      description: resource.description[language],
      inLanguage: language,
      author: { '@type': 'Person', name: 'Eva Gallo' },
      publisher: { '@type': 'Organization', name: 'Pawa Press Inc.' },
      url: `${SITE_URL}${localizePath(path, language)}/`,
      mainEntityOfPage: `${SITE_URL}${localizePath(path, language)}/`,
      isAccessibleForFree: true,
      ...(resource.minutes ? { timeRequired: `PT${resource.minutes}M` } : {}),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, language]);

  const crumbs = resource
    ? [
        { label: t.homeCrumb, to: '/' },
        { label: t.resourcesCrumb, to: '/resources' },
        { label: resource.title[language], to: path },
      ]
    : null;
  const breadcrumbLd = useMemo(
    () => (crumbs ? breadcrumbSchema(crumbs, language) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [slug, language, t.homeCrumb, t.resourcesCrumb],
  );

  // Unknown slug -> real (noindex) 404 rather than a blank page.
  if (!resource || !body || !crumbs) return <NotFound />;

  const others = ARTICLES.filter((r) => r.slug !== slug);

  return (
    <main className="py-8 px-4">
      <Seo title={resource.title[language]} description={resource.description[language]} path={path} />
      {articleLd && <JsonLd id="article" data={articleLd} />}
      {breadcrumbLd && <JsonLd id="breadcrumb" data={breadcrumbLd} />}

      <div className="max-w-3xl mx-auto">
        <Breadcrumbs crumbs={crumbs} className="mb-6" />

        {/* FTC affiliate disclosure -- above the content, only on guides that carry affiliate links. */}
        {hasAffiliateLinks(body) && (
          <aside data-affiliate-disclosure="article" className="bg-amber-50 border border-amber-200 rounded-2xl px-4 py-3 text-sm text-amber-900 mb-8">
            <p className="font-semibold mb-1">{t.disclosure.heading}</p>
            <p className="leading-relaxed">{t.disclosure.body}</p>
            <p className="leading-relaxed mt-1 italic">{t.disclosure.amazon}</p>
          </aside>
        )}

        <article id={slug}>
          <header className="mb-8">
            <div className="flex items-start justify-between gap-4">
              <p className="text-xs uppercase tracking-wider text-amber-700 font-semibold mb-2">
                {resource.emoji && <span aria-hidden>{resource.emoji} </span>}
                {body.eyebrow}
              </p>
              <SaveResourceButton resourceId={resource.id} />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-3 leading-tight">{body.title}</h1>
            <p className="text-gray-600 text-lg leading-relaxed">{body.intro}</p>
            <div className="mt-3">
              <ReadAloudButton text={body.intro} compact />
            </div>
          </header>

          <div className="space-y-6 text-gray-700 leading-relaxed">
            {body.sections && <Sections sections={body.sections} />}
            {body.choices && <Sections sections={body.choices} />}
            {body.skip && (
              <section>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{body.skip.title}</h2>
                <ul className="list-disc pl-6 space-y-2">
                  {body.skip.items.map((item, i) => (
                    <li key={i}>
                      <strong>{item.lead}</strong> {item.rest}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>

          <GuideLinks slug={slug} />
        </article>

        {/* Every guide links every other guide, so no article page is an orphan in any language. */}
        <nav aria-labelledby="more-guides" className="mt-12 pt-8 border-t border-gray-100">
          <h2 id="more-guides" className="text-2xl font-bold text-gray-800 mb-4">{t.moreGuides}</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {others.map((r) => (
              <li key={r.id}>
                <Link to={resourcePath(r)} className="block h-full bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 p-5 transition-shadow">
                  <span className="text-2xl" aria-hidden>{r.emoji}</span>
                  <span className="block font-bold text-gray-800 mt-2 leading-snug">{r.title[language]}</span>
                  <span className="block text-sm text-gray-500 mt-1 leading-relaxed">{r.description[language]}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6">
            <Link to="/resources" className="font-semibold text-purple-600 hover:text-purple-800">← {t.allGuides}</Link>
          </p>
        </nav>
      </div>

      <EmailSignup placement="resources" />
    </main>
  );
}
