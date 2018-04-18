// Initialize Firebase
var config = {
    apiKey: "AIzaSyAeajv9YBvsLvi_nAnqP5F_q60dQfQicDE",
    authDomain: "lets-chat-7191c.firebaseapp.com",
    databaseURL: "https://lets-chat-7191c.firebaseio.com",
    storageBucket: "lets-chat-7191c.appspot.com",
    messagingSenderId: "570560641916"
};
var app = firebase.initializeApp(config);
var database = app.database();
var auth = app.auth();
var storage = app.storage();

function intiApp() {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user === null) {

            HideWelcomePage(false);

            //show a popup when user signs in
            var googleLogin = document.getElementById('googleLogin');
            var provider = new firebase.auth.GoogleAuthProvider();
            provider.addScope('https://www.googleapis.com/auth/plus.login');
            googleLogin.addEventListener('click', function (e) {
                auth.signInWithPopup(provider).then(function (result) {
                    var token = result.credential.accessToken;
                    // The signed-in user info.
                    var user = result.user;
                    console.log(token, user);
                });
            });
        }
        else {
            HideWelcomePage(true);
            InitializeDatabase();
            AssignUser(user);
            AddEventListner(user);
        }
    });

}



function addMessage(chat) {

    var msg = `<div class='chat-body clearfix'>
                 <div class='header'>
                     <strong class='primary-font'>#USER#</strong> <small class='pull-right text-muted'>
                        <span class='glyphicon glyphicon-time'></span>#TIME#
                       </small>
                 </div>
                 <p>
                    #MESSAGE#
                 </p>
              </div>`;
    var ul = document.getElementById('chat');
    var time = CalculateTime(chat.time);
    msg = msg.replace('#USER#', chat.username).replace('#MESSAGE#', chat.message).replace('#TIME#', time);
    var li = document.createElement('li');
    li.className += ' left clearfix';
    li.innerHTML = msg;
    ul.appendChild(li);
}

function HideWelcomePage(hide) {
    if (hide) {
        document.getElementById('welcomeDiv').style.display = 'none';
        document.getElementById('chatDiv').style.display = 'block';
    }
    else {
        document.getElementById('welcomeDiv').style.display = 'block';
        document.getElementById('chatDiv').style.display = 'none';
    }
}
function AssignUser(user) {
    //    var msg="Welcome To Chat box #user#";
    //     msg=msg.replace('#user#',user.displayName);
    //     var h=document.getElementById('wlmsg');
    //     h.innerText=msg;
}

function AddEventListner(user) {
    var send = document.getElementById('send');
    send.addEventListener('click', function (e) {
        var msg = document.getElementById('txtbox').value;
        var time = new Date().getMinutes();
        var chat = { username: user.displayName, message: msg, time: time }
        AddMessageToDatabase(chat);
    });

    var logOff = document.getElementById('btnLogOff');
    logOff.addEventListener('click', function () {
        LogOffCurrentUser();
    });
}

function LogOffCurrentUser() {
    var ul = document.getElementById('chat');
    ul.innerHTML = "";
    //log out  
    firebase.auth().signOut();
}
function InitializeDatabase() {
    var databaseRef = database.ref().child('chat');
    databaseRef.on('child_added', function (snapshot) {
        addMessage(snapshot.val());
    });
}

function AddMessageToDatabase(chat) {
    var databaseRef = database.ref().child('chat');
    databaseRef.push().set(chat);
    document.getElementById('txtbox').value = '';
}

function CalculateTime(time) {
    var now = new Date().getMinutes();
    var diff = now - time;
    console.log(diff);
    if (diff < 0) {
        return "An hour ago";
    }
    else if (diff === 0) {
        return "Just now";
    }
    else {
        return diff + " minutes ago";
    }
}
window.onload = function () {
    intiApp();
}