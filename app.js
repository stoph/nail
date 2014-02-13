var MailParser = require("mailparser").MailParser;
var mailparser = new MailParser();
var simplesmtp = require("simplesmtp");
var request = require('request');

var email = '';

var test_email = "From: 'Sender' <sender@example.com>\r\n"+
            "To: 'Receiver' <receiver@example.com>\r\n"+
            "Subject: [AMP] Post title (12345)\r\n"+
            "\r\n"+
            "Message";

mailparser.on("end", function(mail_object){
	console.log(mail_object);
    // console.log("From:", mail_object.from);
    // console.log("Subject:", mail_object.subject);
    // console.log("headers:", mail_object.text);
    // console.log("Text body:", mail_object.text);
	// console.log("HTML body:", mail_object.html);
	
	request.post('http://requestb.in/1gx0oxm1', {form: mail_object});
	
});

simplesmtp.createSimpleServer({
		SMTPBanner: "Node Mail",
		ignoreTLS: true,
		disableDNSValidation: true,
		debug: false
	}, function(req){
		req.on("data", function(chunk){
    		email += chunk;
		});
		req.on("end", function(){
			mailparser.write(email);
			mailparser.end();
		});
    	req.accept();

}).listen(25, function(err){
    if(!err){
        console.log("SMTP server listening on port 25");
    } else {
        console.log("Could not start server on port 25. Ports under 1000 require root privileges.");
        console.log(err.message);
    }
});
