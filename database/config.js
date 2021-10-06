//npm i mongoose
const mongoose = require('mongoose');

const dbConnection = async () => {
    try {

        await mongoose.connect(process.env.MONGODB_CNN, {
            //config de mongo
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('base de datos online');

    } catch (error) {
        console.log(error);
        throw new Error('Error a la hora de iniciar la base de datos');
    }
}

module.exports = {
    dbConnection,
}