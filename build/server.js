"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http"));
const express_1 = __importDefault(require("express"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const router = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 1 * 1 * 1000,
    max: 3,
    standardHeaders: true,
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
// Apply the rate limiting middleware to all requests
router.use(limiter);
/* Routes */
router.get("/api/age", (req, res, next) => {
    // Check if request parameter is part of the request
    if (req.query.dob == null)
        return res.status(401).json({ message: "dob request parameter required" });
    // Check if paramenter is a valid timestamp
    res.send(new Date(req.params.dob).getTime());
    return;
    // Get DOB
    let [birth_date] = req.query.dob.split(/T| /);
    let [birth_year, birth_month, birth_day] = birth_date.split("-").map(Number);
    // Get today's date
    let today = JSON.stringify(new Date());
    let [, curr_date_time] = today.split('"');
    let [curr_date] = curr_date_time.split("T");
    let [curr_year, curr_month, curr_day] = curr_date.split("-").map(Number);
    // Check if DOB is not in the future
    if (birth_year > curr_year) {
        res.status(401).json({
            message: "Invalid DOB. Birth year is ahead of current year",
        });
        return;
    }
    if (birth_year == curr_year && birth_month > curr_month) {
        res.status(401).json({
            message: "Invalid DOB. Birth month is ahead of current month",
        });
        return;
    }
    if (birth_year == curr_year &&
        birth_month == curr_month &&
        birth_day > curr_day) {
        res.status(401).json({
            message: "Invalid DOB. Birth day is ahead of current day",
        });
        return;
    }
    let age = "";
    let years = curr_year - birth_year;
    let months = 0;
    let days = 0;
    // Get the user's months
    if (curr_month > birth_month) {
        months = curr_month - birth_month;
    }
    else if (curr_month < birth_month) {
        years = years - 1;
        months = 12 - birth_month + curr_month;
    }
    // Get user's day
    if (curr_day > birth_day) {
        days = curr_day - birth_day;
    }
    else if (curr_day < birth_day) {
        if (months == 0) {
            years = years - 1;
            months = 11;
        }
        else {
            months = months - 1;
        }
        // days = (curr_month_days - curr_day) + birth_day;
    }
    age = `${years}years ${months}months`;
    res.status(200).json({ age });
});
/* Error handling */
router.use((req, res, next) => {
    const error = new Error("Not found");
    return res.status(404).json({
        message: error.message,
    });
});
const httpServer = http_1.default.createServer(router);
const PORT = (_a = process.env.PORT) !== null && _a !== void 0 ? _a : 8000;
httpServer.listen(PORT, () => console.log(`The server is running on port ${PORT}`));
