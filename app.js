const express = require('express');
const bodyParser = require('body-parser');
var fs = require('fs');
var path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const req = require('express/lib/request');
var formidable = require('formidable');
// const dbconn = require('./views/dbconn');
const mongoose = require('mongoose');
const speakeasy = require('speakeasy');
const QRCode = require('qrcode');
var session = require('express-session');



// const UserSchema = new mongoose.Schema(
// 	{
// 		username: { type: String, required: true, unique: true },
// 		email: { type: String, required: true },
// 		password: { type: String, required: true }
// 	},
// 	{ collection: 'users_list' }
// )


// const User = mongoose.model('UserSchema', UserSchema)

const registers = new mongoose.Schema({
    username: String,
    email: String,
    role: String,
    password: String,
    secret: String,
    verified: String
  })


const register = mongoose.model("Register", registers)



const app = express();
app.use(session({secret:'XASDASDA'}));

const {create} = require('ipfs-http-client');
async function ipfsclient(){
    const ipfs = await create('/ip4/127.0.0.1/tcp/5001');
    return ipfs;
}

const JWT_SECRET = 'sdjkfh8923yhjdksbfma@#(&@!^#&@bhjb2qiuhesdbhjdsfg839ujkdhfjk';

// const url = "mongodb+srv://noel123:noel123@cluster0.jt0k6.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"

// mongoose.connect(url, {
// 	useNewUrlParser: true,
// 	useUnifiedTopology: true
// })

mongoose.connect("mongodb+srv://admin:Password@cluster0.ajxki.mongodb.net/noel?retryWrites=true&w=majority");


app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", function (req, res) {           
    res.render("index");
});

app.get("/register", function (req, res) {           
    res.render("register");
});

app.get("/login", function (req, res) {           
    res.render("login");
});

app.get("/medicalchat", function (req, res) {
    res.render("medicalchat");
});

var name;
var email;
var password;
app.post('/api/register', async (req, res) => {
	const { username, email, password: plainTextPassword } = req.body

	if (!username || typeof username !== 'string') {
		return res.json({ status: 'error', error: 'Invalid username' })
	}

	if (!email || typeof email !== 'string') {
		return res.json({ status: 'error', error: 'Invalid email' })
	}

	if (!plainTextPassword || typeof plainTextPassword !== 'string') {
		return res.json({ status: 'error', error: 'Invalid password' })
	}

	if (plainTextPassword.length < 5) {
		return res.json({
			status: 'error',
			error: 'Password too small. Should be atleast 6 characters'
		})
	}

	const password = await bcrypt.hash(plainTextPassword, 10)
    req.session.email = email
    req.session.username = username
    req.session.password = password

	try {
        console.log("done")
    } catch (error) {
		if (error.code === 11000) {
			// duplicate key
			return res.json({ status: 'error', error: 'Username already in use' })
		}
		throw error
	}
    	
	// }
    

    //Hashing the passward
    //using bcrypt / md5/ sha1/ sha256/ sha 512
    // 1. The collision should improbable
    // 2. The algorithm should be slow...

    // console.log(req.body)

	res.json({ status: 'ok' })
})



app.get('/2fa', async (req, res) => {
    secret = speakeasy.generateSecret();
    QRCode.toDataURL(secret.otpauth_url, (err, data_url) => {
      // res.send(
      //   `<h1>setup authenticator</h1>
      //   <h3>use the qr code to your authenticator</h3>
      //   <img src=${data_url} > <br>
      //   or add manually: ${secret.base32}`
      // );
      res.render('mfa', {qrcode: data_url, code: secret.base32});

      register.find(function (err, registers) {
          if(err) {
              console.log(err);
          }
          else{
              registers.forEach(function (register){
                  console.log(register.email);
              })
          }
      })
      //console.log(req.headers);
      console.log(req.session.username);
      console.log(req.session.email);
      console.log(req.session.password);
    })
  
  })

  app.post('/api/verify', async (req, res) => {
    const { token } = req.body
    username = req.session.username
    email = req.session.email
    password = req.session.password
    //const token = req.body.userToken;
    console.log(token);
    console.log(secret.base32);
    const verfied = speakeasy.totp.verify({secret: secret.base32, encoding: 'base32', token: token});
    //res.json({success: verfied});
    if(verfied){
		const response = await register.create({
			username,
			email,
            role: "doctor",
			password,
            secret: secret.base32,
            verified: "True"
		})
		console.log('User created successfully: ', response)
    //   const data = new register({
    //     name: "saba",
    //     secret: secret.base32,
    //     role: "doctor",
    //     verified: "True"
  
    // })
    
  
    // data.save()
    return res.status(200).json({ status: 'verified' })
    //return res.json({ status: 'verified' })
  
    
    }
    else{
      return res.status(403).json({ status: 'error_code' })
      //res.json({ status: 'error_code' })
    }
  })
  






function gettimeanddate() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();
    let hours = date_ob.getHours();
    let minutes = date_ob.getMinutes();
    return (year + "-" + month + "-" + date + " " + hours + ":" + minutes);
}
function niceBytes(x){
    const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
     let l = 0, n = parseInt(x, 10) || 0;
     while(n >= 1024 && ++l){
         n = n/1024;
     }
     return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
   }

async function upload(filename, datetime,mb,path){
    let token = "hhhigjjskdkkdiiritutu"
    var filehash = (await uploadtochain(filename,path)).toString(); 
    filehash = filehash.replace(/[()]/g, '');
    const conn = dbconn.get();
    const db = conn.db('myFirstDatabase');
    const col = db.collection('sampleitems');  
    let data = {
        "filename": filename,
        "datetime": datetime,
        "mb": mb,
        "filehash": filehash
    }
    await col.insertOne(data, function (err, result) {
        if (err) throw err;
        console.log("1 document inserted");
    });
}

app.post("/upload", function (req, res) {    
    let datetime = gettimeanddate();
    let fullname = "";
    let mb = 0;
    let size = 0;   
    let filehash = "";
   var form = new formidable.IncomingForm();
   form.parse(req, function (err, fields, files) {
        
        let filename = fields.filename;   
        let filepath = files.filecontent.filepath;     
        let extension = path.extname(files.filecontent.originalFilename);
        let file = fs.statSync(files.filecontent.filepath);
        size = file.size;
        fullname = filename + extension;
        let trim = fullname.trim();
        let finalfullname = trim.replace(/\s/g, '_');
        mb  = niceBytes(size);         
        upload(finalfullname,datetime,mb,filepath);
    });   
    
    res.sendStatus(200);
});

 



const uploadtochain = async (filename,file)=>{
    let ipfs = await ipfsclient();    
    let result = await ipfs.add({path: filename, content: fs.readFileSync(file)});
    return(result.cid);
}


// dbconn.connect(() => {
//     app.listen(3001, function (){
//         console.log(`Listening`);
//     });
// });




// muthu 
app.post('/api/login', async (req, res) => {
	const { email, password } = req.body
	const user = await register.findOne({ email }).lean()

	if (!user) {
		return res.json({ status: 'error', error: 'Invalid username/password' })
	}

	if (await bcrypt.compare(password, user.password)) {
		// the username, password combination is successful
        req.session.email = email;
        req.session.password = password;

		// const token = jwt.sign(
		// 	{
		// 		id: user._id,
		// 		email: user.email
		// 	},
		// 	JWT_SECRET
		// )

		return res.json({ status: 'ok' })
		//res.cookie("userData", token);
	}

	res.json({ status: 'error', error: 'Invalid username/password' })
})

app.get('/verify', async (req, res) => {

      res.render('verify');

    })

app.post('/api/2falogin', async (req, res) => {
    const { token } = req.body
    email = req.session.email
    password = req.session.password
    const user = await register.findOne({ email }).lean()
    var key = user.secret
    console.log(key)
    const verfied = speakeasy.totp.verify({key: key, encoding: 'base32', token: token});
    if(verfied){
        const token = jwt.sign(
			{
				id: user._id,
				email: user.email
			},
			JWT_SECRET
		)
        return res.status(200).json({ status: 'verified', data: token })
        //return res.json({ status: 'ok', data: token })
    }
    else{
        return res.status(403).json({ status: 'no' })
    }


})


function sendmessage(){
    console.log("hello");
    var msg = document.getElementById("messagebox").value;
    var usermessage = document.getElementById("usermessage").value;
    msg.innerHTML = usermessage;
}

app.listen(3001, () => {
	console.log('Server up at 3001')
})

// muthu end