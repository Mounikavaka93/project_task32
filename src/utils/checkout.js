export const INDIAN_STATES = [
  'Andhra Pradesh',
  'Arunachal Pradesh',
  'Assam',
  'Bihar',
  'Chhattisgarh',
  'Delhi',
  'Goa',
  'Gujarat',
  'Haryana',
  'Himachal Pradesh',
  'Jharkhand',
  'Karnataka',
  'Kerala',
  'Madhya Pradesh',
  'Maharashtra',
  'Manipur',
  'Meghalaya',
  'Mizoram',
  'Nagaland',
  'Odisha',
  'Punjab',
  'Rajasthan',
  'Sikkim',
  'Tamil Nadu',
  'Telangana',
  'Tripura',
  'Uttar Pradesh',
  'Uttarakhand',
  'West Bengal',
]

export const emptyCheckout = {
  fullName: '',
  email: '',
  phone: '',
  line1: '',
  line2: '',
  landmark: '',
  city: '',
  state: '',
  pin: '',
  country: 'India',
  shipping: 'standard',
  method: 'card',
  cardName: '',
  cardNumber: '',
  expiry: '',
  cvv: '',
  upiId: '',
  agree: false,
}

export function digitsOnly(value) {
  return value.replace(/\D/g, '')
}

export function formatCardNumber(value) {
  return digitsOnly(value).slice(0, 16).replace(/(\d{4})(?=\d)/g, '$1 ')
}

export function formatExpiry(value) {
  const raw = digitsOnly(value).slice(0, 4)
  if (raw.length < 3) return raw
  return `${raw.slice(0, 2)}/${raw.slice(2)}`
}

export function formatPhone(value) {
  return digitsOnly(value).slice(0, 10)
}

export function luhnValid(number) {
  const s = digitsOnly(number)
  if (s.length !== 16) return false
  let sum = 0
  let alt = false
  for (let i = s.length - 1; i >= 0; i -= 1) {
    let n = Number(s[i])
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return sum % 10 === 0
}

export function expiryValid(value) {
  const match = value.match(/^(0[1-9]|1[0-2])\/(\d{2})$/)
  if (!match) return false
  const month = Number(match[1])
  const year = 2000 + Number(match[2])
  const end = new Date(year, month, 0, 23, 59, 59)
  return end >= new Date()
}

export function cardBrand(number) {
  const n = digitsOnly(number)
  if (/^4/.test(n)) return 'Visa'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard'
  if (/^6/.test(n)) return 'RuPay'
  if (/^3[47]/.test(n)) return 'American Express'
  return 'Card'
}

export function maskCard(number) {
  const n = digitsOnly(number)
  if (n.length < 4) return '••••'
  return `•••• •••• •••• ${n.slice(-4)}`
}

export function validateAddress(form) {
  const errors = {}
  if (!/^[a-zA-Z][a-zA-Z .']{1,48}$/.test(form.fullName.trim()) || form.fullName.trim().split(/\s+/).length < 2) {
    errors.fullName = 'Enter your first and last name'
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
    errors.email = 'Enter a valid email address'
  }
  if (!/^[6-9]\d{9}$/.test(digitsOnly(form.phone))) {
    errors.phone = 'Enter a 10-digit mobile number starting with 6-9'
  }
  if (form.line1.trim().length < 8) {
    errors.line1 = 'Enter a full street address (min 8 characters)'
  }
  if (!/^[a-zA-Z][a-zA-Z .]{1,40}$/.test(form.city.trim())) {
    errors.city = 'Enter a valid city name'
  }
  if (!form.state) {
    errors.state = 'Select your state'
  }
  if (!/^[1-9]\d{5}$/.test(form.pin.trim())) {
    errors.pin = 'Enter a valid 6-digit PIN code'
  }
  if (!form.country) {
    errors.country = 'Select a country'
  }
  return errors
}

export function validatePayment(form) {
  const errors = {}
  if (!form.shipping) errors.shipping = 'Choose a delivery speed'
  if (!['card', 'upi', 'cod'].includes(form.method)) errors.method = 'Choose a payment method'

  if (form.method === 'card') {
    if (!/^[a-zA-Z][a-zA-Z .']{2,48}$/.test(form.cardName.trim())) {
      errors.cardName = 'Enter the name printed on the card'
    }
    if (!luhnValid(form.cardNumber)) {
      errors.cardNumber = 'Enter a valid 16-digit card number'
    }
    if (!expiryValid(form.expiry)) {
      errors.expiry = 'Enter a valid future expiry (MM/YY)'
    }
    if (!/^\d{3,4}$/.test(form.cvv)) {
      errors.cvv = 'Enter a 3 or 4 digit CVV'
    }
  }

  if (form.method === 'upi' && !/^[a-zA-Z0-9._-]{2,256}@[a-zA-Z]{2,64}$/.test(form.upiId.trim())) {
    errors.upiId = 'Enter a valid UPI ID like name@oksbi'
  }

  if (!form.agree) errors.agree = 'Please accept the terms to place your order'
  return errors
}

export function shippingCost(method, subtotal) {
  if (method === 'express') return 9.99
  return subtotal >= 50 ? 0 : 4.99
}

export function taxAmount(subtotal) {
  return Number((subtotal * 0.08).toFixed(2))
}

export function makeOrderId() {
  return `IDL-${Date.now().toString(36).toUpperCase()}`
}
