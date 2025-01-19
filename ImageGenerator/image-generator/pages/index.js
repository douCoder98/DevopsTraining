import { useState } from "react";
import styles from "./index.module.css";

const options = {
  characterType: ["Magicien", "Guerrier", "Archer", "Prince"],
  species: ["Humain", "Elfe", "Orc", "Pokémon"],
  color: ["Bleu", "Rouge", "Vert", "Noir"],
  weapon: ["Épée", "Arc", "Bâton magique", "Hache"],
  armor: ["Armure légère", "Armure lourde", "Robe mystique"],
};

const categoryTitles = {
  characterType: "Type de personnage",
  species: "Race ou espèce",
  color: "Couleur",
  weapon: "Arme",
  armor: "Armure",
};

export default function ImageGenerator() {
  const [selectedOptions, setSelectedOptions] = useState({
    characterType: "Magicien",
    species: "Humain",
    color: "Bleu",
    weapon: "Épée",
    armor: "Armure légère",
  });

  const [generatedImage, setGeneratedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSelect = (category, value) => {
    setSelectedOptions((prev) => ({
      ...prev,
      [category]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Parameters sent to backend:", selectedOptions);

    setLoading(true);
    setGeneratedImage(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(selectedOptions),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response from backend:", data);

      if (data) {
        setGeneratedImage(data.imageUrl);
        console.log("Image generated:", data.imageUrl);
      } else {
        alert("Erreur lors de la génération de l'image : " + data.error);
      }
    } catch (error) {
      console.error("Error fetching the image:", error);
      alert("Une erreur est survenue lors de la génération de l'image.");
    } finally {
      setLoading(false); // Arrêter l'indicateur de chargement
    }
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Générateur d'image de personnage</h1>
      <form onSubmit={handleSubmit} className={styles.form}>
        {Object.keys(options).map((category) => (
          <div key={category} className={styles.category}>
            <h2 className={styles.categoryTitle}>{categoryTitles[category]}</h2>
            <div className={styles.optionsContainer}>
              {options[category].map((option) => (
                <div
                  key={option}
                  className={`${styles.card} ${
                    selectedOptions[category] === option ? styles.selected : ""
                  }`}
                  onClick={() => handleSelect(category, option)}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>
        ))}
        <button type="submit" className={styles.button} disabled={loading}>
          {loading ? "Génération en cours..." : "Générer"}
        </button>
      </form>
      {generatedImage && (
        <div className={styles.imageContainer}>
          <h2 className={styles.imageTitle}>Image générée :</h2>
          <img src={generatedImage} alt="Generated" className={styles.image} />
        </div>
      )}
    </div>
  );
}
