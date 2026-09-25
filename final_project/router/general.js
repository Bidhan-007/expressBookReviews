const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();
const fs=require("fs").promises;

// const axios=require("axios")

public_users.post("/register", (req,res) => {
    console.log(req.body)
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {

        if (isValid(username)) {

            users.push({
                username: username,
                password: password
            });

            return res.status(200).json({
                message: "User successfully registered. Now you can login"
            });

        } else {

            return res.status(404).json({
                message: "User already exists!"
            });

        }

    }

    return res.status(404).json({
        message: "Unable to register user."
    });
});

// Get the book list available in the shop
public_users.get('/',async function (req, res) {
    const getBooks = new Promise((resolve, reject) => {

        if (books) {
            resolve(books);
        } else {
            reject("Books not found");
        }

    });

    getBooks
        .then((data) => {
            res.status(200).json(data);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {

  
    const getBookByISBN = new Promise((resolve, reject) => {

        const isbn = req.params.isbn;

        if (books[isbn]) {
            resolve(books[isbn]);
        } else {
            reject("Book not found");
        }

    });

    getBookByISBN
        .then((book) => {
            res.status(200).json(book);
        })
        .catch((error) => {
            res.status(404).send(error);
        });

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const getBooksByAuthor=new Promise((resolve,reject)=>{
        const author=req.params.author;
        if(books[author]){
            resolve(books[author]);
        }else{
            reject("Book Not Found");
        }
    });

    getBooksByAuthor
    .then((data)=>{
        res.status(200).json(data)
    })
    .catch((err)=>{
        res.status(200).send(err);
    });
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const keys = Object.keys(books);

    let result = [];

    for (let key of keys) {

        if (books[key].title === title) {
            result.push(books[key]);
        }
    }

    return res.status(200).json(result);
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  
    const isbn = req.params.isbn;

    const keys = Object.keys(books);

    for (let key of keys) {

        if (key === isbn) {

            return res.status(200).json(books[key].reviews);
        }
    }
});

module.exports.general = public_users;
