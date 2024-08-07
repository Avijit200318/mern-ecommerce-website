import store from "store";
import axios from "axios";
import sha256 from "sha256";
import uniqid from "uniqid";

export const payment = async (req, res, next) => {
  try {
    let tx_uuid = uniqid();
    store.set('uuid', { tx: tx_uuid });

    let normalPayLoad = {
      "merchantId": "PGTESTPAYUAT86",
      "merchantTransactionId": tx_uuid,
      "merchantUserId": "MUID123",
      "amount": req.body.price * 100,
      "redirectUrl": `https://mern-ecommerce-website-mh4p.onrender.com/order`,
      "redirectMode": "REDIRECT",
      "callbackUrl": `https://mern-ecommerce-website-mh4p.onrender.com/order`,
      "mobileNumber": "9999999999",
      "paymentInstrument": {
        "type": "PAY_PAGE"
      }
    };

    let saltKey = '96434309-7796-489d-8924-ab56988a6076';
    let saltIndex = 1;

    let bufferObj = Buffer.from(JSON.stringify(normalPayLoad), "utf8");
    let base64String = bufferObj.toString("base64");

    let string = base64String + '/pg/v1/pay' + saltKey;

    let sha256_val = sha256(string);
    let checksum = sha256_val + '###' + saltIndex;

    const response = await axios.post('https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay', {
      'request': base64String
    }, {
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': checksum,
        'accept': 'application/json'
      }
    });

    
    return res.status(200).json(response.data);
  } catch (error) {
    console.error('Error during payment:', error);
    res.status(500).json({ error: 'Error during payment' });
  }
};

export const payRedirect = async (req, res, next) => {
  
}