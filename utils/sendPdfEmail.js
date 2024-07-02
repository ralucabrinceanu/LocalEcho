import PDFDocument from 'pdfkit'
import { PrismaClient } from '@prisma/client'
import { sendEmail } from './sendEmail.js'
import { NotFoundError } from '../errors/customErrors.js'
import qr from 'qr-image'

const prisma = new PrismaClient()

const generatePDF = async (order) => {
  return new Promise(async (resolve, reject) => {
    const doc = new PDFDocument()
    let buffers = []

    const orderData = await prisma.orders.findUnique({
      where: { id: order.id },
      include: {
        orderedBy: true,
        orderItems: {
          include: {
            ticket: {
              include: {
                event: {
                  include: {
                    venue: true,
                  },
                },
              },
            },
          },
        },
      },
    })
    // console.log('ORDER DATA', orderData)

    if (!orderData) {
      reject(new NotFoundError(`No order found with id ${order.id}`))
      return
    }

    const { orderedBy, orderItems, createdAt, id } = orderData
    const { firstName, lastName } = orderedBy

    const orderDate = new Date(createdAt)
    const orderYear = orderDate.getFullYear()
    const orderMonth = (orderDate.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
    const orderDay = orderDate.getDate().toString().padStart(2, '0')
    const orderHours = orderDate.getHours().toString().padStart(2, '0')
    const orderMinutes = orderDate.getMinutes().toString().padStart(2, '0')
    const formattedOrderDate = `${orderYear}-${orderMonth}-${orderDay} ${orderHours}:${orderMinutes}`

    doc.font('Helvetica').fontSize(10).text(`Numar comanda: ${id}`)
    doc
      .font('Helvetica')
      .fontSize(10)
      .text(`Cumparator: ${firstName} ${lastName}`)
    doc.font('Helvetica').fontSize(10).text(`Data: ${formattedOrderDate}`)
    doc.y += 10
    doc
      .font('Helvetica-Bold')
      .fontSize(20)
      .text('ACESTA ESTE BILETUL DUMNEAVOASTRA', { align: 'center' })
    doc.moveDown()

    const ticketsPerPage = 2
    let ticketsOnPage = 0

    const promises = orderItems.map(async (item) => {
      try {
        const { ticketId, amount } = item

        const dbTicket = await prisma.tickets.findUnique({
          where: { id: ticketId },
          include: {
            event: {
              include: {
                venue: true,
              },
            },
          },
        })
        // console.log('DB TICKET', dbTicket)
        if (!dbTicket) {
          throw new NotFoundError(`No ticket found with id ${ticketId}`)
        }

        const { event, price } = dbTicket
        if (!event) {
          throw new NotFoundError(
            `No event found for ticket with id ${ticketId}`
          )
        }

        const { title, startDate, venue } = event
        if (!venue) {
          throw new NotFoundError(
            `No venue found for event with id ${event.id}`
          )
        }

        const eventDate = new Date(startDate)
        const day = eventDate.getDate()
        const month = eventDate.toLocaleString('default', { month: 'short' })
        const year = eventDate.getFullYear()
        const formattedDate = `${day} ${month} ${year}`

        const hours = eventDate.getHours().toString().padStart(2, '0')
        const minutes = eventDate.getMinutes().toString().padStart(2, '0')
        const formattedTime = `${hours}:${minutes}`

        const formattedPrice = (price / 100).toFixed(2)

        for (let i = 0; i < amount; i++) {
          if (ticketsOnPage >= ticketsPerPage) {
            doc.addPage()

            doc.font('Helvetica').fontSize(10).text(`Numar comanda: ${id}`)
            doc
              .font('Helvetica')
              .fontSize(10)
              .text(`Cumparator: ${firstName} ${lastName}`)
            doc
              .font('Helvetica')
              .fontSize(10)
              .text(`Data: ${formattedOrderDate}`)
            doc.y += 10
            doc
              .font('Helvetica-Bold')
              .fontSize(20)
              .text('ACESTA ESTE BILETUL DUMNEAVOASTRA', {
                align: 'center',
              })
            doc.moveDown()
            ticketsOnPage = 0
          }

          const googleMapsUrl = `https://maps.google.com/maps?q=${encodeURIComponent(
            venue.address
          )},${encodeURIComponent(venue.city)}`
          const qrSvg = qr.imageSync(googleMapsUrl, { type: 'png' })
          doc.image(qrSvg, 400, doc.y + 20, { width: 150, height: 150 })

          //   const qrSvg = qr.imageSync(
          //     `http://localhost:5173/orders/showAllMyOrders`,
          //     { type: 'png' }
          //   )
          //   doc.image(qrSvg, 400, doc.y + 20, { width: 150, height: 150 })

          doc.rect(50, doc.y + 10, 510, 160).stroke()
          doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text('BILET DE INTRARE', 160, doc.y + 25)
          doc
            .fontSize(14)
            .font('Helvetica-Bold')
            .text(`${title}`, 160, doc.y + 5)
          doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Data: ${formattedDate} ora ${formattedTime}`, 90, doc.y + 20)
          doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Locatie: ${venue.name}`, 90, doc.y + 5)
          doc
            .fontSize(12)
            .font('Helvetica')
            .text(`Pret: ${formattedPrice} RON`, 90, doc.y + 5)
          doc
            .fontSize(8)
            .font('Helvetica')
            .text(
              `Adresa: ${venue.name}, ${venue.address}, ${venue.city}`,
              180,
              doc.y + 10
            )
          doc.y += 50
          doc.moveDown()

          ticketsOnPage++
        }
      } catch (error) {
        console.error('Error fetching event details for ticket:', error)
        reject(error)
      }
    })

    Promise.all(promises)
      .then(() => {
        doc.on('data', buffers.push.bind(buffers))
        doc.on('end', () => {
          const pdfData = Buffer.concat(buffers)
          resolve(pdfData)
        })

        doc.end()
      })
      .catch((error) => {
        console.error('Error generating PDF:', error)
        reject(error)
      })
  })
}

// const generatePDF = async (order) => {
//   return new Promise(async (resolve, reject) => {
//     const doc = new PDFDocument()
//     let buffers = []

//     const orderData = await prisma.orders.findUnique({
//       where: { id: order.id },
//       include: {
//         orderedBy: true,
//         orderItems: {
//           include: {
//             ticket: {
//               include: {
//                 event: {
//                   include: {
//                     venue: true,
//                   },
//                 },
//               },
//             },
//           },
//         },
//       },
//     })
//     // console.log('ORDER DATA', orderData)

//     if (!orderData) {
//       reject(new NotFoundError(`No order found with id ${order.id}`))
//       return
//     }

//     const { orderedBy, orderItems, createdAt, id } = orderData
//     const { firstName, lastName } = orderedBy

//     const orderDate = new Date(createdAt)
//     const orderYear = orderDate.getFullYear()
//     const orderMonth = (orderDate.getMonth() + 1).toString().padStart(2, '0') // Months are zero-based
//     const orderDay = orderDate.getDate().toString().padStart(2, '0')
//     const orderHours = orderDate.getHours().toString().padStart(2, '0')
//     const orderMinutes = orderDate.getMinutes().toString().padStart(2, '0')
//     const formattedOrderDate = `${orderYear}-${orderMonth}-${orderDay} ${orderHours}:${orderMinutes}`

//     doc.font('Helvetica').fontSize(10).text(`Numar comanda: ${id}`)
//     doc
//       .font('Helvetica')
//       .fontSize(10)
//       .text(`Cumparator: ${firstName} ${lastName}`)
//     doc.font('Helvetica').fontSize(10).text(`Data: ${formattedOrderDate}`)
//     doc.y += 10
//     doc
//       .font('Helvetica-Bold')
//       .fontSize(20)
//       .text('ACESTA ESTE BILETUL DUMNEAVOASTRA', { align: 'center' })
//     doc.moveDown()

//     const ticketsPerPage = 2
//     let ticketsOnPage = 0

//     const promises = orderItems.map(async (item) => {
//       try {
//         const { ticketId, amount } = item

//         const dbTicket = await prisma.tickets.findUnique({
//           where: { id: ticketId },
//           include: {
//             event: {
//               include: {
//                 venue: true,
//               },
//             },
//           },
//         })
//         // console.log('DB TICKET', dbTicket)
//         if (!dbTicket) {
//           throw new NotFoundError(`No ticket found with id ${ticketId}`)
//         }

//         const { event, price } = dbTicket
//         if (!event) {
//           throw new NotFoundError(
//             `No event found for ticket with id ${ticketId}`
//           )
//         }

//         const { title, startDate, venue } = event
//         if (!venue) {
//           throw new NotFoundError(
//             `No venue found for event with id ${event.id}`
//           )
//         }

//         const eventDate = new Date(startDate)
//         const day = eventDate.getDate()
//         const month = eventDate.toLocaleString('default', { month: 'short' })
//         const year = eventDate.getFullYear()
//         const formattedDate = `${day} ${month} ${year}`

//         const hours = eventDate.getHours().toString().padStart(2, '0')
//         const minutes = eventDate.getMinutes().toString().padStart(2, '0')
//         const formattedTime = `${hours}:${minutes}`

//         const formattedPrice = (price / 100).toFixed(2)

//         for (let i = 0; i < amount; i++) {
//           if (ticketsOnPage >= ticketsPerPage) {
//             doc.addPage()

//             doc.font('Helvetica').fontSize(10).text(`Numar comanda: ${id}`)
//             doc
//               .font('Helvetica')
//               .fontSize(10)
//               .text(`Cumparator: ${firstName} ${lastName}`)
//             doc
//               .font('Helvetica')
//               .fontSize(10)
//               .text(`Data: ${formattedOrderDate}`)
//             doc.y += 10
//             doc
//               .font('Helvetica-Bold')
//               .fontSize(20)
//               .text('ACESTA ESTE BILETUL DUMNEAVOASTRA', {
//                 align: 'center',
//               })
//             doc.moveDown()
//             ticketsOnPage = 0
//           }

//           const qrSvg = qr.imageSync(
//             `http://localhost:5173/orders/showAllMyOrders`,
//             { type: 'png' }
//           )
//           doc.image(qrSvg, 400, doc.y + 20, { width: 150, height: 150 })

//           doc.rect(50, doc.y + 10, 510, 160).stroke()
//           doc
//             .fontSize(14)
//             .font('Helvetica-Bold')
//             .text('BILET DE INTRARE', 160, doc.y + 25)
//           doc
//             .fontSize(14)
//             .font('Helvetica-Bold')
//             .text(`${title}`, 160, doc.y + 5)
//           doc
//             .fontSize(12)
//             .font('Helvetica')
//             .text(`Data: ${formattedDate} ora ${formattedTime}`, 90, doc.y + 20)
//           doc
//             .fontSize(12)
//             .font('Helvetica')
//             .text(`Locatie: ${venue.name}`, 90, doc.y + 5)
//           doc
//             .fontSize(12)
//             .font('Helvetica')
//             .text(`Pret: ${formattedPrice} RON`, 90, doc.y + 5)
//           doc
//             .fontSize(8)
//             .font('Helvetica')
//             .text(
//               `Adresa: ${venue.name}, ${venue.address}, ${venue.city}`,
//               180,
//               doc.y + 10
//             )
//           doc.y += 50
//           doc.moveDown()

//           ticketsOnPage++
//         }
//       } catch (error) {
//         console.error('Error fetching event details for ticket:', error)
//         reject(error)
//       }
//     })

//     Promise.all(promises)
//       .then(() => {
//         doc.on('data', buffers.push.bind(buffers))
//         doc.on('end', () => {
//           const pdfData = Buffer.concat(buffers)
//           resolve(pdfData)
//         })

//         doc.end()
//       })
//       .catch((error) => {
//         console.error('Error generating PDF:', error)
//         reject(error)
//       })
//   })
// }

export const sendPdfEmail = async (to, order) => {
  try {
    const pdfData = await generatePDF(order)
    console.log('PDF generated successfully')

    const testimonialURL = 'http://localhost:5173/user/add-testimonial'

    await sendEmail({
      to,
      subject: 'Your order tickets',
      html: `<h4>Find attached your tickets.</h4>
      
      <p>-----------------------------------------------------------------------------</p>

      <p>Leave us a feedback <b><a href="${testimonialURL}">here</a></b> on your interaction with the website.</p>`,
      attachments: [
        {
          filename: 'tickets.pdf',
          content: pdfData,
          contentType: 'application/pdf',
        },
      ],
    })
    console.log('Email sent successfully')
  } catch (error) {
    console.error('Error sending PDF email:', error)
    throw new Error('Failed to send PDF email')
  }
}
