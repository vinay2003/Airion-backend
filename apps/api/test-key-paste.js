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

const key = `"-----BEGIN PRIVATE KEY-----\\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCrMDahDBlIZ67d\\n0z0zLAvbtp/PlmBXWKObPKoFXBYz67Lk2/qoDBiQ86I0/KX06AFW+gEKaxeA2Ua1\\n9UTSein1R3V2QxKBA6hrQwRINmNTtY3bgFoH2uEDeWWV3vzOgNoxdKRRSOvgutBx\\nFiUQGO/mpj/WorHnMJhYvf1boWk7LsZ2EaUaR5NueRihbS8gfoXgMBELn1abEztZ\\nUpyUWSc5CafW3b61MaB48hgADecHRNiIfBExz5lmsmSjLMPwnRxQEXg/W8hhCCyw\\nC8skUxbRBBvuPEApY+ReBuIJIUvmyN11zwuid0IYgELHBicYveNRPGSQOBJx8iI7\\n7DdsKthhAgMBAAECggEAHqwkVaXDz+/X6qIDOKx/MW5e4wR4HZ5hrhpoAk7WIZZt\\nNsldd4e3TR2CJklQePmq58kir5mxm+ISY97e5nGCHBMiLj7lTV1460MWPNQV5vVE\\nRhyQxRCIOaWiOIC8PknjDnJuUKwmq1z9pQ2JNYGqVmLaVFxRUPGpklj0UNsybipv\\n1wzNvVU1Xj3dVh8RGBW8iCzhuhutDmf6bs1L/8IkF9ufumhoNb18BK8XBuYCvTCH\\nAFd0P/zxAwBinG8LNUjlWNTD6rLPl6Rg4CQ6eDRA/ieqkDZthEIgq6UHWEomZm/a\\nGRcQ8/PFNYM9a5yjoWluCu6NABm/MQW3+xfAMOpYewKBgQDVr+Zp2wFli6LSXnaD\\nfbd/vFnA6XZGDLNJy/iEhC1Eh84zoFkgRnSLgluTBbqa3WUyHDdCNTrSPwfuR8q4\\nHmLIFEv8vQVCKt9WiymaxyRocZ5/8GYyHz/4JW7P7dgVl/qcedbxsAKG362wh/Q0\\\\YTou3/NQUakoHOlANL0Yj9upRwKBgQDNFf2bMOiHLHyz5l2DPvQjkAQvTRbH5CD8\\nQBr+skKKRxxD+itlJZds+Iah+T7Sv6RICab6JK4h+AhYthrn6x9brz0fK9CuQBn6\\nh55iinKTl4gKHJ6cCY83+WCTfU3XOysSTGENGExDz5bp9KPCg24iNBOikeNEvx79\\nPXEr/f3FFwKBgAiFE+XCkqKu15YVqBoECC3yn41+gXW3iep2VHlMH9XsqD8MtKEB\\nziHF18rb3p3QF/nQgC+GmcrKMpHAkQeYRo39qS3xh2Uk+nSj5cvDBuOXLB+jwR9c\\neZt2Op3VuNjbj2Vvwi8uulsQTgeM1CLGgaBe03+vUdREmtQxhhyVl8d/AoGANDgI\\nNe6zFlAGhIwAfX2XDkMKPb0EMutsVq4/8WAUPz8x/EEDsaJrtwxkw3NCQskXHFyQ\\nzppuWCnefjAIE8szVdX92yT94pBhzP+hHXghCmGH+wMkg5iPhfISXBuIqWfgZK1b\\n/MiWCqIdy/5FgC6U6VKXOUqqMoPzcQmm+kuWxQsCgYBmJee3YMGwlEweXu2umrYH\\nGpnnL1NRqSrs26UcMpCq1PM9uh71bQ+S3ZtFuPYdco8hx+mk+HMoOBPHJ1b7pkta\\nOyzwmF9xeipzWgow+cnHwYHqbxQT6fym65p8YoWcNQBJlH9I5mg5HQQbb1qiGwiJ\\njUOMeO6GFP6jHdl3kz6oZQ==\\n-----END PRIVATE KEY-----"`;

console.log("Testing parsed key:");
try {
  crypto.createPrivateKey(parseKey(key));
  console.log("Success");
} catch(err) {
  console.log("Error:", err.message);
}
