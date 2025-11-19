# Template Management System - Quick Start Guide

## Overview
The Template Management System allows administrators to create, edit, and manage packet templates used for generating personalized client packets.

## Accessing the System
Navigate to: `/admin/templates`

**Required Role:** Admin or Coach (viewing), Admin only (editing)

## Key Features

### 1. Template List View
- View all existing templates
- Filter by packet type (Nutrition, Workout, Performance, etc.)
- Filter by client type (Nutrition Only, Full Program, etc.)
- See template metadata (creation date, last updated)
- Identify default templates with badges

### 2. Creating Templates

#### Step 1: Basic Settings
1. Click "Create New Template"
2. Enter template name (e.g., "Default Nutrition Template")
3. Select packet type (NUTRITION, WORKOUT, PERFORMANCE, YOUTH, RECOVERY, WELLNESS)
4. Optionally select client type for specialized templates
5. Check "Set as default" if this should be the default template for this type

#### Step 2: Add Sections
1. Click "Add Section"
2. Enter section title (e.g., "Your Nutrition Overview")
3. Add optional description
4. Sections organize content into logical groups

#### Step 3: Create Content Blocks
1. Click "Add Content Block"
2. Select block type:
   - **Text** - Paragraphs and formatted text
   - **Table** - Structured data in rows/columns
   - **List** - Bullet or numbered lists
   - **Chart** - Data visualizations
   - **Image** - Pictures or diagrams
   - **Heading** - Section headers
   - **Divider** - Visual separators

3. Enter content using placeholders for dynamic data
4. Optionally set data source for dynamic content
5. Assign block to one or more sections

#### Step 4: Use Placeholders
Templates support dynamic placeholders that get replaced with actual client data:

**Client Data:**
- `{{client.fullName}}` - Client's full name
- `{{client.email}}` - Client's email
- `{{client.goal}}` - Client's primary goal
- `{{client.activityLevel}}` - Activity level
- `{{client.dietType}}` - Dietary preferences
- `{{client.trainingExperience}}` - Training experience level
- `{{client.daysPerWeek}}` - Training frequency
- Any field from the Client model

**Calculated Values:**
- `{{calculated.dailyCalories}}` - Calculated calorie target
- `{{calculated.macros}}` - Macronutrient breakdown
- `{{calculated.mealTiming}}` - Meal timing recommendations
- `{{calculated.trainingSplit}}` - Training split recommendation
- Custom calculated values from packet generators

**Example Content Block:**
```
Welcome {{client.fullName}}! 

This nutrition plan is designed specifically for your goal of {{client.goal}}. 
Based on your activity level ({{client.activityLevel}}), your daily calorie 
target is {{calculated.dailyCalories}} calories.
```

#### Step 5: Preview and Save
1. Click "Show Preview" to see template structure
2. Review sections and content blocks
3. Make any necessary adjustments
4. Click "Save Template" to persist

### 3. Editing Templates
1. Find template in list view
2. Click "Edit" button
3. Modify settings, sections, or content blocks
4. Preview changes
5. Save updates

### 4. Deleting Templates
1. Click "Delete" button on template card
2. Click "Confirm" to proceed
3. Note: Cannot delete templates currently in use by packets

## Template Structure

### Sections
Sections organize content into logical groups:
- Have a title and optional description
- Contain one or more content blocks
- Display in order (1, 2, 3, etc.)
- Can be conditionally displayed based on client data

### Content Blocks
Content blocks are reusable pieces of content:
- Have a unique ID for reference
- Have a type (text, table, list, etc.)
- Contain the actual content with placeholders
- Can be assigned to multiple sections
- Can pull data from specified sources

## Best Practices

### Template Organization
1. **Use descriptive names** - "Default Nutrition Template" not "Template 1"
2. **Set appropriate defaults** - Mark commonly used templates as default
3. **Organize by client type** - Create specialized templates for different client types
4. **Keep sections focused** - Each section should cover one topic

### Content Writing
1. **Use clear language** - Write for your target audience
2. **Include placeholders** - Make templates dynamic and personalized
3. **Provide context** - Explain why recommendations are made
4. **Be actionable** - Give specific, implementable guidance

### Placeholder Usage
1. **Test placeholders** - Ensure they reference valid client fields
2. **Provide fallbacks** - Consider what happens if data is missing
3. **Format appropriately** - Use proper grammar around placeholders
4. **Don't overuse** - Balance personalization with readability

### Maintenance
1. **Review regularly** - Update templates based on feedback
2. **Version control** - Keep notes on major changes
3. **Test with real data** - Generate packets to verify templates work
4. **Archive unused** - Delete or deactivate outdated templates

## Common Use Cases

### Creating a Nutrition Template
1. Create sections: Overview, Macros, Meal Timing, Sample Meals, Shopping List, Tips
2. Add welcome block with client name and goal
3. Add macro breakdown table with calculated values
4. Add meal timing recommendations
5. Add sample meal plans incorporating preferences
6. Add shopping list with common foods
7. Add adherence tips and troubleshooting

### Creating a Workout Template
1. Create sections: Overview, Schedule, Exercises, Progression, Safety
2. Add welcome block with training goals
3. Add weekly schedule with training split
4. Add exercise library with instructions
5. Add progression strategy
6. Add safety guidelines and recovery tips

### Creating a Performance Template
1. Create sections: Overview, Periodization, Power, Strength, Conditioning, Recovery
2. Add athlete profile with sport and position
3. Add periodization plan based on season
4. Add power development protocols
5. Add strength training program
6. Add sport-specific conditioning
7. Add recovery and monitoring strategies

## Troubleshooting

### Template Not Saving
- Check that template name is filled in
- Verify packet type is selected
- Ensure at least one section exists
- Check browser console for errors

### Placeholders Not Working
- Verify placeholder syntax: `{{field.name}}`
- Check that field exists in client data
- Ensure no typos in field names
- Test with actual packet generation

### Cannot Delete Template
- Template may be in use by existing packets
- Check packet list for references
- Edit packets to use different template first
- Then delete the template

### Preview Not Showing Content
- Preview shows structure, not populated data
- Use actual packet generation to see final result
- Preview is for layout verification only

## API Reference

### List Templates
```
GET /api/admin/templates
Query params: packetType, clientType, isDefault
```

### Get Template
```
GET /api/admin/templates/[id]
```

### Create Template
```
POST /api/admin/templates
Body: { name, packetType, clientType, sections, contentBlocks, isDefault }
```

### Update Template
```
PUT /api/admin/templates/[id]
Body: { name, packetType, clientType, sections, contentBlocks, isDefault }
```

### Delete Template
```
DELETE /api/admin/templates/[id]
```

## Support

For issues or questions:
1. Check this guide first
2. Review the implementation summary in `.kiro/specs/dynamic-intake-and-packet-system/TASK_14_IMPLEMENTATION_SUMMARY.md`
3. Check the design document for technical details
4. Contact system administrator

## Next Steps

After creating templates:
1. Test templates by generating packets for test clients
2. Review generated packets for quality
3. Refine templates based on feedback
4. Create specialized templates for different client types
5. Document any custom placeholders or calculated values
6. Train coaches on template usage

---

**Last Updated:** November 18, 2025
**Version:** 1.0
