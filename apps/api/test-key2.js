const crypto = require('crypto');

function parseKey(privateKey) {
  let formattedPrivateKey = privateKey;
  if (formattedPrivateKey.startsWith('"') && formattedPrivateKey.endsWith('"')) {
      formattedPrivateKey = formattedPrivateKey.slice(1, -1);
  } else if (formattedPrivateKey.startsWith("'") && formattedPrivateKey.endsWith("'")) {
      formattedPrivateKey = formattedPrivateKey.slice(1, -1);
  }
  formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'").trim();
  
  if (!formattedPrivateKey.includes('\n')) {
      formattedPrivateKey = formattedPrivateKey.replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n');
      formattedPrivateKey = formattedPrivateKey.replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n');
      const content = formattedPrivateKey.replace('-----BEGIN PRIVATE KEY-----\n', '').replace('\n-----END PRIVATE KEY-----\n', '').replace(/\s+/g, '');
      const matchedContent = content.match(/.{1,64}/g);
      if (matchedContent) {
          formattedPrivateKey = `-----BEGIN PRIVATE KEY-----\n${matchedContent.join('\n')}\n-----END PRIVATE KEY-----\n`;
      }
  }
  return formattedPrivateKey;
}

function testKey(key, label) {
  try {
    crypto.createPrivateKey(parseKey(key));
    console.log(label + ": Success");
  } catch (err) {
    console.log(label + ": Error:", err.message);
  }
}

const valid = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/3Q0lpd9fV/LQ
... (pretend valid structure)
-----END PRIVATE KEY-----`;

const actual = `-----BEGIN PRIVATE KEY-----
MIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQC/3Q0lpd9fV/LQ
p/d9u3QU5gdJtL2xXNE+Wj7Y+G3PxVLpHWwztHP0YgqhkatXicQifhxiGuKhJBcr
K1xHPky8h6YmqSHDDU9fBNIzgfu1NPDUNeZqw9DhC7ic3913faZxw1YKSC4u19tP
LfSiwVKpP3ONI3vRX0DIyLi+BG5GEYXhBeNjuUxJTFLdPe/NEl1wi7JT2cO0AlOS
4APpAOQFqK8Q75VDnL05dSPYJlMiwxS+fClXZ6WJ5MiYhzxoE0rJyxuBInfhaJtm
vV0A9Kq/CyAO/q66Or1ZsAmjTF18iifFLucFbQnq1xJ3211i22hMTHOFFy97Wuuz
U45Q0rY7AgMBAAECggEAEuqa+LrFbrOPo6Xj31gjhkn1rv0sdLe3g6PHLYI05XbJ
iWVWvTRN+GrQLITdtVhGZ7YyWzPWY1fZFu8D/pw0WaQwLACh7Qa7bB1gEib/J6sM
EYgs6xraVc3fikwCHF1dkzrUmVfrgb/Thhd8Vq2j1j8EyAYXF5oCG6m6mTV7n9m/
t49R11AFTyV176sh+YxcJ8QkzNRRliL54u2vDjs73Ffc6GqcnCmhJoJUn4WATxKz
X41uOGI2MW8OVny/5jt10gRWn5TxK4Nj46dCESq+WClN+pp0bs909lnq8+U2OAzY
3Yny1SfwQZbqqLYbmhdikxm3Hs4tyvJRqpo7wfyDBQKBgQDjXfBinCpMZh3c6hA5
2q9qUo61ieD0CDXEyFIPBMFof7jidgfwIeQvRB3ESLhYvWbYUbaaih9gF7sRkf5s
IL2Ow4mmruP/x98gK4O6hT+bzqGJvxVG/NSUMf+lxJo79oPKpQnH60EspxsXkH4B
yIUS/4qgRtrlmzjTrcsh0W7PVQKBgQDYBoT+4ekwIxi03Ddpaj3MbIWIXmaekJQA
FhsPsoi8I6Hl1N36FZuUls95UZQ3qgo56zl0Bs/stnn+HuCD7tnNotg40i6Xdc7W
uvi/2BZNrhV4SM199KweG94PIbSQIVRv2aZdXBtdyda2mFVctE7l5Bdfz77KZT/i
EDHIMA/PTwKBgGmvXbCIhITUpqbsSbSKuSUD0QADYgQs2Mlqj/IZNMmdLNRfJttw
9X8e+3MklkPxbh+5A9cbwu/IuBS3tvqN0W7N52sKOkLHpihu8aE+lM2Yo6/CmWJQ
3YMxJnLoSwT6VlJYmo5KBRZ7anVunZO4oFqvW8Gajd9SYnzKePR0RDytAoGAFgdc
Ko2o9NKvY0oNkH9X+++ZElXmCwddQEEA03H2RZEwojo5xJXNfrJ+R7XM8nwxfMSC
4FUNgOr+t644YNvLdA/GEs1EGQfXZsg8M3v6kkNNRy3NXqnDn3JiC5L5UbVEYf+E
2oJY/BBoB8iy87gjT4gZ5hhOMV9vy0KxgON9yTsCgYBo56GuMT3zVRtehXllekpQ
0BxtQfvJ/6rmTWofXZ6uOqpKPskSAPQ5/kXdID1KCfQgvWIQLPmgNgKGJjCJNeNX
0MssmbE1tIy8fS28D2mDzkbX27uuu/ZraKn9oHXvjI0PkPrcfk2ZGq7/cIi1N+Nl
PJBXzBZpQEh8Ju1lX9OKig==
-----END PRIVATE KEY-----`;

// 1. Literal JSON string from .env
testKey(JSON.stringify(actual), "JSON stringified");

// 2. Spaces instead of newlines
testKey(actual.replace(/\n/g, ' '), "Spaces instead of newlines");

// 3. Render raw pasted without quotes (sometimes collapses spaces)
testKey(actual.replace(/\n/g, '  '), "Double spaces");

// 4. Literal \n characters without quotes
testKey(actual.replace(/\n/g, '\\n'), "Literal \\n");
