const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

describe('GET /api/departments', () => {

    before(async () => {
        // Insert test data with fixed _id for easy testing
        await Department.deleteMany();
        await new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' }).save();
        await new Department({ _id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2' }).save();
    });

    after(async () => {
        await Department.deleteMany();
    });

    it('/ should return all departments', async () => {
        const res = await request(server).get('/api/departments');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array');
        expect(res.body.length).to.equal(2);
    });

    it('/:id should return one department by :id', async () => {
        const res = await request(server).get('/api/departments/5d9f1140f10a81216cfd4408');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.not.be.null;
    });

    it('/random should return one random department', async () => {
        const res = await request(server).get('/api/departments/random');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.not.be.null;
    });

});