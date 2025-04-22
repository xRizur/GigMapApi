const Pub = require('../models/Pub');

const addPub = async (req, res) => {
    const pub = req.body;
        if (!pub.name || !pub.location) {
            return res.status(400).send("Brakuje Danych");
        }
      try {
        if (req.file) {
          pub.image = req.file.path;
        }
        const newPub = await Pub.create(pub);
        res.send("Dodano Pub o id: " + newPub._id);
      } catch (error) {
        console.error("Error creating Pub:", error);
        return res.status(500).send("Error creating Pub");
      };
};

const getPubs = async (req, res) => {
    try {
    const data = await Pub.find();
    const pubs = data;
    res.send(pubs);
    }
    catch (error) {
        console.error("Error fetching pubs:", error);
        return res.status(500).send("Error fetching Pubs");
    }
};

const viewPubs = async (req, res) => {
    try {
        const data = await Pub.find();
        const pubs = data;
        res.render('pubs', { pubs });
    } catch (error) {
        console.error("Error fetching pubs:", error);
        return res.status(500).send("Error fetching pubs");
    }
}

const deletePub = async (req, res) => {
  const { id } = req.params;
      try {
          const pub = await Pub.findByIdAndDelete(id);
          if (!pub) {
              return res.status(404).send("pub not found");
          }
          if (pub.image) {
              fs.unlink(pub.image, (err) => {
                  if (err) {
                      console.error("Error deleting image:", err);
                  } else {
                      console.log("Image deleted successfully");
                  }
              });
          }
          res.send("pub deleted successfully");
      } catch (error) {
          console.error("Error deleting pub:", error);
          return res.status(500).send("Error deleting pub");
      }
}

const updatePub = async (req, res) => {
    const { id } = req.params;
    
      try {
        const pub = await Pub.findById(id);
        if (!pub) {
          return res.status(404).send("pub not found");
        }
    
        if (req.body.name) pub.name = req.body.name;
        if (req.body.genre) pub.genre = req.body.genre;
    
        if (req.file) {
          if (pub.image && fs.existsSync(pub.image)) {
            fs.unlink(pub.image, (err) => {
              if (err) console.error("Error deleting old image:", err);
              else console.log("Old image deleted successfully");
            });
          }
    
          pub.image = req.file.path;
        }
    
        await pub.save();
    
        res.send("pub updated successfully: " + pub._id);
    
      } catch (error) {
        console.error("Error updating pub:", error);
        return res.status(500).send("Error updating pub");
      }
};

const getPubAvailability = async (req, res) => {
    const { id } = req.params;
    try {
        const pub = await Pub.findById(id);
        if (!pub) {
            return res.status(404).send("pub not found");
        }
        res.send(pub.availability);
    } catch (error) {
        console.error("Error fetching pub availability:", error);
        return res.status(500).send("Error fetching pub availability");
    }
};

const updatePubAvailability = async (req, res) => {
    const { id } = req.params;
    const { availability } = req.body;
    try {
        const pub = await Pub.findById(id);
        if (!pub) {
            return res.status(404).send("pub not found");
        }
        
        if (!Array.isArray(availability)) {
          return res.status(400).send("Availability must be an array");
        }
      
        if (availability.some(item => !item.start || !item.end)) {
            return res.status(400).send("Each availability item must have start and end dates");
        }

        pub.availability = availability;
        await pub.save();
        res.send("pub availability updated successfully: " + pub._id);
    } catch (error) {
        console.error("Error updating pub availability:", error);
        return res.status(500).send("Error updating pub availability");
    }
};

module.exports = {addPub, getPubs, viewPubs, deletePub, updatePub, getPubAvailability, updatePubAvailability};
