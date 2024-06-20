export default async function handler(req, res) {
    if (req.method === 'POST') {
      const bookingData = req.body;
  
      console.log('Received booking data:', bookingData);
  
      res.status(200).json({ message: 'Booking submitted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  