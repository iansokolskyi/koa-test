class User {
  constructor(dbRes) {
    this._id = dbRes.id;
    this._password = dbRes.password;

    this.fname = dbRes.fname;
    this.lname = dbRes.lname;
    this.isActive = dbRes.isactive;
    this.categoryId = dbRes.categoryid;
    this.email = dbRes.email;
    // this.photo = dbRes.photo;
  }

  getInfo(idFlag = false) {
    const responseData = {
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      isActive: this.isActive,
      categoryId: this.categoryId,
      // photo: this.photo,
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
