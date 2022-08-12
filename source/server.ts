import http from "http";
import express, { Express, Request, Response, NextFunction } from "express";
import rateLimit from "express-rate-limit";

const router: Express = express();

const limiter = rateLimit({
  windowMs: 1 * 1 * 1000, // 1 sec
  max: 3, // Limit each IP to 3 requests per `window` (here, per sec)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// Apply the rate limiting middleware to all requests
router.use(limiter);

/* Routes */
router.get("/api/age", (req: Request, res: Response, next: NextFunction) => {
  // Check if paramenter is a valid timestamp
  // Get DOB
  let [birth_date] = (<string>req.query.dob).split(/T| /);
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

  if (
    birth_year == curr_year &&
    birth_month == curr_month &&
    birth_day > curr_day
  ) {
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
  } else if (curr_month < birth_month) {
    years = years - 1;
    months = 12 - birth_month + curr_month;
  }

  // Get user's day
  if (curr_day > birth_day) {
    days = curr_day - birth_day;
  } else if (curr_day < birth_day) {
    if (months == 0) {
      years = years - 1;
      months = 11;
    } else {
      months = months - 1;
    }
    // days = (curr_month_days - curr_day) + birth_day;
  }

  age = `${years}years`;

  res.status(200).json({ age });
});

/* Error handling */
router.use((req: Request, res: Response, next: NextFunction) => {
  const error = new Error("Not found");
  return res.status(404).json({
    message: error.message,
  });
});

const httpServer = http.createServer(router);
const PORT: any = process.env.PORT ?? 8000;
httpServer.listen(PORT, () =>
  console.log(`The server is running on port ${PORT}`)
);
