import stripePackage from 'stripe'

const stripe = stripePackage(process.env.STRIPE_KEY)

export const stripeController = async (req, res) => {
  // console.log(req.body)
  const { total } = req.body

  if (!total || isNaN(total) || total <= 0) {
    return res.status(400).json({ error: 'Invalid total amount' })
  }

  const calculateOrderAmount = () => {
    return total
  }

  const paymentIntent = await stripe.paymentIntents.create({
    amount: calculateOrderAmount(),
    currency: 'ron',
    automatic_payment_methods: { enabled: true },
  })

  res.send({ clientSecret: paymentIntent.client_secret })
}
