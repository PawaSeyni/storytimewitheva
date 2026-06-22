import Seo from '../components/Seo';
import { useTranslation } from '../lib/language';

// Plain-language terms of use. Reflects how the site actually works: free
// activities for personal/classroom use, books sold via Amazon, contact form,
// affiliate links. Operator: Pawa Press Inc., Toronto, Ontario, Canada;
// governing law = Ontario (confirmed 2026-06-16). Have counsel review the
// governing-law / no-warranty wording before relying on it.

interface Section {
  heading: string;
  body: string[];
}

const TRANSLATIONS = {
  en: {
    seoTitle: 'Terms of Use',
    seoDesc:
      'The terms for using the Story Time with Eva website, free activities, and links to purchase books on Amazon.',
    title: 'Terms of Use',
    updated: 'Last updated: June 2026',
    intro:
      'Welcome! storytimewitheva.com is operated by Pawa Press Inc. By using the site you agree to these terms. They are written for parents, guardians, caregivers, and educators who use the site.',
    sections: [
      {
        heading: 'Using this site',
        body: [
          'You may use this site and its free activities for personal, family, and classroom use. Please do not resell our content or use it for commercial purposes without permission.',
        ],
      },
      {
        heading: 'Our books and content',
        body: [
          'The stories, characters, illustrations, and text of the Eva Gallo Collection are protected by copyright and remain our property or that of their respective owners. Free printable activities may be downloaded and used at home or in the classroom, but not sold or redistributed for profit.',
        ],
      },
      {
        heading: 'Buying books',
        body: [
          'Books are sold through Amazon. When you choose to buy, you leave our site and your purchase, payment, shipping, and returns are handled by Amazon under Amazon\'s own terms. We are not the seller and do not process your payment.',
        ],
      },
      {
        heading: 'Affiliate links',
        body: [
          'Links to Amazon on this site are affiliate links (Amazon Associates). If you buy through them, we may earn a small commission at no additional cost to you. This helps support the project.',
        ],
      },
      {
        heading: 'Messages you send us',
        body: [
          'When you contact us, please keep it respectful and do not send confidential or sensitive personal information. See our Privacy Policy for how we handle the information you provide.',
        ],
      },
      {
        heading: 'No warranties',
        body: [
          'The site and its activities are provided "as is". We do our best to keep everything accurate and working, but we cannot guarantee the site will always be available, error-free, or suitable for a particular purpose.',
        ],
      },
      {
        heading: 'External links',
        body: [
          'Our site links to other websites (such as Amazon and our social media). We are not responsible for the content or practices of those sites; their own terms and privacy policies apply.',
        ],
      },
      {
        heading: 'Governing law',
        body: [
          'Story Time with Eva is operated by Pawa Press Inc., a corporation based in Toronto, Ontario, Canada. These terms are governed by the laws of the Province of Ontario and the federal laws of Canada applicable there, without regard to conflict-of-laws rules. Any dispute will be subject to the courts located in Toronto, Ontario, Canada.',
        ],
      },
      {
        heading: 'Changes & contact',
        body: [
          'We may update these terms from time to time; the date above shows the latest version. Questions? Email contact@storytimewitheva.com.',
        ],
      },
    ] as Section[],
  },
  es: {
    seoTitle: 'Términos de uso',
    seoDesc:
      'Las condiciones para usar el sitio de Story Time with Eva, las actividades gratuitas y los enlaces para comprar libros en Amazon.',
    title: 'Términos de uso',
    updated: 'Última actualización: junio de 2026',
    intro:
      '¡Bienvenido/a! storytimewitheva.com es operado por Pawa Press Inc. Al usar el sitio aceptas estos términos. Están escritos para padres, tutores, cuidadores y educadores que usan el sitio.',
    sections: [
      {
        heading: 'Uso de este sitio',
        body: [
          'Puedes usar este sitio y sus actividades gratuitas para uso personal, familiar y en el aula. Por favor, no revendas nuestro contenido ni lo uses con fines comerciales sin permiso.',
        ],
      },
      {
        heading: 'Nuestros libros y contenido',
        body: [
          'Las historias, personajes, ilustraciones y textos de la Colección Eva Gallo están protegidos por derechos de autor y siguen siendo nuestra propiedad o la de sus respectivos dueños. Las actividades imprimibles gratuitas pueden descargarse y usarse en casa o en el aula, pero no venderse ni redistribuirse con fines de lucro.',
        ],
      },
      {
        heading: 'Compra de libros',
        body: [
          'Los libros se venden a través de Amazon. Cuando decides comprar, sales de nuestro sitio y tu compra, pago, envío y devoluciones los gestiona Amazon según sus propios términos. No somos el vendedor ni procesamos tu pago.',
        ],
      },
      {
        heading: 'Enlaces de afiliado',
        body: [
          'Los enlaces a Amazon en este sitio son enlaces de afiliado (Amazon Associates). Si compras a través de ellos, podemos ganar una pequeña comisión sin coste adicional para ti. Esto ayuda a sostener el proyecto.',
        ],
      },
      {
        heading: 'Mensajes que nos envías',
        body: [
          'Cuando nos contactas, por favor sé respetuoso/a y no envíes información personal confidencial o sensible. Consulta nuestra Política de privacidad para saber cómo tratamos la información que proporcionas.',
        ],
      },
      {
        heading: 'Sin garantías',
        body: [
          'El sitio y sus actividades se ofrecen "tal cual". Hacemos lo posible por mantener todo correcto y funcionando, pero no podemos garantizar que el sitio esté siempre disponible, libre de errores o sea adecuado para un fin concreto.',
        ],
      },
      {
        heading: 'Enlaces externos',
        body: [
          'Nuestro sitio enlaza a otros sitios web (como Amazon y nuestras redes sociales). No somos responsables del contenido ni de las prácticas de esos sitios; se aplican sus propios términos y políticas de privacidad.',
        ],
      },
      {
        heading: 'Ley aplicable',
        body: [
          'Story Time with Eva es operado por Pawa Press Inc., una sociedad con sede en Toronto, Ontario, Canadá. Estos términos se rigen por las leyes de la Provincia de Ontario y las leyes federales de Canadá aplicables en ella, sin tener en cuenta las normas sobre conflictos de leyes. Cualquier disputa se someterá a los tribunales ubicados en Toronto, Ontario, Canadá.',
        ],
      },
      {
        heading: 'Cambios y contacto',
        body: [
          'Podemos actualizar estos términos de vez en cuando; la fecha de arriba indica la última versión. ¿Preguntas? Escribe a contact@storytimewitheva.com.',
        ],
      },
    ] as Section[],
  },
  fr: {
    seoTitle: 'Conditions d\'utilisation',
    seoDesc:
      'Les conditions d\'utilisation du site Story Time with Eva, des activités gratuites et des liens pour acheter des livres sur Amazon.',
    title: 'Conditions d\'utilisation',
    updated: 'Dernière mise à jour : juin 2026',
    intro:
      'Bienvenue ! storytimewitheva.com est exploité par Pawa Press Inc. En utilisant le site, vous acceptez ces conditions. Elles sont rédigées pour les parents, tuteurs, accompagnants et enseignants qui utilisent le site.',
    sections: [
      {
        heading: 'Utilisation de ce site',
        body: [
          'Vous pouvez utiliser ce site et ses activités gratuites pour un usage personnel, familial et en classe. Merci de ne pas revendre notre contenu ni de l\'utiliser à des fins commerciales sans autorisation.',
        ],
      },
      {
        heading: 'Nos livres et notre contenu',
        body: [
          'Les histoires, personnages, illustrations et textes de la Collection Eva Gallo sont protégés par le droit d\'auteur et restent notre propriété ou celle de leurs détenteurs respectifs. Les activités imprimables gratuites peuvent être téléchargées et utilisées à la maison ou en classe, mais ne peuvent être vendues ni redistribuées à but lucratif.',
        ],
      },
      {
        heading: 'Achat de livres',
        body: [
          'Les livres sont vendus via Amazon. Lorsque vous choisissez d\'acheter, vous quittez notre site et votre achat, le paiement, la livraison et les retours sont gérés par Amazon selon ses propres conditions. Nous ne sommes pas le vendeur et ne traitons pas votre paiement.',
        ],
      },
      {
        heading: 'Liens affiliés',
        body: [
          'Les liens vers Amazon sur ce site sont des liens affiliés (Amazon Associates). Si vous achetez via ces liens, nous pouvons percevoir une petite commission sans coût supplémentaire pour vous. Cela aide à soutenir le projet.',
        ],
      },
      {
        heading: 'Les messages que vous nous envoyez',
        body: [
          'Lorsque vous nous contactez, merci de rester respectueux et de ne pas envoyer d\'informations personnelles confidentielles ou sensibles. Consultez notre politique de confidentialité pour savoir comment nous traitons les informations que vous fournissez.',
        ],
      },
      {
        heading: 'Aucune garantie',
        body: [
          'Le site et ses activités sont fournis « tels quels ». Nous faisons de notre mieux pour que tout soit exact et fonctionnel, mais nous ne pouvons garantir que le site sera toujours disponible, sans erreur ou adapté à un usage particulier.',
        ],
      },
      {
        heading: 'Liens externes',
        body: [
          'Notre site renvoie vers d\'autres sites (comme Amazon et nos réseaux sociaux). Nous ne sommes pas responsables du contenu ni des pratiques de ces sites ; leurs propres conditions et politiques de confidentialité s\'appliquent.',
        ],
      },
      {
        heading: 'Droit applicable',
        body: [
          'Story Time with Eva est exploité par Pawa Press Inc., une société établie à Toronto (Ontario), Canada. Les présentes conditions sont régies par les lois de la province de l\'Ontario et les lois fédérales du Canada qui y sont applicables, sans égard aux règles de conflits de lois. Tout litige sera soumis aux tribunaux situés à Toronto (Ontario), Canada.',
        ],
      },
      {
        heading: 'Modifications et contact',
        body: [
          'Nous pouvons mettre à jour ces conditions de temps à autre ; la date ci-dessus indique la dernière version. Des questions ? Écrivez à contact@storytimewitheva.com.',
        ],
      },
    ] as Section[],
  },
};

export default function Terms() {
  const t = useTranslation(TRANSLATIONS);

  return (
    <main>
      <Seo title={t.seoTitle} description={t.seoDesc} path="/terms" />

      <section className="bg-gradient-to-b from-purple-50 to-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">📜</div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">{t.title}</h1>
          <p className="text-gray-400 text-sm">{t.updated}</p>
        </div>
      </section>

      <section className="py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <p className="text-gray-600 leading-relaxed mb-8">{t.intro}</p>
          <div className="space-y-8">
            {t.sections.map((section, i) => (
              <div key={i}>
                <h2 className="text-xl font-bold text-gray-800 mb-2">{section.heading}</h2>
                {section.body.map((para, j) => (
                  <p key={j} className="text-gray-600 leading-relaxed mb-3">{para}</p>
                ))}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
