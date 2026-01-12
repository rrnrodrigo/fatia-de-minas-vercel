
import { GoogleGenAI } from "@google/genai";

export async function getCheeseRecommendation(pref: string) {
  // Use a chave de API injetada pelo ambiente
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é o 'Tião', o Mestre Queijeiro da loja 'Fatia de Minas'. 
      Sua missão é ajudar o cliente a escolher um produto mineiro.
      O cliente disse: "${pref}". 
      Responda como um mineiro autêntico da roça: use 'uai', 'trem', 'sô', 'prosa', 'café coado'. 
      Recomende um queijo (ex: Canastra, Serro, Salitre) ou doce e uma harmonização típica.
      Sua resposta deve ter no máximo 3 frases e ser muito calorosa.`,
    });
    
    // Acessa o texto gerado diretamente como propriedade
    return response.text;
  } catch (error) {
    console.error("AI Error:", error);
    return "Eita, o sistema deu um tropeço aqui, sô! Mas ó, leva o Canastra Real que não tem erro não, viu? É o nosso campeão!";
  }
}
