import assert from 'node:assert/strict';
import { parseOrderPersonalization } from '../convex/orderPersonalization.ts';

const uuid = '25466939-ce0a-440c-bcbc-ab8ca38f6f00';
const read = entries => entries.map(([name,value])=>({name,value}));
const contact = read([
  ['_lr_configuration_id',uuid],['Kontaktname','QA Contact'],['Firmenname','QA Studio'],
  ['Position','Beratung'],['E-Mail','qa@example.org'],['Telefon','+49 123 4567'],
  ['Website / vCard Link','https://example.org/shopify-qa'],['LinkedIn','https://www.linkedin.com/company/example'],
  ['Logo','https://cdn.shopify.com/s/files/1/1042/2085/2601/uploads/logo.png'],
  ['Titelbild','https://cdn.shopify.com/s/files/1/1042/2085/2601/uploads/cover.png'],
  ['Designvorlage','Signature'],['Akzentfarbe','Violet'],['Entwurfsprüfung gewünscht','Ja'],
]);
const result = parseOrderPersonalization(contact);
assert.deepEqual(result,{
  configurationId:uuid,contactName:'QA Contact',company:'QA Studio',role:'Beratung',
  email:'qa@example.org',phone:'+49 123 4567',website:'https://example.org/shopify-qa',
  qrTarget:undefined,address:undefined,instagram:undefined,
  linkedin:'https://www.linkedin.com/company/example',message:undefined,
  logoUrl:'https://cdn.shopify.com/s/files/1/1042/2085/2601/uploads/logo.png',
  coverImageUrl:'https://cdn.shopify.com/s/files/1/1042/2085/2601/uploads/cover.png',
  designTemplate:'Signature',accentColor:'Violet',proofRequested:true,layoutApproved:undefined,
});
const studio = parseOrderPersonalization(read([
  ['Kontaktname','Another Person'],['Firmenname','Another Company'],
  ['QR-Zieladresse','https://example.org/ratings'],['Artwork','https://cdn.shopify.com/s/files/1/10/uploads/a.png'],
  ['Designvorlage','review/noir/v2'],['Designfreigabe','Ja'],
]));
assert.equal(studio.qrTarget,'https://example.org/ratings');
assert.equal(studio.logoUrl,'https://cdn.shopify.com/s/files/1/10/uploads/a.png');
assert.equal(studio.layoutApproved,true);
assert.equal(studio.contactName,'Another Person');
const attack = parseOrderPersonalization(read([
  ['Kontaktname','<script>alert(1)</script>'],
  ['Logo','https://evil.example/uploads/cover.png'],
  ['Website','javascript:alert(1)'],
  ['QR-Zieladresse','http://insecure.example'],
  ['_lr_configuration_id','INVALID'],
  ['Instagram','https://u:p@example.org/'],
]));
assert.equal(attack.logoUrl,undefined);
assert.equal(attack.website,undefined);
assert.equal(attack.qrTarget,undefined);
assert.equal(attack.configurationId,undefined);
assert.equal(attack.instagram,undefined);
assert.equal(attack.contactName,'<script>alert(1)</script>'); // text remains raw for React escaping
assert.equal(parseOrderPersonalization(undefined),undefined);
assert.equal(parseOrderPersonalization([]),undefined);
assert.equal(parseOrderPersonalization([{name:'Secret Not Needed',value:'do not retain'}]),undefined);
const tooLarge=parseOrderPersonalization([{name:'Kontaktname',value:'a'.repeat(2049)}]);
assert.equal(tooLarge,undefined);
console.log('SMART_HUB_PROPERTIES_TESTS=PASS (mapped contact, review QR, artwork CDN, negative/security cases)');