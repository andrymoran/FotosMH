const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const carpetaFotos = path.join(__dirname, '2026');
const limiteBytes = 4 * 1024 * 1024; // 4 MB

async function processFolder() {
    console.log(`Iniciando escaneo en: ${carpetaFotos}`);
    const archivos = fs.readdirSync(carpetaFotos);
    let comprimidos = 0;

    for (const archivo of archivos) {
        const rutaCompleta = path.join(carpetaFotos, archivo);
        
        try {
            const stats = fs.statSync(rutaCompleta);
            
            // Procesamos si es archivo y pesa > 4MB
            if (stats.isFile() && stats.size > limiteBytes && /\.(png|jpe?g)$/i.test(archivo)) {
                const sizeMB = (stats.size / 1024 / 1024).toFixed(2);
                console.log(`\n📸 Encontrado: ${archivo}`);
                console.log(`   Peso original: ${sizeMB} MB`);
                
                let buffer;
                if (archivo.toLowerCase().endsWith('.png')) {
                    buffer = await sharp(rutaCompleta)
                        .png({ quality: 60, compressionLevel: 9, effort: 10 }) // Opciones agresivas para comprimir PNG
                        .toBuffer();
                } else {
                    buffer = await sharp(rutaCompleta)
                        .jpeg({ quality: 80 })
                        .toBuffer();
                }
                
                // Sobreescribir el archivo original
                fs.writeFileSync(rutaCompleta, buffer);
                
                const newStats = fs.statSync(rutaCompleta);
                const newSizeMB = (newStats.size / 1024 / 1024).toFixed(2);
                const reduccion = (((stats.size - newStats.size) / stats.size) * 100).toFixed(1);
                
                console.log(`   ✅ Comprimido exitosamente a: ${newSizeMB} MB (Reducción de ${reduccion}%)`);
                comprimidos++;
            }
        } catch (error) {
            console.error(`   ❌ Error procesando ${archivo}:`, error.message);
        }
    }
    console.log(`\n🎉 Proceso terminado! ${comprimidos} imagen(es) sobre 4MB fueron comprimidas.`);
}

processFolder();
