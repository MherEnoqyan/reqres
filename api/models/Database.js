import dotenv from 'dotenv';
import mongodb from 'mongodb';

dotenv.config();
const MongoClient = mongodb.MongoClient;

class Mongo {
    constructor () {
        this.client = new MongoClient(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    }

    async main () {
        try {
            await this.client.connect();
            console.log('Connected to MongoDB');

            this.db = this.client.db();
        } catch (e) {
            throw e;
        }

    }
}

export default new Mongo();
