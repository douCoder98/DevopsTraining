import { OpenAI } from 'openai';
import 'dotenv/config';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
// Fonction utilitaire pour nettoyer les données
function sanitizeInput(input) {
  return input
    .toLowerCase() // Convertir en minuscules
    .normalize("NFD") // Normaliser pour séparer les accents des lettres
    .replace(/[\u0300-\u036f]/g, "") // Supprimer les accents
    .replace(/[^a-z0-9\s]/g, ""); // Supprimer les caractères spéciaux
}
export default async function handler(req, res) {
  // Gestion des en-têtes CORS
  res.setHeader('Access-Control-Allow-Origin', '*'); // Remplacez '*' par le domaine spécifique si nécessaire, par exemple 'http://localhost:3000'
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Réponse pour les requêtes OPTIONS (prévol)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  let { characterType, species, color, weapon, armor } = req.body;
  characterType = sanitizeInput(characterType);
  species = sanitizeInput(species);
  color = sanitizeInput(color);
  weapon = sanitizeInput(weapon);
  armor = sanitizeInput(armor);
  console.log('Parameters received:', { characterType, species, color, weapon, armor });


  // Validation des paramètres requis
  if (!characterType || !species || !color || !weapon || !armor) {
    return res.status(400).json({ error: 'Missing required parameters.' });
  }

  const prompt = `Une ${color} ${species} ${characterType} portant une ${weapon} avec une ${armor}.`;

  try {
    const response = await openai.images.generate({
      prompt,
      n: 1,
      size: '512x512',
    });

    const imageUrl = response.data[0].url;
    res.status(200).json({ imageUrl });
  } catch (error) {
    console.error('OpenAI API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to generate image.' });
  }
}
