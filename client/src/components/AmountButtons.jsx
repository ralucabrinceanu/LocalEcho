import React from 'react'
import { FaPlus, FaMinus } from 'react-icons/fa'

const AmountButtons = ({ increase, decrease, amount }) => {
  return (
    <section className="flex items-center">
      <button type="button" className="mr-2" onClick={decrease}>
        <FaMinus />
      </button>
      <h2 className="amount">{amount}</h2>
      <button type="button" className="ml-2" onClick={increase}>
        <FaPlus />
      </button>
    </section>
  )
}

export default AmountButtons
