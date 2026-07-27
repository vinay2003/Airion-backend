const jwt = require('jsonwebtoken');
require('dotenv').config();
const uuid = require('uuid');

const secret = process.env.JWT_SECRET || '1ae64e6a399d2f3a17189530ba954ce647ef2c26bc617a5e9ec8241050a70193895903e481b1bc5b1609ef5ead15c56110c49be64d7e1fbc4b706a353199d9db';
const fakeId = uuid.v4();

const payload = {
    sub: fakeId,
    email: 'admin@ease2event.com',
    role: 'admin'
};

const token = jwt.sign(payload, secret, { expiresIn: '7d' });
console.log('ID:', fakeId);
console.log('Token:', token);
