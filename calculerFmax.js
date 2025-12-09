// Fonction JavaScript de Calcul
function calculerFmax(m, v, d_m, L0, E, g) {
    // d_m est le diamètre en mètres
    
    // Étape 1 : Aire de la section transversale (A = π * d² / 4)
    const A = Math.PI * Math.pow(d_m, 2) / 4;

    // Étape 2 : Poids / Charge statique (P = m * g)
    const P = m * g;
    
    // Étape 3 : Terme dynamique sous la racine
    // Terme = (m*g)^2 + (m * v^2 * E * A / L0)
    const termeSousRacine = Math.pow(P, 2) + (m * Math.pow(v, 2) * E * A / L0);

    // Étape 4 : Force Fmax = P + sqrt(Terme)
    const Fmax = P + Math.sqrt(termeSousRacine);

    return { Fmax, P };
}

// Gestion de l'événement de soumission du formulaire
document.getElementById('calcForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupération des valeurs des champs
    const m = parseFloat(document.getElementById('m').value);
    const v = parseFloat(document.getElementById('v').value);
    const d_mm = parseFloat(document.getElementById('d_mm').value);
    const L0 = parseFloat(document.getElementById('L0').value);
    const E = parseFloat(document.getElementById('E').value);
    const g = parseFloat(document.getElementById('g').value);
    
    // Conversion du diamètre de mm en mètres (S.I. nécessaire pour le calcul)
    const d_m = d_mm / 1000;

    // Appel de la fonction de calcul
    const { Fmax, P } = calculerFmax(m, v, d_m, L0, E, g);
    
    // Affichage des résultats
    const resultatDiv = document.getElementById('resultat');
    
    const Fmax_text = Fmax.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    const P_text = P.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    const facteur_choc = (Fmax / P).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    
    resultatDiv.innerHTML = `
        <p>✅ Poids statique (P) : ${P_text} N</p>
        <p>✅ Force d'Impact maximale (F<sub>max</sub>) : ${Fmax_text} N</p>
        <p>📈 Facteur de Choc (F<sub>max</sub> / P) : ${facteur_choc}</p>
    `;
    resultatDiv.style.display = 'block';
});


