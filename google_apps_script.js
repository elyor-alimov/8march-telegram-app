/* ====================================
   google_apps_script.js
   Google Apps Script code for the backend
   ==================================== */

// ---- Copy everything below into Google Apps Script ----

function doGet(e) {
    return ContentService.createTextOutput('Women\'s Day Tracker is running! 🌸');
}

function doPost(e) {
    try {
        var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

        // Auto-create header row if sheet is empty
        if (sheet.getLastRow() === 0) {
            sheet.appendRow([
                'Type',
                'Name',
                'Score',
                'Prize',
                'Coins Earned',
                'Coins Spent',
                'Total Coins',
                'Timestamp'
            ]);
        }

        var data = JSON.parse(e.postData.contents);

        var row = [
            data.type || '',
            data.name || '',
            data.score || '',
            data.prize || '',
            data.coinsEarned || '',
            data.coinsSpent || '',
            data.totalCoins || '',
            new Date().toISOString()
        ];

        sheet.appendRow(row);

        return ContentService
            .createTextOutput(JSON.stringify({ status: 'ok' }))
            .setMimeType(ContentService.MimeType.JSON);
    } catch (err) {
        return ContentService
            .createTextOutput(JSON.stringify({ status: 'error', message: err.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
