const crypto = require('crypto');

const isValidNotification = (req, secret) => {
    const signature = req.headers['x-signature'];
    if (!signature) return false;
  
    const [tsPart, v1Part] = signature.split(',');
    const ts = tsPart.split('=')[1];
    const v1 = v1Part.split('=')[1];
  
    const requestId = req.headers['x-request-id'];
    const dataId = req.query['data.id'];
  
    const message = `id:${dataId};request-id:${requestId};ts:${ts};`;
  
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(message);
    const digest = hmac.digest('hex');
  
    return digest === v1;
  }

export {isValidNotification}