import { useState, useEffect } from "react";
import QRCodeStyling from "qr-code-styling";
import { data } from "../data/personas.js";
import html2canvas from "html2canvas";

export default function QrGenerator() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [qrInstance, setQrInstance] = useState(null);

  useEffect(() => {
    const qr = new QRCodeStyling({
      width: 300,
      height: 300,
      type: "svg",
      image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAF5UlEQVR4Xu2bvYtcRRTHP1+MoihgoXyg0eCCiAf6gK1FF2FSrkDY10oHdoCv4At3aCf6g2R9D2Ig0VY6IQJVURRd0H9QfKJJNne/5szs7q7Ozt+/szZzfn3nu/vmfef+Z37rfvwGpF1uxu+OXJAIr3BjjCdwDl9IHKkKcGlB+eMRe7cc0A3uhYxz2rRkYBf0EcsM5uRu5RGy9DEAKM9iJm+PY0+7kdPyOcHNu06HYz5NB+TGnEkDTz/DO4HPZC8NtdlG4bfvh8Ax3wiBo7RS1sK7i7QAJ7yPN/d4UPvoX9gHl3kRyfjNyEY+1rVgLg1veU2bC/urTAYtLvh+bIWs/v1ziqTWwkeNjEvxW/F9a1GgBGZsTdcPjR5KzSR1XYJK7nw+6F8RXLKyQ3Sz8Cy/fkEGes+K2xhN0RMg4jQUL07Qv9xDkGvvTq9RQWmxe0pmv4/V++HRgobWFm6muvqBdyaeZPWtUtMSZ9UlZrMf5+N+W9T9egDrGvjXPcFo3cRnWqorP3gWzDjZZGbDNypURu9G2GHtZ7QjySpsczbWx6cZNuSbEey12KHvmtxHwNlye7lQ0aZQUbe7lKTnGE5gUs9KxOuzYKr6IsBrD1ldZlBbv5q/whRfUQ+DO6VrJ8FsPqzUFDhnCV0oy/5Wa2lI5gaDEv5XQn0ZqNl9KhkS+HU8hxAq2dDg8qpEbJX3ckj2WsyEdAYFlXFo3HcJjfpWD6eWY9G8p69I8fHtjVGFFSmK2j/ow0axhYmOSraUCPiDnGTk6Cz7cSSptQnJuxMHRbsPHW3j4gZHxt/fD1a50DXc3Pbov/FC+GSfneW7zJ2g5R+U5fp9MNhtONgpeRPZasrCE3alXybdJ/l02nR9ZYRAuLSmZB5p+8wDMe73WnZYQMyNLJx3HmyX2llLIpyoNPKWyHLGVVWDkqZ4qg0sJvOgt0IbUV6shbWwq+1+KGGU97QEG+9nW49vAhKoROSe4oPPuMdP70cxvkskYax0p6yFKNTS1hvglkh33vKkhulWd+XvltCPcXbGyVmRFk+clZqpMfPYiFlH8Em1qIauON9h7VX4N99+Ns7WLrE+3UDXw6ce9WvSeEez5YqgVqYwCr0vbg0zXRnmbQccOpFcvO1UdoXL5WdAm+c9I2NgWPDP7EY8TY7p0x6PIdQ74EEsjcIjUSr0zkobZ09nO0m1u5v1If6m0Mju5d84OSbKy9A9qS6qEnK3nR30Oj4qxYd5+eSo/N4ptBpbMvEvxt/EovEzzhr+C1XW0frPhsAAAAASUVORK5CYII=",
      data: "",
      imageOptions: {
        crossOrigin: "anonymous",
        margin: 3,
        imageSize: 0.5,
      },
      dotsOptions: {
        type: "dots",
        color: "#23346f",
      },
      cornersSquareOptions: {
        type: "extra-rounded",
        color: "#23346f",
      },
      cornersDotOptions: {
        type: "extra-rounded",
        color: "#23346f",
      },
      backgroundOptions: {
        color: "#ffffff",
      },
    });
    setQrInstance(qr);
  }, []);

  const handleInputChange = (e) => {
    const value = e.target.value;
    setQuery(value);
    setError("");
    if (value.trim()) {
      const q = value.trim().toLowerCase();
      const matches = data.filter(
        ({ nombre, apellido }) =>
          nombre.toLowerCase().includes(q) || apellido.toLowerCase().includes(q)
      );
      setResults(matches);
    } else {
      setResults([]);
    }
  };

  const handleSelect = (persona) => {
    setQuery(`${persona.nombre} ${persona.apellido}`);
    setResults([]);
    generateQRFor(persona);
  };

  const generateQRFor = (persona) => {
    const url = `https://executive-cards.netlify.app/${persona.id}/`;
    if (qrInstance) {
      qrInstance.update({ data: url });
      const qrContainer = document.getElementById("styled-qr");
      if (qrContainer) {
        qrContainer.innerHTML = "";
        qrInstance.append(qrContainer);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const persona = data.find(({ nombre, apellido }) => {
      const q = query.trim().toLowerCase();
      return (
        nombre.toLowerCase().includes(q) || apellido.toLowerCase().includes(q)
      );
    });
    if (!persona) {
      setError(`No se encontr\u00f3 nadie con "${query}".`);
      return;
    }
    generateQRFor(persona);
  };

  const handleDownload = async () => {
    const area = document.getElementById("download-area");
    if (!area) return;

    const canvas = await html2canvas(area);
    const link = document.createElement("a");
    link.download = `qr-${query.trim()}.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  return (
    <div  className="w-screen h-screen mx-auto text-center items-center flex flex-col  z-0">
      <form onSubmit={handleSubmit} className="relative w-80 top-15 md:top-5 absolute z-2">
            <div className="flex flex-row relative">
              <input
                type="text"
                placeholder="  Nombre o apellido"
                value={query}
                onChange={handleInputChange}
                className="w-full p-2 rounded-full bg-white input-search"
              />
              <img
                src="/assets/lupa.svg"
                alt="lupa"
                className="w-6 h-6 absolute right-2 mr-2 mt-2"
              />
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
    <div id="download-area"  className="gen-container absolute w-screen h-screen mx-auto text-center items-center flex flex-col justify-center z-1">
    <div  className="opacity-container w-screen h-screen mx-auto p-4 text-center items-center flex flex-col ">
        <div className="w-full max-w-md mx-auto mt-20 md:mt-5 justify-center items-center flex flex-col relative">
        <div
              className="flex flex-col top-12 absolute items-center justify-center bg-white p-4 rounded-4xl shadow-md"
            >
              <img
                src="/assets/logo.svg"
                alt="logo"
                className=" absolute w-36 h-36 "
              />
              <div
                className="w-[300px] h-[300px]"
              ></div>
            </div>
        </div>

        {error && <p className="mt-3 text-red-600">{error}</p>}

        {!error && query && (
          <div className="mt-12 w-full text-center relative flex flex-col items-center">
            <div
              className="flex flex-col items-center justify-center bg-white p-4 rounded-4xl shadow-md"
            >
              
              <div
                id="styled-qr"
                className="w-[300px] h-[300px] rounded-4xl transition-all duration-500 ease-in-out"
              ></div>
            </div>
            <h2 className="mt-8 md:mt-4 text-lg font-bold mb-2 poppins full-name text-white">{query}</h2>
            <button
              type="button"
              onClick={handleDownload}
              className="flex items-center justify-center absolute descarga"
            >
              <img
                src="/assets/descarga.svg"
                alt="descargar"
                className="w-10 h-10 transition-all duration-500 ease-in-out animate-fadeIn"
              />
            </button>
          </div>
        )}
      </div>
    </div>
    </div>
  );
}
