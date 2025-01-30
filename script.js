document.addEventListener("DOMContentLoaded", () => {
    console.info("DOM ist vollständig geladen.");

    setTimeout(() => {
        if (window.bootstrap) {
            console.info("Bootstrap erfolgreich registriert.", window.bootstrap);
        } else {
            console.warn("Bootstrap ist nicht definiert.");
        }
    }, 500);
});

// Erkennung der Benutzerpräferenz
const userLanguage = navigator.language || navigator.userLanguage;
const rtlLanguages = ['ar', 'he', 'fa', 'ur'];
const isRTL = rtlLanguages.includes(userLanguage.split('-')[0]);

if (isRTL) {
    document.documentElement.setAttribute('dir', 'rtl');
}

// Dynamisches Einbinden von Chart.js mit Ladeüberwachung
const chartScript = document.createElement('script');
chartScript.src = 'https://cdn.jsdelivr.net/npm/chart.js';
chartScript.onload = () => {
    setzeAktualisierungsdatum();
    aktualisiereTabelle();
};
document.head.appendChild(chartScript);

// Beispielhafte Daten für die Tabelle
const emissionsDaten = [
    ["USA", "EcoPower Inc.", 150000],
    ["USA", "GreenFuture Solutions", 120000],
    ["Deutschland", "Klimawerk AG", 85000],
    ["Deutschland", "Energie21 GmbH", 90000],
    ["China", "BlueSky Ltd.", 250000],
    ["China", "CarbonTech Corp.", 180000],
    ["Indien", "EcoEnergy Pvt. Ltd.", 130000],
    ["Indien", "GreenFields Ltd.", 110000],
    ["Frankreich", "EnergieVert SAS", 75000],
    ["Frankreich", "Terre Verte Sarl", 60000],
    ["Japan", "FutureTech Co.", 95000],
    ["Japan", "Sustainable Systems Inc.", 85000]
];

// Eingabevalidierung zur Sicherheit
function sanitizeInput(input) {
    return input.replace(/[^a-zA-Z0-9\s\u00C0-\u017F.-]/g, '');
}

// Setze aktuelles Datum für "Letzte Aktualisierung"
function setzeAktualisierungsdatum() {
    const aktuellesDatum = new Date().toLocaleDateString('de-DE', {
        day: '2-digit', month: 'long', year: 'numeric'
    });
	console.log(document.getElementById("aktualisierung-info"));
    document.getElementById("aktualisierung-info").textContent += aktuellesDatum;
}

// Berechnungsfunktion für die Gesamteinsparung
function berechneEinsparung(gesamtEmissionen) {
    const zielEinsparung = 0.2;
    return gesamtEmissionen * zielEinsparung;
}

// Dynamisches Diagramm zur Visualisierung der Emissionen
function erstelleDiagramm(daten) {
    let chartContainer = document.getElementById('chart-container');
    if (!chartContainer) {
        chartContainer = document.createElement('div');
        chartContainer.id = 'chart-container';
        chartContainer.style.width = '100%';
        chartContainer.style.height = '400px';
        document.querySelector('main').appendChild(chartContainer);
    }

    chartContainer.innerHTML = '<canvas id="emissionsChart"></canvas>';
    const ctx = document.getElementById('emissionsChart').getContext('2d');

    const labels = daten.map(item => item[0] + ' - ' + item[1]);
    const emissions = daten.map(item => item[2]);

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'CO₂-Emissionen (Tonnen)',
                data: emissions,
                backgroundColor: 'rgba(46, 204, 113, 0.5)',
                borderColor: 'rgba(46, 204, 113, 1)',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

// Gesamtemissionen und Einsparung berechnen
function aktualisiereEinsparung(gefilterteDaten) {
    const einsparungBereich = document.getElementById("einsparung-bereich");
    einsparungBereich.innerHTML = '';

    const gesamtEmissionen = gefilterteDaten.reduce((summe, [, , emission]) => summe + emission, 0);
    const gesamtEinsparung = berechneEinsparung(gesamtEmissionen);

    const einsparungAnzeige = document.createElement("p");
    einsparungAnzeige.textContent = `Geschätzte Gesamteinsparung: ${gesamtEinsparung.toFixed(2)} Tonnen CO₂ (20% Ziel)`;
    einsparungBereich.appendChild(einsparungAnzeige);
}

// Tabelle mit Daten füllen und Filter berücksichtigen
function aktualisiereTabelle() {
    const tabellenBody = document.getElementById("daten-tabelle");
    tabellenBody.innerHTML = '';

    const landFilterWert = sanitizeInput(document.getElementById('landFilter').value.toLowerCase());
    const unternehmenFilterWert = sanitizeInput(document.getElementById('unternehmenFilter').value.toLowerCase());

    const gefilterteDaten = emissionsDaten.filter(([land, unternehmen]) => {
        const landMatch = land.toLowerCase().includes(landFilterWert);
        const unternehmenMatch = unternehmen.toLowerCase().includes(unternehmenFilterWert);
        return landMatch && unternehmenMatch;
    });

    gefilterteDaten.forEach(([land, unternehmen, emission]) => {
        const tr = document.createElement("tr");
        [land, unternehmen, emission].forEach(zelle => {
            const td = document.createElement("td");
            td.textContent = zelle;
            tr.appendChild(td);
        });
        tabellenBody.appendChild(tr);
    });

    aktualisiereEinsparung(gefilterteDaten);
    erstelleDiagramm(gefilterteDaten);
}

document.getElementById('landFilter').addEventListener('input', aktualisiereTabelle);
document.getElementById('unternehmenFilter').addEventListener('input', aktualisiereTabelle);

document.addEventListener('DOMContentLoaded', () => {
    const chartDiv = document.createElement('div');
    chartDiv.id = 'chart-container';
    chartDiv.style.width = '100%';
    chartDiv.style.height = '400px';
    document.querySelector('main').appendChild(chartDiv);
});