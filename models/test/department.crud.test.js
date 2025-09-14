const mongoose = require('mongoose');
const Department = require('../department.model');
const expect = require('chai').expect;

describe('Department', () => {

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

  describe('Reading data', () => {
    before(async () => {
      await Department.deleteMany();
      await new Department({ name: 'Department #1' }).save();
      await new Department({ name: 'Department #2' }).save();
    });

    it('should return all the data with "find" method', async () => {
      const departments = await Department.find();
      expect(departments.length).to.equal(2);
    });

    it('should return a proper document by "name" with "findOne" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      expect(department.name).to.equal('Department #1');
    });

    after(async () => {
      await Department.deleteMany();
    });
  });

  describe('Creating data', () => {
    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should insert new document with "save" method', async () => {
      const department = new Department({ name: 'Department #1' });
      await department.save();
      expect(department.isNew).to.be.false;

      const savedDepartment = await Department.findOne({ name: 'Department #1' });
      expect(savedDepartment).to.not.be.null;
    });
  });

  describe('Updating data', () => {
    beforeEach(async () => {
      await Department.deleteMany();
      await new Department({ name: 'Department #1' }).save();
      await new Department({ name: 'Department #2' }).save();
    });

    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly update one document with "updateOne" method', async () => {
      await Department.updateOne({ name: 'Department #1' }, { $set: { name: '=Department #1=' } });
      const updatedDepartment = await Department.findOne({ name: '=Department #1=' });
      expect(updatedDepartment).to.not.be.null;
    });

    it('should properly update one document with "save" method', async () => {
      const department = await Department.findOne({ name: 'Department #1' });
      department.name = '=Department #1=';
      await department.save();

      const updatedDepartment = await Department.findOne({ name: '=Department #1=' });
      expect(updatedDepartment).to.not.be.null;
    });

    it('should properly update multiple documents with "updateMany" method', async () => {
      await Department.updateMany({}, { $set: { name: 'Updated!' } });
      const departments = await Department.find({ name: 'Updated!' });
      expect(departments.length).to.equal(2);
    });
  });

  describe('Removing data', () => {
    beforeEach(async () => {
      await Department.deleteMany();
      await new Department({ name: 'Department #1' }).save();
      await new Department({ name: 'Department #2' }).save();
    });

    afterEach(async () => {
      await Department.deleteMany();
    });

    it('should properly remove one document with "deleteOne" method', async () => {
      await Department.deleteOne({ name: 'Department #1' });
      const removedDepartment = await Department.findOne({ name: 'Department #1' });
      expect(removedDepartment).to.be.null;
    });

    it('should properly remove multiple documents with "deleteMany" method', async () => {
      await Department.deleteMany();
      const departments = await Department.find();
      expect(departments.length).to.equal(0);
    });
  });

});

