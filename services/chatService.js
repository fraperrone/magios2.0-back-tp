import { GoogleGenAI } from '@google/genai'
import conocimiento from '../data/chatConocimiento'

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
})

export const consultarGemini = async (historial, mensaje) => {
  const response = await ai.models.generateContent({
    model: 'gemini-3.6-flash',

    contents: `
      INFORMACIÓN DISPONIBLE:
      ${conocimiento}

      PREGUNTA DEL USUARIO:
      ${pregunta}
    `,

    config: {
      systemInstruction: `
        Sos un asistente virtual amable.
        Respondé en español.
        Utilizá respuestas claras y sencillas.
      `,
    },
  })

  return response.text
}
