const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const archvos = [
    '2026/N21RedBrown-1.jpg',
    '2026/N21RedBrown-2.jpg',
    '2026/N21RedBrown-3.jpg',
    '2026/N21RedBrown-4.jpg',
    '2026/N21RedBrown-5.jpg',
    '2026/N21RedBrown-6.jpg',
    '2026/N21RedBrown-7.jpg',
    '2026/N21RedBrown-8.jpg'
];

async function comprimir() {
    for (let f of archvos) {
        let rutaCompleta = path.join(__dirname, f);
        try {
            let stat = fs.statSync(rutaCompleta);
            if (stat.size > 1.9 * 1024 * 1024) { // Pesa mas de 1.9MB aprox
                console.log(`Comprimiendo ${f} (${(stat.size/1024/1024).toFixed(2)} MB)...`);
                let inputBuffer = fs.readFileSync(rutaCompleta);
                let bufferSalida = await sharp(inputBuffer).jpeg({ quality: 75 }).toBuffer();
                fs.writeFileSync(rutaCompleta, bufferSalida);
                let newStat = fs.statSync(rutaCompleta);
                console.log(`  -> ¡Listo! Ahora pesa ${(newStat.size/1024/1024).toFixed(2)} MB`);
            } else {
                console.log(`Omitiendo ${f} -> Ya pesa menos de 2MB (${(stat.size/1024/1024).toFixed(2)} MB).`);
            }
        } catch (error) {
            console.error(`Error con ${f}:`, error.message);
        }
    }
}

comprimir();
