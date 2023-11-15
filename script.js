// Sélectionnez tous les éléments de type "path" et "polygon" et ajoutez un écouteur d'événements pour le clic
document.querySelectorAll("path, polygon").forEach(element => {
    element.addEventListener('click', function () {
        // Récupérez l'identifiant de l'État à partir de l'élément cliqué
        const CRITERIA_STATE = this.id;
        
        // Effectuez une requête pour récupérer les données du fichier JSON
        fetch('data2.json')
            .then((response) => response.json())
            .then((dataFetched) => {
                // Définissez la plage d'années de 2015 à 2023
                const yearRange = Array.from({ length: 9 }, (_, index) => (2015 + index).toString());
                // Définissez l'indicateur comme 'Methadone (T40.3)'
                const CRITERIA_INDICATOR = 'Methadone (T40.3)';
                // Stockage de la somme des valeurs de données pour chaque année
                const sumValuesByYear = Array(yearRange.length).fill(0); // Initialisez le tableau avec des zéros

                // Filtrez en fonction des critères
                dataFetched.forEach(d => {
                    if (
                        yearRange.includes(d.Year) &&
                        d && d["State Name"] === CRITERIA_STATE &&
                        d.Indicator === CRITERIA_INDICATOR
                    ) {
                        // Convertissez la valeur de données en nombre
                        const numericValue = parseFloat(d["Data Value"].replace(',', ''));

                        // Ajoutez la valeur de données convertie en nombre à la somme de l'année correspondante
                        const yearIndex = yearRange.indexOf(d.Year);
                        if (!isNaN(numericValue)) {
                            sumValuesByYear[yearIndex] += numericValue;
                            console.log(sumValuesByYear)
                        }
                    }
                });

                const dataPoints = yearRange.map((year, index) => ({
                    x: parseInt(year, 10), // Utilisez parseInt pour obtenir un nombre entier
                    y: sumValuesByYear[index]
                }));

                // Utilisez D3.js pour créer un graphique en ligne
                const svg = d3.select('.graphique');

                const margin = { top: 20, right: 20, bottom: 30, left: 50 };
                const width = +svg.attr('width') - margin.left - margin.right;
                const height = +svg.attr('height') - margin.top - margin.bottom;

                const x = d3.scaleLinear()
                    .range([0, width])
                    .domain(d3.extent(dataPoints, d => d.x));

                const y = d3.scaleLinear()
                    .range([height, 0])
                    .domain([0, d3.max(dataPoints, d => d.y)]);

                const line = d3.line()
                    .x(d => x(d.x))
                    .y(d => y(d.y));

                    svg.select(".graphGroup").remove();
                // Ajoutez un groupe pour le tracé du graphe
                const graphGroup = svg.append('g')
                    .attr('transform', `translate(${margin.left},${margin.top})`)
                    .attr('class',"graphGroup");
                // Effacez le contenu existant du groupe
                graphGroup.selectAll('*').remove();

                // Ajoutez la ligne du graphique avec le dégradé
                const linePath = graphGroup.append('path')
                    .data([dataPoints])
                    .attr('class', 'line')
                    .attr('d', line)
                    .style('stroke', 'url(#line-gradient)') // Utilisez le dégradé
                    .style('stroke-width', 3) // Ajustez l'épaisseur du trait
                    .attr('fill', 'none');

                // Création et Ajout du dégradé au SVG
                svg.append("defs").append("linearGradient")
                    .attr("id", "line-gradient")
                    .attr("gradientUnits", "userSpaceOnUse")
                    .attr("x1", 0).attr("y1", y(0))
                    .attr("x2", 0).attr("y2", y(d3.max(dataPoints, d => d.y)))
                    .selectAll("stop")
                    .data([
                        { offset: "0%", color: "#E42A2A" },
                        { offset: "50%", color: "#DA5B58" },
                        { offset: "100%", color: "#ED8240" }
                    ])
                    .enter().append("stop")
                    .attr("offset", d => d.offset)
                    .attr("stop-color", d => d.color);

                // Obtenez la longueur totale du chemin
                const totalLength = linePath.node().getTotalLength();

                // Ajoutez l'animation du tracé
                linePath
                    .attr('stroke-dasharray', `${totalLength} ${totalLength}`)
                    .attr('stroke-dashoffset', totalLength)
                    .transition()
                    .duration(1500) // Durée de l'animation en millisecondes
                    .ease(d3.easeLinear)
                    .attr('stroke-dashoffset', 0);

                // Ajoutez les cercles pour chaque point de données
                graphGroup.selectAll('circle')
                    .data(dataPoints)
                    .enter().append('circle')
                    .attr('cx', d => x(d.x))
                    .attr('cy', d => y(d.y))
                    .attr('r', 4) // Rayon du cercle
                    .attr('fill', 'white'); // Couleur du cer

                // Ajoutez les axes x et y
                graphGroup.append('g')
                    .attr('transform', `translate(0, ${height})`)
                    .call(d3.axisBottom(x))
                    .attr('fill', 'white');

                graphGroup.append('g')
                    .call(d3.axisLeft(y))
                    .attr('fill', 'white');
            });

        // Faites défiler la vue vers l'élément contenant le graphique
        document.getElementById('graphique').scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});
