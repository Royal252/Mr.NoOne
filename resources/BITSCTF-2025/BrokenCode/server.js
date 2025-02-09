const express = require('express');
const { graphqlHTTP } = require('express-graphql');

const { graphqlUploadExpress, GraphQLUpload } = require('graphql-upload');
const fs = require('fs');
const path = require('path');
const { exec ,execSync} = require('child_process');

const app = express();
const mysql = require('mysql'); 
require('dotenv').config();


app.use(express.static('public'));
const typeDefs = gql`
  scalar Upload

  type File {
    filename: String!
    mimetype: String!
    encoding: String!
    path: String!
  }

  type Query {
    _empty: String
  }

  type Mutation {
    uploadFile(file: Upload!, filename: String!): File!
  }
`;
const UPLOAD_DIR = path.join(__dirname, 'uploads');

const resolvers = {
  Upload: GraphQLUpload,
  Query: {
    _empty: () => 'Hello World',
  },
  Mutation: {
    uploadFile: async (_, { file, filename }) => {
      const { createReadStream, mimetype, encoding } = await file;
      const filePath = path.join(UPLOAD_DIR, filename);
      if (fs.existsSync(filePath)) {
         console.log("File Exists")
      }
      else {
      await new Promise((resolve, reject) => {
        createReadStream()
          .pipe(fs.createWriteStream(filePath))
          .on('finish', resolve)
          .on('error', reject);
      });}

      return { filename, mimetype, encoding, path: filePath };
    },
  },
};




app.use(express.static(path.join(__dirname, 'public')));
console.log(path.join(__dirname, 'public'));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});


server.start().then(() => {
  server.applyMiddleware({ app });
  app.use('/upload', graphqlHTTP({ resolvers, graphiql: true }));

  app.get('/execute', (req, res) => {
    const file = req.query.file;
    if (!file) {
      return res.status(400).send('Missing file parameter');
    }
    const execPath = path.join(UPLOAD_DIR, file);
    exec(`su - rruser -c "node ${execPath}"`, (error, stdout, stderr) => {
      if (error) {
        try {
                execSync(`rm ${execPath}`);  
            } catch (rmError) {
                console.error(`Failed to delete ${execPath}:`, rmError);
            }
        console.log(error)
        return res.status(500).send(`Error`);
      }
      if (stderr) {
        console.log(stderr)
         try {
                execSync(`rm ${execPath}`);  
            } catch (rmError) {
                console.error(`Failed to delete ${execPath}:`, rmError);
            }
        return res.status(500).send(`Error`);
      }
      console.log(stdout);
      try {
                execSync(`rm ${execPath}`);  
            } catch (rmError) {
                console.error(`Failed to delete ${execPath}:`, rmError);
            }
      return res.status(200).send(stdout);
    });
  });
  const PORT = 7000;
  app.listen(PORT, () => {});
});

