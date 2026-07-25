const admin = require('firebase-admin');

// Exact string the user provided with \\n
const privateKey = "-----BEGIN PRIVATE KEY-----\\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDG0LTAZ7seep/1\\ncxj6i201RwSxIf8eo72zyyVmURoEvkwHDa5pd9yEny2tExUptT9rNKUmOeLwx3rn\\nMquR7gcPGIf1KCk9yxOz0iMAKZgzmhToqsE2KE2Ua9fLx0dKG0BjnrXanw4P0EPb\\nwGfxnIYqCC8HAx3d1e/HxTs/X25cvimIGbPEz+wikL0g+Vl0wB0jWbBuHm7UYjdD\\nQlG/K0WFM+WXiRT/hLvTLqWIsS9tp0N4Bf3qXKbFpz9SKSfsP/8CzqpeD62MiwlL\\n7Z5thR09vbZWmWYSBDlmZsyHaMBnl1q7MMtK99ntIh8yfpGPZEH+Vu2kMWtBSl35\\nWLaWTkXBAgMBAAECggEAEwfOOBlActntBCBzdHldHOZCijawBhLz/nOZuFysqhCR\\nvskYoqAmW7bQN0q7fLBh33/8tkHV5GihGI6j7UYvUcrDf3whJSOSVrpCFGq8LBBP\\nI7hDN00N+VYwo/ZcGg6tZVEUpNZoZlYam2ckQUnTbnmLECzvB8QfKBb2erSb9UTU\\nAVPFtkA19S6Bf0tTAmrW2+Tj06oOd2GTf2ZAnDXphh/NUbtQEUGj7p6uP12nqaKM\\nFPzR8IVRdQNRC+bhdiPGVv9T9xRFCxzHdmAqwbCyDlsKdItM6WzG+ce0q4YWs6Eg\\nOfDjER+qYkArim2iujGcLfTKpHwB8eTgpkzGuKC44wKBgQDsB/nWBBMuO3Lnd4Ef\\n48rGorvnYzZbxlE554JCdMzOW4gpy5HKgIm3ODHVBi0MIEkrsPI5tbkntNE+4DXr\\n3cjEnrPJ7wsnWqxkuOorYlUUr2lJHS+wzwDbbBGKySA0ekAd2F560eGjuTET/6T0\\n2pD50N8zmpJRxO+6nBcUxzmh8wKBgQDXorLUmp5GwKKo5WsLe7r6GFi/kqCnYHiY\\nKtZqbLqi055+UuUJi8yy/a3LNagp/yKsXh1FYqdR1g9pECC1OT56QlsqY8IrxjW7\\ngl8wV0HPJkwtapV08d7xS4j2qNIvbNrN5aquk9dMRuwYEB8VKQjqpei3G8Z2ZA9I\\ndKETdxQyewKBgQDHhsKLSayRM44h36MXOzBKlHy10Oe90zsM8QjrduM/Op8zfbQD\\n9H72lJmDlBH2o0BXn+BUKquXxkHwngbXGghDNkmT1fCe1wbOqobCIAD+WH5vYS3U\\nkFkQJB38LaN82S9kS2kq+Et/ZOj5F+3xUualWA2nCO7SEuH45USZuwScQwKBgHt7\\nLr7yf7pya3MeVQsxYmP+9ytU8uyGIOi6dyhgdQvy9OrP21p5FNJW1GPuqQrLkHZ2\\nOnrWQIxrcU2vr5s3WaC3SO9gSvu4OGLVCF9tSEEwZCUJyOY773fr0lW1XQ9NXYrU\\nfsYT4RFL97zb1oDOi82bDkV1AVQgfmP2bZrw8L7rAoGBAI9SqJrJkoDkLybN6vwh\\n8SZkln8jtn2lnMpzFUkaf3HVYw9LpW6RlfalfJyN/PKENMNoZZR5z95RVAvnBLjK\\nwW5f6fBlr9ZzLW9x9wdppZAtQQM+1H0oDWkL+Ntd34AE49JZykzJeLKVqYvqQnKO\\n+Obm3G1Ls7JG1hQBEDsk1wgc\\n-----END PRIVATE KEY-----\\n";

try {
    let formattedPrivateKey = privateKey;
    formattedPrivateKey = formattedPrivateKey.replace(/\\n/g, '\n').replace(/\\"/g, '"').replace(/\\'/g, "'").trim();
    
    if (!formattedPrivateKey.includes('\n')) {
        formattedPrivateKey = formattedPrivateKey.replace('-----BEGIN PRIVATE KEY-----', '-----BEGIN PRIVATE KEY-----\n');
        formattedPrivateKey = formattedPrivateKey.replace('-----END PRIVATE KEY-----', '\n-----END PRIVATE KEY-----\n');
    }

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: 'easy2event-67c2a',
            clientEmail: 'firebase-adminsdk-fbsvc@easy2event-67c2a.iam.gserviceaccount.com',
            privateKey: formattedPrivateKey,
        }),
    });
    console.log('Firebase initialized successfully!');
} catch (err) {
    console.error('Firebase initialization failed:', err.message);
}
