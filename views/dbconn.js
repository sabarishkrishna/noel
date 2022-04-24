// const { MongoClient } = require('mongodb');
// const url = "mongodb+srv://adminuser:Bharath54321@noel.w0jsw.mongodb.net/sample2?retryWrites=true&w=majority";
// const client = new MongoClient(url);
 

                      
//  const clientt = async function() {
//     try {                 
//         const conn =  await client.connect();
//         const db = await client.db('sample2');
//         return db;
//         //  console.log("Connected correctly to server");
//         //  const db = client.db(dbName);
//         //  // Use the collection "people"
//         //  const col = db.collection("people");
//         //  // Insert a single document
          
//         //  // Construct a document                                                                                                                                                              
//         //  let personDocument = {
//         //      "name": { "first": "Alan", "last": "Turing" },
                    // files:{0}
                    // files : {
                            
                    //                 "fileonecontent":{
                    //                         filename : 
                    //                         filesize :
                    //                         filedata :
                    //                         filehash :
                    //                 }
                    //                 "filetwocontent":{

                    //             }
                            
                    // }
//         //      "birth": new Date(1912, 5, 23), // June 23, 1912                                                                                                                                 
//         //      "death": new Date(1954, 5, 7),  // June 7, 1954                                                                                                                                  
//         //      "contribs": [ "Turing machine", "Turing test", "Turingery" ],
//         //      "views": 1250000
//         //  }
//         //  // Insert a single document, wait for promise so we can read it back
//         //  const p = await col.insertOne(personDocument);
//         //  // Find one document
//         //      Doc = await col.findOne();
//         //  // Print to the console
//         //  console.log(myDoc);
//         } catch (err) {
//          console.log(err.stack);
//      }
 
//      finally {
//         await client.close();
//     }
// }

// //run().catch(console.dir);

// module.exports = clientt;



// const mongoClient = require('mongodb').MongoClient;
// const mongoDbUrl = 'mongodb+srv://noel123:noel123@cluster0.jt0k6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
// var mongodb;

// function connect(callback){
//     mongoClient.connect(mongoDbUrl, (err, db) => {
//         console.log('connected successfully')
//         this.mongodb = db;
//         callback();
//     });
// }
// function get(){
//     return this.mongodb;
// }

// //defining user to store in db
// const UserSchema = new mongoose.Schema(
// 	{
// 		username: { type: String, required: true, unique: true },
// 		email: { type: String, required: true },
// 		password: { type: String, required: true }
// 	},
// 	{ collection: 'users_list' }
// )

// const User = mongoose.model('UserSchema', UserSchema)

// function close(){
//     this.mongodb.close();
// }

// module.exports = {
//     connect,
//     get,
//     close
// };