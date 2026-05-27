import { useState } from 'react'
import { findSchemes } from '../api'
import { FileText, ExternalLink, Loader2, Search, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
]

const CROP_TYPES = [
  'Rice','Wheat','Maize','Sorghum','Pearl Millet','Finger Millet',
  'Tur/Pigeon Pea','Chickpea','Lentil','Soybean','Groundnut','Sunflower',
  'Cotton','Sugarcane','Jute','Tobacco','Potato','Onion','Tomato',
  'Banana','Mango','Coconut','Rubber','Pepper','Cardamom','Fruits & Vegetables',
]

const MINISTRY_COLOR = {
  'Ministry of Agriculture & Farmers Welfare': 'bg-green-100 text-green-800',
  'Ministry of Jal Shakti':                    'bg-blue-100 text-blue-800',
  'Ministry of Agriculture & Farmers Welfare / RBI': 'bg-purple-100 text-purple-800',
}

export default function SchemesFinder() {
  const [state, setState]       = useState('')
  const [acres, setAcres]       = useState('')
  const [crop, setCrop]         = useState('')
  const [income, setIncome]     = useState('')
  const [result, setResult]     = useState(null)
  const [loading, setLoading]   = useState(false)

  const handleSearch = async () => {
    if (!state || !acres || !crop) {
      toast.error('Please fill in state, land size, and crop type.')
      return
    }
    setLoading(true)
    setResult(null)
    try {
      const data = await findSchemes(
        state,
        parseFloat(acres),
        crop,
        income ? parseFloat(income) : null,
      )
      setResult(data)
    } catch {
      toast.error('Could not fetch schemes. Check your connection.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="bg-amber-50 p-3 rounded-xl">
            <FileText className="text-farm-amber" size={26} />
          </div>
          <div>
            <h1 className="section-title">Government Scheme Finder</h1>
            <p className="text-gray-500 text-sm">
              Find all government subsidies, insurance & loans you qualify for
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="card space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          {/* State */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">State</label>
            <select
              value={state}
              onChange={e => setState(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-farm-leaf bg-white"
            >
              <option value="">Select your state…</option>
              {STATES.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Land */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Land Size (acres)</label>
            <input
              type="number"
              value={acres}
              onChange={e => setAcres(e.target.value)}
              placeholder="e.g. 2.5"
              min="0"
              step="0.1"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-farm-leaf"
            />
          </div>

          {/* Crop */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Crop Type</label>
            <select
              value={crop}
              onChange={e => setCrop(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-farm-leaf bg-white"
            >
              <option value="">Select your crop…</option>
              {CROP_TYPES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          {/* Income */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Annual Income (₹) <span className="text-gray-400 font-normal">optional</span>
            </label>
            <input
              type="number"
              value={income}
              onChange={e => setIncome(e.target.value)}
              placeholder="e.g. 150000"
              className="w-full border border-gray-200 rounded-xl px-3 py-2.5 text-sm
                         focus:outline-none focus:ring-2 focus:ring-farm-leaf"
            />
          </div>
        </div>

        <button onClick={handleSearch} disabled={loading} className="btn-amber w-full justify-center">
          {loading
            ? <><Loader2 size={16} className="spinner" /> Finding schemes…</>
            : <><Search size={16} /> Find My Eligible Schemes</>
          }
        </button>
      </div>

      {/* Results */}
      {result && (
        <div className="space-y-4">

          {/* Summary */}
          <div className="card bg-farm-pale border border-green-200">
            <div className="flex items-start gap-3">
              <CheckCircle className="text-farm-mid shrink-0 mt-0.5" size={22} />
              <div>
                <p className="font-semibold text-farm-dark">
                  🎉 {result.total_found} scheme{result.total_found !== 1 ? 's' : ''} found for you!
                </p>
                <p className="text-sm text-gray-600 mt-1">{result.message}</p>
              </div>
            </div>
          </div>

          {/* Scheme cards */}
          {result.schemes.map((scheme, i) => (
            <div key={i} className="card hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between gap-3 mb-3">
                <h3 className="font-bold text-gray-800 leading-snug">{scheme.name}</h3>
                <a
                  href={scheme.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-farm-mid hover:text-farm-dark transition"
                  title="Official website"
                >
                  <ExternalLink size={16} />
                </a>
              </div>

              <span className={`badge text-xs mb-3 inline-block
                ${MINISTRY_COLOR[scheme.ministry] || 'bg-gray-100 text-gray-600'}`}>
                {scheme.ministry}
              </span>

              <div className="space-y-2 text-sm">
                <div className="flex gap-2">
                  <span className="font-medium text-farm-dark w-24 shrink-0">Benefit:</span>
                  <span className="text-gray-600">{scheme.benefit}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-farm-dark w-24 shrink-0">Eligible if:</span>
                  <span className="text-gray-600">{scheme.eligibility}</span>
                </div>
                <div className="flex gap-2">
                  <span className="font-medium text-farm-dark w-24 shrink-0">How to apply:</span>
                  <span className="text-gray-600">{scheme.how_to_apply}</span>
                </div>
              </div>

              <a
                href={scheme.link}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-farm-mid
                           hover:text-farm-dark transition"
              >
                Apply Now <ExternalLink size={13} />
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
