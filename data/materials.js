/**
 * Echte, herleidbare bestratingsproducten (F01) — gekoppeld aan de onderzochte
 * regels in data/price-sources.json. Dit zijn echte artikelen van externe
 * leveranciers die als referentie zijn onderzocht, geen Sealcleaning-eigen
 * assortiment of inkoopprijzen (die zijn nog niet aangeleverd, zie
 * docs/IMPLEMENTATION_STATUS.md BLOCKERS). Kleur wordt bewust niet geraden:
 * alleen tonen wat op de bron geverifieerd is (naam, materiaalsoort, maat,
 * bron). Prijs wordt niet hier gedupliceerd maar live opgezocht via de
 * bijbehorende priceSourceId in price-sources.json, zodat er nooit twee
 * plekken zijn die uit de pas kunnen lopen.
 */

export const PAVING_VERIFIED_PRODUCTS = [
  {
    id: "product-excluton-terrastegel-plus-6060",
    priceSourceId: "price-excluton-terrastegel-plus-6060",
    label: "EXCLUTON Terrastegel Plus schelpkalk 60×60×4 cm",
    materialType: "schelpkalkbeton",
    lengthMm: 600,
    widthMm: 600,
    thicknessMm: 40,
    verifiedProduct: true
  },
  {
    id: "product-excluton-keramisch-madrid-6060",
    priceSourceId: "price-excluton-keramisch-madrid-6060",
    label: "EXCLUTON Keramische tuintegel Madrid 60×60×2 cm",
    materialType: "keramiek",
    lengthMm: 600,
    widthMm: 600,
    thicknessMm: 20,
    verifiedProduct: true
  },
  {
    id: "product-flairstone-garden-moon-6060",
    priceSourceId: "price-flairstone-garden-moon-6060",
    label: "FLAIRSTONE Garden moon 60×60×2 cm",
    materialType: "keramiek",
    lengthMm: 600,
    widthMm: 600,
    thicknessMm: 20,
    verifiedProduct: true
  }
];

export function getPavingProduct(productId) {
  return PAVING_VERIFIED_PRODUCTS.find((p) => p.id === productId) || null;
}

export function getPavingProductsForFormat(lengthMm, widthMm) {
  return PAVING_VERIFIED_PRODUCTS.filter((p) => p.lengthMm === lengthMm && p.widthMm === widthMm);
}
