import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { analyzeDisease } from '../api'
import {
  Upload, Camera, Leaf, AlertTriangle, CheckCircle,
  ChevronDown, ChevronUp, Loader2, RefreshCw
} from 'lucide-react'
import toast from 'react-hot-toast'

const SEVERITY_COLOR = {
  Healthy: 'bg-green-100 text-green-800',
  Low:     'bg-yellow-100 text-yellow-800',
  Medium:  'bg-orange-100 text-orange-800',
  High:    'bg-red-100 text-red-800',
}

export default function DiseaseScanner() {
  const [preview, setPreview]     = useState(null)
  const [file, setFile]           = useState(null)
  const [result, setResult]       = useState(null)
  const [loading, setLoading]     = useState(false)
  const [showDetails, setDetails] = useState(false)

  const onDrop = useCallback((accepted) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    setPreview(URL.createObjectURL(f))
    setResult(null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': ['.jpg', '.jpeg', '.png', '.webp'] },
    maxFiles: 1,
  })

  const handleAnalyze = async () => {
    if (!file) return toast.error('Please upload a crop image first.')
    setLoading(true)
    setResult(null)
    try {
      const data = await analyzeDisease(file)
      setResult(data)
      setDetails(false)
    } catch (err) {
      toast.error('Analysis failed. Check your connection and API key.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setPreview(null); setFile(null); setResult(null)
  }

  return (
    <div className="max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div className="card">
        <div className="flex items-center gap-3">
          <div className="bg-farm-pale p-3 rounded-xl">
            <Leaf className="text-farm-mid" size={26} />
          </div>
          <div>
            <h1 className="section-title">Crop Disease Scanner</h1>
            <p className="text-gray-500 text-sm">
              Upload a photo of any leaf or crop — AI diagnoses disease in seconds
            </p>
          </div>
        </div>
      </div>

      {/* Upload zone */}
      <div className="card">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors duration-200
            ${isDragActive
              ? 'border-farm-leaf bg-farm-pale'
              : 'border-gray-200 hover:border-farm-leaf hover:bg-gray-50'
            }`}
        >
          <input {...getInputProps()} />
          {preview ? (
            <img
              src={preview}
              alt="Crop preview"
              className="max-h-64 mx-auto rounded-xl object-contain shadow"
            />
          ) : (
            <div className="space-y-3">
              <Upload className="mx-auto text-gray-400" size={40} />
              <p className="text-gray-600 font-medium">
                {isDragActive ? 'Drop it here!' : 'Drag & drop a crop photo here'}
              </p>
              <p className="text-gray-400 text-sm">or click to browse (JPG, PNG, WebP)</p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-4 flex gap-3 flex-wrap">
          <button onClick={handleAnalyze} disabled={!file || loading} className="btn-primary flex-1">
            {loading
              ? <><Loader2 size={16} className="spinner" /> Analyzing…</>
              : <><Camera size={16} /> Analyze Crop</>
            }
          </button>
          {preview && (
            <button onClick={handleReset} className="btn-secondary">
              <RefreshCw size={16} /> Reset
            </button>
          )}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="card space-y-4 animate-[fadeSlideUp_0.3s_ease-out]">

          {/* Status banner */}
          <div className={`flex items-center gap-3 p-4 rounded-xl ${result.is_healthy ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {result.is_healthy
              ? <CheckCircle className="text-green-600 shrink-0" size={28} />
              : <AlertTriangle className="text-red-500 shrink-0" size={28} />
            }
            <div className="flex-1">
              <p className="font-bold text-lg text-gray-800">{result.disease_name}</p>
              <p className="text-gray-500 text-sm">{result.description}</p>
            </div>
            <span className={`badge ${SEVERITY_COLOR[result.severity] || 'bg-gray-100 text-gray-700'}`}>
              {result.severity}
            </span>
          </div>

          {/* Confidence bar */}
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-500">AI Confidence</span>
              <span className="font-semibold text-farm-dark">{Math.round(result.confidence * 100)}%</span>
            </div>
            <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-farm-leaf rounded-full transition-all duration-700"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>

          {/* Treatments toggle */}
          {!result.is_healthy && (
            <>
              <button
                onClick={() => setDetails(d => !d)}
                className="w-full flex items-center justify-between text-farm-mid font-medium text-sm
                           bg-farm-pale px-4 py-2.5 rounded-xl hover:bg-green-100 transition"
              >
                View Treatment & Prevention Details
                {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>

              {showDetails && (
                <div className="grid sm:grid-cols-3 gap-4 pt-1">
                  {/* Organic */}
                  <div className="bg-green-50 rounded-xl p-4">
                    <p className="font-semibold text-farm-dark mb-2 text-sm">🌿 Organic Treatment</p>
                    <ul className="space-y-1.5">
                      {result.organic_treatment.map((t, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-farm-leaf mt-0.5">•</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Chemical */}
                  <div className="bg-blue-50 rounded-xl p-4">
                    <p className="font-semibold text-farm-dark mb-2 text-sm">🧪 Chemical Treatment</p>
                    <ul className="space-y-1.5">
                      {result.chemical_treatment.map((t, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-blue-400 mt-0.5">•</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                  {/* Prevention */}
                  <div className="bg-amber-50 rounded-xl p-4">
                    <p className="font-semibold text-farm-dark mb-2 text-sm">🛡️ Prevention Tips</p>
                    <ul className="space-y-1.5">
                      {result.prevention_tips.map((t, i) => (
                        <li key={i} className="text-sm text-gray-600 flex gap-2">
                          <span className="text-farm-amber mt-0.5">•</span>{t}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Healthy message */}
          {result.is_healthy && (
            <div className="bg-green-50 rounded-xl p-4 text-center">
              <p className="text-green-700 font-medium">✅ Your crop looks healthy! Keep up the good work.</p>
              <p className="text-green-600 text-sm mt-1">Continue regular monitoring and maintain good farming practices.</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
