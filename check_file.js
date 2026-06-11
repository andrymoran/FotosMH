const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '2026', 'FZ1Verde-3.jpg');

try {
    const stats = fs.statSync(filePath);
    console.log(`File size on disk: ${stats.size} bytes`);
    
    const fd = fs.openSync(filePath, 'r');
    const buffer = Buffer.alloc(10);
    fs.readSync(fd, buffer, 0, 10, 0);
    console.log(`First 10 bytes:`, buffer.toString('hex'));
    fs.closeSync(fd);
} catch (error) {
    console.error(`Failed to read file:`, error.message);
}
