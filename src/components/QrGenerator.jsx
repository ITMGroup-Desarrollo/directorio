import { useState } from 'react'
import QRCode from 'qrcode'
import { data } from '../data/personas.js'

export default function QrGenerator() {
  const [query, setQuery] = useState('')
  const [qrUrl, setQrUrl] = useState('')
  const [error, setError] = useState('')
  const [results, setResults] = useState([])
  const [showEspacioQR, setShowEspacioQR] = useState(true) // Nuevo estado para controlar la visibilidad

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
    setShowEspacioQR(false) // Ocultar el espacioQR al iniciar el submit
    
    const persona = data.find(({ nombre, apellido }) => {
      const q = query.trim().toLowerCase()
      return nombre.toLowerCase().includes(q) || apellido.toLowerCase().includes(q)
    })
    
    if (!persona) {
      setError(`No se encontró nadie con "${query}".`)
      setShowEspacioQR(true) // Mostrar nuevamente si hay error
      return
    }
    generateQRFor(persona)
  }

  return (
    <div className="gen-container w-screen h-screen mx-auto text-center items-center flex flex-col justify-center">
      <div className='opacity-container w-screen h-screen mx-auto p-4 text-center items-center flex flex-col '>
      <div className='w-full max-w-md mx-auto mt-20 justify-center items-center flex flex-col'>
        <form onSubmit={handleSubmit} className="relative w-80">
          <div className='flex flex-row relative'>
            <input
              type="text"
              placeholder="  Nombre o apellido"
              value={query}
              onChange={handleInputChange}
              className="w-full p-2 border rounded-full bg-white input-search"
            />
            <img src="/assets/lupa.svg" alt="lupa" className='w-6 h-6 absolute right-2 mr-2 mt-2'/>
          </div>
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
        
        {showEspacioQR && !qrUrl && (
          <div className='mt-12 espacioQR w-80 h-80 rounded-4xl bg-white'></div>
        )}
      </div>

      {error && (
        <p className="mt-3 text-red-600">
          {error}
        </p>
      )}

      {qrUrl && (
        <div className="mt-12 w-full text-center relative flex flex-col items-center">
          <div className='flex justify-center items-center w-80 h-80 rounded-4xl bg-white'>
            <img src={qrUrl} alt="Código QR generado" className="mx-auto w-76 h-76 rounded-4xl" />
          </div>
          <a
            href={qrUrl}
            download={`qr-${query.trim() || 'person'}.png`}
            className="flex items-center justify-center absolute descarga"
          >
            <img src="/assets/descarga.svg" alt="descargar" className='w-10 h-10'/>
          </a>
        </div>
      )}
      </div>
    </div>
  )
}