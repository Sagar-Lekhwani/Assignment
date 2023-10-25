var express = require('express');
var router = express.Router();
var userModel = require('./users')
var medModel = require('./medicine')
var passport = require('passport');
var localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));
const path = require("path");
const { type } = require('os');
const  cron = require('node-cron');
var nodemailer = require('./nodemailer')
const sendmessage = require('./whatsapp')
// var schedule = require('./list')

//middle ware functions are here
function IsLoggedIn (req, res, next){
  if (req.isAuthenticated()) {
    return next();
  }
  else{
    res.redirect('/login');
  }
}


/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/register' , function(req,res,next) {
  var newUser = new userModel ({
    username:req.body.username,
    age:req.body.age,
    email:req.body.email,
    phone:req.body.phone,
  })
  userModel.register(newUser,req.body.password)
  .then(function (user) {
    passport.authenticate('local') (req , res, function () {
      res.redirect('/dashboard');
    })
  })
  .catch(function (err) {
    res.send(err);
  })
});

router.get('/login', function(req, res, next) {
  res.render('login');
});

router.post('/login',passport.authenticate('local' , {
  failureRedirect:'/logn',
  successRedirect:'/dashboard',
}), function(req, res, next) {});

router.get('/logout', function(req,res,next) {
  if(req.isAuthenticated()) req.logout(function (err) {
    if(err) res.send(err);
    else res.redirect('/login');
  });
  else res.redirect('/login');
});

router.get('/dashboard', IsLoggedIn, function (req,res,next) {
  userModel.findOne({username:req.session.passport.user})
  .populate('medicine')
  .then(function (founduser) {
    res.render('dashboard', {founduser});
  });
});

router.get('/medicine', IsLoggedIn, function (req,res,next) {
  userModel.findOne({username:req.session.passport.user})
  .then(function (founduser) {
    res.render('medicine', {founduser});
  });
});


router.post('/register/medicine',IsLoggedIn , function(req,res,next) {
userModel.findOne({username:req.session.passport.user})
.then(function (user) {
  medModel.create({
    userid:user._id,
    medname:req.body.name,
    day:req.body.day,
    hrs:req.body.hrs,
    minutes:req.body.minutes,
    services:req.body.services,
    message:req.body.msg,
  })
  .then(function (med) {
    med.email.push(user.email);
    med.email.push(user.care);
    med.phone.push(user.phone);
    med.phone.push(user.carenumber);
    med.save();
    user.medicine.push(med._id);
    user.save()
    .then(function (){
      console.log('reminder set');
      res.redirect('/dashboard');
    })
  })
})
});

router.get('/delete/:id', IsLoggedIn, function(req,res,next) {
  medModel.findOneAndDelete({_id:req.params.id})
  .then(function (del) {
    userModel.findOne({username:req.session.passport.user})
    .then(function (user) {
      user.medicine.splice(user.medicine.indexOf(del._id), 1);
      user.save()
      .then(function () {
        res.redirect('/dashboard');
      })
    })
  })
})

router.post('/update' , IsLoggedIn , function (req,res,next) {
  userModel.findOneAndUpdate({username:req.session.passport.user},{care:req.body.email,carenumber:req.body.phone}).then( function () {
    res.redirect('/dashboard');
  })
})
router.get('/caretaker' , IsLoggedIn , function (req,res,next) {
  userModel.findOne({username:req.session.passport.user})
  .then(function (found) {
    res.render('caretaker', {found})
  })
})


 const getDetails = async () => {
  return await medModel.find({day:{$ne:null},hrs:{$ne:null},minutes:{$ne:null}})
}


let flag = false;
async function doit() {
  if(flag) return;
  flag = true;
  try{
    const messages = await getDetails();
  messages.forEach(job => {
    const time = `${job.minutes} ${job.hrs} * * *`
    cron.schedule(time, () => {
      if(job.services === 'gmail')
      {
        nodemailer(job.email,job.message).then( function () {
          console.log('notification on mail sent');
        })
      }
      else {
        //whatsapp notification message function
        console.log('notification on whatsapp sent')
      }
    });
 })
  }catch (err) {
    console.log('err in medicine')
  }
  finally{
    flag = false;
  }
  
}

doit();

setInterval(doit, 60000);

module.exports = router;
