const express = require("express");
const app = express();
const fs = require("fs");
const path = require("path");
const data1 = require("./data_register_signin.json");
const { log } = require("console");
const cors = require('cors');
// const e = require("express");
const { stringify } = require("querystring");
const zod = require("zod");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require('uuid');
const port = 2000;

// Use environment variables for sensitive data in production
const jwtpassword = process.env.JWT_SECRET || "1234567";

app.use(cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
    allowedHeaders: 'Content-Type'
}));
app.use(express.json());
// app.use(express.json({ extended: true }));
// app.use(express.urlencoded({ extended: true }));

// signup
app.post("/signup", function (req, res) {
    const schema = zod.object({
        first_name: zod.string().nonempty("First name is required").regex(/^[A-Za-z\s]+$/, "First name must contain only letters and spaces"),
        last_name: zod.string().nonempty("Last name is required").regex(/^[A-Za-z\s]+$/, "First name must contain only letters and spaces"),
        email: zod.string().email("Invalid email address"),
        password: zod.string().min(8, "Password must be at least 8 characters"),
        confirm_password: zod.string().min(8, "Confirm password must be at least 8 characters"),
        dob: zod.string().nonempty("Date of birth is required"),
        address: zod.string().nonempty("Address is required"),
        mobile_no: zod.string()
            .length(10, "Mobile number must be exactly 10 digits")
            .regex(/^[0-9]+$/, "Mobile number must contain only digits")
    });
    // const { first_name, last_name, email, password, confirm_password, dob, address, mobile_no } = req.body;
    let result = schema.safeParse(req.body)
    if (!result.success) {
        res.status(400).json({ msg: "Invalid Input" });
    }
    else {
        // console.log(first_name, last_name, email, password, confirm_password, dob, address, mobile_no);
        // if (!first_name || !last_name || !email || !password || !confirm_password || !dob || !address || !mobile_no) {
        //     return res.send("Pls fill all the fields");
        // }

        const { first_name, last_name, email, password, confirm_password, dob, address, mobile_no } = result.data;

        if (password != confirm_password) {
            return res.status(400).json({ msg: "Password and Confirm password are not same" });
        }
        const userdata = {
            first_name: first_name,
            last_name: last_name,
            email: email,
            password: password,
            confirm_password: confirm_password,
            dob: dob,
            address: address,
            mobile_no: mobile_no
        }
        fs.readFile("data_register_signin.json", "utf-8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send({ msg: 'Internal Server Error' });
            }
            let arr = [];
            arr = JSON.parse(data || []);

            let check = arr.find((ele) => ele.email === email);
            if (!check) {
                arr.push(userdata);
                let stringifydata = JSON.stringify(arr);
                fs.writeFile("data_register_signin.json", stringifydata, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send({ msg: 'Internal Server Error' });
                    }
                    // res.send(`${id}`,`${name}`,`${email}`,`${password}`)
                    res.send({ msg: "Registered successfully" });
                });
            }
            else {
                res.status(500).json({
                    msg: "User Already Exist"
                })
            }
        })
    }
})

// signin
app.post("/signin", function (req, res) {
    const { sessionToken } = req.body;
    if (sessionToken && jwt.verify(sessionToken)) return res.send({ msg: 'log in Successful' });
    const schema = zod.object({
        email: zod.string().email().nonempty(),
        password: zod.string().min(8, "Password must be at least 8 characters").nonempty(),
    })
    let result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ msg: "Invalid Input" });
    }
    else {
        const { email, password } = result.data;
        fs.readFile("data_register_signin.json", "utf-8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
            else {
                let arr = [];
                arr = JSON.parse(data || []);
                // console.log(arr);
                let user = arr.find((ele) => ele.email === email && ele.password === password);
                console.log(email, password);
                if (user) {
                    var token = jwt.sign({ email: email }, jwtpassword, { expiresIn: 30 });
                    return res.status(200).json({ msg: 'log in Successful', token });
                }
                else {
                    res.status(404).json({ msg: "User Not Found" });
                }
            }
        })
    }
})

// Update password
app.post("/signin/resetprofile", function (req, res) {
    const schema = zod.object({
        password: zod.string().min(8, "Password must be at least 8 characters").nonempty(),
        new_password: zod.string().min(8, "Password must be at least 8 characters").nonempty(),
        confirm_new_password: zod.string().min(8, "Password must be at least 8 characters").nonempty(),
    })
    let result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ msg: "Invalid Input" });
    }
    else {
        const { password, new_password, confirm_new_password } = result.data;
        if (new_password !== confirm_new_password) {
            return res.status(400).json({ msg: "New passwords do not match" });
        }
        if (password === new_password) {
            return res.status(400).json({ msg: "New passwords is same as old password" });
        }
        fs.readFile("data_register_signin.json", "utf-8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
            else {
                let arr = [];
                arr = JSON.parse(data || []);
                let user = arr.find((ele) => ele.password === password)
                // console.log(password)
                // console.log(arr[0].password);
                if (!user) {
                    return res.status(400).json({ msg: "Old Password is not correct" });
                }
                else {
                    user.password = new_password;
                    user.confirm_password = new_password;
                    let stringifydata = JSON.stringify(arr);
                    fs.writeFile("data_register_signin.json", stringifydata, (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ msg: 'Internal Server Error' });
                        }
                        else {
                            res.json({ msg: "Your profile updated successfully" });
                        }
                    })
                }
            }

        })
    }
})

// Delete profile
app.post("/signin/delete", function (req, res) {
    const schema = zod.object({
        email: zod.string().email().nonempty(),
        // password: zod.string().min(8, "Password must be at least 8 characters").nonempty()
    })
    let result = schema.safeParse(req.body);
    if (!result.success) {
        res.status(400).json({ msg: "Invalid Input" });
    }
    else {
        const { email } = result.data;
        fs.readFile("data_register_signin.json", "utf-8", (err, data) => {
            if (err) {
                4
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            else {
                let arr = [];
                arr = JSON.parse(data || []);
                let user = arr.findIndex((ele) => ele.email === email)
                if (user >= 0) {
                    arr.splice(user, 1);
                    let stringifydata = JSON.stringify(arr);
                    fs.writeFile("data_register_signin.json", stringifydata, (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).send('Internal Server Error 2');
                        }
                        else {
                            res.send(`User with email ${email} has been deleted.`);
                        }
                    })
                }
            }
        })
    }

})

// Making Poll
app.post("/signin/admindetail", function (req, res) {
    console.log(req.body);
    const schema = zod.object({
        name: zod.string().nonempty(),
        email: zod.string().email().nonempty(),
        age: zod.string().nonempty(),
        mobile_no: zod.string()
            .length(10, "Mobile number must be exactly 10 digits")
            .regex(/^[0-9]+$/, "Mobile number must contain only digits").nonempty(),
        password: zod.string().min(8).nonempty()
    })
    let result = schema.safeParse(req.body)
    if (!result.success) {
        res.status(400).json({ msg: "Invalid Input" });
    }
    else {
        const { name, email, age, mobile_no, password } = result.data;
        const userdata = {
            id: uuidv4(),
            name: name,
            email: email,
            age: age,
            mobile_no: mobile_no,
            password: password,
        }
        const ageNumber = parseInt(age, 10);
        if (isNaN(ageNumber) || ageNumber < 16) {
            return res.status(400).json({ msg: `${email} is not eligible as they are below 16 years old ` });
        }
        fs.readFile("data_register_signin.json", "utf-8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).json({ msg: 'Internal Server Error' });
            }
            let arr = [];
            arr = JSON.parse(data || []);
            let user = arr.find((ele) => ele.email === email && ele.password===password)
            if (!user) {
                return res.status(404).json({ msg: `${email} is not registered or password is wrong` });
            }
            else {
                fs.readFile("data_poll_voter.json", "utf-8", (err, data) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ msg: 'Internal Server Error' });
                    }
                    let arr1 = [];
                    arr1 = JSON.parse(data || []);
                    arr1[0].data.push({
                        creator: {
                            ...userdata
                        }
                    });
                    let stringifydata = JSON.stringify(arr1);
                    fs.writeFile("data_poll_voter.json", stringifydata, (err) => {
                        if (err) {
                            console.error(err);
                            return res.status(500).json({ msg: 'Internal Server Error' });
                        }
                        res.status(200).json({ msg: "registered successfully for doing survey", id: userdata.id });
                    })
                })
            }
        })
    }

})

// Question nd option input
app.post("/signin/admindetail/input", function (req, res) {
    const schema = zod.object({
        poll_name: zod.string().nonempty(),
        question: zod.string().nonempty(),
        opt1: zod.string().nonempty(),
        opt2: zod.string().nonempty(),
        opt3: zod.string().nonempty(),
        opt4: zod.string().nonempty(),
        id: zod.string().nonempty()
    })
    let result = schema.safeParse(req.body)
    if (!result.success) {
        res.status(400).json({ msg: "Invalid input" });
    }
    else {
        const { poll_name, question, opt1, opt2, opt3, opt4, id } = result.data;
        const questiondata = {
            poll_name: poll_name,
            question: question,
            opt1: opt1,
            opt2: opt2,
            opt3: opt3,
            opt4: opt4,
            voters: []
        }
        fs.readFile("data_poll_voter.json", "utf-8", (err, data) => {
            if (err) {
                console.error(err);
                return res.status(500).send('Internal Server Error');
            }
            else {
                let arr = [];
                arr = JSON.parse(data || []);
                let users = arr[0].data || [];
                // console.log(users);

                let userFound = false;

                // Loop through the data to find the user
                for (const item of arr[0].data) {
                    let creators = item.creator;

                    if (!Array.isArray(creators)) {
                        creators = [creators];
                    }

                    // Check if the user exists
                    const user = creators.find(ele => ele.id === id);
                    if (user) {
                        userFound = true;

                        // Add the question data directly to the creator
                        // Check if the creator already has questions
                        if (!user.questions) {
                            user.questions = [];
                        }

                        // Add the question data
                        user.questions.push(questiondata);
                        break;
                    }
                }

                if (!userFound) {
                    return res.send(`${id} is not registered in our database`);
                }


                let stringifydata = JSON.stringify(arr);
                fs.writeFile("data_poll_voter.json", stringifydata, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).send('Internal Server Error');
                    }
                    else {
                        res.send({ msg: "Poll successfully uploaded" });
                    }
                })
            }
        })
    }
})

// Voter detail
app.post("/signin/voterdetail", function (req, res) {
    console.log(req.body);
    const schema = zod.object({
        name: zod.string().nonempty(),
        email: zod.string().email().nonempty(),
        age: zod.string().nonempty(),
        mobile_no: zod.string()
            .length(10, "Mobile number must be exactly 10 digits")
            .regex(/^[0-9]+$/, "Mobile number must contain only digits").nonempty(),
        password: zod.string().min(8).nonempty(),
        ques: zod.string().nonempty(),
        ans: zod.string().nonempty()
    })
    let result = schema.safeParse(req.body)
    if (!result.success) {
        return res.status(400).json({ msg: "Invalid input" });
    }

    const { name, email, age, mobile_no, password, ques, ans } = result.data;
    const userdata = {
        id: uuidv4(),
        name: name,
        email: email,
        age: age,
        mobile_no: mobile_no,
        password: password,
        answer: ans
    }
    const ageNumber = parseInt(age, 10);
    if (isNaN(ageNumber) || ageNumber < 16) {
        return res.status(403).json({ msg: `${email} is not eligible as they are below 16 years old` });
    }
    fs.readFile("data_register_signin.json", "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
        let arr = [];
        arr = JSON.parse(data || []);
        let user = arr.find((ele) => ele.email === email && ele.password===password)
        if (!user) {
            return res.status(404).json({ msg: `${email} is not registered or password is wrong` });
        }
        else {
            fs.readFile("data_poll_voter.json", "utf-8", (err, data) => {
                if (err) {
                    console.error(err);
                    return res.status(500).json({ msg: 'Internal Server Error' });
                }
                let arr1 = [];
                arr1 = JSON.parse(data || []);
                let found = false;

                for (const item of arr1[0].data) {
                    let question = item.creator.questions.find(q => q.question === ques);
                    if (question) {
                        if (question.voters.find(user => user.email == userdata.email)) return res.status(400).json({ msg: 'you have already voted.' });
                        if (item.creator.email == userdata.email) return res.status(400).json({ msg: "The creator of the poll cannot vote." });
                        found = true;
                        question.voters.push(userdata);
                        break;
                    }
                }

                if (!found) {
                    return res.status(404).json({ msg: `${ques} not found` });
                }


                let stringifydata = JSON.stringify(arr1);
                fs.writeFile("data_poll_voter.json", stringifydata, (err) => {
                    if (err) {
                        console.error(err);
                        return res.status(500).json({ msg: 'Internal Server Error' });
                    }
                    res.status(200).json({ msg: "Voted Succesfully" });
                })
            })
        }
    })


})


app.get("/fetchAllQuestions", function (req, res) {
    fs.readFile("data_poll_voter.json", "utf-8", (err, data) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ msg: 'Internal Server Error' });
        }
        let arr = [];
        arr = JSON.parse(data || []);
        let questions = [];
        for (const item of arr[0].data) {
            let creators = item.creator;
            if (!Array.isArray(creators)) {
                creators = [creators];
            }
            for (const creator of creators) {
                if (creator.questions) {
                    questions.push(...creator.questions.map(question => {
                        const { voters, ...rest } = question;
                        return rest;
                    }));
                }
            }
        }
        res.json(questions);
    })
});

app.listen(port, () => {
    console.log(`server is running on ${port}`);
})