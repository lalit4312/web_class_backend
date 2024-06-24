// for sending request
const request = require('supertest')

// server main file(index.js)
const app = require('../index')

// making test collections
describe('Api Test Collection', () => {

    // test case 1 (/test)
    it('GET/test | Response text', async () => {

        // making api request to /test
        const response = await request(app).get('/test')

        // our response should have 200 status code
        expect(response.statusCode).toBe(200);

        // expect text
        expect(response.text).toEqual('Test Api is Working...!');

    })

    it('GET Products | Fetch all products', async () => {
        const response = await request(app).get('/api/product/get_all_products');
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual('product fetched successfully')
    })

    // register api (post)
    it('POST /api/user/create | Response with message', async () => {
        const response = await request(app).post('/api/user/create').send({
            "firstName": "John",
            "lastName": "Cena",
            "email": "john@gmail.com",
            "password": "123"

        });
        // if already exists
        if (!response.body.success) {
            expect(response.body.message).toEqual('User Already Exists!')
        } else {
            expect(response.statusCode).toBe(200)
            expect(response.body.message).toEqual('User Created Successfully')
        }
    })

    it('POST /api/user/login | response with message', async () => {
        const response = (await request(app).post('/api/user/login')).setEncoding({
            "email": "john@gmail.com",
            "password": "123",
        });
        if (!response.body.success) {
            expect(response.body.message).toEqual('user not found!')
        } else {
            expect(response.statusCode).toBe(200)
            expect(response.body.message).toEqual('Login Successfully')

        }

    })


})

// task
// 1. Login
// 2. update product(try)
