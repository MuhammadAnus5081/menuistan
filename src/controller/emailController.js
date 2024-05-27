const nodemailer = require("nodemailer");
const path = require("path");
const fs = require("fs").promises;

const sendEmailWithAttachment = async (req, res) => {
  const { email, userId, givenEmail, filename } = req.body;

  try {
    if (!email || !userId || !givenEmail || !filename) {
      return res.status(400).json({ error: "Required fields are missing." });
    }

    const filePath = path.join('resources', 'static', 'assets', 'uploads', filename); // Construct the full file path

    // Check if the file exists
    const fileExists = await fs.access(filePath).then(() => true).catch(() => false);
    if (!fileExists) {
      return res.status(404).json({ error: "Requested file not found." });
    }

    // Create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "ansari.anasai024@gmail.com", // Replace with your Gmail email address
        pass: "nfprpkrtlshdprci", // Replace with your Gmail password or app password
      },
    });

    // Define email options
    let mailOptions = {
      from: '"Superior Crane" <shahidhaya599@gmail.com>', // Replace with your Gmail email address
      to: [email, givenEmail], // Send email to both userId email and given email address
      subject: "Test Email with Attachment",
      attachments: [
        {
          filename: filename,
          path: filePath, // Provide the full file path here
        },
      ],
    };

    // Send email
    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully!" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send email." });
  }
};

module.exports = {
  sendEmailWithAttachment,
};
