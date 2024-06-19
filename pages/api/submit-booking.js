export default async function handler(req, res) {
    if (req.method === 'POST') {
      const bookingData = req.body;
  
      // Логика сохранения данных на сервере
      // Например, сохранение в базу данных или отправка по электронной почте
  
      console.log('Received booking data:', bookingData);
  
      res.status(200).json({ message: 'Booking submitted successfully' });
    } else {
      res.status(405).json({ message: 'Method not allowed' });
    }
  }
  