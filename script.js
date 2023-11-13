// tous les éléments de type "path" et "polygon" et ajoutez un écouteur d'événements pour le clic
document.querySelectorAll("path,polygon").forEach(element => {
element.addEventListener('click', function() {
// on récupère l'identifiant de l'État à partir de l'élément cliqué
const CRITERIA_STATE = this.id;
// Effectuez une requête pour récupérer les données du fichier JSON
fetch('data2.json')
    .then((response) => response.json())
    .then((dataFetched) => {
        // on definit la plage d'années de 2015 à 2023
        const yearRange = Array.from({ length: 9 }, (_, index) => (2015 + index).toString());
        // on definit l'indicateur comme 'Methadone (T40.3)'
        const CRITERIA_INDICATOR = 'Methadone (T40.3)'
        // stockage de la somme des valeurs de données pour chaque année
        const sumValuesByYear = Array(yearRange.length).fill(0); // Initialiser le tableau avec des zéros
        //  filtrez en fonction des critères
        dataFetched.forEach(d => {
        if (
            yearRange.includes(d.Year) &&
            d && d["State Name"] === CRITERIA_STATE &&
            d.Indicator === CRITERIA_INDICATOR
            ) {
            // Initialisez la somme pour l'année si elle n'existe pas encore
            if (!isNaN(numericValue)) {
                sumValuesByYear[yearIndex] += numericValue;
            }

// on ajoute la valeur de données convertie en nombre à la somme de l'année correspondante
  const numericValue = parseFloat(d["Data Value"].replace(',', ''));


// on verifie si la conversion a réussi (remplacez NaN par 0)
 
}
});
console.log(sumValuesByYear);
            });
    });
});

//Dessiner le graphe en utilisant la somme 


