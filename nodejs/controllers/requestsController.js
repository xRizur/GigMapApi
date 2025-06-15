const Request = require('../models/Request');
const Band = require('../models/Band');
const Pub = require('../models/Pub');


const showNewRequestForm = async (req, res) => {
  try {
    const bands = await Band.find({}, 'id name').exec();
    const pubs = await Pub.find({}, 'id name').exec();
    const basePath = res.locals.basePath || req.app.locals.basePath || '';
    res.render('request_form', { bands, pubs, basePath });
  } catch (error) {
    console.error("Error fetching data for request form:", error);
    res.status(500).send("Error loading request form");
  }
};


const createRequest = async (req, res) => {
  try {
    const { bandId, pubId, start, end, message, initiator } = req.body;

    if (!bandId || !pubId || !start || !end || !initiator) {
      return res.status(400).send("Missing required fields");
    }

    if (!['band', 'pub'].includes(initiator)) {
      return res.status(400).send("Invalid initiator value");
    }

    if (new Date(start) >= new Date(end)) {
      return res.status(400).send("Invalid time range");
    }

    const target = initiator === 'band'
      ? await Pub.findById(pubId)
      : await Band.findById(bandId);

    if (!target) {
      return res.status(404).send("Target not found");
    }

    const slotIsAvailable = target.availability.some(a => {
      return new Date(start) >= new Date(a.start) && new Date(end) <= new Date(a.end);
    });

    if (!slotIsAvailable) {
      return res.status(400).send("Requested slot is not available");
    }

    await Request.create({
      bandId,
      pubId,
      start,
      end,
      message,
      initiator
    });

    const basePath = res.locals.basePath || req.app.locals.basePath || '';
    res.redirect(`${basePath}/requests/view`);

  } catch (error) {
    console.error("Error creating request:", error);
    res.status(500).send("Error creating request");
  }
};

const getRequests = async (req, res) => {
    const { id, bandId, pubId } = req.params;
    try {
        let filter = {};

        if (id) {
            filter._id = id;
        } else if (bandId) {
            filter.bandId = bandId;
        } else if (pubId) {
            filter.pubId = pubId;
        }

        const requests = await Request.find(filter).populate('bandId').populate('pubId');
        res.send(requests);
    } catch (error) {
        console.error("Error fetching requests:", error);
        res.status(500).send("Error fetching requests");
    }
}

const viewRequests = async (req, res) => {
    try {
      const requests = await Request.find().populate('bandId').populate('pubId');
      const basePath = res.locals.basePath || req.app.locals.basePath || '';
      res.render('requests', { requests, basePath });
    } catch (error) {
      console.error("Error rendering requests:", error);
      res.status(500).send("Error rendering requests");
    }
  };
  
  const acceptRequest = async (req, res) => {
    const { id } = req.params;
  
    try {
      const request = await Request.findById(id);
      if (!request) return res.status(404).send("Request not found");
      if (request.status !== 'pending') return res.status(400).send("Request already processed");
  
      request.status = 'accepted';
      await request.save();
  
      const Model = request.initiator === 'band' ? Pub : Band;
      const targetId = request.initiator === 'band' ? request.pubId : request.bandId;
  
      const target = await Model.findById(targetId);
      if (!target) return res.status(404).send("Target not found");
  
      const newAvailability = [];
  
      for (const slot of target.availability) {
        const slotStart = new Date(slot.start);
        const slotEnd = new Date(slot.end);
        const reqStart = new Date(request.start);
        const reqEnd = new Date(request.end);
  
        if (reqStart >= slotStart && reqEnd <= slotEnd) {
          if (reqStart > slotStart) {
            newAvailability.push({ start: slotStart, end: reqStart });
          }
          if (reqEnd < slotEnd) {
            newAvailability.push({ start: reqEnd, end: slotEnd });
          }
        } else {
          newAvailability.push(slot);
        }
      }
  
      target.availability = newAvailability;
      await target.save();
  
      const basePath = res.locals.basePath || req.app.locals.basePath || '';
      res.redirect(`${basePath}/requests/view`);
    } catch (error) {
      console.error("Error accepting request:", error);
      res.status(500).send("Error accepting request");
    }
  };
  
  
  const rejectRequest = async (req, res) => {
    const { id } = req.params;
    try {
      const request = await Request.findById(id);
      if (!request) return res.status(404).send("Not found");
  
      request.status = 'rejected';
      await request.save();
      const basePath = res.locals.basePath || req.app.locals.basePath || '';
      res.redirect(`${basePath}/requests/view`);
    } catch (err) {
      console.error(err);
      res.status(500).send("Error");
    }
  };
  
module.exports = { createRequest, getRequests, viewRequests, acceptRequest, rejectRequest, showNewRequestForm };
