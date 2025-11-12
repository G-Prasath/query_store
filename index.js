import express from 'express';
import fs from 'fs';
import path from 'path';
// import nodemailer from 'nodemailer';

const app = express();

app.use(express.json());



// File path for storing data
const DATA_FILE = path.join(process.cwd(), 'mail_data.json');

// Helper function to read existing data
const readDataFromFile = () => {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const data = fs.readFileSync(DATA_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error reading data file:', error);
  }
  return [];
};

// Helper function to write data to file
const writeDataToFile = (data) => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
    return true;
  } catch (error) {
    console.error('Error writing data file:', error);
    return false;
  }
};

app.post('/data', async (req, res) => {
  const { name, email, phone, message } = req.body;



  try {
    // Create data object with timestamp
    const mailData = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      name,
      email,
      phone: phone || 'Not provided',
      message
    };

    // Read existing data
    const existingData = readDataFromFile();
    
    // Append new data
    existingData.push(mailData);
    
    // Save to JSON file
    const saveSuccess = writeDataToFile(existingData);
    
    if (!saveSuccess) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save data to file'
      });
    }{
        return res.status(201).send("Success");
    }

   

  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Optional: GET endpoint to view all saved mail data
app.get('/mails', (req, res) => {
  try {
    const mailData = readDataFromFile();
    res.status(200).json({
      success: true,
      count: mailData.length,
      data: mailData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error reading mail data'
    });
  }
});


app.listen(3000, (req, res) => {
  console.log("Server running on : 3000");
});