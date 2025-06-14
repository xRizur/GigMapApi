const Band = require('../models/Band');
const fs = require('fs');

const addBand = async (req, res) => {
    const band = req.body;
        if (!band.name || !band.genre) {
            return res.status(400).send("Brakuje Danych");
        }
      try {
        if (req.file) {
          band.image = req.file.path;
        }
        const newBand = await Band.create(band);
        res.send("Dodano Zespol o id: " + newBand._id);
      } catch (error) {
        console.error("Error creating band:", error);
        return res.status(500).send("Error creating band");
      };
};

const getBands = async (req, res) => {
    try {
    const data = await Band.find();
    const bands = data;
    res.send(bands);
    }
    catch (error) {
        console.error("Error fetching bands:", error);
        return res.status(500).send("Error fetching bands");
    }
};

const viewBands = async (req, res) => {
    try {
        const data = await Band.find();
        const bands = data;
        res.render('bands', { bands });
    } catch (error) {
        console.error("Error fetching bands:", error);
        return res.status(500).send("Error fetching bands");
    }
}

const deleteBand = async (req, res) => {
    const { id } = req.params;
    try {
        const band = await Band.findByIdAndDelete(id);
        if (!band) {
            return res.status(404).send("Band not found");
        }
        if (band.image) {
            fs.unlink(band.image, (err) => {
                if (err) {
                    console.error("Error deleting image:", err);
                } else {
                    console.log("Image deleted successfully");
                }
            });
        }
        res.send("Band deleted successfully");
    } catch (error) {
        console.error("Error deleting band:", error);
        return res.status(500).send("Error deleting band");
    }
}

const updateBand = async (req, res) => {
  const { id } = req.params;

  try {
    const band = await Band.findById(id);
    if (!band) {
      return res.status(404).send("Band not found");
    }

    if (req.body.name) band.name = req.body.name;
    if (req.body.genre) band.genre = req.body.genre;

    if (req.file) {
      if (band.image && fs.existsSync(band.image)) {
        fs.unlink(band.image, (err) => {
          if (err) console.error("Error deleting old image:", err);
          else console.log("Old image deleted successfully");
        });
      }

      band.image = req.file.path;
    }

    await band.save();

    res.send("Band updated successfully: " + band._id);

  } catch (error) {
    console.error("Error updating band:", error);
    return res.status(500).send("Error updating band");
  }
};

const getBandAvailability = async (req, res) => {
    const { id } = req.params;
    try {
        const band = await Band.findById(id);
        if (!band) {
            return res.status(404).send("Band not found");
        }
        res.send(band.availability);
    } catch (error) {
        console.error("Error fetching band availability:", error);
        return res.status(500).send("Error fetching band availability");
    }
}

const updateBandAvailability = async (req, res) => {
    const { id } = req.params;
    const { availability } = req.body;
    try {
        const band = await Band.findById(id);
        if (!band) {
            return res.status(404).send("Band not found");
        }
        
        if (!Array.isArray(availability)) {
            return res.status(400).send("Availability must be an array");
        }
        
        if (availability.some(item => !item.start || !item.end)) {
            return res.status(400).send("Each availability item must have start and end dates");
        }
        band.availability = availability;
        await band.save();
        res.send("Band availability updated successfully");
    } catch (error) {
        console.error("Error updating band availability:", error);
        return res.status(500).send("Error updating band availability");
    }
}

module.exports = {addBand, getBands, viewBands, deleteBand, updateBand, getBandAvailability, updateBandAvailability};
