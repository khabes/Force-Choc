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

// Conversion des unités de vitesse et de diamètre pour le calcul
function convertirUnites(v_input, v_unit, d_mm) {
    const v = v_unit === 'm/min' ? v_input / 60 : v_input;
    const d_m = d_mm / 1000;
    return { v, d_m };
}

let cmuParDiametre = [];
const CMU_CSV_FALLBACK = `Diamètre du cable (mm);CMU (kg)
3;100
4;178
5;278
6;400
7;570
8;710
9;898
10;1108
11;1342
12;1596
13;1798
14;2080
16;2720
18;3440
20;4260
22;5140
24;6120
26;7200
28;8340
30;10600
32;12200
36;15420
38;17200
40;19040
44;24800
48;29600
52;34800`;

function parseCsvCmu(csvText) {
    return csvText
        .split(/\r?\n/)
        .map((ligne) => ligne.trim())
        .filter(Boolean)
        .slice(1)
        .map((ligne) => {
            const [diametreText, cmuText] = ligne.split(';');
            const diametre = parseFloat(diametreText);
            const cmu = parseFloat(cmuText);

            if (Number.isFinite(diametre) && Number.isFinite(cmu)) {
                return { diametre, cmu };
            }

            return null;
        })
        .filter(Boolean)
        .sort((a, b) => a.diametre - b.diametre);
}

async function chargerCmuCsv() {
    if (cmuParDiametre.length > 0) {
        return cmuParDiametre;
    }

    try {
        const reponse = await fetch('CMU Câbles Acier.csv');
        if (!reponse.ok) {
            throw new Error('Impossible de charger le fichier CSV.');
        }

        const csvText = await reponse.text();
        cmuParDiametre = parseCsvCmu(csvText);
        return cmuParDiametre;
    } catch (erreur) {
        console.warn('Erreur lors du chargement du fichier CMU CSV :', erreur);
        cmuParDiametre = parseCsvCmu(CMU_CSV_FALLBACK);
        return cmuParDiametre;
    }
}

function getCmuPourDiametre(d_mm) {
    if (!cmuParDiametre.length) {
        return null;
    }

    let reference = null;
    for (const item of cmuParDiametre) {
        if (item.diametre <= d_mm) {
            reference = item;
        } else {
            break;
        }
    }

    return reference;
}

function verifierMasseCmu(m, d_mm) {
    const reference = getCmuPourDiametre(d_mm);

    if (!reference) {
        return {
            conforme: null,
            message: 'Aucune valeur CMU n’a pu être trouvée pour ce diamètre.'
        };
    }

    const conforme = m <= reference.cmu;
    const message = conforme
        ? `✅ Masse de l'objet (${m.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kg) est inférieure ou égale à la CMU de ${reference.cmu.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kg pour un diamètre de ${reference.diametre} mm.`
        : `⚠️ Attention : la masse de l'objet (${m.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kg) dépasse la CMU de ${reference.cmu.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} kg pour un diamètre de ${reference.diametre} mm.`;

    return { conforme, message };
}

// Gestion de l'événement de soumission du formulaire
document.getElementById('calcForm').addEventListener('submit', async function(event) {
    event.preventDefault(); // Empêche le rechargement de la page

    // Récupération des valeurs des champs
    const m = parseFloat(document.getElementById('m').value);
    const v_input = parseFloat(document.getElementById('v').value);
    const v_unit = document.getElementById('v_unit').value;
    const d_mm = parseFloat(document.getElementById('d_mm').value);
    const L0 = parseFloat(document.getElementById('L0').value);
    const E = parseFloat(document.getElementById('E').value);
    const g = parseFloat(document.getElementById('g').value);

    await chargerCmuCsv();

    // Conversion des unités pour le calcul
    const { v, d_m } = convertirUnites(v_input, v_unit, d_mm);

    // Appel de la fonction de calcul
    const { Fmax, P } = calculerFmax(m, v, d_m, L0, E, g);

    // Affichage des résultats
    const resultatDiv = document.getElementById('resultat');

    const Fmax_text = Fmax.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    const P_text = P.toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    const facteur_choc = (Fmax / P).toLocaleString('fr-FR', { maximumFractionDigits: 2 });
    const verification = verifierMasseCmu(m, d_mm);

    resultatDiv.innerHTML = `
        <p><img src="icon/Weight.png" alt="Poids statique" height="24" width="24"> Poids statique (P) : ${P_text} N</p>
        <p><img src="icon/icon-192x192.png" alt="Force d'Impact maximale" height="24" width="24"> Force d'Impact maximale (F<sub>max</sub>) : ${Fmax_text} N</p>
        <p><img src="icon/Calc.png" alt="Facteur de Choc" height="24" width="24"> Facteur de Choc (F<sub>max</sub> / P) : ${facteur_choc}</p>
        <p>${verification.message}</p>
    `;
    resultatDiv.style.display = 'block';

    if (verification.conforme === false) {
        window.alert(verification.message);
    }
});

