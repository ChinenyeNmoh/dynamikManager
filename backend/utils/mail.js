import nodemailer from 'nodemailer';
import rateLimit from 'express-rate-limit';

const sendEmail = async (email, subject, html) => {
	try {

        
		const transporter = nodemailer.createTransport({
			host: process.env.HOST,
			service: process.env.SERVICE,
			port: Number(process.env.EMAIL_PORT),
			auth: {
				user: process.env.USER,
				pass: process.env.PASS,
			},
		});
       
		await transporter.sendMail({
			from: process.env.USER,
			to: email,
			subject: subject,
			html: html
		});
		console.log("email sent successfully");
	} catch (error) {
		console.log("email not sent!", error.message);
		return error;
	}
};

const emailVerificationTemplate = (link, user) => {
	return `<h3> Hello ${user.name}</h3>
	<p>
	Thank you for creating an account with dynamikManager.
	please click the link below to verify your account within 24 hours:
	</p>
	<br/>
	<a href="${link}">Click Here</a><br/>
	<br/>
	<p>If the button above isn’t working, paste the link below into your browser</p><br/>
	${link}
	<br/>
	<br/>
	<p>If you did not create an account with dynamikManager, just ignore this message.<br/>
	<br/>
	Thank you for choosing dynamikManager.
	</p>
	`
}

// password reset template
const passwordResetTemplate = (link, user) => {
	return `<p> Hi <strong>${user.name} </strong></p>,
	<br/>
	<p>
	There was recently a request to change the password on your account.
	If you requested this password change, please click the link below to set a new password within 24 hours:
	</p>
	<br/>
	<a href="${link}">Click Here</a><br/>
	<br/>
	<p>If the button above isn’t working, paste the link below into your browser</p><br/>
	${link}
	<br/>
	<br/>
	<p>If you don't want to change your password, just ignore this message.<br/>
	<br/>
	Thank you for choosing dynamikManager.
	</p>
	`
}

const taskCreatedTemplate = (task, user) => {
	return `<h3> Hello ${user.name}</h3>
	<p>
	You have been assigned a new task:
	</p>
	<br/>
	<p>Task Title: ${task.title}</p>
	<p>Task Description: ${task.description}</p>
	<p>Task Priority: ${task.priority}</p>
	<p>Task Status: ${task.status}</p>
	<p>Due Date: ${task.dueDate}</p>
	<br/>
	<p>Thank you for choosing dynamikManager.
	</p>
	`
}

const limiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again later.',
});

export { sendEmail, emailVerificationTemplate, passwordResetTemplate, taskCreatedTemplate, limiter };