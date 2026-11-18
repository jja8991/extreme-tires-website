// Sample data shaped like real Wheel Pros responses (including a fake NIP so the price pipeline and the
// "cost never leaks" guarantee are exercised in mock mode too). Images are null placeholders.
'use strict';

const money = (msrp, nip, map) => ({
  msrp: [{ currencyAmount: msrp == null ? null : String(msrp), currencyCode: 'USD' }],
  nip: [{ currencyAmount: nip == null ? null : String(nip), currencyCode: 'USD' }],
  map: [{ currencyAmount: map == null ? null : String(map), currencyCode: 'USD' }],
});
const wheel = (sku, code, brand, model, d, w, off, bolt, finish, stock, prices) => ({
  sku, upc: null, skuType: 'WHEEL', title: model + ' ' + d + 'X' + w + ' ' + bolt + ' ' + finish + ' ' + off + 'MM',
  brand: { code, description: brand, parent: brand }, inventory: { type: 'ST', localStock: 0, globalStock: stock },
  properties: { model, offset: String(off), boltPattern: bolt, finish, width: String(w), diameter: String(d), centerbore: '78.10',
    tpmsCompatible: 1, structuralWarranty: 'LIFETIME', finishWarranty: 'ONE YEAR', loadRating: '2500', sizeDesc: d + 'X' + w },
  prices, images: [],
});
const tire = (sku, code, brand, model, sec, ar, rim, load, stock, prices) => ({
  sku, upc: null, skuType: 'TIRE', title: '' + sec + ar + 'R' + rim + ' ' + load + ' ' + model,
  brand: { code, description: brand, parent: brand }, inventory: { type: 'ST', localStock: 0, globalStock: stock },
  properties: { model, width: String(sec), aspectRatio: String(ar), wheelDiameter: String(rim) + '.0', loadIndexSpeed: load },
  prices, images: [],
});

const WHEELS = [
  wheel('MOCK-W-FU1', 'FU', 'Fuel Off-Road', 'D538 MAVERICK', 20, 9, 1, '6X135', 'MATTE BLACK', 24, money(398, 210.5, 289)),
  wheel('MOCK-W-FU2', 'FU', 'Fuel Off-Road', 'D610 REBEL', 20, 10, -18, '6X139.7', 'MATTE BRONZE', 2, money(436, 233.1, 315)),
  wheel('MOCK-W-XD1', 'XD', 'XD Series', 'XD820 GRENADE', 18, 9, 18, '5X114.3', 'SATIN BLACK', 40, money(249, 131.25, 189)),
  wheel('MOCK-W-XD2', 'XD', 'XD Series', 'XD861 STORM', 17, 9, 0, '6X139.7', 'SATIN BLACK', 0, money(229, 120.4, null)),
  wheel('MOCK-W-MO1', 'MO', 'Moto Metal', 'MO970', 20, 12, -44, '8X170', 'GLOSS BLACK MILLED', 12, money(359, 188.9, 259)),
  wheel('MOCK-W-AS1', 'AB', 'Asanti Black', 'ABL-12 ORION', 22, 10.5, 35, '5X112', 'GLOSS BLACK', 6, money(512, 270.75, 398)),
  wheel('MOCK-W-KM1', 'KM', 'KMC', 'KM541 DIRTY HARRY', 18, 8.5, 18, '5X127', 'TEXTURED BLACK', 3, money(null, 160.0, null)),
  wheel('MOCK-W-AM1', 'AR', 'American Racing', 'VN501 TORQ THRUST II', 17, 8, 0, '5X114.3', 'POLISHED', 18, money(305, 162.2, 239)),
];
const TIRES = [
  tire('MOCK-T-FK1', 'FK', 'Falken', 'WILDPEAK A/T3W', 275, 65, 18, '116T', 32, money(289, 168.4, 239)),
  tire('MOCK-T-FK2', 'FK', 'Falken', 'AZENIS FK510', 235, 35, 20, '92Y XL', 3, money(270, 151.2, 219)),
  tire('MOCK-T-NI1', 'NT', 'Nitto', 'RIDGE GRAPPLER', 35, 12, 20, '121Q', 8, money(455, 287.7, 389)),
  tire('MOCK-T-NI2', 'NT', 'Nitto', 'NT555 G2', 245, 40, 19, '98W XL', 0, money(239, 140.0, null)),
  tire('MOCK-T-MT1', 'MT', 'Mickey Thompson', 'BAJA BOSS A/T', 285, 70, 17, '121Q', 14, money(398, 249.9, 339)),
  tire('MOCK-T-GT1', 'GT', 'General', 'GRABBER A/TX', 265, 70, 17, '115T', 20, money(null, 132.6, null)),
];
// The 35x12.50R20 Ridge Grappler title is non-metric; give it explicit properties.
TIRES[2].title = '35X1250R20 121Q RIDGE GRAPPLER'; TIRES[2].properties.width = '12.5'; TIRES[2].properties.aspectRatio = '';

const BRANDS = {
  wheel: [['FU', 'Fuel Off-Road'], ['XD', 'XD Series'], ['MO', 'Moto Metal'], ['AB', 'Asanti Black'], ['KM', 'KMC'], ['AR', 'American Racing']],
  tire: [['FK', 'Falken'], ['NT', 'Nitto'], ['MT', 'Mickey Thompson'], ['GT', 'General']],
};
const VEHICLES = {
  makes: ['Chevrolet', 'Ford', 'GMC', 'Honda', 'Jeep', 'Ram', 'Tesla', 'Toyota'],
  models: { Ford: ['Bronco', 'F-150', 'F-250 Super Duty', 'Mustang', 'Ranger'], Toyota: ['4Runner', 'Camry', 'Corolla', 'Tacoma', 'Tundra'],
    Chevrolet: ['Colorado', 'Silverado 1500', 'Tahoe'], Jeep: ['Gladiator', 'Grand Cherokee', 'Wrangler'], Ram: ['1500', '2500'],
    Honda: ['Accord', 'Civic', 'CR-V'], GMC: ['Sierra 1500', 'Yukon'], Tesla: ['Model 3', 'Model Y'] },
  submodels: ['Base', 'Lariat', 'Limited', 'Platinum', 'Raptor', 'XLT'],
};

function years() { const y = new Date().getFullYear() + 1, out = []; for (let i = y; i >= 1990; i--) out.push(i); return out; }

module.exports = { WHEELS, TIRES, BRANDS, VEHICLES, years };
