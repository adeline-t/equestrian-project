import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

/**
 * Export data to CSV format
 */
export function exportToCSV(data, filename) {
  const csv = generateCSV(data);
  downloadFile(csv, filename, 'text/csv;charset=utf-8;');
}

/**
 * Generate CSV content from event stats data
 */
function generateCSV(eventStats) {
  const lines = [];

  // En-tête global
  lines.push(
    "Type d'événement,Semaine,Date début,Date fin,Nom événement,Date,Horaire,Durée,Participants,Cavalier,Cheval"
  );

  // Pour chaque type d'événement
  eventStats.forEach((stat) => {
    const eventTypeName = stat.eventTypeConfig?.label || stat.eventType;

    stat.weeks.forEach((week) => {
      week.slots.forEach((slot) => {
        const dateStr = slot.date || '';
        const timeStr = slot.isAllDay
          ? 'Journée entière'
          : slot.startTime && slot.endTime
          ? `${slot.startTime} - ${slot.endTime}`
          : '';

        const duration = slot.isAllDay
          ? ''
          : slot.startTime && slot.endTime
          ? calculateDurationForCSV(slot.startTime, slot.endTime)
          : '';

        if (slot.participants && slot.participants.length > 0) {
          // Une ligne par participant
          slot.participants.forEach((participant) => {
            lines.push(
              [
                escapeCSV(eventTypeName),
                escapeCSV(week.weekLabel),
                week.weekStart,
                week.weekEnd || '',
                escapeCSV(slot.event?.name || 'Sans nom'),
                dateStr,
                timeStr,
                duration,
                slot.participants.length,
                escapeCSV(participant.riderName || 'N/A'),
                escapeCSV(participant.horseName || 'N/A'),
              ].join(',')
            );
          });
        } else {
          // Ligne sans participant
          lines.push(
            [
              escapeCSV(eventTypeName),
              escapeCSV(week.weekLabel),
              week.weekStart,
              week.weekEnd || '',
              escapeCSV(slot.event?.name || 'Sans nom'),
              dateStr,
              timeStr,
              duration,
              0,
              '',
              '',
            ].join(',')
          );
        }
      });
    });
  });

  return lines.join('\n');
}

/**
 * Escape CSV values
 */
function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

/**
 * Calculate duration for CSV export
 */
function calculateDurationForCSV(startTime, endTime) {
  if (!startTime || !endTime) return '';

  const [startHour, startMin] = startTime.split(':').map(Number);
  const [endHour, endMin] = endTime.split(':').map(Number);

  const totalMinutes = endHour * 60 + endMin - (startHour * 60 + startMin);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours > 0 && minutes > 0) {
    return `${hours}h${minutes}min`;
  } else if (hours > 0) {
    return `${hours}h`;
  } else {
    return `${minutes}min`;
  }
}

/**
 * Download file
 */
function downloadFile(content, filename, mimeType) {
  const blob = new Blob(['\ufeff' + content], { type: mimeType }); // BOM for Excel UTF-8
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export to PDF using browser print
 */
export function exportToPDF(eventStats, month) {
  const monthStr = format(month, 'MMMM yyyy', { locale: fr });

  // Créer une nouvelle fenêtre avec le contenu formaté pour l'impression
  const printWindow = window.open('', '_blank');

  const htmlContent = generatePDFHTML(eventStats, monthStr);

  printWindow.document.write(htmlContent);
  printWindow.document.close();

  // Attendre que le contenu soit chargé puis lancer l'impression
  printWindow.onload = () => {
    printWindow.print();
  };
}

/**
 * Generate HTML for PDF export
 */
function generatePDFHTML(eventStats, monthStr) {
  let html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Statistiques - ${monthStr}</title>
  <style>
    @page {
      size: A4 landscape;
      margin: 1cm;
    }
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
      font-size: 10pt;
      line-height: 1.4;
      color: #000;
    }
    
    .header {
      margin-bottom: 20px;
      padding-bottom: 10px;
      border-bottom: 2px solid #000;
    }
    
    .header h1 {
      font-size: 18pt;
      margin-bottom: 5px;
    }
    
    .header .subtitle {
      font-size: 12pt;
      color: #666;
    }
    
    .event-type-section {
      page-break-inside: avoid;
      margin-bottom: 30px;
    }
    
    .event-type-header {
      background: #f0f0f0;
      padding: 10px;
      margin-bottom: 10px;
      border-left: 4px solid #333;
    }
    
    .event-type-title {
      font-size: 14pt;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .event-type-stats {
      font-size: 10pt;
      color: #666;
    }
    
    table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 15px;
    }
    
    th {
      background: #e0e0e0;
      font-weight: bold;
      text-align: left;
      padding: 8px 5px;
      border: 1px solid #ccc;
      font-size: 9pt;
    }
    
    td {
      padding: 6px 5px;
      border: 1px solid #ddd;
      font-size: 9pt;
    }
    
    .week-header {
      background: #f5f5f5;
      font-weight: bold;
    }
    
    .participant-detail {
      padding-left: 20px;
      font-size: 8pt;
      color: #666;
    }
    
    @media print {
      .event-type-section {
        page-break-inside: avoid;
      }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>Statistiques mensuelles - ${monthStr}</h1>
    <div class="subtitle">Activité par type d'événement</div>
  </div>
`;

  eventStats.forEach((stat) => {
    const eventTypeName = stat.eventTypeConfig?.label || stat.eventType;

    html += `
  <div class="event-type-section">
    <div class="event-type-header">
      <div class="event-type-title">${eventTypeName}</div>
      <div class="event-type-stats">
        ${stat.totalSlots} événement${stat.totalSlots > 1 ? 's' : ''} • 
        ${stat.totalParticipants} participant${stat.totalParticipants > 1 ? 's' : ''}
      </div>
    </div>
    
    <table>
      <thead>
        <tr>
          <th style="width: 15%">Semaine</th>
          <th style="width: 30%">Événement</th>
          <th style="width: 12%">Date</th>
          <th style="width: 15%">Horaire</th>
          <th style="width: 8%">Part.</th>
          <th style="width: 20%">Détails</th>
        </tr>
      </thead>
      <tbody>
`;

    stat.weeks.forEach((week) => {
      if (week.slots.length === 0) return;

      week.slots.forEach((slot, slotIndex) => {
        const dateStr = slot.date ? format(new Date(slot.date), 'dd/MM/yyyy') : '';
        const timeStr = slot.isAllDay
          ? 'Journée entière'
          : slot.startTime && slot.endTime
          ? `${slot.startTime.substring(0, 5)} - ${slot.endTime.substring(0, 5)}`
          : '';

        const participantsStr =
          slot.participants && slot.participants.length > 0
            ? slot.participants
                .map((p) => `${p.riderName || 'N/A'} - ${p.horseName || 'N/A'}`)
                .join(', ')
            : '-';

        html += `
        <tr>
          ${
            slotIndex === 0
              ? `<td rowspan="${week.slots.length}" class="week-header">${week.weekLabel}</td>`
              : ''
          }
          <td>${slot.event?.name || 'Sans nom'}</td>
          <td>${dateStr}</td>
          <td>${timeStr}</td>
          <td style="text-align: center">${slot.participants?.length || 0}</td>
          <td class="participant-detail">${participantsStr}</td>
        </tr>
`;
      });
    });

    html += `
      </tbody>
    </table>
  </div>
`;
  });

  html += `
</body>
</html>
`;

  return html;
}
