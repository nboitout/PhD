/**
 * Google Apps Script web app — write sink for the self-hosted visitor
 * analytics of nicolas-boitout.phd (see docs/admin-analytics-setup.md).
 *
 * This script must be bound to the dissertation hub's OWN spreadsheet
 * (Extensions → Apps Script from inside that sheet), not shared with another
 * project's script: a bound script writes to whichever sheet it lives in.
 *
 * Deploy: Deploy → New deployment → Web app
 *   Execute as: Me
 *   Who has access: Anyone      ← "Anyone with a Google account" breaks it
 * Copy the resulting /exec URL into APPS_SCRIPT_URL.
 *
 * Then OPEN that /exec URL once in a browser. If it shows a "needs your
 * permission" page rather than {"ok":true,...}, the script has never been
 * authorized and every write will fail silently: Review permissions →
 * Advanced → Go to (unsafe) → Allow.
 *
 * To keep the URL stable across future edits, use "Manage deployments" →
 * edit the existing deployment → New version, rather than "New deployment".
 */

var HEADERS = {
  Visits: ['timestamp', 'event', 'readerId', 'sessionId', 'isReturning', 'page', 'country',
           'duration_seconds', 'utm_source', 'utm_medium', 'utm_campaign', 'utm_content',
           'utm_term', 'userAgent', 'referer'],
  Events: ['timestamp', 'readerId', 'sessionId', 'context', 'event', 'data', 'country',
           'userAgent', 'referer'],
  Leads: ['timestamp', 'readerId', 'sessionId', 'status', 'firstName', 'familyName', 'email',
          'consent', 'source', 'country', 'pageUrl', 'userAgent', 'referer', 'company', 'jobTitle'],
};

function getSheet(tabName) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tabName);
  if (!sheet) {
    sheet = ss.insertSheet(tabName);
    sheet.appendRow(HEADERS[tabName]);
  }
  return sheet;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(30000);
  try {
    var p = JSON.parse(e.postData.contents);
    var type = p.type; // 'visit' | 'event' | 'lead'
    var tab = { visit: 'Visits', event: 'Events', lead: 'Leads' }[type];
    if (!tab) return json({ ok: false, error: 'Unknown type: ' + type });

    var row = HEADERS[tab].map(function (key) {
      var v = p[key];
      if (v === null || v === undefined) return '';
      return typeof v === 'boolean' ? (v ? 'TRUE' : 'FALSE') : v;
    });
    getSheet(tab).appendRow(row);
    return json({ ok: true, tab: tab });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return json({ ok: true, service: 'nicolas-boitout.phd visitor analytics' });
}
