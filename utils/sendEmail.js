import nodemailer from 'nodemailer'
import { nodemailerConfig } from './nodemailerConfig.js'

export const sendEmail = async ({ to, subject, html, attachments }) => {
  const transporter = nodemailer.createTransport(nodemailerConfig)

  const info = await transporter.sendMail({
    from: '"Raluca Brînceanu" <raluca.brinc@gmail.com>',
    to,
    subject,
    html,
    attachments,
  })
}
