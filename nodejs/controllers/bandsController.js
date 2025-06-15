const Band = require('../models/Band');
const fs = require('fs');

const addBand = async (req, res) => {
    const { name, genre, description, contactEmail, contactPhone, websiteUrl, availabilityStart, availabilityEnd } = req.body;
    if (!name || !genre) {
        return res.status(400).send("Brakuje nazwy lub gatunku");
    }
    try {
        const bandData = {
            name,
            genre,
            description,
            contactEmail,
            contactPhone,
            websiteUrl,
            availability: []
        };
        if (req.file) {
            bandData.image = req.file.path;
        }

        if (availabilityStart && availabilityEnd && new Date(availabilityStart) < new Date(availabilityEnd)) {
            bandData.availability.push({ start: new Date(availabilityStart), end: new Date(availabilityEnd) });
        }

        await Band.create(bandData);
        const basePath = res.locals.basePath || req.app.locals.basePath || '';
        res.redirect(`${basePath}/bands/view`);
    } catch (error) {
        console.error("Error creating band:", error);
        return res.status(500).send("Error creating band");
    }
};

const getBands = async (req, res) => {
    try {
        const data = await Band.find();
        res.send(data);
    }
    catch (error) {
        console.error("Error fetching bands:", error);
        return res.status(500).send("Error fetching bands");
    }
};

const viewBands = async (req, res) => {
    try {
        const data = await Band.find();
        const basePath = res.locals.basePath || req.app.locals.basePath || '';
        res.render('bands', { bands: data, basePath });
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
        if (band.image && fs.existsSync(band.image)) {
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
    const { name, genre, description, contactEmail, contactPhone, websiteUrl, availabilityStart, availabilityEnd } = req.body;

    try {
        const band = await Band.findById(id);
        if (!band) {
            return res.status(404).send("Band not found");
        }

        if (name) band.name = name;
        if (genre) band.genre = genre;
        if (description) band.description = description;
        if (contactEmail) band.contactEmail = contactEmail;
        if (contactPhone) band.contactPhone = contactPhone;
        if (websiteUrl) band.websiteUrl = websiteUrl;

        if (availabilityStart && availabilityEnd && new Date(availabilityStart) < new Date(availabilityEnd)) {
            band.availability = [{ start: new Date(availabilityStart), end: new Date(availabilityEnd) }];
        } else if (req.body.hasOwnProperty('availabilityStart') && req.body.hasOwnProperty('availabilityEnd')) {
        }


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
        
        if (availability.some(item => !item.start || !item.end || new Date(item.start) >= new Date(item.end))) {
            return res.status(400).send("Each availability item must have start and end dates, and start must be before end");
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
