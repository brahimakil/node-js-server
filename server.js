const express = require('express');
const fs = require('fs');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

// Middleware to parse JSON bodies
app.use(bodyParser.json());

// Endpoint to update locations.json
app.post('/update-locations', (req, res) => {
  const locationsData = req.body;
  const newLocations = locationsData.locations;

  // Define path to locations.json file
  const locationsFilePath = path.join(__dirname, 'assets', 'locations.json');

  // Read the existing locations.json file
  fs.readFile(locationsFilePath, (err, data) => {
    if (err) {
      return res.status(500).send('Error reading the JSON file');
    }

    let existingLocations;
    try {
      // Parse the existing JSON data
      existingLocations = JSON.parse(data).locations;
    } catch (error) {
      return res.status(500).send('Error parsing the JSON file');
    }

    // Check for duplicates before adding
    newLocations.forEach((newLocation) => {
      const isDuplicate = existingLocations.some(existingLocation => existingLocation.name === newLocation.name);
      if (!isDuplicate) {
        existingLocations.push(newLocation); // Add new location if it's not a duplicate
      }
    });

    // Write the updated data back to locations.json
    fs.writeFile(locationsFilePath, JSON.stringify({ locations: existingLocations }, null, 2), (err) => {
      if (err) {
        return res.status(500).send('Error writing to the JSON file');
      }
      // Send a success response
      res.status(200).send('locations.json updated successfully');
    });
  });
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
