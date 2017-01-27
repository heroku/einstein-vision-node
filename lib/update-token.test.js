const test = require('ava');
const updateToken = require('./update-token');
const oAuthToken = require('./oauth-token');
const rp = require('request-promise');

test('updateToken gets access token', t=> {
  const pvsUrl = 'http://pvs.example.com/';
  const accountId = 'yyyyy-account-id';
  const privateKey = getPrivateKey();

  const subject = updateToken(pvsUrl, accountId, privateKey);

  let yielded = subject.next();
  t.is(yielded.value.fn, rp.post);
  t.is(yielded.value.args[0].url, 'http://pvs.example.com/v1/oauth2/token');
  t.is(yielded.value.args[0].method, 'POST');
  t.truthy(
    /^grant_type=urn:ietf:params:oauth:grant-type:jwt-bearer&assertion=[a-z0-9_%\-\.]+$/i
      .exec(yielded.value.args[0].body));

  yielded = subject.next('{"access_token":"new-access-token"}');
  t.true(yielded.done);
  t.is(yielded.value, 'new-access-token');
});

test('updateToken sets into oAuthToken module', t=> {
  const pvsUrl = 'http://pvs.example.com/';
  const accountId = 'yyyyy-account-id';
  const privateKey = getPrivateKey();

  oAuthToken.set(null);
  t.falsy(oAuthToken.get());

  const subject = updateToken(pvsUrl, accountId, privateKey);

  subject.next();
  subject.next('{"access_token":"new-access-token"}');

  t.is(oAuthToken.get(), "new-access-token");
});


function getPrivateKey() {
  return `-----BEGIN RSA PRIVATE KEY-----
MIIEpAIBAAKCAQEApu1gji+d5q5RBK04AxV7cWi6SbbypunCeWsWlhVFrERkHdZ3
GddK1bORmcLdybPARkdd6WeqSaPj9QxxWFoQdKJHTI9hoWSceJ2lZiuvZaMnUwNo
u0YbeqbaJbGY/NGrulGUXTHVJRUAATvhgYkhhILq73qmLf2jyj5Y1bdG4whj3Vfg
yRUBaCkKoNzS4LiApE7ggsCL4dAQyvyOxapOexSGcHLzQrBfH2CiTEaGcSBTd9c9
W/+8pBXrtopc8VpPUThmGTyxIvJZKqUC5fycnW2MCe+J7nsOP4DGJTfrPbw+dCRH
PnJI1UzYqxZE46PWOiBck0IdSegn6Tu3mfZr6QIDAQABAoIBACruS/Hljy+fz1hr
kEdCxB+zto10zs1cu1Zs0z9AM04NvM3rtW/g7e8uIpkwA8h3QVER07ZOof4Ud3Ez
hQcbCrZkcf/ftFVEwfVHXh17yL1UC64O52War0CJHvuoxFbpOchOaODbCx1hXEH0
+5dMBGHHJdL3cTvMys4d4Mz+OO30c2/P85T/6FrcP452uwh3c9gEUB1Nd8T4ZGzZ
/6xsP5EEm+8FIODPsSzGhdHQ+wrNXYtbWusiBTm2NN4nADFHdvIQaYW9fv0Lq9r2
/XLCM+f6i4Lg0yO/s3vELmba5lKf5hL57jlDpe97x3LE4gx4uMTt3YwTCtCi8H2U
ELfDug0CgYEA9t66fw4hr9Uyfv4VNp2cINAHfN0AW9mHmWAPFeZOLiHTilxrFB35
KUZtMwBw6GfT0JQwTwCPyJqEviQMX7MnCMgVdBHt/K1CXjF3wFE2CKEm6V4X/6kW
hqteEAZSgV4NHazcexeYwye3lhyEEbW5qIN4lVKzSvjqN2sgEdo0FJ8CgYEArRnH
5zi7raJion+sz4E1bjC2gWB/g7LM6xLMWoEpq7aNqAQob+O3SVecgK6IEVHBo4Si
mSSbtJ1jkt+LdMGKEttYgYLCHDvPSPyBYde3VYNPEp5J8Ew+vMbDdmuMGm49IPKJ
cEY7Fti1CPwTAAUAMrNZkPCBmBqum89AQxppancCgYEAhtP0RUohidfFoWgBi/ee
eqlDPaWx+Xgfv9ufwZUr47QjxbBd5vnLyAgnwbAe+j8ihws4Kx2iaaxCjVpAy8+b
pQcp+F+Ge/bghXM89PMlsKbbCp+SOdZOcDSNxfC+BNuqDCgJrsyfaQ57DOf8FXQL
twY+yEcHlw3FVYkTVcy3nv8CgYEAl7z2wFi6JC4punqjGM8R8ELhaS4W+XJ+MT6s
RlXdGnoPWQ40CEkcfT1AoojcHBqH3PhCtG4j08L362LsU2/owjjnL7hYwfkn7rny
DLvVKS/O2+pHtE6R3Fd8Nk12ZiDmkwAovHPEDnXu1C5r1WOM1eTkCaraX2RcVZbq
pSf86mcCgYADaegTsvNzwdMO9fafxCeIq12NFUSfZi4n4FAXHxMSryfyal5dOURz
0MazNBIJdAXUrb7SISrrerGX70X5VOux1Dqh+MS2ShMeDHv7UsgRRYuqHbEynLS2
fN52VZQ/kBTS5QbrPJuHvjN/Qvr7n0pI8tDGVwmnkmpfeLVMypAcGw==
-----END RSA PRIVATE KEY-----`;
}