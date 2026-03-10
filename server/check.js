const bcrypt = require("bcrypt");

bcrypt.hash("staff123", 10).then(console.log);
