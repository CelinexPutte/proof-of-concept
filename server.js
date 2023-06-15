import express from "express"
import dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config()

const server = express()

// Views en public instellen
server.use(express.static("public"))
server.set("view engine", "ejs")
server.set("views", "./views")

// Maak een route voor de index
server.get("/", (request, response) => {
  const searchTerm = request.query.searchbar || ""
  console.log(request.query.searchbar)
  graphQLRequest(
    `query AllBlogPosts($searchbar: String!, $orderBy: [BlogPostModelOrderBy]) {
      allBlogPosts(orderBy: $orderBy, filter: { title: { matches: { pattern: $searchbar } } } ) {
        title
        authors {
          image {
            url
          }
          name
        }
        publishDate
        introTitle
        slug
      }
    }`, {"orderBy": "updatedAt_DESC", "searchbar": searchTerm}).then((data) => {
      response.render('index', { posts: data.data.allBlogPosts });
  })
})

// Stel het poortnummer in en start express
server.set("port", process.env.PORT || 8000)
server.listen(server.get("port"), function () {
  console.log(`Application started on http://localhost:${server.get("port")}`)
})

// Functie GraphQL ophalen
async function graphQLRequest(gql = "", variables = {}) {
    return await fetch("https://graphql.datocms.com", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": process.env.GRAPHQL_KEY,
        },
        body: JSON.stringify({
            query: gql,
            variables,
        }),
    })
        .then(async response => {
          const body = await response.json()
          if (body.errors) {
            throw new Error(JSON.stringify(body.errors, null, 2))
          }
          return body
        })
        .catch(error => console.log(error))
}
