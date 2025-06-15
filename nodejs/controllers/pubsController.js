const Pub = require('../models/Pub');
const fs = require('fs');

const addPub = async (req, res) => {
    const { name, city, address, map_url, description, contactEmail, contactPhone, websiteUrl, availabilityStart, availabilityEnd } = req.body;
    if (!name || !city || !address) {
        return res.status(400).send("Brakuje nazwy, miasta lub adresu");
    }
    try {
        const pubData = {
            name,
            city,
            address,
            map_url,
            description,
            contactEmail,
            contactPhone,
            websiteUrl,
            availability: []
        };
        if (req.file) {
            pubData.image = req.file.path;
        }

        if (availabilityStart && availabilityEnd && new Date(availabilityStart) < new Date(availabilityEnd)) {
            pubData.availability.push({ start: new Date(availabilityStart), end: new Date(availabilityEnd) });
        }

        await Pub.create(pubData);
        const basePath = res.locals.basePath || req.app.locals.basePath || '';
        res.redirect(`${basePath}/pubs/view`);
    } catch (error) {
        console.error("Error creating Pub:", error);
        return res.status(500).send("Error creating Pub");
    }
};

const getPubs = async (req, res) => {
    try {
        const data = await Pub.find();
        res.send(data);
    }
    catch (error) {
        console.error("Error fetching pubs:", error);
        return res.status(500).send("Error fetching Pubs");
    }
};

const viewPubs = async (req, res) => {
    try {
        const data = await Pub.find();
        const basePath = res.locals.basePath || req.app.locals.basePath || '';
        res.render('pubs', { pubs: data, basePath });
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
            return res.status(404).send("Pub not found");
        }
        if (pub.image && fs.existsSync(pub.image)) {
            fs.unlink(pub.image, (err) => {
                if (err) {
                    console.error("Error deleting image:", err);
                } else {
                    console.log("Image deleted successfully");
                }
            });
        }
        res.send("Pub deleted successfully");
    } catch (error) {
        console.error("Error deleting pub:", error);
        return res.status(500).send("Error deleting pub");
    }
}

const updatePub = async (req, res) => {
    const { id } = req.params;
    const { name, city, address, map_url, description, contactEmail, contactPhone, websiteUrl, availabilityStart, availabilityEnd } = req.body;
    
    try {
        const pub = await Pub.findById(id);
        if (!pub) {
            return res.status(404).send("Pub not found");
        }
    
        if (name) pub.name = name;
        if (city) pub.city = city;
        if (address) pub.address = address;
        if (map_url) pub.map_url = map_url;
        if (description) pub.description = description;
        if (contactEmail) pub.contactEmail = contactEmail;
        if (contactPhone) pub.contactPhone = contactPhone;
        if (websiteUrl) pub.websiteUrl = websiteUrl;

        if (availabilityStart && availabilityEnd && new Date(availabilityStart) < new Date(availabilityEnd)) {
            pub.availability = [{ start: new Date(availabilityStart), end: new Date(availabilityEnd) }];
        } else if (req.body.hasOwnProperty('availabilityStart') && req.body.hasOwnProperty('availabilityEnd')) {
        }
    
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
        res.send("Pub updated successfully: " + pub._id);
    
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
            return res.status(404).send("Pub not found");
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
            return res.status(404).send("Pub not found");
        }
        
        if (!Array.isArray(availability)) {
            return res.status(400).send("Availability must be an array");
        }
      
        if (availability.some(item => !item.start || !item.end || new Date(item.start) >= new Date(item.end))) {
            return res.status(400).send("Each availability item must have start and end dates, and start must be before end");
        }

        pub.availability = availability;
        await pub.save();
        res.send("Pub availability updated successfully: " + pub._id);
    } catch (error) {
        console.error("Error updating pub availability:", error);
        return res.status(500).send("Error updating pub availability");
    }
};

module.exports = {addPub, getPubs, viewPubs, deletePub, updatePub, getPubAvailability, updatePubAvailability};
