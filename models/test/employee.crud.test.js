const mongoose = require('mongoose');
const expect = require('chai').expect;
const Employee = require('../employee.model');

describe('Employee', () => {

    before(async () => {
        try {
            await mongoose.connect('mongodb://localhost:27017/companyDBtest', {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
        } catch (err) {
            console.error(err);
        }
    });

    // --- Reading data ---
    describe('Reading data', () => {

        before(async () => {
            await Employee.deleteMany();
            await new Employee({ firstName: 'John', lastName: 'Doe', department: 'HR' }).save();
            await new Employee({ firstName: 'Jane', lastName: 'Smith', department: 'Finance' }).save();
        });

        it('should return all the data with find method', async () => {
            const employees = await Employee.find();
            expect(employees.length).to.equal(2);
        });

        it('should return proper document by various params with findOne method', async () => {
            const empByFirstName = await Employee.findOne({ firstName: 'John' });
            expect(empByFirstName).to.exist;
            expect(empByFirstName.lastName).to.equal('Doe');

            const empByLastName = await Employee.findOne({ lastName: 'Smith' });
            expect(empByLastName).to.exist;
            expect(empByLastName.firstName).to.equal('Jane');

            const empByDepartment = await Employee.findOne({ department: 'HR' });
            expect(empByDepartment).to.exist;
            expect(empByDepartment.firstName).to.equal('John');
        });

        after(async () => {
            await Employee.deleteMany();
        });
    });

    // --- Creating data ---
    describe('Creating data', () => {

        afterEach(async () => {
            await Employee.deleteMany();
        });

        it('should insert new document with insertOne method', async () => {
            const employee = new Employee({ firstName: 'Alice', lastName: 'Brown', department: 'Marketing' });
            await employee.save();
            expect(employee.isNew).to.be.false;

            const savedEmployee = await Employee.findOne({ firstName: 'Alice', lastName: 'Brown' });
            expect(savedEmployee).to.not.be.null;
        });
    });

    // --- Updating data ---
    describe('Updating data', () => {

        beforeEach(async () => {
            await Employee.deleteMany();
            await new Employee({ firstName: 'John', lastName: 'Doe', department: 'HR' }).save();
            await new Employee({ firstName: 'Jane', lastName: 'Smith', department: 'Finance' }).save();
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });

        it('should properly update one document with updateOne method', async () => {
            await Employee.updateOne({ firstName: 'John' }, { $set: { department: 'IT' } });
            const updatedEmployee = await Employee.findOne({ firstName: 'John' });
            expect(updatedEmployee.department).to.equal('IT');
        });

        it('should properly update one document with save method', async () => {
            const employee = await Employee.findOne({ firstName: 'Jane' });
            employee.department = 'Legal';
            await employee.save();

            const updatedEmployee = await Employee.findOne({ firstName: 'Jane' });
            expect(updatedEmployee.department).to.equal('Legal');
        });

        it('should properly update multiple documents with updateMany method', async () => {
            await Employee.updateMany({}, { $set: { department: 'UpdatedDept' } });
            const employees = await Employee.find({ department: 'UpdatedDept' });
            expect(employees.length).to.equal(2);
        });
    });

    // --- Removing data ---
    describe('Removing data', () => {

        beforeEach(async () => {
            await Employee.deleteMany();
            await new Employee({ firstName: 'John', lastName: 'Doe', department: 'HR' }).save();
            await new Employee({ firstName: 'Jane', lastName: 'Smith', department: 'Finance' }).save();
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });

        it('should properly remove one document with deleteOne method', async () => {
            await Employee.deleteOne({ firstName: 'John' });
            const removedEmployee = await Employee.findOne({ firstName: 'John' });
            expect(removedEmployee).to.be.null;
        });

        it('should properly remove multiple documents with deleteMany method', async () => {
            await Employee.deleteMany();
            const employees = await Employee.find();
            expect(employees.length).to.equal(0);
        });
    });

});
