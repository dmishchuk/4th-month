/**
 * Created by dmishchuk on 11/06/2014.
 */
module.exports = function (app) {
    require("./home")(app);
    require("./auth")(app);
};