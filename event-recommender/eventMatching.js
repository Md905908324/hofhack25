const csv = require('csv-parser');
const moment = require('moment');
const stream = require('stream');

async function getMatchingEvents(freeSlots, preferences, csvContent) {
  return new Promise((resolve, reject) => {
    const matches = [];
    const csvStream = new stream.Readable();
    csvStream.push(csvContent);
    csvStream.push(null);

    csvStream
      .pipe(csv())
      .on('data', (row) => {
        try {
          
          let eventStart, eventEnd;
          
          if (row['All Day'] === 'True') {
            eventStart = moment(row.datetime).startOf('day');
            eventEnd = moment(row.datetime).endOf('day');
          } else {
            eventStart = moment(row.datetime, 'YYYY-MM-DD HH:mm:ss');
            eventEnd = moment(eventStart).add(2, 'hours');
          }

          
          if (!preferences.map(p => p.toLowerCase()).includes(row.category.toLowerCase())) {
            return;
          }

          
          for (const slot of freeSlots) {
            const slotStart = moment(slot.start);
            const slotEnd = moment(slot.end);

            if (eventStart.isBetween(slotStart, slotEnd, null, '[]') &&
                eventEnd.isBetween(slotStart, slotEnd, null, '[]')) {
              matches.push({
                title: row.name,
                category: row.category,
                location: row.location,
                start: eventStart.toDate(),
                end: eventEnd.toDate(),
                description: row.description
              });
              break;
            }
          }
        } catch (error) {
          console.error('Error processing row:', row, error);
        }
      })
      .on('end', () => {
        resolve(matches);
      })
      .on('error', reject);
  });
}
