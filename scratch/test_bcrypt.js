const bcrypt = require('bcrypt');
async function test() {
    try {
        console.log('Hashing...');
        const hash = await bcrypt.hash('123456', 10);
        console.log('Hash:', hash);
        const match = await bcrypt.compare('123456', hash);
        console.log('Match:', match);
    } catch (e) {
        console.error('Error:', e);
    }
}
test();
