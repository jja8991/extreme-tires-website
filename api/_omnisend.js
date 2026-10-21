'use strict';
/**
 * Omnisend contact upsert (v3 contacts API). Not a route (leading underscore).
 * RE-VERIFY against current Omnisend docs when wiring (see docs file):
 * endpoint path/version, identifier + channels shape, status values,
 * and whether POST /contacts upserts by email/phone.
 */
const { fetchJson, logFailure } = require('./_lib');

const OMNISEND_CONTACTS_URL = 'https://api.omnisend.com/v3/contacts';

/**
 * @param {object} contact { identifiers, tags, customProperties, firstName?, lastName? }
 * @returns {Promise<{ok:boolean,status:number}>}
 */
async function upsertContact(contact) {
  const r = await fetchJson(OMNISEND_CONTACTS_URL, {
    method: 'POST',
    headers: {
      'X-API-KEY': process.env.OMNISEND_API_KEY,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(contact),
  });
  if (!r.ok) logFailure('omnisend', 'upsert failed status=' + r.status + (r.error ? ' ' + r.error : ''));
  return { ok: r.ok, status: r.status };
}

module.exports = { OMNISEND_CONTACTS_URL, upsertContact };
