class User {
  constructor(dbRes) {
    this._id = dbRes.id;
    this.fname = dbRes.fname;
    this.lname = dbRes.lname;
    this.isActive = dbRes.isactive;
    this.categoryId = dbRes.categoryid;
    this.email = dbRes.email;
    this._password = dbRes.password;
  }

  getInfo(idFlag = false) {
    const responseData = {
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      isActive: this.isActive,
      categoryId: this.categoryId,
    };

    if (idFlag) {
      responseData.id = this._id;
    }

    return responseData;
  }

  getId() {
    return this._id;
  }
}

module.exports = { User };
