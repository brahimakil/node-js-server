const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to update locations.json
app.post('/update-locations', (req, res) => {
  const newLocation = req.body.locations[0];

  // Read the current locations.json file
  fs.readFile('locations.json', (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the JSON file');
    }

    // Parse the existing JSON data
    const locationsData = JSON.parse(data);
    
    // Add the new location to the locations array
    locationsData.locations.push(newLocation);

    // Write the updated JSON back to the file
    fs.writeFile('locations.json', JSON.stringify(locationsData, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing to the JSON file');
      }

      // Send a success response
      res.status(200).send('locations.json updated successfully');
    });
  });
});

// Start the server
app.listen(3000, () => {
  console.log('Server running on port 3000');
});
