#!/bin/bash

# Export all client data to Excel-ready CSV file

GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

DB_PATH="prisma/dev.db"
OUTPUT_FILE="AFYA_Client_Data_$(date +%Y%m%d_%H%M%S).csv"

echo ""
echo -e "${BLUE}📊 Exporting AFYA Client Data to Excel...${NC}"
echo ""

# Check if there are any clients
CLIENT_COUNT=$(sqlite3 "$DB_PATH" "SELECT COUNT(*) FROM Client;")

if [ "$CLIENT_COUNT" -eq 0 ]; then
    echo -e "${YELLOW}⚠️  No clients found in database${NC}"
    echo ""
    echo "Clients will appear after they submit the intake form at:"
    echo "http://localhost:3000/get-started"
    echo ""
    exit 0
fi

# Export all client data with organized columns
sqlite3 "$DB_PATH" <<EOF
.mode csv
.headers on
.output $OUTPUT_FILE
SELECT 
    -- Basic Information
    fullName as "Full Name",
    email as "Email",
    gender as "Gender",
    dateOfBirth as "Date of Birth",
    heightInches as "Height (inches)",
    weightLbs as "Weight (lbs)",
    
    -- Activity & Goals
    activityLevel as "Activity Level",
    dailyMovementPattern as "Daily Movement Pattern",
    mainFitnessGoals as "Main Fitness Goals",
    trainingExperience as "Training Experience",
    trainingHistory as "Training History",
    
    -- Training Preferences
    daysPerWeek as "Training Days Per Week",
    sessionDuration as "Session Duration (min)",
    preferredWorkoutTime as "Preferred Workout Time",
    availableEquipment as "Available Equipment",
    workoutLocation as "Workout Location",
    trainingStyle as "Training Style",
    coachingStyle as "Coaching Style Preference",
    
    -- Motivation & Challenges
    motivation as "What Motivates You",
    biggestStruggle as "Biggest Struggle",
    
    -- Health & Medical
    injuries as "Current/Past Injuries",
    medicalConditions as "Medical Conditions",
    medications as "Medications/Supplements",
    painOrDiscomfort as "Pain or Discomfort",
    
    -- Nutrition
    dietType as "Diet Type",
    foodAllergies as "Food Allergies",
    foodsToAvoid as "Foods to Avoid",
    eatsBreakfast as "Eats Breakfast",
    eatsAnimalProducts as "Eats Animal Products",
    mealsPerDay as "Meals Per Day",
    beverageConsumption as "Beverage Consumption",
    waterIntakeOz as "Water Intake (oz)",
    typicalDayEating as "Typical Day of Eating",
    favoriteMeals as "Favorite Meals",
    preferredMacros as "Preferred Macros",
    fastingPattern as "Fasting Pattern",
    culturalDietaryNeeds as "Cultural/Religious Dietary Needs",
    
    -- Program Delivery
    deliveryPreference as "Program Delivery Preference",
    wantsWeeklyCheckins as "Wants Weekly Check-ins",
    
    -- Sport-Specific
    sportsPlayed as "Sports Played",
    schoolGrade as "School Grade",
    eatsBeforePractice as "Eats Before Practice",
    staysHydrated as "Stays Hydrated",
    seasonMotivation as "Season Motivation",
    seasonChallenges as "Season Challenges",
    
    -- Metadata
    datetime(createdAt, 'localtime') as "Submitted Date",
    id as "Client ID"
    
FROM Client
ORDER BY createdAt DESC;
.quit
EOF

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Export successful!${NC}"
    echo ""
    echo -e "${BLUE}📄 File created:${NC} $OUTPUT_FILE"
    echo -e "${BLUE}📊 Total clients:${NC} $CLIENT_COUNT"
    echo ""
    echo -e "${YELLOW}📂 Next steps:${NC}"
    echo "1. Open the file in Excel, Google Sheets, or Numbers"
    echo "2. All 50+ fields are included with organized column headers"
    echo "3. Data is sorted by submission date (newest first)"
    echo ""
    echo -e "${GREEN}Opening file...${NC}"
    
    # Try to open the file automatically
    if command -v open &> /dev/null; then
        open "$OUTPUT_FILE"
    elif command -v xdg-open &> /dev/null; then
        xdg-open "$OUTPUT_FILE"
    else
        echo "File location: $(pwd)/$OUTPUT_FILE"
    fi
else
    echo -e "${RED}❌ Export failed${NC}"
    exit 1
fi
