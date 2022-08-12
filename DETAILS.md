This is a simple REST API with endpoint /api/age that expects a query parameter and returns the age based the parameter sent.

It was built with typescript, javascript, nodejs.

To run the API, Follow the steps below:

1. Open postman
2. Create a GET request <deployedAppURL>/age with request parameters(dob) with timestamp value representing DOB ex: 2022-01-01T11:10:30
3. This will calculate the age and return a json response

IMPLEMENTATION
--------------
The API is split into two major parts

1. The Algorithm that calculates age performs the following steps
        Step 1: Extracts the request parameter and split it to get the birth date.
        Step 2: Get today's using js default Date() class
        Step 3: Calculate years by subtracting birth year(birth_year) from today's year(curr_year)
        Step 4: Get user's months by checking current month(curr_month) is greater than birth month(birth_month)
        Step 5: If the step above is true(i.e curr_month > birth_month); months = current_month - birth_month
        Step 6: Else; years = years - 1 while months = (12 - birth_month) + current_month
        Step 7: Get user's days by checking if current day(curr_day) is greater than birth day(birth_day)
        Step 8: If the above step is true(i.e curr_day > birth_day); days = curr_day - birth_day
        Step 9: Else; months = months - 1 but if months == 0 ? years = years - 1 while months = 11;
        Step 10: After all the above steps is successful, age is years to the user
2. Rate-limiting to limit the number of calls that can be made per sec
        a. The rate-limiting feature was implemented using an npm package, express-rate-limit
        b. The package is a function that accept object with the properties such as windowMs which spcify a time and max where
            you set the number of request that can be in with the time specified in windowMs
        c. This was imported in server.ts and registered as a middleware
