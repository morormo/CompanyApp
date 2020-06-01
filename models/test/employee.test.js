const Employee = require('../employee.model.js');
const expect = require('chai').expect;
const mongoose = require('mongoose');

describe('Employee', () => {

    it('should throw an error if some arg is missed', () => {
        const employee1 = new Employee({ lastName: 'Doe', department: 'DEVS'});
        const employee2 = new Employee({ firstName: 'Joe', department: 'DEVS'});
        const employee3 = new Employee({ firstName: 'Joe', lastName: 'Doe' });

        const cases = [employee1, employee2, employee3];

        for (let empl of cases) {
            empl.validate(err => {
            expect(err.errors).to.exist;
            });
        }
    });

    it('should throw an error if arg is not a string', () => {
        const employee1 = new Employee({ firstName: [], lastName: 'Doe', department: 'DEVS'});
        const employee2 = new Employee({ firstName: 'Joe', lastName: [], department: 'DEVS'});
        const employee3 = new Employee({ firstName: 'Joe', lastName: 'Doe', department: [] });

        const cases = [employee1, employee2, employee3];

        for (let empl of cases) {
          empl.validate(err => {
            expect(err.errors).to.exist;
          });
        }
      });

    it('should not throw an error if "firstName", "lastName", "department" is okay', () => {

        const empl = new Employee({ firstName: 'John', lastName: 'Doe', department: 'DEVS' });

        empl.validate(err => {
        expect(err).to.not.exist;
        });
    });

    after(() => {
        mongoose.models = {};
    });

  }); 