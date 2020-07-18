import Mongo from './Database.js';

class Users {
    static async createUsers (insertData) {
        try {
            return await Mongo.db.collection('users').insertMany(insertData);
        } catch (e) {
            throw e;
        }
    }

    static async deleteUsers (deleteData) {
        try {
            return await Mongo.db.collection('users').deleteMany(deleteData);
        } catch (e) {
            throw e;
        }
    }

    static async findUsers () {
        try {
            return await Mongo.db.collection('users').find().toArray();
        } catch (e) {
            throw e;
        }
    }

    static async findUserByCondition (findData) {
        try {
            return await Mongo.db.collection('users').find(findData).toArray();
        } catch (e) {
            throw e;
        }
    }
}

export default Users;