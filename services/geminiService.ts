import { GoogleGenAI, HarmCategory, HarmBlockThreshold } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateJerseyImage = async (
  base64Image: string, 
  teamName: string, 
  colors: string[],
  logoBase64?: string
): Promise<string> => {
  const model = 'gemini-2.5-flash-image';

  // Helper to strip prefix if present (Gemini often prefers raw base64 or handles it, but stripping ensures consistency)
  const cleanBase64 = (dataUrl: string) => dataUrl.replace(/^data:image\/(png|jpeg|jpg|webp);base64,/, '');

  const imagePart = {
    inlineData: {
      mimeType: 'image/jpeg', 
      data: cleanBase64(base64Image)
    },
  };

  const colorsText = colors.join(" ve ");

  let promptText = `
    Bu fotoğraftaki kişiyi düzenle. 
    Kişinin üzerindeki kıyafeti değiştir ve ona "${teamName}" futbol takımının resmi formasını giydir.
    
    ÖNEMLİ KURALLAR:
    1. Kişinin yüzünü, saçını, ten rengini ve kafa yapısını KESİNLİKLE değiştirme. Sadece boyundan aşağısını (kıyafetini) değiştir.
    2. Forma renkleri: ${colorsText} olmalı.
  `;

  if (logoBase64) {
    promptText += `
    3. LOGO: Sağlanan ikinci görseldeki takım logosunu/armasını formanın sol göğsüne net bir şekilde yerleştir.
    4. Logonun renklerini ve şeklini bozma.
    `;
  } else {
    promptText += `
    3. LOGO: Formanın sol göğsünde ${teamName} takımının logosu olmalı.
    `;
  }

  promptText += `5. Fotoğraf fotogerçekçi, yüksek kaliteli ve profesyonel görünmeli.`;

  const parts: any[] = [imagePart];
  
  if (logoBase64) {
    parts.push({
      inlineData: {
        mimeType: 'image/png',
        data: cleanBase64(logoBase64)
      }
    });
  }

  parts.push({ text: promptText });

  const config = {
    safetySettings: [
      { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
      { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    ]
  };

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: { parts: parts },
      config: config
    });

    const responseParts = response.candidates?.[0]?.content?.parts;
    if (responseParts) {
      for (const part of responseParts) {
        if (part.inlineData) {
          return `data:image/png;base64,${part.inlineData.data}`;
        }
      }
    }
    throw new Error("Görsel oluşturulamadı: Yanıt içinde görsel bulunamadı.");
  } catch (error) {
    console.error("Gemini API Hatası:", error);
    throw new Error("Görsel oluşturulamadı.");
  }
};
