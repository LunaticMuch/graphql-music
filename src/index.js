const DataLoader = require("dataloader");
const resolvers = require("./resolvers");
const createConnectors = require("./connectors");
const { addResolversToSchema } = require("@graphql-tools/schema");
const { GraphQLFileLoader } = require('@graphql-tools/graphql-file-loader');
const { loadSchemaSync } = require('@graphql-tools/load');

// Various imports required to run the server
const express = require("express");
const { graphqlHTTP } = require("express-graphql");


  const connectors = createConnectors();
  const loaders = {
    artist: new DataLoader((IDs) =>
      Promise.resolve(
        IDs.map((id) => connectors.iTunes.artist({ id })),
        console.log(`Dataloader here for ${IDs}`)
      )
    ),
  };

const schema =  loadSchemaSync('./src/schema/*.graphql', {  // load files and merge them into a single schema object
  loaders: [
      new GraphQLFileLoader()
  ]
});

const schemaWithResolvers = addResolversToSchema({
  schema,
  resolvers,
});

// Define HTTP port
const port = 4000;

// Instantiate Express HTTP Server
const app = express();

// GraphQL Endpoint
app.use(
  "/graphql",
  graphqlHTTP({
    schema: schemaWithResolvers,
    context: {connectors, loaders},
    graphiql: true,
  })
);

// Express HTTP Server start
app.listen(port, (error) => {
  if (error) {
    console.error(error);
  } else {
    console.info("🌎 Listening on port", port);
  }
});
