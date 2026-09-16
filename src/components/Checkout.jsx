import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import {
  Check,
  CreditCard,
  Lock,
  MapPin,
  ShieldCheck,
  Truck,
  Wallet,
  X,
} from 'lucide-react'
import { useShop } from '../context/ShopContext'
import {
  INDIAN_STATES,
  cardBrand,
  digitsOnly,
  emptyCheckout,
  formatCardNumber,
  formatExpiry,
  formatPhone,
  makeOrderId,
  maskCard,
  shippingCost,
  taxAmount,
  validateAddress,
  validatePayment,
} from '../utils/checkout'

const STEPS = ['Address', 'Payment', 'Review']

export function Checkout() {
  const { checkoutOpen, closeCheckout, cart, cartTotal, placeOrder, order } = useShop()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(emptyCheckout)
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})

  useEffect(() => {
    if (!checkoutOpen) return undefined
    setStep(1)
    setForm(emptyCheckout)
    setErrors({})
    setTouched({})
    document.body.style.overflow = 'hidden'
    const onKey = (e) => e.key === 'Escape' && closeCheckout()
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [checkoutOpen, closeCheckout])

  const shipping = shippingCost(form.shipping, cartTotal)
  const tax = taxAmount(cartTotal)
  const grand = cartTotal + shipping + tax

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    if (touched[key]) {
      const next = { ...form, [key]: value }
      setErrors((prev) => ({ ...prev, [key]: { ...validateAddress(next), ...validatePayment(next) }[key] }))
    }
  }

  const blur = (key) => {
    setTouched((prev) => ({ ...prev, [key]: true }))
    const all = { ...validateAddress(form), ...validatePayment(form) }
    setErrors((prev) => ({ ...prev, [key]: all[key] }))
  }

  const goPayment = () => {
    const next = validateAddress(form)
    setErrors(next)
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(next).map((k) => [k, true])) }))
    if (Object.keys(next).length) return
    setStep(2)
  }

  const goReview = () => {
    const next = validatePayment(form)
    setErrors(next)
    setTouched((prev) => ({ ...prev, ...Object.fromEntries(Object.keys(next).map((k) => [k, true])) }))
    if (Object.keys(next).length) return
    setStep(3)
  }

  const submit = () => {
    const next = { ...validateAddress(form), ...validatePayment(form) }
    setErrors(next)
    if (Object.keys(next).length) {
      setStep(Object.keys(validateAddress(form)).length ? 1 : 2)
      return
    }

    placeOrder({
      id: makeOrderId(),
      placedAt: new Date().toISOString(),
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        image: item.image,
      })),
      address: {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        phone: digitsOnly(form.phone),
        line1: form.line1.trim(),
        line2: form.line2.trim(),
        landmark: form.landmark.trim(),
        city: form.city.trim(),
        state: form.state,
        pin: form.pin.trim(),
        country: form.country,
      },
      shipping: form.shipping,
      payment: {
        method: form.method,
        brand: form.method === 'card' ? cardBrand(form.cardNumber) : form.method === 'upi' ? 'UPI' : 'Cash on Delivery',
        cardName: form.cardName.trim(),
        masked: form.method === 'card' ? maskCard(form.cardNumber) : form.method === 'upi' ? form.upiId.trim() : 'Pay on delivery',
        expiry: form.method === 'card' ? form.expiry : '',
      },
      totals: {
        subtotal: cartTotal,
        shipping,
        tax,
        grand,
      },
    })
  }

  return (
    <AnimatePresence>
      {checkoutOpen && (
        <motion.div
          className="fixed inset-0 z-[85] flex items-end justify-center sm:items-center sm:p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button type="button" className="absolute inset-0 bg-navy/50 backdrop-blur-md" aria-label="Close checkout" onClick={closeCheckout} />
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="checkout-title"
            initial={{ y: 80, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 40, opacity: 0 }}
            className="relative flex max-h-[94vh] w-full max-w-4xl flex-col overflow-hidden rounded-t-[28px] bg-white shadow-2xl sm:rounded-[28px]"
          >
            <header className="flex items-center justify-between border-b border-navy/10 px-5 py-4 sm:px-6">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.2em] text-candy">Secure checkout</p>
                <h2 id="checkout-title" className="font-display text-2xl font-bold text-navy">
                  {order ? 'Order confirmed' : 'Place your order'}
                </h2>
              </div>
              <button type="button" onClick={closeCheckout} className="grid h-10 w-10 place-items-center rounded-full bg-cream" aria-label="Close">
                <X className="h-5 w-5" />
              </button>
            </header>

            <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
              {order ? (
                <Receipt order={order} onShop={closeCheckout} />
              ) : (
                <>
                  <ol className="mb-6 grid grid-cols-3 gap-2">
                    {STEPS.map((label, i) => {
                      const n = i + 1
                      const active = step === n
                      const done = step > n
                      return (
                        <li
                          key={label}
                          className={`rounded-2xl px-3 py-2 text-center text-xs font-black uppercase tracking-wide ${
                            done ? 'bg-mint/30 text-navy' : active ? 'bg-navy text-white' : 'bg-cream text-ink/50'
                          }`}
                        >
                          {n}. {label}
                        </li>
                      )
                    })}
                  </ol>

                  {step === 1 && (
                    <AddressStep form={form} errors={errors} setField={setField} blur={blur} />
                  )}
                  {step === 2 && (
                    <PaymentStep form={form} errors={errors} setField={setField} blur={blur} subtotal={cartTotal} />
                  )}
                  {step === 3 && (
                    <ReviewStep form={form} cart={cart} cartTotal={cartTotal} shipping={shipping} tax={tax} grand={grand} />
                  )}
                </>
              )}
            </div>

            {!order && (
              <footer className="flex flex-col gap-3 border-t border-navy/10 bg-cream/80 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-sm font-extrabold text-navy">
                  Payable <span className="text-candy">${grand.toFixed(2)}</span>
                </p>
                <div className="flex gap-3">
                  {step > 1 && (
                    <button type="button" onClick={() => setStep((s) => s - 1)} className="rounded-full bg-white px-5 py-3 font-extrabold text-navy">
                      Back
                    </button>
                  )}
                  {step === 1 && (
                    <button type="button" onClick={goPayment} className="flex-1 rounded-full bg-navy px-6 py-3 font-extrabold text-white sm:flex-none">
                      Continue to payment
                    </button>
                  )}
                  {step === 2 && (
                    <button type="button" onClick={goReview} className="flex-1 rounded-full bg-navy px-6 py-3 font-extrabold text-white sm:flex-none">
                      Review order
                    </button>
                  )}
                  {step === 3 && (
                    <button type="button" onClick={submit} className="flex-1 rounded-full bg-candy px-6 py-3 font-extrabold text-white sm:flex-none">
                      Pay & place order
                    </button>
                  )}
                </div>
              </footer>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function AddressStep({ form, errors, setField, blur }) {
  return (
    <div>
      <h3 className="mb-4 flex items-center gap-2 font-display text-xl font-bold text-navy">
        <MapPin className="h-5 w-5 text-candy" /> Contact & delivery address
      </h3>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" error={errors.fullName} required>
          <input value={form.fullName} onChange={(e) => setField('fullName', e.target.value)} onBlur={() => blur('fullName')} placeholder="Priya Mehta" />
        </Field>
        <Field label="Email" error={errors.email} required>
          <input type="email" value={form.email} onChange={(e) => setField('email', e.target.value)} onBlur={() => blur('email')} placeholder="you@email.com" />
        </Field>
        <Field label="Mobile number" error={errors.phone} required>
          <input
            inputMode="numeric"
            value={form.phone}
            onChange={(e) => setField('phone', formatPhone(e.target.value))}
            onBlur={() => blur('phone')}
            placeholder="9876543210"
          />
        </Field>
        <Field label="Country" error={errors.country} required>
          <select value={form.country} onChange={(e) => setField('country', e.target.value)} onBlur={() => blur('country')}>
            <option value="India">India</option>
            <option value="United States">United States</option>
            <option value="United Kingdom">United Kingdom</option>
            <option value="United Arab Emirates">United Arab Emirates</option>
          </select>
        </Field>
        <Field label="Street address" error={errors.line1} required className="sm:col-span-2">
          <input value={form.line1} onChange={(e) => setField('line1', e.target.value)} onBlur={() => blur('line1')} placeholder="House no., street, area" />
        </Field>
        <Field label="Apartment / floor (optional)" className="sm:col-span-2">
          <input value={form.line2} onChange={(e) => setField('line2', e.target.value)} placeholder="Wing, building, floor" />
        </Field>
        <Field label="Landmark (optional)">
          <input value={form.landmark} onChange={(e) => setField('landmark', e.target.value)} placeholder="Near the park" />
        </Field>
        <Field label="City" error={errors.city} required>
          <input value={form.city} onChange={(e) => setField('city', e.target.value)} onBlur={() => blur('city')} placeholder="Pune" />
        </Field>
        <Field label="State" error={errors.state} required>
          <select value={form.state} onChange={(e) => setField('state', e.target.value)} onBlur={() => blur('state')}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </Field>
        <Field label="PIN code" error={errors.pin} required>
          <input
            inputMode="numeric"
            value={form.pin}
            onChange={(e) => setField('pin', digitsOnly(e.target.value).slice(0, 6))}
            onBlur={() => blur('pin')}
            placeholder="411001"
          />
        </Field>
      </div>
    </div>
  )
}

function PaymentStep({ form, errors, setField, blur, subtotal }) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-navy">
          <Truck className="h-5 w-5 text-sky" /> Delivery speed
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <Choice
            active={form.shipping === 'standard'}
            onClick={() => setField('shipping', 'standard')}
            title="Standard (4–6 days)"
            copy={subtotal >= 50 ? 'Free over $50' : `$${shippingCost('standard', subtotal).toFixed(2)}`}
          />
          <Choice
            active={form.shipping === 'express'}
            onClick={() => setField('shipping', 'express')}
            title="Express (1–2 days)"
            copy="$9.99"
          />
        </div>
      </div>

      <div>
        <h3 className="mb-3 flex items-center gap-2 font-display text-xl font-bold text-navy">
          <Wallet className="h-5 w-5 text-candy" /> Payment method
        </h3>
        <div className="grid gap-3 sm:grid-cols-3">
          <Choice active={form.method === 'card'} onClick={() => setField('method', 'card')} title="Card" copy="Visa / Mastercard" />
          <Choice active={form.method === 'upi'} onClick={() => setField('method', 'upi')} title="UPI" copy="GPay / PhonePe" />
          <Choice active={form.method === 'cod'} onClick={() => setField('method', 'cod')} title="Cash on delivery" copy="Pay at the door" />
        </div>
        {errors.method && <p className="mt-2 text-xs font-bold text-candy">{errors.method}</p>}
      </div>

      {form.method === 'card' && (
        <div className="rounded-[24px] bg-cream p-4 sm:p-5">
          <p className="mb-4 flex items-center gap-2 text-sm font-extrabold text-navy">
            <CreditCard className="h-4 w-4" /> Card details
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Name on card" error={errors.cardName} required className="sm:col-span-2">
              <input value={form.cardName} onChange={(e) => setField('cardName', e.target.value)} onBlur={() => blur('cardName')} placeholder="PRIYA MEHTA" />
            </Field>
            <Field label="Card number" error={errors.cardNumber} required className="sm:col-span-2">
              <input
                inputMode="numeric"
                value={form.cardNumber}
                onChange={(e) => setField('cardNumber', formatCardNumber(e.target.value))}
                onBlur={() => blur('cardNumber')}
                placeholder="ACCT-000015"
              />
            </Field>
            <Field label="Expiry (MM/YY)" error={errors.expiry} required>
              <input
                inputMode="numeric"
                value={form.expiry}
                onChange={(e) => setField('expiry', formatExpiry(e.target.value))}
                onBlur={() => blur('expiry')}
                placeholder="08/28"
              />
            </Field>
            <Field label="CVV" error={errors.cvv} required>
              <input
                inputMode="numeric"
                type="password"
                value={form.cvv}
                onChange={(e) => setField('cvv', digitsOnly(e.target.value).slice(0, 4))}
                onBlur={() => blur('cvv')}
                placeholder="123"
              />
            </Field>
          </div>
        </div>
      )}

      {form.method === 'upi' && (
        <Field label="UPI ID" error={errors.upiId} required>
          <input value={form.upiId} onChange={(e) => setField('upiId', e.target.value)} onBlur={() => blur('upiId')} placeholder="name@oksbi" />
        </Field>
      )}

      {form.method === 'cod' && (
        <p className="rounded-2xl bg-sunny/30 px-4 py-3 text-sm font-bold text-navy">
          Please keep ${(subtotal + shippingCost(form.shipping, subtotal) + taxAmount(subtotal)).toFixed(2)} ready in cash. Our rider will collect it on delivery.
        </p>
      )}

      <label className="flex items-start gap-3 text-sm font-bold text-navy">
        <input
          type="checkbox"
          checked={form.agree}
          onChange={(e) => setField('agree', e.target.checked)}
          className="mt-1 h-4 w-4"
        />
        <span>
          I confirm the address is correct and I agree to IDEALS’ terms, refund policy, and payment authorization.
        </span>
      </label>
      {errors.agree && <p className="-mt-4 text-xs font-bold text-candy">{errors.agree}</p>}
    </div>
  )
}

function ReviewStep({ form, cart, cartTotal, shipping, tax, grand }) {
  const payLabel =
    form.method === 'card'
      ? `${cardBrand(form.cardNumber)} ${maskCard(form.cardNumber)} · ${form.expiry}`
      : form.method === 'upi'
        ? form.upiId
        : 'Cash on delivery'

  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <div className="rounded-[24px] bg-cream p-5">
        <h3 className="font-display text-lg font-bold text-navy">Ship to</h3>
        <p className="mt-2 text-sm font-bold leading-relaxed text-ink/80">
          {form.fullName}
          <br />
          {form.line1}
          {form.line2 ? `, ${form.line2}` : ''}
          <br />
          {form.city}, {form.state} {form.pin}
          <br />
          {form.country}
          <br />
          {form.phone} · {form.email}
        </p>
        <p className="mt-3 text-sm font-extrabold text-navy">
          {form.shipping === 'express' ? 'Express 1–2 days' : 'Standard 4–6 days'}
        </p>
      </div>
      <div className="rounded-[24px] bg-cream p-5">
        <h3 className="font-display text-lg font-bold text-navy">Payment</h3>
        <p className="mt-2 text-sm font-bold text-ink/80">{payLabel}</p>
        <ul className="mt-4 space-y-1 text-sm font-bold text-navy">
          <li className="flex justify-between"><span>Subtotal</span><span>${cartTotal.toFixed(2)}</span></li>
          <li className="flex justify-between"><span>Shipping</span><span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span></li>
          <li className="flex justify-between"><span>Tax (8%)</span><span>${tax.toFixed(2)}</span></li>
          <li className="mt-2 flex justify-between border-t border-navy/10 pt-2 font-black">
            <span>Total</span><span className="text-candy">${grand.toFixed(2)}</span>
          </li>
        </ul>
      </div>
      <div className="lg:col-span-2">
        <h3 className="mb-3 font-display text-lg font-bold text-navy">Items</h3>
        <div className="space-y-2">
          {cart.map((item) => (
            <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-cream p-2">
              <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <p className="flex-1 font-extrabold text-navy">{item.name}</p>
              <p className="text-sm font-bold text-ink/60">x{item.qty}</p>
              <p className="font-black text-candy">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs font-bold text-ink/50">
          <Lock className="h-3.5 w-3.5" /> Frontend checkout only — no real charge is made.
        </p>
      </div>
    </div>
  )
}

function Receipt({ order, onShop }) {
  const eta = useMemo(() => {
    const days = order.shipping === 'express' ? 2 : 6
    const d = new Date(order.placedAt)
    d.setDate(d.getDate() + days)
    return d.toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
  }, [order])

  return (
    <div>
      <div className="mb-5 flex items-start gap-3 rounded-[24px] bg-mint/25 p-4">
        <span className="grid h-10 w-10 place-items-center rounded-full bg-mint text-navy">
          <Check className="h-5 w-5" />
        </span>
        <div>
          <p className="font-display text-xl font-bold text-navy">Playtime is on the way</p>
          <p className="text-sm font-bold text-ink/70">
            Order <span className="text-candy">{order.id}</span> placed{' '}
            {new Date(order.placedAt).toLocaleString()}
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[24px] border border-navy/10 p-5">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
            <MapPin className="h-4 w-4 text-candy" /> Delivery address
          </h3>
          <p className="mt-2 text-sm font-bold leading-relaxed text-ink/80">
            {order.address.fullName}
            <br />
            {order.address.line1}
            {order.address.line2 ? `, ${order.address.line2}` : ''}
            {order.address.landmark ? `, ${order.address.landmark}` : ''}
            <br />
            {order.address.city}, {order.address.state} {order.address.pin}
            <br />
            {order.address.country}
          </p>
          <p className="mt-3 text-sm font-bold text-navy">
            {order.address.phone}
            <br />
            {order.address.email}
          </p>
          <p className="mt-3 text-sm font-extrabold text-sky">Arrives by {eta}</p>
        </section>

        <section className="rounded-[24px] border border-navy/10 p-5">
          <h3 className="flex items-center gap-2 font-display text-lg font-bold text-navy">
            <CreditCard className="h-4 w-4 text-candy" /> Payment details
          </h3>
          <ul className="mt-2 space-y-1 text-sm font-bold text-ink/80">
            <li>Method: {order.payment.brand}</li>
            <li>Paid with: {order.payment.masked}</li>
            {order.payment.cardName && <li>Name on card: {order.payment.cardName}</li>}
            {order.payment.expiry && <li>Expiry: {order.payment.expiry}</li>}
            <li>Status: {order.payment.method === 'cod' ? 'Collect on delivery' : 'Authorized'}</li>
          </ul>
          <ul className="mt-4 space-y-1 text-sm font-bold text-navy">
            <li className="flex justify-between"><span>Subtotal</span><span>${order.totals.subtotal.toFixed(2)}</span></li>
            <li className="flex justify-between"><span>Shipping</span><span>{order.totals.shipping === 0 ? 'Free' : `$${order.totals.shipping.toFixed(2)}`}</span></li>
            <li className="flex justify-between"><span>Tax</span><span>${order.totals.tax.toFixed(2)}</span></li>
            <li className="mt-2 flex justify-between border-t border-navy/10 pt-2 font-black">
              <span>Amount</span><span className="text-candy">${order.totals.grand.toFixed(2)}</span>
            </li>
          </ul>
        </section>
      </div>

      <section className="mt-4 rounded-[24px] bg-cream p-5">
        <h3 className="font-display text-lg font-bold text-navy">Items in this order</h3>
        <div className="mt-3 space-y-2">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3">
              <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
              <p className="flex-1 font-extrabold text-navy">{item.name}</p>
              <p className="text-sm font-bold text-ink/60">x{item.qty}</p>
              <p className="font-black text-navy">${(item.price * item.qty).toFixed(2)}</p>
            </div>
          ))}
        </div>
      </section>

      <p className="mt-4 flex items-center gap-2 text-xs font-bold text-ink/50">
        <ShieldCheck className="h-4 w-4 text-mint" /> A confirmation copy stays on this device. No real payment was processed.
      </p>
      <button type="button" onClick={onShop} className="mt-5 w-full rounded-full bg-navy py-3 font-extrabold text-white">
        Back to shop
      </button>
    </div>
  )
}

function Field({ label, error, required, children, className = '' }) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-xs font-black uppercase tracking-widest text-ink/40">
        {label}
        {required && <span className="text-candy"> *</span>}
      </span>
      <div className="[&_input]:w-full [&_input]:rounded-2xl [&_input]:border-2 [&_input]:bg-cream [&_input]:px-4 [&_input]:py-3 [&_input]:font-bold [&_input]:text-navy [&_input]:transition [&_input]:focus:border-candy [&_input]:focus:bg-white [&_select]:w-full [&_select]:rounded-2xl [&_select]:border-2 [&_select]:bg-cream [&_select]:px-4 [&_select]:py-3 [&_select]:font-bold [&_select]:text-navy [&_select]:focus:border-candy [&_input]:border-transparent [&_select]:border-transparent">
        {children}
      </div>
      {error && <span className="mt-1 block text-xs font-bold text-candy">{error}</span>}
    </label>
  )
}

function Choice({ active, onClick, title, copy }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-2xl border-2 px-4 py-3 text-left transition ${
        active ? 'border-candy bg-peach/60' : 'border-transparent bg-cream hover:border-navy/10'
      }`}
    >
      <span className="block font-extrabold text-navy">{title}</span>
      <span className="text-xs font-bold text-ink/50">{copy}</span>
    </button>
  )
}
