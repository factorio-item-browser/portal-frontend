const dotenv = require("dotenv");
dotenv.config({
    path: ".env.test",
});

module.exports = {
    clearMocks: true,
    resetMocks: true,
    testEnvironment: "jsdom",
};
