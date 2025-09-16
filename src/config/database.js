const mongoose = require('mongoose');

// connect to cluster. it rerturns a promise
// mongoose.connect("mongodb+srv://priyanka:priyanka@mycluster.aawevis.mongodb.net/");

// async function to connect to db
// const password = encodeURIComponent("priyanka");
const connectDB = async () => {
    await mongoose.connect("mongodb+srv://priyanka:priyanka@myfreecluster.akatsav.mongodb.net/devTinder", // ?retryWrites=true&w=majority&appName=MyFreeCluster
        {
            serverSelectionTimeoutMS: 5000, // fail fast if can’t connect
            family: 4, // force IPv4
            directConnection: false, // use SRV discovery
            tls: true, // enforce TLS
        }
    );
};

module.exports = connectDB;

// connectDB().then(() => {
//     console.log("DB connected");
// }).catch((err) => {
//     console.log("DB connection error", err);
// });
