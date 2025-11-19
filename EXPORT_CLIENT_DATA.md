# 📊 Export All Client Data to Excel

## ✅ Fixed Issues

1. **Intake Form Text Visibility** - Fixed! Text is now visible when typing
2. **Excel Export** - Ready! All 50+ fields export to one file

## 🚀 Export All Client Data

Run this command anytime:

```bash
./scripts/export-to-excel.sh
```

This creates a CSV file with:
- ✅ ALL 50+ intake form fields
- ✅ Organized column headers
- ✅ One row per client
- ✅ Sorted by submission date (newest first)
- ✅ Timestamped filename

## 📋 What's Included

The export includes every field from the intake form:

### Basic Information
- Full Name, Email, Gender
- Date of Birth, Height, Weight

### Activity & Goals
- Activity Level, Daily Movement
- Fitness Goals, Training Experience

### Training Preferences
- Days Per Week, Session Duration
- Equipment, Location, Coaching Style

### Health & Medical
- Injuries, Medical Conditions
- Medications, Pain/Discomfort

### Nutrition (15+ fields)
- Diet Type, Allergies, Eating Patterns
- Meal Frequency, Water Intake
- Favorite Foods, Macro Preferences

### Program Delivery
- Delivery Preference
- Check-in Frequency

### Sport-Specific
- Sports Played, School Grade
- Practice Habits, Motivation

### Metadata
- Submission Date
- Client ID

## 📂 File Location

The file is created in your current directory with a name like:
```
AFYA_Client_Data_20250117_142530.csv
```

The script will try to open it automatically in your default spreadsheet app!

## 🔄 When to Use This

- **After clients submit** - Export to see their data
- **Before coaching sessions** - Review client information
- **For reports** - Share with your team
- **For backups** - Keep records of submissions

## 💡 Pro Tips

1. **Import to Google Sheets** - Upload the CSV for cloud access
2. **Filter & Sort** - Use Excel features to organize data
3. **Create Pivot Tables** - Analyze trends across clients
4. **Share Selectively** - Remove sensitive columns before sharing

## 🆘 Troubleshooting

### No clients found
Wait for clients to submit the form at:
`http://localhost:3000/get-started`

### File won't open
Manually open the CSV file from your file browser

### Missing data
Some fields are optional - blank cells are normal

---

**Your intake form text visibility is now fixed!** Refresh the page and you should see text as you type.
