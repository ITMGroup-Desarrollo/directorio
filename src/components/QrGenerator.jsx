// src/components/QrGenerator.jsx
import { useState } from 'react'
import QRCode from 'qrcode'
import { data } from '../data/personas.js'

export default function QrGenerator() {
  const [query, setQuery] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState([])

  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setError('')
    setQrUrl('')
    if (value.trim()) {
      const q = value.trim().toLowerCase()
      const matches = data.filter(({ nombre, apellido }) =>
        nombre.toLowerCase().includes(q) || apellido.toLowerCase().includes(q)
      )
      setResults(matches)
    } else {
      setResults([])
    }
  }

  const handleSelect = (persona) => {
    setQuery(`${persona.nombre} ${persona.apellido}`)
    setResults([])
    generateQRFor(persona)
  }

  const generateQRFor = async (persona) => {
    setError('')
    setQrUrl('')
    const url = `https://executive-cards.netlify.app/${persona.id}/`
    try {
      const dataUrl = await QRCode.toDataURL(url)
      setQrUrl(dataUrl)
    } catch (err) {
      console.error(err)
      setError('Error generando el código QR.')
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setQrUrl('')
    const persona = data.find(({ nombre, apellido }) => {
      const q = query.trim().toLowerCase()
      return nombre.toLowerCase().includes(q) || apellido.toLowerCase().includes(q)
    })
    if (!persona) {
      setError(`No se encontró nadie con "${query}".`)
      return
    }
    generateQRFor(persona)
  }

  return (
    <div className="max-w-md mx-auto p-4">
      <h2 className="text-xl font-bold mb-4">Generador de Código QR</h2>

      <form onSubmit={handleSubmit} className="space-y-2 relative">
        <input
          type="text"
          placeholder="Buscar por nombre o apellido..."
          value={query}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
        />
        {results.length > 0 && (
          <ul className="absolute z-10 bg-white border rounded w-full mt-1 max-h-40 overflow-auto">
            {results.map((persona) => (
              <li
                key={persona.id}
                onClick={() => handleSelect(persona)}
                className="p-2 hover:bg-gray-100 cursor-pointer"
              >
                {persona.nombre} {persona.apellido}
              </li>
            ))}
          </ul>
        )}
      </form>

      {error && (
        <p className="mt-3 text-red-600">
          {error}
        </p>
      )}

      {qrUrl && (
        <div className="mt-6 text-center">
          <img src={qrUrl} alt="Código QR generado" className="mx-auto w-48 h-48" />
          <a
            href={qrUrl}
            download={`qr-${query.trim() || 'person'}.png`}
            className="inline-block mt-4 text-blue-600 underline"
          >
            Descargar QR
          </a>
        </div>
      )}
    </div>
  )
}
