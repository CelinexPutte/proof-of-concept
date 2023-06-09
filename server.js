import * as path from "path"
import express from "express"
import dotenv from "dotenv"

dotenv.config()

const server = express()

// Views en public instellen
server.use(express.static("public"))
server.set("view engine", "ejs")
server.set("views", "./views")

// Maak een route voor de index
server.get("/", (request, response) => {
  response.render("index")
})

// Stel het poortnummer in en start express
server.set("port", process.env.PORT || 8000)
server.listen(server.get("port"), function () {
  console.log(`Application started on http://localhost:${server.get("port")}`)
})

/**
 * Wraps the fetch api and returns the response body parsed through json
 * @param {*} url the api endpoint to address
 * @returns the json response from the api endpoint
 */
async function fetchJson(url) {
  return await fetch(url)
    .then((response) => response.json())
    .catch((error) => error)
}