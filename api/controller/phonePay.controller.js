import store from "store";
import axios from "axios";
import sha256 from "sha256";
import uniqid from "uniqid";

export const payment = async (req, res, next) => {
  try {
    let tx_uuid = uniqid();
    store.set('uuid', { tx: tx_uuid });

    let normalPayLoad = {
      "merchantId": "PGTESTPAYUAT",
      "merchantTransactionId": tx_uuid,
      "merchantUserId": "MUID123",
      "amount": req.body.price * 100,
      "redirectUrl": `http://localhost:3000/api/payment/redirect`,
      "redirectMode": "POST",
      "callbackUrl": `http://localhost:3000/api/payment/redirect`,
      "mobileNumber": "9999999999",
      "paymentInstrument": {
        "type": "PAY_PAGE"
      }
    };

    let saltKey = '099eb0cd-02cf-4e2a-8aca-3e6c6aff0399';
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
  return res.redirect("http://localhost:5173/order");
}