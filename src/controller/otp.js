const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const Otp = require('../models/otp');

//configure nodemailer
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ansari.anasai024@gmail.com',
        pass: 'nfprpkrtlshdprci'
    }
});

//generate OTP
function generateOTP() {
    var digits = '0123456789';
    let OTP = '';
    for (let i = 0; i < 4; i++) {
        OTP += digits[Math.floor(Math.random() * 10)];
    }
    return OTP;
}

//send OTP
exports.sendOTP = (req, res) => {
    const email = req.body.email;
    const OTP = generateOTP();
    //send email
    const mailOptions = {
        from: '"Superior Crane" <shahidhaya599@gmail.com>',
        to: email,
        subject: 'OTP Verification',
        // FromName:'Superior Crane',
        // header:'Superior Crane',
        text: 
`Your verification code: 
${OTP} 
Please do not share this code with anyone.`
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
            res.status(500).json(console.log(error));
        } else {
            console.log('Email sent: ' + info.response);

            //save OTP to database
           // Inside the sendOTP function
           const otp = new Otp({
            _id: new mongoose.Types.ObjectId(),
            email: email,
            otp: OTP
        });
        otp.save()
            .then(result => {
                console.log(result);
                res.status(200).json({ message: 'OTP sent successfully' });
            })
            .catch(err => {
                console.log(err);
                res.status(500).json({ message: 'Failed to send OTP' });
            });
}
});
};

//verify OTP
exports.verifyOTP = (req, res) => {
    const email = req.body.email;
    const OTP = req.body.otp;

    //find OTP in database
    Otp.findOne({ email: email, otp: OTP })
    .then(result => {
        if (result) {
            // Check if the OTP is within the 10-minute window
            const currentTime = new Date();
            const otpCreationTime = result.createdAt;
            const timeDifference = currentTime - otpCreationTime;

            if (timeDifference <= 10 * 60 * 1000) { // 10 minutes in milliseconds
                console.log(result);
                res.status(200).json({ message: 'OTP verified successfully' });
            } else {
                console.log('OTP expired');
                res.status(400).json({ message: 'OTP has expired' });
            }
        } else {
            console.log('Invalid OTP');
            res.status(400).json({ message: 'Invalid OTP' });
        }
    })
        .catch(err => {
            console.log(err);
            res.status(500).json(console.log(error));
        });
};
