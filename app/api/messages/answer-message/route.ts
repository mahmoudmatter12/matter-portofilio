import nodemailer from 'nodemailer'
import { NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  try {
    const { name, email, replyContent , messageId } = await request.json()

    // Validate input
    if (!name || !email || !replyContent || !messageId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create transporter (using Gmail as example)
    const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Send mail
    await transporter.sendMail({
      from: `"Portfolio Contact" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Your receiving email
      subject: `New message from ${name}`,
      text: replyContent,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${replyContent.replace(/\n/g, '<br>')}</p>
      `,
    })

    // set message status to 'replied' in the database
    // Assuming you have a function to update the message status
    await db.messages.update({
      where: { id: messageId },
      data: { status: 'REPLIED' },
    })

    return NextResponse.json(
      { success: true },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    )
  }
}

// export async function POST(request: Request) {
//   const body = await request.json();
//   console.log("Received body:", body);
//   return new Response("This endpoint is not implemented yet", {
//     status: 501,
//   });
// }
