const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index.js").app;
const should = chai.should();
const auth_users = require("../router/auth_users.js");
const jwt = require("jsonwebtoken");
const token = "access";

chai.use(chaiHttp);

describe("POST /login", () => {
  it("it should log in an existing user", (done) => {
    let user = {
      username: "user2",
      password: "password2",
    };
    auth_users.users.push(user);
    chai
      .request(server)
      .post("/customer/login")
      .send(user)
      .end((err, res) => {
        res.should.have.status(200);
        res.text.should.be.eql("User successfully logged in");
        done();
      });
  });
  it("it should not log in a user with incorrect credentials", (done) => {
    let user = {
      username: "testuser",
      password: "testpassword",
    };
    auth_users.users.push(user);
    let user2 = {
      username: "testuser",
      password: "wrongpassword",
    };
    chai
      .request(server)
      .post("/customer/login")
      .send(user2)
      .end((err, res) => {
        res.should.have.status(208);
        res.body.message.should.be.eql(
          "Invalid Login. Check username and password"
        );
        done();
      });
  });

  it("it should not log in a user with missing credentials", (done) => {
    let user = {
      username: "testuser",
    };
    chai
      .request(server)
      .post("/customer/login")
      .send(user)
      .end((err, res) => {
        res.should.have.status(404);
        res.body.message.should.be.eql("Error logging in");
        done();
      });
  });
});

describe("PUT customer/auth/review/:isbn", () => {
  it("it should add a review for an existing book", (done) => {
    let user = {
      username: "testuser",
      password: "testpassword",
    };
    let isbn = "1";
    let review = "This is a great book!";
    chai
      .request(server)
      .put("/customer/auth/review/" + isbn)
      .set(
        "authorization",
        `Bearer ${jwt.sign({ username: user.username }, token)}`
      )
      .send({ review })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.message.should.be.eql("Review added");
        res.body.review.should.be.eql(review);
        done();
      });
  });

  it("it should not add a review for a non-existent book", (done) => {
    let user = {
      username: "testuser",
      password: "testpassword",
    };
    let isbn = "999";
    let review = "This is a great book!";
    chai
      .request(server)
      .put("/customer/auth/review/" + isbn)
      .set(
        "authorization",
        `Bearer ${jwt.sign({ username: user.username }, token)}`
      )
      .send({ review })
      .end((err, res) => {
        res.should.have.status(404);
        res.body.message.should.be.eql("Book not found");
        done();
      });
  });
});

describe("DELETE customer/auth/review/:isbn", () => {
  let user = {
    username: "testuser",
    password: "testpassword",
  };
  it("it should delete a review for an existing book", (done) => {
    let isbn = "1";
    let review = "This is a great book!";
    chai
      .request(server)
      .put("/customer/auth/review/" + isbn)
      .set(
        "authorization",
        `Bearer ${jwt.sign({ username: user.username }, token)}`
      )
      .send({ review })
      .end((err, res) => {
        chai
          .request(server)
          .delete("/customer/auth/review/" + isbn)
          .set(
            "authorization",
            `Bearer ${jwt.sign({ username: user.username }, token)}`
          )
          .end((err, res) => {
            res.should.have.status(200);
            res.body.message.should.be.eql("Review deleted");
            done();
          });
      });
  });

  it("it should not delete a review for a non-existent book", (done) => {
    let user = {
      username: "testuser",
      password: "testpassword",
    };
    let isbn = "999";
    chai
      .request(server)
      .delete("/customer/auth/review/" + isbn)
      .set(
        "authorization",
        `Bearer ${jwt.sign({ username: user.username }, token)}`
      )
      .end((err, res) => {
        res.should.have.status(404);
        res.body.message.should.be.eql("Book not found");
        done();
      });
  });

  it("it should not delete a review that does not exist", (done) => {
    let isbn = "1";
    chai
      .request(server)
      .delete("/customer/auth/review/" + isbn)
      .set(
        "authorization",
        `Bearer ${jwt.sign({ username: user.username }, token)}`
      )
      .end((err, res) => {
        res.should.have.status(404);
        res.body.message.should.be.eql("Review not found");
        done();
      });
  });
});
