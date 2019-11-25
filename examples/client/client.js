const payPerCall = require("../../");

const payPerCallClient = new payPerCall.Client("6BEYY3GWGKKFFJAM6AN22AS4VPQHDBG6", null, 100000, 20000); // (peer address, asset, deposits amount, refill threshold)

start();

async function start(){
	console.error("client started");

	//we generate a payment package
	try{
		const objPaymentPackage = await payPerCallClient.createPaymentPackage(40000);
		console.error(JSON.stringify(objPaymentPackage));	// objPaymentPackage can be encoded in JSON with JSON.stringify(objPaymentPackage) and transmitted to server alongside with your request
	} catch (error){
		console.error("Coudln't create payment package, reason: " + error);
	}

	
	//let's say server sent back a refund in JSON format

	//we parse it
	
	const objPaymentPackageFromServer = JSON.parse(`{
		"version":"2.0t",
		"signed_message":{
			"payment_amount":5000,
			"amount_spent":10000
			,"period":1,
			"aa_address":"PHA6RO4FVYKAY5QND77RF4V67ESHLZYJ"
		},
		"authors":[{"address":"CWNPFF6YAZWFEOZXKRB6527NZ47OFYRE",
		"authentifiers":{"r":"DXRAAmoJMAZyV2S6djwfRWMiFOG2B3sxHiVtCIogjlQ6mg+rhp0fQWKAumBySsH8N3zJuCkNI7hM5zYz4UXCQA=="},
		"definition":["sig",{"pubkey":"A6IMnIlrs+XI3TFjwIVdRnujE1692nLskboQugaKsMAQ"}]}]}`);

	//it has to be verified with:
	const objRefundFromServer = await payPerCallClient.verifyPaymentPackage(objPaymentPackageFromServer);
	if (objRefundFromServer.error){
		console.error(objRefundFromServer.error);
	} else
		console.error("Peer paid " + objRefundFromServer.amount + " in " + objRefundFromServer.asset + " using channel " + objRefundFromServer.aa_address);

}



