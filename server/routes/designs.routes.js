import express from 'express';
import { authenticateToken } from '../middleware/auth.js';
import db from '../database/db.js';

const router = express.Router();

// Save a design
router.post('/save', authenticateToken, (req, res) => {
  const { designName, designData } = req.body;
  
  if (!designName || !designData) {
    return res.status(400).json({ message: 'Design name and data are required' });
  }

  db.saveDesign(req.user.id, designName, designData, (err, designId) => {
    if (err) {
      return res.status(500).json({ message: 'Error saving design' });
    }

    res.status(201).json({
      message: 'Design saved successfully',
      designId
    });
  });
});

// Get user's designs
router.get('/my-designs', authenticateToken, (req, res) => {
  db.getUserDesigns(req.user.id, (err, designs) => {
    if (err) {
      return res.status(500).json({ message: 'Error fetching designs' });
    }

    // Parse design data
    const parsedDesigns = designs.map(design => ({
      ...design,
      design_data: JSON.parse(design.design_data)
    }));

    res.json({ designs: parsedDesigns });
  });
});

// Delete a design
router.delete('/:designId', authenticateToken, (req, res) => {
  const { designId } = req.params;

  db.deleteDesign(designId, req.user.id, (err) => {
    if (err) {
      return res.status(500).json({ message: 'Error deleting design' });
    }

    res.json({ message: 'Design deleted successfully' });
  });
});

export default router;
