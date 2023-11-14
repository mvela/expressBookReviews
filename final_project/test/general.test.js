const chai = require("chai");
const chaiHttp = require("chai-http");
const server = require("../index.js").app;
const should = chai.should();

chai.use(chaiHttp);

describe("General Routes", () => {
  describe("POST /register", () => {
    it("it should register a new user", (done) => {
      let user = {
        username: "user1",
        password: "password123",
      };
      chai
        .request(server)
        .post("/register")
        .send(user)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.message.should.be.eql(
            "User successfully registered. Now you can login"
          );
          done();
        });
    });
  });

  describe("GET /isbn/:isbn", () => {
    it("it should GET book details based on ISBN", (done) => {
      let isbn = 1;
      chai
        .request(server)
        .get("/isbn/" + isbn)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          done();
        });
    });
  });

  describe("GET /author/:author", () => {
    it("it should GET book details based on author", (done) => {
      let author = "Chinua Achebe";
      chai
        .request(server)
        .get("/author/" + author)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.books.should.be.an("array");
          done();
        });
    });
  });

  describe("GET /title/:title", () => {
    it("it should GET book details based on title", (done) => {
      let title = "The Book Of Job";
      chai
        .request(server)
        .get("/title/" + title)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.books.should.be.an("array");
          done();
        });
    });
  });

  describe("GET /review/:isbn", () => {
    it("it should GET book reviews based on ISBN", (done) => {
      let isbn = "3";
      chai
        .request(server)
        .get("/review/" + isbn)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("reviews");
          done();
        });
    });
  });
});
