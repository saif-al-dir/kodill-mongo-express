const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../../../../server');
const Department = require('../../../models/department.model');

chai.use(chaiHttp);
const expect = chai.expect;
const request = chai.request;

describe('DELETE /api/departments', () => {

    // Prepare test data before each test
    beforeEach(async () => {
        await Department.deleteMany();
        await new Department({ _id: '5d9f1140f10a81216cfd4408', name: 'Department #1' }).save();
        await new Department({ _id: '5d9f1159f81ce8d1ef2bee48', name: 'Department #2' }).save();
    });

    // Clean up after all tests
    after(async () => {
        await Department.deleteMany();
    });

    it('should properly remove one document with deleteOne method', async () => {
        const res = await request(server)
            .delete('/api/departments/5d9f1140f10a81216cfd4408');

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');

        // Verify the document was removed
        const removedDepartment = await Department.findById('5d9f1140f10a81216cfd4408');
        expect(removedDepartment).to.be.null;

        // Verify the other document still exists
        const remainingDepartment = await Department.findById('5d9f1159f81ce8d1ef2bee48');
        expect(remainingDepartment).to.not.be.null;
    });

    it('should properly remove multiple documents with deleteMany method', async () => {
        const res = await request(server)
            .delete('/api/departments'); // assuming your route deletes all on DELETE /api/departments

        expect(res.status).to.equal(200);
        expect(res.body).to.have.property('message');

        // Verify all documents are removed
        const departments = await Department.find();
        expect(departments.length).to.equal(0);
    });

});
