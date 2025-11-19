# Form Focus Issue - Quick Fix

The intake form loses focus after typing one character. This is because the field component functions are being recreated on every render.

## Temporary Solution

For now, use the **Excel export** to collect client data:

```bash
./scripts/export-to-excel.sh
```

This exports all submitted client data to a CSV file you can open in Excel.

## Why the Form Has Issues

The form components (`InputField`, `TextAreaField`, `SelectField`) are defined inside the main component, causing React to recreate them on every keystroke, which unmounts and remounts the inputs.

## Permanent Fix Needed

The form needs to be restructured with field components moved outside the main component, or converted to use direct JSX instead of component functions.

## Alternative: Use Google Forms

Until the form is fixed, you could:
1. Create a Google Form with the same questions
2. Have clients fill that out
3. Export responses to Google Sheets
4. Import into your database later

Or manually enter client data directly into the database:

```bash
sqlite3 prisma/dev.db
```

Then insert client records with SQL.

## For Development/Testing

You can still test the backend by submitting data via API:

```bash
curl -X POST http://localhost:3000/api/intake/submit \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test Client",
    "email": "test@example.com",
    "mainFitnessGoals": "Get fit"
  }'
```

This will create a client record you can then export with the Excel script.
