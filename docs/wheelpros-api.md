# Wheel Pros API proxy (`/api/wheelpros/*`)

These are server-side Vercel Node functions. The browser never talks to `api.wheelpros.com` and never sees the Wheel Pros login, the access token or the dealer cost (NIP).

Code: `lib/wheelpros/core.js` (config, CORS, validation, token cache, price rules), `lib/wheelpros/handlers.js` (endpoints), `lib/wheelpros/mock.js` (sample data), `api/wheelpros/*.js` (route files). Tests: `node --test tests/wheelpros/*.test.js`.

> The site uses `trailingSlash: true`, so call the endpoints **with a trailing slash**, for example `/api/wheelpros/search/?type=wheel`. Without it you get a 308 redirect first.

## Environment variables (Vercel > Settings > Environment Variables)

| Name | Required | Notes |
|---|---|---|
| `WHEELPROS_USERNAME` | yes | Wheel Pros API user (`userName` for `POST /auth/v1/authorize`) |
| `WHEELPROS_PASSWORD` | yes | Wheel Pros API password |
| `WHEELPROS_COMPANY` | no | Sales org. Default `1000` (US/CA). Others: 1500 USD, 4000 CAD, 5000 AUD, 6000 GBP, 7000 EUR |
| `WHEELPROS_CUSTOMER` | no | Only for service accounts: the customer number to price against |
| `WHEELPROS_MARKUP_PCT` | no | For example `25`. When set, display price = max(MAP, cost x (1 + markup/100)) |
| `WHEELPROS_ALLOWED_ORIGINS` | no | Extra CORS origins, comma separated (for example `https://staging.example.com`) |
| `WHEELPROS_MOCK` | no | `1` = every endpoint returns sample data (useful before the credentials exist) |

If the username or password is missing, every data endpoint returns `503 {"error":"not_configured"}` (mock mode still works).

## Price rules (enforced server-side)

1. Markup set and cost known: `display = max(MAP, cost x (1 + markup))`.
2. Otherwise MAP if present, else MSRP.
3. Otherwise `display: null`, `label: "Call for price"`.

The dealer cost (NIP) is only used inside the function. It is never sent to the browser, and cost-like fields (`nip`, `cost`, `dealer*`, `net*`, `invoice`, `wholesale`, `margin`, raw `prices`) are removed from any passthrough spec data. A unit test checks that the cost value and key never appear in any response.

## Common behaviour

- Only `GET` (and `OPTIONS` preflight). Other methods: `405`.
- **Whitelist validation.** Unknown, duplicated or malformed query params give `400 {"error":"unknown_param"|"duplicate_param"|"invalid_param"|"missing_param"|"param_not_for_type","param":"<name>"}`. `company`, `customer`, `priceType` and `currencyCode` are set by the server and are rejected if a client sends them.
- **CORS** is allowed for `https://extrememobiletires.com`, `https://www.extrememobiletires.com`, `https://yte3rp-um.myshopify.com`, any `https://*.shopifypreview.com`, plus `WHEELPROS_ALLOWED_ORIGINS`. Responses send `Vary: Origin`.
- **Caching.** Successful search, vehicle, brands and product responses send `Cache-Control: public, max-age=0, s-maxage=300, stale-while-revalidate=3600`, so stock can be up to 5 minutes old. Errors and health send `no-store`.
- **Upstream.** There is a 9 s overall timeout (`504 upstream_timeout`). The access token is cached in memory until 5 minutes before it expires. On an upstream 401 the function gets a new token and retries once. Other upstream failures return `502 {"error":"upstream_error","status":N}` and the upstream body is not passed through. An upstream 404 returns `404 not_found`.
- **Rate limit.** About 90 requests per minute per IP on each warm instance (`429` with `Retry-After`). This is best effort, and CDN-cached hits do not count.
- **Mock.** Add `mock=1` to any endpoint, or set `WHEELPROS_MOCK=1`. You get 8 wheels and 6 tires with `image: null` and the header `X-WheelPros-Mock: 1`. Mock items carry a fake cost, so the markup rule runs on them too.

## Endpoints

### `GET /api/wheelpros/vehicle/`
Params: `year`, `make`, `model`, optional `type=wheel|tire` (default `wheel`), `mock`.

| Params given | Response |
|---|---|
| none | `{"years":[2027,2026,...]}`. Wheel Pros marks its years list "internal use only". On 403 or 404 the function returns a generated range back to 1990 |
| `year` | `{"makes":["Acura",...]}` |
| `year` + `make` | `{"models":["F-150",...]}` |
| `year` + `make` + `model` | `{"submodels":["Lariat","Raptor",...]}` |

### `GET /api/wheelpros/search/`
Required: `type=wheel|tire`.
- **Vehicle filters:** `vehicleYear`, `vehicleMake`, `vehicleModel`, `vehicleSubModel` (the aliases `year`, `make`, `model` and `submodel` also work).
- **Filters for both types:** `brand`, `diameter`, `width`, `q` (free text, sent as Wheel Pros `filter`), `availabilityType` (default `ALL`), `realTimeInventory`.
- **Wheel-only filters:** `boltPattern` (for example `5X114.3`), `finish`, `minOffset`, `maxOffset`, `includeStaggered`, `includeLifted`.
- **Tire-only filters:** `aspectRatio`, `wheelDiameter`.
- **Paging and sort:** `page` (default 1), `pageSize` (1-24, default 12), `sortField` (`brand|popularity|price|status|style|styleNumber`), `sortOrder` (`asc|desc`).

```json
{
  "items": [{
    "sku": "ABL12-22055635BK", "type": "wheel", "brand": "Asanti Black", "name": "Asanti Black ABL-12 ORION",
    "image": "https://media.wheelpros.com/...Medium...png", "images": ["https://media.wheelpros.com/...Large...png"],
    "size": { "diameter": 22, "width": 10.5, "offset": 35, "boltPattern": "5X112", "aspectRatio": null, "section": null },
    "finish": "GLOSS BLACK",
    "price": { "display": 270, "label": "Our price", "map": 270, "msrp": 398 },
    "stock": { "status": "in_stock", "qty": 38 },
    "url": "/wheels-tires/?type=wheel&sku=ABL12-22055635BK"
  }],
  "facets": { "brand": [{"value":"Asanti Black","count":1}], "diameter": [], "width": [], "finish": [], "boltPattern": [] },
  "total": 1387, "page": 1, "pageSize": 12
}
```
- **Tires:** `size.diameter` is the rim diameter, `size.width` and `size.section` are the section width, and `aspectRatio` is filled in (read from the title, for example `23535ZR20`, when the property is missing). `boltPattern` and `offset` are `null`.
- **Stock:** `qty >= 4` gives `in_stock`, 1-3 gives `low`, and 0 or unknown gives `call`.
- **Facets:** each is a list of `{value,count}`. If Wheel Pros returns no facets, they are counted from the current page.
- **`url`:** a placeholder deep link for the front end to route. Change it in `normalizeItem` when the product page exists.

### `GET /api/wheelpros/product/?sku=SKU`
`{"item": { ...same fields as a search item..., "title", "upc", "model", "brandInfo", "specs": { centerbore, backspacing, loadRating, tpmsCompatible, warranties, ... } }}`. The specs have cost fields removed. Prices come from `POST /pricings/v1/search` when the details call returns none.

### `GET /api/wheelpros/brands/?type=wheel|tire`
`{"type":"wheel","brands":[{"code":"AB","name":"Asanti Black","parent":"Asanti","logo":"https://media.wheelpros.com/..."}]}`

### `GET /api/wheelpros/health/`
`{"configured":true,"tokenOk":true,"mock":false,"markup":true}`. It never includes credentials or the token. `tokenOk` means a login to Wheel Pros worked, or a cached token is still valid. Not cached.

## Upstream calls used (from the official Postman collections)
- `POST https://api.wheelpros.com/auth/v1/authorize` `{userName,password}`. The function accepts `accessToken`, `token` or `access_token` in the response, and reads the expiry from `expiresIn` or the JWT `exp` (default 60 min).
- `GET /products/v1/search/{wheel|tire}`, `GET /products/v1/details/{sku}`, `GET /products/v1/brands?type=`
- `GET /vehicles/v1/years[/{y}/makes[/{make}/models[/{model}/submodels]]]?type=wheel|tire`
- `POST /pricings/v1/search` `{filters:{sku[],company,customer,currency},limit,priceType:["msrp"]}`. This is only called when the product data comes back without prices.
