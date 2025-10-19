const express = require("express");
const app = express();
const https = require("https");
const port = 3000;

function allTodos() {
    return [{
        id: 1,
        name: "Finished writing a blogpost"
    }, {
        id: 2,
        name: "Get pizza for dinner"
    }, {
        id: 3,
        name: "wake up at 7:30am"
    }, ];
}

app.get("/", (req, res) => {
  res.send({
    date: new Date(),
    msg: "Greetings!"
  });
});

app.get("/todo", (req, res) => {
  res.send(allTodos());
});

app.get("/todo/:id", (req, res) => {
  const todoId = parseInt(req.params.id, 10);
  if (isNaN(todoId)) {
    return res.status(400).send({ error: "Invalid ID parameter" });
  }
  const todos = allTodos();
  const todo = todos.find(t => t.id === todoId);
  if (!todo) {
    return res.status(404).send({ error: "Todo not found" });
  }
  res.send(todo);
});

app.get("/joke", (req, res) => {
    const url = "https://api.chucknorris.io/jokes/random";
    https.get(url, (response) => {
        let data = '';
        response.on('data', (chunk) => {
            data += chunk;
        });
        response.on('end', () => {
            try {
                const joke = JSON.parse(data);
                res.send(joke);
            } catch (error) {
                res.status(500).send({ error: "Failed to parse joke response" });
            }
        });
    }).on('error', (error) => {
        res.status(500).send({ error: "Failed to fetch joke" });
    });
});

app.listen(port, () => {
    console.log(`Listening on port => ${port}`);
});

module.exports = app;
