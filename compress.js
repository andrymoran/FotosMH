const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const carpetaRaiz = __dirname;
// LÍMITE REDUCIDO A 2MB SEGÚN LO SOLICITADO
const limiteBytes = 2 * 1024 * 1024; 

// Carpetas que no queremos escanear
const ignorar = ['.git', 'node_modules'];

let comprimidosTotal = 0;

async function procesarCarpeta(carpeta) {
    try {
        const archivos = fs.readdirSync(carpeta);

        for (const archivo of archivos) {
            const rutaCompleta = path.join(carpeta, archivo);
            const stats = fs.statSync(rutaCompleta);

            if (stats.isDirectory() && !ignorar.includes(archivo)) {
                await procesarCarpeta(rutaCompleta);
            } 
            // Si es un archivo, pesa > 2MB y es imagen
            else if (stats.isFile() && stats.size > limiteBytes && /\.(png|jpe?g)$/i.test(archivo)) {
                const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
                console.log(`\n📸 Encontrado: ${rutaCompleta.replace(carpetaRaiz, '')}`);
                console.log(`   Peso original: ${sizeMB} MB`);
                
                let buffer;
                try {
                    const inputBuffer = fs.readFileSync(rutaCompleta);

                    if (archivo.toLowerCase().endsWith('.png')) {
                        buffer = await sharp(inputBuffer)
                            .png({ quality: 60, compressionLevel: 9, effort: 10 })
                            .toBuffer();
                    } else {
                        buffer = await sharp(inputBuffer)
                            .jpeg({ quality: 80 })
                            .toBuffer();
                    }
                    
                    fs.writeFileSync(rutaCompleta, buffer);
                    
                    const newStats = fs.statSync(rutaCompleta);
                    const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2);
                    const reduccion = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);
                    
                    console.log(`   ✅ Comprimido: ${newSizeMB} MB (Reducción de ${reduccion}%)`);
                    comprimidosTotal++;
                } catch (imgError) {
                    console.error(`   ❌ Falló Sharp comprimiendo ${archivo}:`, imgError.message);
                }
            }
        }
    } catch (error) {
        console.error(`Error escaneando carpeta ${carpeta}:`, error.message);
    }
}

async function inicio() {
    console.log(`🚀 Iniciando escaneo profundo en todas las carpetas de: ${carpetaRaiz}`);
    console.log(`Buscando fotos que pesen MÁS DE 2 MB...`);
    await procesarCarpeta(carpetaRaiz);
    console.log(`\n🎉 PROCESO TOTAL TERMINADO! ${comprimidosTotal} imagen(es) sobre 2MB fueron comprimidas en total.`);
}

inicio();
