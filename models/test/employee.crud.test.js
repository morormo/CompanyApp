const Employee = require('../employee.model');
const expect = require('chai').expect;
const MongoMemoryServer = require('mongodb-memory-server').MongoMemoryServer;
const mongoose = require('mongoose');

describe('Employee', () => {

    before(async () => {
      try {
        const fakeDB = new MongoMemoryServer();

        const uri = await fakeDB.getConnectionString();

        await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

      } catch (err) {
        console.log(err);
      }
    });

    describe('Reading data', () => {

        beforeEach(async () => {
            const testEmplOne = new Employee({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' });
            await testEmplOne.save();

            const testEmpTwo = new Employee({ firstName: 'Janet', lastName: 'Moore', department: 'Marketing' });
            await testEmpTwo.save();
        });

        it('should return all the data with "find" method', async () => {
            const employees = await Employee.find();
            const expectedLength = 2;
            expect(employees.length).to.be.equal(expectedLength);
        });

        it('should return proper document by various params with "findOne" method', async () => {
            const emplFirstName = await Employee.findOne({ firstName: 'Michael' });
            const expectedFirstName = 'Michael';

            const emplLastName = await Employee.findOne({ lastName: 'Jackson' });
            const expectedLastName = 'Jackson';

            const emplDepartment = await Employee.findOne({ department: 'IT' });
            const expectedDepartment = 'IT';

            expect(emplFirstName.firstName).to.be.equal(expectedFirstName);
            expect(emplLastName.lastName).to.be.equal(expectedLastName);
            expect(emplDepartment.department).to.be.equal(expectedDepartment);
        }); 

        after(async () => {
            await Employee.deleteMany();
        });  
    });

    describe('Creating data', () => {

        it('should insert new document with "insertOne" method', async () => {
            const employee = new Employee({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' });
            await employee.save();
            expect(employee.isNew).to.be.false;
        });

        after(async () => {
            await Employee.deleteMany();
        });
    });

    describe('Updating data', () => {
        beforeEach(async () => {
            const testEmplOne = new Employee({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' });
            await testEmplOne.save();

            const testEmplTwo = new Employee({ firstName: 'Janet', lastName: 'Moore', department: 'Marketing' });
            await testEmplTwo.save();
        });

        it('should properly update one document with "updateOne" method', async () => {
            await Employee.updateOne({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' }, 
                { $set: { firstName: '=Michael=', lastName: '=Jackson=', department: '=IT=' }});
            const updatedEmployee = await Employee.findOne({ firstName: '=Michael=', lastName: '=Jackson=', department: '=IT=' });
            expect(updatedEmployee).to.not.be.null;
        });

        it('should properly update one document with "save" method', async () => {
            const employee = await Employee.findOne({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' });
            employee.firstName = '=Michael=';
            employee.lastName = '=Jackson=';
            employee.department = '=IT=';
            await employee.save();

            const updatedEmployee = await Employee.findOne({ firstName: '=Michael=', lastName: '=Jackson=', department: '=IT=' });
            expect(updatedEmployee).to.not.be.null;
        });

        it('should properly update multiple documents with "updateMany" method', async () => {
            await Employee.updateMany({}, { $set: { firstName: 'updated', lastName: 'updated', department: 'updated' }});
            const employees = await Employee.find({ firstName: 'updated', lastName: 'updated', department: 'updated' });
            expect(employees.length).to.be.equal(2);
        });

        afterEach(async () => {
            await Employee.deleteMany();
        });    
    });

    describe('Removing data', () => {
        beforeEach(async () => {
            const testEmplOne = new Employee({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' });
            await testEmplOne.save();

            const testEmpTwo = new Employee({ firstName: 'Janet', lastName: 'Moore', department: 'Marketing' });
            await testEmpTwo.save();
        });

        it('should properly remove one document with "deleteOne" method', async () => {
            await Employee.deleteOne({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' });
            const removedEmployee = await Employee.findOne({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' });
            expect(removedEmployee).to.be.null;
        });

        it('should properly remove one document with "remove" method', async () => {
            const empl = await Employee.findOne({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' });
            await empl.remove();
            const removedEmpl = await Employee.findOne({ firstName: 'Michael', lastName: 'Jackson', department: 'IT' });
            expect(removedEmpl).to.be.null;
        });

        it('should properly remove multiple documents with "deleteMany" method', async () => {
            await Employee.deleteMany();
            const employees = await Employee.find();
            expect(employees.length).to.be.equal(0);
        });

        afterEach(async () => {
        await Employee.deleteMany();
        });

    });

    after(() => {
        mongoose.models = {};
    });

}); 