import express from 'express';
import Agenda from 'Agenda';
import axios from 'axios';
import dotenv from 'dotenv';
import Mongo from './models/Database.js';
import Users from './models/Users.js';

let dbUsers = [];
dotenv.config();
const port = process.env.PORT || 4000;
const app = express();
const agenda = new Agenda({db: {address: process.env.MONGO_URI}});

agenda.define('updateUsersJob', () => {
    console.log(new Date());
    updateUsers();
});

app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "http://localhost:3000");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.get('/', async (req, res, next) => {
    try {
        const users = await Users.findUsers();

        res.json({users});
    } catch (e) {
        next(e);
    }
});

app.get('/search', async (req, res, next) => {
    try {
        const value = req.query.value;
        const findData = { $or: [ {"first_name": {'$regex': `${value}`}}, {"last_name": {'$regex': `${value}`}} ] };
        const users = await Users.findUserByCondition(findData);

        res.json({users});
    } catch (e) {
        next(e);
    }
});

const start = async () => {
    try {
        await Mongo.main();

        app.listen(port, async () => {
            console.log('We are live on ' + port);
            try {
                dbUsers = await Users.findUsers();
            } catch (e) {
                console.error(e);
            }
            updateUsers();
            agenda.start();
            agenda.every('1 minutes', 'updateUsersJob');
        });
    } catch (e) {
        console.error(e);
    }
};

start();

async function updateUsers() {
    try {
        const {data} = await axios.get('https://reqres.in/api/users?page=1&per_page=100');
        const serverUsers = data?.data;
        const diffDelete = dbUsers?.filter(user => !serverUsers?.map(item => item.id)?.includes(user.id));
        const diffAdd = serverUsers?.filter(user => !dbUsers?.map(item => item.id)?.includes(user.id));

        if (diffAdd?.length > 0 || diffDelete?.length > 0) {
            if (diffAdd?.length > 0) {
                await Users.createUsers(diffAdd);
            }

            if (diffDelete?.length > 0) {
                await Promise.allSettled(diffDelete.map(item => Users.deleteUsers(item)));
            }

            dbUsers = await Users.findUsers();
        }
    } catch (e) {
        console.error(e);
    }
}