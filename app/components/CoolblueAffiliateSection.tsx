'use client';

import { COOLBLUE_AFFILIATE_PRODUCTS, type CoolblueAffiliateProduct } from "../data/coolblueAffiliateProducts";
import type { MouseEvent } from "react";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: Array<Record<string, unknown>>;
  }
}

const AWIN_MID = "85165";
const AWIN_AFF_ID = "2630458";
const CTA_LABEL = "Bekijk bij Coolblue";

type CalcOutcome = "dry_possible" | "not_recommended" | "unknown";

function yyyymmddNow(): string {
  const d = new Date();
  const yyyy = d.getFullYear().toString();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}${mm}${dd}`;
}

function buildClickref(slot: number, sku: string): string {
  return `bdr_hp_calc_${slot}_${sku}_${yyyymmddNow()}`;
}

function buildSubid(slot: number, sku: string): string {
  return `bdr|homepage_below_calc|${slot}|${sku}`;
}

function buildAwinLink(product: CoolblueAffiliateProduct): string {
  const params = new URLSearchParams();
  params.set("awinmid", AWIN_MID);
  params.set("awinaffid", AWIN_AFF_ID);
  params.set("ued", product.productUrl);
  params.set("clickref", buildClickref(product.slot, product.sku));
  params.set("subid", buildSubid(product.slot, product.sku));
  return `https://www.awin1.com/cread.php?${params.toString()}`;
}

function hasAnalyticsConsent(): boolean {
  try {
    const raw = localStorage.getItem("cookieConsent");
    if (!raw) return false;
    const parsed = JSON.parse(raw) as { analytics?: boolean };
    return !!parsed.analytics;
  } catch {
    return false;
  }
}

interface CoolblueAffiliateSectionProps {
  calcOutcome: CalcOutcome;
}

export default function CoolblueAffiliateSection({ calcOutcome }: CoolblueAffiliateSectionProps) {
  const onAffiliateClick = (
    e: MouseEvent<HTMLAnchorElement>,
    product: CoolblueAffiliateProduct,
  ) => {
    if (typeof window === "undefined") return;
    if (!hasAnalyticsConsent()) return;

    const clickref = buildClickref(product.slot, product.sku);
    const subid = buildSubid(product.slot, product.sku);

    const payload = {
      merchant: "coolblue",
      product_sku: product.sku,
      placement: "homepage_below_calc",
      clickref,
      subid,
      card_position: product.slot,
      calc_outcome: calcOutcome,
    };

    const href = buildAwinLink(product);
    let opened = false;
    const openTarget = () => {
      if (opened) return;
      opened = true;
      window.open(href, "_blank", "noopener,noreferrer");
    };

    e.preventDefault();

    if (typeof window.gtag === "function") {
      const timer = window.setTimeout(openTarget, 350);
      window.gtag("event", "affiliate_click", {
        ...payload,
        event_callback: () => {
          window.clearTimeout(timer);
          openTarget();
        },
      });
      return;
    }

    window.dataLayer = window.dataLayer ?? [];
    window.dataLayer.push({ event: "affiliate_click", ...payload });
    openTarget();
  };

  return (
    <section className="bg-blue-50 border border-blue-100 rounded-2xl p-6 md:p-8">
      <p className="text-sm text-blue-900 mb-4">
        Reclame: onderstaande links zijn affiliate links. Als je via deze links koopt, kunnen wij een commissie
        ontvangen. Voor jou verandert de prijs niet.
      </p>
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-5">
        Goed weer? Dit heb je nodig om de was buiten te krijgen.
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {COOLBLUE_AFFILIATE_PRODUCTS.slice(0, 5).map((product) => {
          const href = buildAwinLink(product);
          return (
            <article key={product.sku} className="bg-white border border-blue-100 rounded-xl p-4 shadow-sm">
              <p className="text-xs font-semibold text-blue-700 mb-2">SKU {product.sku}</p>
              <h4 className="font-semibold text-gray-900 leading-snug mb-2">{product.name}</h4>
              <p className="text-sm text-gray-600 mb-4">{product.useCase}</p>
              <a
                href={href}
                target="_blank"
                rel="sponsored nofollow noopener"
                onClick={(e) => onAffiliateClick(e, product)}
                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
              >
                {CTA_LABEL}
              </a>
            </article>
          );
        })}
      </div>
    </section>
  );
}
