'use client';

const BOL_PUBLISHER_ID = '1517373';
const BOL_BASE = 'https://partner.bol.com/click/click';
const SUB_ID = 'buitendrogen_bol_apr2026';
const TARGET_URL = 'https://www.bol.com/be/nl/s/?searchtext=wasrek+buiten';

function buildBolDeeplink(targetUrl: string, subId: string) {
  const params = new URLSearchParams();
  params.set('p', '1');
  params.set('t', 'url');
  params.set('s', BOL_PUBLISHER_ID);
  params.set('url', targetUrl);
  params.set('subid', subId);
  return `${BOL_BASE}?${params.toString()}`;
}

export default function BolAffiliateCard() {
  const href = buildBolDeeplink(TARGET_URL, SUB_ID);

  const handleClick = () => {
    if (typeof window === 'undefined') return;
    const w = window as unknown as { dataLayer?: Array<Record<string, unknown>> };
    w.dataLayer = w.dataLayer ?? [];
    w.dataLayer.push({
      event: 'click_outbound',
      affiliate_network: 'bol',
      affiliate_partner: 'bol_partners',
      site: 'buitendrogen.be',
      placement: 'under_result',
      sub_id: SUB_ID,
    });
  };

  return (
    <aside
      className="bg-gradient-to-br from-sky-50 to-cyan-50 border border-sky-200 rounded-2xl p-6"
      data-affiliate-network="bol"
      data-affiliate-partner="bol_partners"
    >
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-semibold text-sky-700 bg-sky-100 px-2 py-1 rounded-full">
          Tip
        </span>
        <span className="text-sm font-semibold text-gray-900">Wasrekken & droogrekken op Bol</span>
      </div>
      <p className="text-sm text-gray-700 mb-4">
        Op zoek naar een goed wasrek voor buiten? Bekijk de meest gekozen
        droogrekken op Bol.com.
      </p>
      <a
        href={href}
        rel="sponsored nofollow noopener"
        target="_blank"
        onClick={handleClick}
        className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white px-5 py-3 rounded-xl font-medium text-sm transition shadow-sm"
      >
        Bekijk op Bol.com
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </a>
      <p className="text-xs text-gray-500 mt-3">
        Affiliate-link — als je via deze link iets koopt ondersteun je deze site (kost jou niets extra).
      </p>
    </aside>
  );
}
