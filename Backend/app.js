const express = require("express");
const uuid = require("uuid");
const app = express();
const port = 3000;
const fs = require("fs");
app.use(express.json());

// GET request to /b returns a list of objects
app.get("/b", (req, res) => {
  const files = fs.readdirSync("./Backend/tasks");
  const arr = [];
  if (files.length === 0) {
    res.send("you have no files");
  } else {
    try {
      files.forEach((file) => {
        arr.push(JSON.parse(fs.readFileSync(`./Backend/tasks/${file}`)));
      });
      res.send(arr);
    } catch (err) {
      res.status(500).send("There is a problem with the server.");
    }
  }
});

// GET request to /b/{id} returns the details of the object
app.get("/b/:id", (req, res) => {
  const { id } = req.params;
  if (!fs.existsSync(`./Backend/tasks/${id}.json`)) {
    res.status(400).send(`{
      "message": "Invalid Bin Id provided",
    }`);
  } else {
    fs.readFile(`./Backend/tasks/${id}.json`, (err, data) => {
      if (err) {
        res.status(500).send(`{ message: "Error!", error: err }`);
      } else res.send(data);
    });
  }
});

// POST request to /b create new object and return the new object
app.post("/b", (req, res) => {
  const { body } = req;
  if (Object.keys(body).length === 0) {
    res.status(400).send(`{
      "message": "Bin can not be blank",
    }`);
  } else {
    const id = uuid.v4();
    body.id = id;
    fs.writeFile(
      `./Backend/tasks/${id}.json`,
      JSON.stringify(body, null, 4),
      (err) => {
        if (err) {
          res.status(500).json({ message: "Error!", error: err });
        } else {
          res.status(201).json(objectsArr);
        }
      }
    );
  }
});

// PUT request to /b/{id} get in the body params updated object and return the updated object
app.put("/b/:id", (req, res) => {
  const { id } = req.params;
  const { body } = req;
  if (!fs.existsSync(`./Backend/tasks/${id}.json`)) {
    res.status(400).send(`{
      "message": "Bin Id not found",
    }`);
  } else {
    body.id = id;
    fs.writeFile(
      `./Backend/tasks/${id}.json`,
      JSON.stringify(body, null, 4),
      (err) => {
        if (err) {
          res.status(500).json({ message: "Error!", error: err });
        } else {
          res.status(201).json(body);
        }
      }
    );
  }
});

// DELETE request to /b/{id} delete a object
app.delete("/b/:id", (req, res) => {
  const { id } = req.params;
  if (!fs.existsSync(`./Backend/tasks/${id}.json`)) {
    res.status(400).send(`{
      "message": "Bin Id not found",
    }`);
  } else {
    fs.unlink(`./Backend/tasks/${id}.json`, (err) => {
      if (err) {
        res.status(500).json({ message: "Error!", error: err });
      } else {
        res.status(201).send("Success");
      }
    });
  }
});

app.listen(port, () => {
  console.log(`app listening on port: ${port}`);
});