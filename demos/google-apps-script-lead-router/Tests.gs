function runSelfTest() {
  assertEqual_(normalizeEmail_('  TEST@Example.COM '), 'test@example.com', 'normalize email');
  assertEqual_(isValidEmail_('a@example.com'), true, 'valid email');
  assertEqual_(isValidEmail_('bad-email'), false, 'invalid email');
  assertEqual_(parseBudget_('$1,000'), 1000, 'thousands separator');
  assertEqual_(parseBudget_('$1000'), 1000, 'budget parse');
  assertEqual_(routeLead_(1200), 'High Priority', 'high priority route');
  assertEqual_(routeLead_(500), 'Qualified', 'qualified route');
  assertEqual_(routeLead_(20), 'Review', 'review route');
  Logger.log('PASS: Apps Script lead-router pure-function checks');
}

function assertEqual_(actual, expected, label) {
  if (actual !== expected) {
    throw new Error(`${label}: expected ${expected}, got ${actual}`);
  }
}
