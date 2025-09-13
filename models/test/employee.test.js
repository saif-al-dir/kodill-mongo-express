const mongoose = require('mongoose');
const expect = require('chai').expect;
const Employee = require('../employee.model.js');

describe('Employee', () => {

  it('should throw an error if "firstName" is missing', () => {
    const emp = new Employee({ lastName: 'Smith', department: 'HR' });
    const err = emp.validateSync();
    expect(err.errors.firstName).to.exist;
  });

  it('should throw an error if "lastName" is missing', () => {
    const emp = new Employee({ firstName: 'John', department: 'HR' });
    const err = emp.validateSync();
    expect(err.errors.lastName).to.exist;
  });

  it('should throw an error if "department" is missing', () => {
    const emp = new Employee({ firstName: 'John', lastName: 'Smith' });
    const err = emp.validateSync();
    expect(err.errors.department).to.exist;
  });

  it('should not throw an error if all fields are valid strings', () => {
    const validCases = [
      { firstName: 'John', lastName: 'Smith', department: 'HR' },
      { firstName: 'Amanda', lastName: 'Doe', department: 'Finance' }
    ];

    for (const data of validCases) {
      const emp = new Employee(data);
      const err = emp.validateSync();
      expect(err).to.not.exist;
    }
  });

  after(() => {
    mongoose.models = {};
  });
});