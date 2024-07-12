const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors');
const multer = require('multer');
const path = require('path');


const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// MongoDB configuration
const uri = 'mongodb+srv://mern-book-store:Park15hoseok@cluster0.1ab2bzo.mongodb.net/BookInventory?retryWrites=true&w=majority';

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './uploads'); // Example destination directory
  },
  filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      const originalName = file.originalname.toLowerCase().split(' ').join('-');
      cb(null, originalName + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});



const upload = multer({ storage: storage });
app.get('/', (req, res) => {
  res.send('Hello World!');
});

async function run() {
  try {
    await client.connect();
    const resultCollection = client.db('Test').collection('Results');
    const questionCollection = client.db('Test').collection('Questions');
    const profileCollection = client.db('Test').collection('Profile');

    // Insert a result to the database using the POST method
    app.post('/upload-result', async (req, res) => {
      const data = req.body;
      if (!data.user_id || !data.scores || !data.totalScores || !data.noOfTests) {
        return res.status(400).send({ success: false, message: 'Invalid input data' });
      }

      const result = await resultCollection.insertOne(data);
      res.send(result);
    });

    // Update a result: PATCH or UPDATE method
    // app.patch('/result/:id', async (req, res) => {
    //   try {
    //     const id = req.params.id;
    //     if (!ObjectId.isValid(id)) {
    //       return res.status(400).send({ success: false, message: 'Invalid result ID format.' });
    //     }

    //     const updateResultData = req.body;
    //     const filter = { _id: new ObjectId(id) };
    //     const updateDoc = {
    //       $set: {
    //         scores: updateResultData.scores,
    //         totalScores: updateResultData.totalScores,
    //         noOfTests: updateResultData.noOfTests
    //       },
    //     };
    //     const options = { upsert: true };

    //     const result = await resultCollection.updateOne(filter, updateDoc, options);

    //     if (result.modifiedCount > 0 || result.upsertedCount > 0) {
    //       const updatedResult = await resultCollection.findOne(filter);
    //       res.send(updatedResult);
    //     } else {
    //       res.status(404).send({ success: false, message: 'Result not found.' });
    //     }
    //   } catch (error) {
    //     console.error('Error updating result:', error);
    //     res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
    //   }
    // });

    app.patch('/result/:user_id', async (req, res) => {
      try {
        const userId = req.params.user_id;
        const newScores = req.body;
    
        // Fetch the current result for the user
        const existingResult = await resultCollection.findOne({ user_id: userId });
    
        if (!existingResult) {
          return res.status(404).send({ success: false, message: 'Result not found.' });
        }
    
        // Append the new scores to the existing scores
        for (const [scoreKey, scoreValue] of Object.entries(newScores)) {
          if (existingResult.scores[scoreKey]) {
            existingResult.scores[scoreKey].push(scoreValue);
          } else {
            existingResult.scores[scoreKey] = [scoreValue];
          }
        }
    
        // Calculate the new total scores and number of tests
        const newTotalScore = Object.values(newScores).reduce((sum, score) => sum + score, 0);
        existingResult.totalScores.push(newTotalScore);
        existingResult.noOfTests += 1;
    
        // Update the result in the database
        const filter = { user_id: userId };
        const updateDoc = {
          $set: {
            scores: existingResult.scores,
            totalScores: existingResult.totalScores,
            noOfTests: existingResult.noOfTests
          }
        };
    
        const options = { upsert: true };
        const result = await resultCollection.updateOne(filter, updateDoc, options);
    
        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
          const updatedResult = await resultCollection.findOne(filter);
          res.send(updatedResult);
        } else {
          res.status(404).send({ success: false, message: 'Result not found.' });
        }
      } catch (error) {
        console.error('Error updating result:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });
    
    

    // Delete a result
    app.delete('/result/:id', async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ success: false, message: 'Invalid result ID format.' });
        }

        const filter = { _id: new ObjectId(id) };
        const result = await resultCollection.deleteOne(filter);

        if (result.deletedCount > 0) {
          res.send({ success: true, message: 'Result deleted successfully.' });
        } else {
          res.status(404).send({ success: false, message: 'Result not found for deletion.' });
        }
      } catch (error) {
        console.error('Error deleting result:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });

    // Get all results or results by user_id
    app.get('/all-results', async (req, res) => {
      try {
        let query = {};
        if (req.query?.user_id) {
          query = { user_id: req.query.user_id };
        }
        const results = await resultCollection.find(query).toArray();
        res.send(results);
      } catch (error) {
        console.error('Error finding results:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });

    // Get a single result by ID
    app.get('/result/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: 'Invalid result ID format.' });
      }
      const filter = { _id: new ObjectId(id) };
      const result = await resultCollection.findOne(filter);
      if (result) {
        res.send(result);
      } else {
        res.status(404).send({ success: false, message: 'Result not found.' });
      }
    });

    // Questions Collection Endpoints

    // Insert a question
    app.post('/add-question', async (req, res) => {
      const data = req.body;
      if (!data.question || !data.type || !data.options) {
        return res.status(400).send({ success: false, message: 'Invalid input data' });
      }

      const result = await questionCollection.insertOne(data);
      res.send(result);
    });

    // Update a question
    app.patch('/question/:id', async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ success: false, message: 'Invalid question ID format.' });
        }

        const updateQuestionData = req.body;
        const filter = { _id: new ObjectId(id) };
        const updateDoc = {
          $set: {
            question: updateQuestionData.question,
            type: updateQuestionData.type,
            options: updateQuestionData.options
          },
        };
        const options = { upsert: true };

        const result = await questionCollection.updateOne(filter, updateDoc, options);

        if (result.modifiedCount > 0 || result.upsertedCount > 0) {
          const updatedQuestion = await questionCollection.findOne(filter);
          res.send(updatedQuestion);
        } else {
          res.status(404).send({ success: false, message: 'Question not found.' });
        }
      } catch (error) {
        console.error('Error updating question:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });

    // Delete a question
    app.delete('/question/:id', async (req, res) => {
      try {
        const id = req.params.id;
        if (!ObjectId.isValid(id)) {
          return res.status(400).send({ success: false, message: 'Invalid question ID format.' });
        }

        const filter = { _id: new ObjectId(id) };
        const result = await questionCollection.deleteOne(filter);

        if (result.deletedCount > 0) {
          res.send({ success: true, message: 'Question deleted successfully.' });
        } else {
          res.status(404).send({ success: false, message: 'Question not found for deletion.' });
        }
      } catch (error) {
        console.error('Error deleting question:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });

    // // Get all questions
    // app.get('/all-questions', async (req, res) => {
    //   try {
    //     const questions = await questionCollection.find({}).toArray();
    //     res.send(questions);
    //   } catch (error) {
    //     console.error('Error finding questions:', error);
    //     res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
    //   }
    // });

    // Get paginated questions
    app.get('/all-questions', async (req, res) => {
      try {
        const page = parseInt(req.query.page) || 1; // Default to page 1 if not provided
        const limit = parseInt(req.query.limit) || 5; // Default to limit of 5 if not provided
        const skip = (page - 1) * limit;
    
        const questions = await questionCollection.find({})
          .skip(skip)
          .limit(limit)
          .toArray();
    
        const totalQuestions = await questionCollection.countDocuments({});
        const totalPages = Math.ceil(totalQuestions / limit);
    
        res.status(200).json({ questions, totalPages });
      } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ success: false, message: 'Internal server error.', error: error.message });
      }
    });
    
    


    // Get a single question by ID
    app.get('/question/:id', async (req, res) => {
      const id = req.params.id;
      if (!ObjectId.isValid(id)) {
        return res.status(400).send({ success: false, message: 'Invalid question ID format.' });
      }
      const filter = { _id: new ObjectId(id) };
      const question = await questionCollection.findOne(filter);
      if (question) {
        res.send(question);
      } else {
        res.status(404).send({ success: false, message: 'Question not found.' });
      }
    });

    app.post('/profile', async (req, res) => {
      try {
        const { user_id, userEmail } = req.body;

        // Check if user already exists
        const existingProfile = await profileCollection.findOne({ user_id });
        if (existingProfile) {
          return res.status(400).send({ success: false, message: 'Profile already exists for this user.' });
        }

        // Insert new profile
        const result = await profileCollection.insertOne({ user_id, userEmail });
        res.send(result);
      } catch (error) {
        console.error('Error creating profile:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });

    // Update profile image by user_id (using multipart form-data)
    app.patch('/profile/image/:user_id', upload.single('profileImage'), async (req, res) => {
      try {
        const { user_id } = req.params;
        const profileImage = req.file.path; // Uploaded file path

        // Update profile with new profileImage
        const result = await profileCollection.updateOne(
          { user_id },
          { $set: { profileImage } }
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: 'Profile image updated successfully.' });
        } else {
          res.status(404).send({ success: false, message: 'Profile not found.' });
        }
      } catch (error) {
        console.error('Error updating profile image:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });

    // Update profile name by user_id
    app.patch('/profile/name/:user_id', async (req, res) => {
      try {
        const { user_id } = req.params;
        const { userName } = req.body;

        // Update profile with new userName
        const result = await profileCollection.updateOne(
          { user_id },
          { $set: { userName } }
        );

        if (result.modifiedCount > 0) {
          res.send({ success: true, message: 'Profile name updated successfully.' });
        } else {
          res.status(404).send({ success: false, message: 'Profile not found.' });
        }
      } catch (error) {
        console.error('Error updating profile name:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });

    // Delete profile by user_id
    app.delete('/profile/:user_id', async (req, res) => {
      try {
        const { user_id } = req.params;

        // Delete profile
        const result = await profileCollection.deleteOne({ user_id });

        if (result.deletedCount > 0) {
          res.send({ success: true, message: 'Profile deleted successfully.' });
        } else {
          res.status(404).send({ success: false, message: 'Profile not found for deletion.' });
        }
      } catch (error) {
        console.error('Error deleting profile:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });

    // Get profile by user_id
    app.get('/profile/:user_id', async (req, res) => {
      try {
        const { user_id } = req.params;

        // Fetch profile
        const profile = await profileCollection.findOne({ user_id });

        if (profile) {
          res.send(profile);
        } else {
          res.status(404).send({ success: false, message: 'Profile not found.' });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).send({ success: false, message: 'Internal server error.', error: error.message });
      }
    });

    await client.db('admin').command({ ping: 1 });
    console.log('Pinged your deployment. You successfully connected to MongoDB!');
  } finally {
    process.on('SIGINT', async () => {
      console.log('Closing MongoDB connection');
      await client.close();
      process.exit();
    });
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
