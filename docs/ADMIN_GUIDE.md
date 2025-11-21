# Admin Guide: Dynamic Intake and Packet System

This guide provides comprehensive instructions for coaches and administrators managing clients, packets, templates, and analytics.

## Table of Contents

1. [Admin Dashboard Overview](#admin-dashboard-overview)
2. [Managing Clients](#managing-clients)
3. [Managing Packets](#managing-packets)
4. [Managing Templates](#managing-templates)
5. [Managing Products and Shop](#managing-products-and-shop)
6. [Managing Orders](#managing-orders)
7. [Managing Gear Drive Submissions](#managing-gear-drive-submissions)
8. [Interpreting Analytics](#interpreting-analytics)
9. [Best Practices](#best-practices)

---

## Admin Dashboard Overview

### Accessing the Admin Panel

1. Log in with your admin or coach account
2. Navigate to `/admin` or click "Admin Panel" in the navigation
3. You'll see the main admin dashboard with key metrics and client lists

### Dashboard Sections

**Client Management**
- View all clients
- Filter by client type, status, or intake completion
- Access individual client profiles

**Packet Management**
- Monitor packet generation status
- View failed packets requiring attention
- Regenerate or edit packets

**Template Management**
- Create and edit packet templates
- Preview templates with sample data
- Manage template library

**Analytics**
- View intake completion rates
- Monitor system performance
- Export data for reporting

---

## Managing Clients

### Viewing Client List

The client table displays:
- **Name**: Client's full name
- **Email**: Contact email
- **Client Type**: Selected intake path
- **Intake Status**: Completed, In Progress, or Not Started
- **Packets**: Number of packets (Ready/Total)
- **Created**: Account creation date
- **Actions**: Quick action buttons

### Filtering and Searching

**Filter by Client Type:**
```
- All Types
- Nutrition Only
- Workout Only
- Full Program
- Athlete Performance
- Youth
- General Wellness
- Movement Needs
```

**Filter by Status:**
```
- All Statuses
- Intake Complete
- Intake In Progress
- Intake Not Started
- Packets Pending
- Packets Ready
- Packets Failed
```

**Search:**
- Use the search bar to find clients by name or email
- Search is case-insensitive and matches partial strings

### Viewing Client Details

Click on a client name to view their full profile:

**Profile Information:**
- Basic demographics (name, email, age, gender)
- Contact preferences
- Account status and creation date

**Intake Responses:**
- Complete intake questionnaire responses
- Organized by section
- Timestamps for start and completion

**Packets:**
- All packets associated with the client
- Status of each packet
- Quick actions (view, edit, regenerate, download)

**Activity Log:**
- Intake submission date
- Packet generation history
- Admin modifications
- Communication history

### Client Actions

**View Full Profile**
- Click the client name or "View" button
- Access complete intake responses and packet history

**View Packets**
- Click "Packets" to see all client packets
- Manage individual packets from this view

**Send Message**
- Use the messaging feature to communicate with clients
- Messages appear in the client's dashboard

**Export Client Data**
- Click "Export" to download client data as JSON or CSV
- Includes intake responses and packet metadata

---

## Managing Packets

### Packet Overview

Each client may have one or more packets depending on their client type:

| Client Type | Packets Generated |
|-------------|-------------------|
| Nutrition Only | Nutrition Packet |
| Workout Only | Workout Packet |
| Full Program | Nutrition + Workout Packets |
| Athlete Performance | Performance Packet + Optional Nutrition |
| Youth | Youth Packet |
| General Wellness | Wellness Packet |
| Movement Needs | Recovery Packet |

### Packet Status Indicators

**Pending** (⏳)
- Packet is queued for generation
- Typically resolves within 1-2 minutes
- No action needed

**Generating** (🔄)
- Packet is actively being created
- Template is being populated with client data
- PDF is being generated

**Ready** (✓)
- Packet is complete and available to client
- Can be viewed, edited, or downloaded
- Client has been notified

**Failed** (✗)
- Generation encountered an error
- Requires admin attention
- View error details and retry

### Viewing Packets

**From Client Profile:**
1. Navigate to client profile
2. Scroll to "Packets" section
3. Click "View" on any packet

**From Packet Management:**
1. Go to Admin Panel > Packets
2. Filter by status or client type
3. Click on packet to view

**Packet Content Sections:**

Packets are organized into sections. Common sections include:

*Nutrition Packets:*
- Overview and Goals
- Daily Calorie Targets
- Macronutrient Breakdown
- Meal Timing Recommendations
- Sample Meal Plans
- Shopping Lists
- Tips and Resources

*Workout Packets:*
- Overview and Goals
- Training Schedule
- Exercise Selection
- Sets, Reps, and Progression
- Exercise Instructions
- Safety Notes

*Performance Packets:*
- Periodization Overview
- Phase-Specific Training Blocks
- Power Development
- Speed and Agility Work
- Strength Programming
- Conditioning Protocols
- Recovery Strategies

### Editing Packets

**When to Edit:**
- Client requests specific modifications
- Need to adjust recommendations based on feedback
- Correct errors or add clarifications
- Personalize content further

**How to Edit:**

1. **Navigate to Packet**
   - Open the client profile
   - Click "Edit" on the packet you want to modify

2. **Edit Content**
   - Modify text in any section
   - Add or remove content blocks
   - Adjust recommendations
   - Update calculations or targets

3. **Preview Changes**
   - Use the preview pane to see how changes will appear
   - Ensure formatting is correct

4. **Save Changes**
   - Click "Save" to update the packet
   - Version number automatically increments
   - Previous version is archived

5. **Notify Client**
   - Option to send notification about updates
   - Client will see "Updated" badge on packet

**Editing Best Practices:**
- Make clear, specific changes
- Add notes explaining modifications
- Maintain consistent formatting
- Test any calculations or formulas
- Review before saving

### Regenerating Packets

**When to Regenerate:**
- Client retook intake with updated information
- Template was updated and you want to apply changes
- Original generation had errors
- Client's goals or circumstances changed significantly

**How to Regenerate:**

1. **Access Packet Actions**
   - Navigate to the packet
   - Click "Regenerate" button

2. **Confirm Regeneration**
   - Review warning that current content will be replaced
   - Confirm you want to proceed

3. **Monitor Progress**
   - Packet status changes to "Generating"
   - Refresh to check completion
   - Usually completes within 1-2 minutes

4. **Review New Packet**
   - Check that new content is appropriate
   - Make any necessary manual edits
   - Notify client if needed

**Note:** Regeneration creates a new version. The previous version is archived and can be restored if needed.

### Handling Failed Packets

**Identifying Failed Packets:**
- Dashboard shows count of failed packets
- Red "Failed" badge on packet status
- Email notification sent to admins

**Viewing Error Details:**

1. Navigate to Admin Panel > Packets > Failed
2. Click on the failed packet
3. View error message and details:
   - Error type (Template Error, Data Error, AI Error, Export Error)
   - Error message
   - Timestamp
   - Retry count

**Common Errors and Solutions:**

**Template Error**
- *Cause:* Missing or invalid template
- *Solution:* Check template exists and is properly formatted
- *Action:* Fix template, then regenerate

**Data Error**
- *Cause:* Missing required client data
- *Solution:* Review client intake responses
- *Action:* Have client complete missing fields, then regenerate

**AI Error**
- *Cause:* AI service timeout or error
- *Solution:* Usually temporary
- *Action:* Retry generation (automatic up to 3 times)

**Export Error**
- *Cause:* PDF generation failed
- *Solution:* Check PDF service status
- *Action:* Retry or contact technical support

**Manual Retry:**
1. Click "Retry" button on failed packet
2. System queues packet for regeneration
3. Monitor status for completion

**If Retries Fail:**
1. Review error logs for technical details
2. Contact technical support with packet ID
3. Consider manual packet creation as temporary solution

### Downloading Packets

**Download as PDF:**
- Click "Download PDF" button
- PDF includes all sections with proper formatting
- Suitable for printing or offline sharing

**Download as JSON:**
- For technical purposes or data export
- Contains structured packet data
- Useful for integrations or backups

---

## Managing Templates

### Template Overview

Templates are reusable structures that define how packets are generated. Each template includes:

- **Sections**: Major divisions of content (e.g., "Overview", "Meal Plan")
- **Content Blocks**: Individual pieces of content within sections
- **Placeholders**: Dynamic fields populated with client data (e.g., `{{client.fullName}}`)
- **Conditional Logic**: Rules for showing/hiding content based on client data

### Viewing Templates

**Access Template Manager:**
1. Navigate to Admin Panel > Templates
2. View list of all templates

**Template List Shows:**
- Template name
- Packet type (Nutrition, Workout, Performance, etc.)
- Client type (if specific)
- Status (Active/Inactive)
- Last modified date
- Actions (Edit, Preview, Duplicate, Delete)

### Creating a New Template

**Step 1: Basic Information**
1. Click "Create New Template"
2. Enter template name (e.g., "Nutrition - Vegan Focus")
3. Select packet type
4. Optionally select specific client type
5. Set as default (optional)

**Step 2: Add Sections**
1. Click "Add Section"
2. Enter section title (e.g., "Daily Calorie Targets")
3. Set section order
4. Add conditional display rules (optional)

**Step 3: Add Content Blocks**
1. Within each section, click "Add Content Block"
2. Select content type:
   - **Text**: Paragraphs, headings, instructions
   - **Table**: Structured data (macros, schedule, etc.)
   - **List**: Bullet or numbered lists
   - **Chart**: Visual data representation
   - **Image**: Graphics or diagrams

3. Enter content with placeholders
4. Configure formatting options

**Step 4: Use Placeholders**

Placeholders are replaced with actual client data during generation.

**Common Placeholders:**

```
Client Information:
{{client.fullName}}
{{client.email}}
{{client.age}}
{{client.gender}}
{{client.goal}}

Intake Responses:
{{client.activityLevel}}
{{client.trainingExperience}}
{{client.dietType}}
{{client.foodAllergies}}
{{client.availableEquipment}}

Calculated Values:
{{calculated.dailyCalories}}
{{calculated.proteinGrams}}
{{calculated.carbGrams}}
{{calculated.fatGrams}}
{{calculated.trainingDays}}

Dates:
{{date.today}}
{{date.startDate}}
{{date.weekNumber}}
```

**Example Text Block:**
```
Welcome {{client.fullName}}!

This nutrition plan is designed specifically for your goal of {{client.goal}}. 
Based on your activity level ({{client.activityLevel}}) and current stats, 
your daily calorie target is {{calculated.dailyCalories}} calories.
```

**Step 5: Add Conditional Logic**

Show or hide content based on client data:

```json
{
  "condition": {
    "type": "equals",
    "field": "client.dietType",
    "value": "vegan"
  },
  "action": "show"
}
```

**Common Conditions:**
- `equals`: Field equals specific value
- `contains`: Field contains value (for arrays)
- `greaterThan`: Numeric comparison
- `lessThan`: Numeric comparison
- `exists`: Field has any value

**Step 6: Preview and Test**
1. Click "Preview" to see template with sample data
2. Test with different client profiles
3. Verify placeholders are replaced correctly
4. Check conditional logic works as expected

**Step 7: Save Template**
1. Review all sections and content
2. Click "Save Template"
3. Set as active to make available for generation

### Editing Existing Templates

**To Edit:**
1. Find template in Template Manager
2. Click "Edit"
3. Modify sections, content blocks, or settings
4. Preview changes
5. Save

**Version Control:**
- Each save creates a new version
- Previous versions are archived
- Can revert to previous version if needed

**Impact of Changes:**
- Changes only affect newly generated packets
- Existing packets are not automatically updated
- Consider regenerating packets for active clients if changes are significant

### Template Best Practices

**Content Writing:**
- Use clear, concise language
- Write in second person ("you" and "your")
- Provide actionable guidance
- Include examples where helpful
- Maintain consistent tone

**Placeholder Usage:**
- Always provide fallback values for optional fields
- Test with clients who have minimal data
- Use conditional blocks for optional content
- Format numbers appropriately (e.g., round calories)

**Organization:**
- Group related content in sections
- Use logical ordering (overview → details → action steps)
- Keep sections focused and digestible
- Use headings and subheadings for clarity

**Conditional Logic:**
- Keep conditions simple and clear
- Test all branches thoroughly
- Provide default content when conditions aren't met
- Document complex logic in template notes

**Maintenance:**
- Review templates quarterly
- Update based on client feedback
- Keep content current with best practices
- Archive outdated templates rather than deleting

### Duplicating Templates

**When to Duplicate:**
- Creating a variation of existing template
- Testing changes without affecting original
- Creating client-type-specific versions

**How to Duplicate:**
1. Find template to duplicate
2. Click "Duplicate"
3. Enter new name
4. Modify as needed
5. Save as new template

### Deleting Templates

**Before Deleting:**
- Ensure no packets are actively using the template
- Consider archiving instead of deleting
- Export template data for backup

**To Delete:**
1. Click "Delete" on template
2. Confirm deletion
3. Template is permanently removed

**Note:** Cannot delete templates that are set as default or currently in use.

---

## Managing Products and Shop

### Product Management Overview

The AFYA shop allows you to sell merchandise to support the organization. As an admin, you can create, edit, and manage products, inventory, and pricing.

### Accessing Product Management

1. Log in with your admin account
2. Navigate to `/admin/products` or click "Products" in the admin panel
3. You'll see the product management dashboard

### Product List View

The product table displays:
- **Image**: Product thumbnail
- **Name**: Product name
- **Category**: Apparel, Accessories, Drops, or Collections
- **Price**: Current price
- **Inventory**: Current stock level
- **Status**: Active or Inactive
- **Actions**: Edit, Duplicate, Delete

### Creating a New Product

**Step 1: Basic Information**

1. Click "Add Product" button
2. Enter product details:
   - **Name**: Clear, descriptive product name (e.g., "AFYA Performance T-Shirt")
   - **Description**: Detailed product description (2-4 paragraphs)
     - Material and quality
     - Fit and sizing information
     - Care instructions
     - Why customers will love it
   - **Price**: Product price in dollars (e.g., 29.99)
   - **Category**: Select from:
     - **Apparel**: Clothing items (shirts, hoodies, shorts, etc.)
     - **Accessories**: Non-clothing items (water bottles, bags, bands, etc.)
     - **Drops**: Limited-time exclusive items
     - **Collections**: Curated product bundles

**Step 2: Product Images**

1. Click "Upload Images"
2. Select one or more product images:
   - **Primary image**: Main product photo (required)
   - **Additional images**: Different angles, colors, lifestyle shots (optional)
3. Image requirements:
   - Format: JPG, PNG, or WebP
   - Recommended size: 1200x1200px minimum
   - Maximum file size: 5MB per image
4. Drag to reorder images (first image is primary)

**Step 3: Variants (Optional)**

If your product comes in different sizes or colors:

**Sizes:**
1. Click "Add Sizes"
2. Select available sizes:
   - Apparel: XS, S, M, L, XL, XXL, XXXL
   - Accessories: One Size, Small, Medium, Large
3. Sizes appear as dropdown in product page

**Colors:**
1. Click "Add Colors"
2. Enter color names (e.g., "Black", "Turquoise", "Lavender")
3. Colors appear as selection options

**Step 4: Inventory**

1. Enter initial inventory count
2. Set low stock threshold (optional):
   - Alerts you when inventory is low
   - Displays "Low Stock" badge to customers
3. Enable "Track Inventory" to automatically decrement on purchases

**Step 5: Drop Configuration (Optional)**

For limited-time exclusive items:

1. Check "This is a Drop"
2. Set drop start date and time
3. Set drop end date and time
4. Product will:
   - Show "Coming Soon" before start date
   - Display countdown timer during drop
   - Show "Sold Out" after end date or when inventory depletes

**Step 6: SEO and URL**

1. **Slug**: URL-friendly product identifier
   - Auto-generated from product name
   - Can be customized (e.g., "afya-performance-tshirt")
   - Must be unique
2. **Meta Description** (optional): For search engines

**Step 7: Review and Publish**

1. Preview product page
2. Check all details are correct
3. Set status:
   - **Active**: Product is visible and purchasable
   - **Inactive**: Product is hidden from shop
4. Click "Save Product"

### Editing Products

**To Edit:**
1. Find product in product list
2. Click "Edit" button
3. Modify any fields
4. Click "Save Changes"

**Common Edits:**
- Update price
- Adjust inventory
- Change description
- Add/remove images
- Update sizes or colors
- Activate/deactivate product

**Bulk Actions:**
- Select multiple products using checkboxes
- Choose action: Activate, Deactivate, Delete
- Confirm action

### Managing Inventory

**Viewing Inventory:**
- Product list shows current inventory count
- Low stock items highlighted in yellow
- Out of stock items highlighted in red

**Updating Inventory:**

**Manual Update:**
1. Edit product
2. Update inventory count
3. Save changes

**Automatic Updates:**
- Inventory decrements automatically on purchase
- Increments on refund
- Tracks inventory history

**Inventory Alerts:**
- Email notification when inventory falls below threshold
- Dashboard alert for low stock items
- Weekly inventory report

**Restocking:**
1. Receive new inventory
2. Edit product
3. Add quantity to current inventory
4. Add note about restock date
5. Save changes

### Product Categories

**Apparel**
- T-shirts, tank tops
- Hoodies, sweatshirts
- Shorts, leggings
- Hats, beanies
- Socks

**Accessories**
- Water bottles
- Gym bags, backpacks
- Resistance bands
- Yoga mats
- Towels
- Stickers, patches

**Drops**
- Limited edition items
- Seasonal releases
- Collaboration products
- Special event merchandise

**Collections**
- Starter packs
- Seasonal bundles
- Gift sets
- Program-specific kits

### Product Best Practices

**Photography:**
- Use high-quality, well-lit photos
- Show product from multiple angles
- Include lifestyle shots (product in use)
- Maintain consistent background and style
- Show size/scale reference

**Descriptions:**
- Be specific about materials and quality
- Include sizing information
- Mention care instructions
- Highlight unique features
- Use bullet points for key details
- Write in friendly, enthusiastic tone

**Pricing:**
- Research competitor pricing
- Consider production costs and margins
- Remember 25% goes to donation allocation
- Price in whole dollars or .99 endings
- Offer bundles for better value

**Inventory Management:**
- Start with conservative inventory
- Monitor sales velocity
- Restock popular items promptly
- Discontinue slow-moving items
- Plan for seasonal demand

**SEO:**
- Use descriptive product names
- Include relevant keywords in description
- Create unique slugs
- Add alt text to images

### Duplicating Products

**When to Duplicate:**
- Creating similar products (e.g., same shirt in different color)
- Creating seasonal variations
- Testing price points

**How to Duplicate:**
1. Click "Duplicate" on product
2. Product copy is created with "(Copy)" suffix
3. Edit name, images, and details as needed
4. Save as new product

### Archiving vs. Deleting Products

**Archive (Deactivate):**
- Product remains in database
- Not visible in shop
- Order history preserved
- Can be reactivated later
- **Recommended** for seasonal or temporarily unavailable items

**Delete:**
- Product permanently removed
- Cannot be recovered
- Order history remains but product details may be limited
- **Use only** for mistakes or test products

---

## Managing Orders

### Order Management Overview

Track and fulfill customer orders, manage payments, and handle customer service issues.

### Accessing Order Management

1. Navigate to `/admin/orders` (coming soon)
2. Or view orders from Analytics dashboard

### Order List View

Orders display:
- **Order Number**: Unique identifier (e.g., ORD-2024-001234)
- **Customer**: Name and email
- **Date**: Order date and time
- **Items**: Number of items
- **Total**: Order total amount
- **Donation Allocation**: Foundations or Sponsor-A-Client
- **Payment Status**: Pending, Completed, Failed, Refunded
- **Fulfillment Status**: Pending, Processing, Shipped, Delivered, Cancelled
- **Actions**: View, Process, Ship, Refund

### Viewing Order Details

Click on an order to view full details:

**Customer Information:**
- Name
- Email
- Phone (if provided)
- Shipping address
- Billing address (if different)

**Order Items:**
- Product name and image
- Quantity
- Size/color (if applicable)
- Price at time of purchase
- Subtotal

**Order Summary:**
- Subtotal
- Tax
- Shipping
- **Total**
- **Donation Amount** (25% of subtotal)
- **Donation Allocation** (Foundations or Sponsor-A-Client)

**Payment Information:**
- Payment method (Card, Apple Pay, Google Pay)
- Last 4 digits of card
- Payment status
- Stripe Payment Intent ID
- Transaction date

**Fulfillment Information:**
- Fulfillment status
- Tracking number (if shipped)
- Carrier
- Estimated delivery date
- Actual delivery date

**Order Timeline:**
- Order placed
- Payment confirmed
- Order processed
- Shipped
- Delivered

### Processing Orders

**Order Workflow:**

1. **Order Placed** → Payment Status: Pending
2. **Payment Confirmed** → Payment Status: Completed
3. **Order Processed** → Fulfillment Status: Processing
4. **Order Shipped** → Fulfillment Status: Shipped
5. **Order Delivered** → Fulfillment Status: Delivered

**Step 1: Confirm Payment**

- Stripe automatically processes payment
- Payment status updates to "Completed" on success
- If payment fails, customer is notified to update payment method

**Step 2: Process Order**

1. Click "Process Order" button
2. Verify items are in stock
3. Pick and pack items
4. Update fulfillment status to "Processing"

**Step 3: Ship Order**

1. Click "Mark as Shipped"
2. Enter shipping information:
   - Carrier (USPS, UPS, FedEx, etc.)
   - Tracking number
   - Estimated delivery date
3. System automatically:
   - Updates fulfillment status to "Shipped"
   - Sends tracking email to customer
   - Updates inventory

**Step 4: Confirm Delivery**

- Tracking updates automatically mark as delivered
- Or manually mark as delivered when confirmed

### Handling Order Issues

**Payment Failed:**
1. Customer receives email notification
2. Customer can retry payment from order page
3. If not resolved in 24 hours, order is cancelled
4. Inventory is released

**Item Out of Stock:**
1. Check if item can be restocked quickly
2. If yes: Contact customer with expected ship date
3. If no: Offer alternatives or refund

**Shipping Address Error:**
1. Contact customer immediately
2. Update address if order hasn't shipped
3. If already shipped, work with carrier to redirect

**Damaged or Lost Package:**
1. Customer contacts support
2. Verify with tracking information
3. File claim with carrier if insured
4. Offer replacement or refund

### Refunds and Cancellations

**Cancelling an Order:**

**Before Shipping:**
1. Click "Cancel Order"
2. Select reason
3. Confirm cancellation
4. System automatically:
   - Refunds payment via Stripe
   - Restores inventory
   - Sends cancellation email

**After Shipping:**
- Cannot cancel
- Customer must return item for refund

**Processing a Refund:**

1. Click "Issue Refund"
2. Select refund type:
   - **Full Refund**: Entire order amount
   - **Partial Refund**: Specific items or amount
3. Enter reason
4. Confirm refund
5. System automatically:
   - Processes refund via Stripe (2-10 business days)
   - Updates order status
   - Sends refund confirmation email
   - Restores inventory (if applicable)

**Refund Policy:**
- 30-day return window
- Items must be unworn and in original condition
- Customer pays return shipping (unless defective)
- Refund issued after item received and inspected

### Donation Allocation Tracking

Every order includes a 25% donation allocation selected by the customer.

**Viewing Allocations:**
- Individual order shows allocation choice
- Analytics dashboard shows aggregate breakdown
- Export reports for accounting

**Allocation Options:**

**Foundations:**
- Supports AFYA's general operations
- Funds community programs
- Covers operational costs
- Enables program expansion

**Sponsor-A-Client:**
- Directly funds wellness packets for clients in need
- Tracked separately for transparency
- Can match sponsors with sponsored clients (anonymized)

**Reporting:**
- Monthly allocation summary
- Year-to-date totals
- Export for tax documentation
- Share impact with donors

### Order Best Practices

**Timely Processing:**
- Process orders within 24 hours
- Ship within 2-3 business days
- Communicate delays proactively

**Communication:**
- Send order confirmation immediately
- Provide tracking information
- Follow up on delivery
- Respond to inquiries within 24 hours

**Quality Control:**
- Inspect items before packing
- Use quality packaging materials
- Include thank you note or sticker
- Double-check shipping address

**Customer Service:**
- Be friendly and helpful
- Resolve issues quickly
- Offer solutions, not excuses
- Turn problems into positive experiences

---

## Managing Gear Drive Submissions

### Gear Drive Overview

The Gear Drive program accepts donations of used workout clothing for recycling, upcycling, redistribution, and community events.

### Accessing Gear Drive Management

1. Navigate to `/admin/gear-drive` (coming soon)
2. Or view submissions from Analytics dashboard

### Submission List View

Submissions display:
- **Submission ID**: Unique identifier
- **Donor Name**: Name and email
- **Date**: Submission date
- **Items**: Types of items donated
- **Quantity**: Estimated quantity
- **Condition**: Excellent, Good, Fair, Worn
- **Method**: Dropoff, Pickup, or Shipping
- **Status**: Pending, Confirmed, Scheduled, Completed, Cancelled
- **Actions**: View, Confirm, Schedule, Complete

### Viewing Submission Details

Click on a submission to view full details:

**Donor Information:**
- Name
- Email
- Phone number
- Preferred contact method

**Donation Details:**
- Item types (shirts, shorts, shoes, etc.)
- Estimated quantity
- Condition assessment
- Photos (if provided)
- Notes from donor

**Logistics:**
- Dropoff method: Dropoff, Pickup, or Shipping
- Preferred date/time
- Address (for pickup)
- Special instructions

**Status and Timeline:**
- Submission received
- Confirmation sent
- Pickup/dropoff scheduled
- Items received
- Items processed

### Processing Submissions

**Submission Workflow:**

1. **Submitted** → Status: Pending
2. **Reviewed** → Status: Confirmed
3. **Logistics Arranged** → Status: Scheduled
4. **Items Received** → Status: Completed

**Step 1: Review Submission**

1. Review submission details
2. Verify contact information
3. Assess feasibility based on:
   - Item types and condition
   - Quantity
   - Location (for pickup)
4. Click "Confirm Submission"

**Step 2: Contact Donor**

System automatically sends confirmation email with:
- Confirmation number
- Next steps
- Contact information
- What to expect

**For Dropoff:**
- Provide dropoff location and hours
- Include parking and entrance instructions
- Mention what to bring (bags, boxes)

**For Pickup:**
- Confirm address
- Provide pickup window
- Mention preparation instructions

**For Shipping:**
- Provide shipping address
- Include packing instructions
- Mention any shipping label arrangements

**Step 3: Schedule Logistics**

1. Click "Schedule"
2. Enter scheduled date and time
3. Assign team member (if applicable)
4. Add any special notes
5. System sends reminder email to donor

**Step 4: Receive Items**

1. Receive items at dropoff or pickup
2. Verify quantity and condition
3. Thank donor
4. Click "Mark as Completed"
5. Update actual quantity received

**Step 5: Process Items**

Sort items by use case:

**Recycling:**
- Items too worn for reuse
- Sent to textile recycling facility
- Prevents landfill waste

**Upcycling:**
- Items that can be repaired or repurposed
- Used for craft projects or modifications
- Creative reuse

**Redistribution:**
- Good condition items
- Donated to clients in need
- Distributed through community partners

**Community Events:**
- Items for youth sports programs
- Equipment for community fitness events
- Supplies for workshops

### Managing Submission Status

**Pending:**
- New submission awaiting review
- Action: Review and confirm or decline

**Confirmed:**
- Submission accepted
- Action: Schedule logistics

**Scheduled:**
- Pickup/dropoff date set
- Action: Complete pickup/dropoff

**Completed:**
- Items received and processed
- Action: None (archived)

**Cancelled:**
- Submission declined or donor cancelled
- Action: None (archived)

### Gear Drive Best Practices

**Communication:**
- Respond to submissions within 24 hours
- Provide clear instructions
- Send reminders before scheduled date
- Thank donors for their contribution

**Logistics:**
- Be flexible with scheduling
- Provide multiple dropoff times
- Coordinate pickups efficiently
- Make process easy for donors

**Quality Control:**
- Inspect items upon receipt
- Sort by condition and use case
- Track quantities accurately
- Document impact

**Impact Tracking:**
- Record total items received
- Track pounds diverted from landfill
- Count items redistributed
- Share impact with donors and community

**Donor Recognition:**
- Send thank you email
- Share impact statistics
- Feature donors in newsletter (with permission)
- Provide tax receipt if applicable

### Declining Submissions

Sometimes you may need to decline a submission:

**Reasons to Decline:**
- Items not suitable (e.g., non-athletic clothing)
- Condition too poor (e.g., heavily damaged)
- Quantity too small to justify pickup
- Location too far for pickup
- Program at capacity

**How to Decline:**
1. Click "Decline Submission"
2. Select reason
3. Add personalized message
4. Suggest alternatives if possible
5. Send notification

**Be Respectful:**
- Thank donor for their interest
- Explain reason clearly
- Suggest other donation options
- Maintain positive relationship

---

## Interpreting Analytics

### Analytics Dashboard

Access: Admin Panel > Analytics

The analytics dashboard provides insights into intake completion, client demographics, and system performance.

### Key Metrics

**Intake Completion Rate**
- Percentage of started intakes that are completed
- Broken down by client type
- Trend over time

**Target:** >80% completion rate

**Low completion rates may indicate:**
- Intake is too long or complex
- Questions are confusing
- Technical issues
- Poor user experience

**Average Completion Time**
- Mean time from start to submission
- Broken down by client type
- Compared to estimated time

**Target:** Within 10% of estimated time

**Longer than expected may indicate:**
- Questions require research or thought
- Form is confusing
- Technical performance issues

**Abandonment Analysis**
- Where users drop off during intake
- Which questions have highest abandonment
- Patterns by client type

**High abandonment at specific questions suggests:**
- Question is too personal or invasive
- Question is confusing
- Question requires information user doesn't have
- Technical issue at that point

### Client Demographics

**Client Type Distribution**
- Pie chart showing breakdown of client types
- Helps understand your client base
- Informs marketing and resource allocation

**Goals Distribution**
- Most common client goals
- Trends over time
- Segmented by client type

**Experience Levels**
- Distribution of training experience
- Helps tailor content and templates

**Equipment Access**
- What equipment clients have available
- Informs exercise selection in templates

### Packet Generation Metrics

**Generation Success Rate**
- Percentage of packets generated successfully
- Broken down by packet type

**Target:** >95% success rate

**Average Generation Time**
- Time from queue to ready status
- Broken down by packet type

**Target:** <2 minutes for standard packets

**Failed Packet Analysis**
- Count of failed packets
- Error types and frequency
- Trends over time

**Retry Statistics**
- How many packets required retries
- Success rate after retry
- Patterns in retry needs

### Shop and E-Commerce Metrics

**Sales Performance**
- Total revenue
- Number of orders
- Average order value
- Revenue by category
- Top-selling products

**Conversion Metrics**
- Shop page views
- Product page views
- Add-to-cart rate
- Checkout completion rate
- Abandoned cart rate

**Target:** >60% checkout completion rate

**Inventory Metrics**
- Current inventory levels
- Low stock alerts
- Out of stock items
- Inventory turnover rate
- Restock frequency

**Donation Allocation**
- Total donation amount (25% of sales)
- Allocation breakdown:
  - Foundations percentage
  - Sponsor-A-Client percentage
- Trend over time
- Impact metrics

**Customer Behavior**
- New vs. returning customers
- Popular product categories
- Average items per order
- Peak shopping times
- Geographic distribution

### Gear Drive Metrics

**Submission Volume**
- Total submissions
- Submissions by month
- Submissions by dropoff method
- Completion rate

**Target:** >80% completion rate (confirmed to completed)

**Items Collected**
- Total items received
- Items by type (shirts, shorts, shoes, etc.)
- Items by condition
- Pounds diverted from landfill

**Processing Metrics**
- Items recycled
- Items upcycled
- Items redistributed
- Items for community events

**Response Time**
- Average time to confirm submission
- Average time to schedule
- Average time to complete

**Target:** <24 hours to confirm

**Geographic Distribution**
- Submissions by location
- Pickup vs. dropoff ratio
- Shipping submissions

### Community Impact Metrics

**Community Minutes Moved**
- Total minutes logged by all clients
- Average per client
- Trend over time
- Most active programs

**Client Engagement**
- Active clients
- Activity logging frequency
- Program participation rates
- Retention metrics

**Overall Impact**
- Total clients served
- Total donations raised (shop + direct)
- Total gear items collected
- Community reach

### Using Analytics for Improvement

**Optimize Intake Flow**

1. **Identify Drop-Off Points**
   - Review abandonment analysis
   - Find questions with >10% drop-off
   - Consider:
     - Making question optional
     - Simplifying question
     - Adding help text
     - Moving question later in flow

2. **Reduce Completion Time**
   - Identify sections taking longest
   - Remove unnecessary questions
   - Improve question clarity
   - Optimize branching logic to skip irrelevant sections

3. **Improve Completion Rate**
   - Add progress indicators
   - Break long sections into smaller parts
   - Provide time estimates
   - Enable save and resume

**Enhance Templates**

1. **Review Client Data**
   - See what information clients commonly provide
   - Identify gaps in data collection
   - Adjust templates to use available data

2. **Analyze Goals and Preferences**
   - Create templates for common goal combinations
   - Tailor content to popular preferences
   - Address common challenges

3. **Monitor Packet Success**
   - Track which packet types have issues
   - Review failed packet errors
   - Update templates to prevent errors

**Resource Allocation**

1. **Staff Planning**
   - Understand peak intake times
   - Plan support coverage accordingly
   - Allocate coaches based on client type distribution

2. **Content Development**
   - Focus on most common client types
   - Develop resources for popular goals
   - Create FAQs for common questions

### Exporting Analytics Data

**Export Options:**
- CSV: For spreadsheet analysis
- JSON: For technical analysis or integrations
- PDF: For reports and presentations

**To Export:**
1. Navigate to Analytics Dashboard
2. Select date range
3. Choose metrics to include
4. Click "Export"
5. Select format
6. Download file

**Common Export Uses:**
- Monthly performance reports
- Quarterly business reviews
- Marketing analysis
- System optimization planning
- Stakeholder presentations

### Setting Up Alerts

**Configure Alerts for:**
- Completion rate drops below threshold
- Failed packet count exceeds threshold
- Average generation time increases significantly
- Specific error types occur repeatedly

**Alert Delivery:**
- Email notifications
- Dashboard notifications
- Slack/Teams integration (if configured)

---

## Best Practices

### Client Management

**Regular Check-Ins**
- Review new clients weekly
- Monitor intake completion rates
- Follow up on incomplete intakes
- Respond to client messages promptly

**Data Quality**
- Encourage thorough intake completion
- Follow up on unclear or incomplete responses
- Keep client profiles updated
- Document any manual adjustments

**Communication**
- Set clear expectations about response times
- Provide guidance on using packets
- Be proactive about potential issues
- Celebrate client progress

### Packet Management

**Quality Control**
- Review generated packets before client access (if possible)
- Spot-check packets regularly for quality
- Address failed packets within 24 hours
- Keep templates updated and accurate

**Personalization**
- Add custom notes to packets when appropriate
- Adjust recommendations based on client feedback
- Use manual edits to enhance AI-generated content
- Consider client's unique circumstances

**Version Management**
- Document reasons for regeneration
- Keep notes on manual edits
- Archive significant versions
- Track client progress across versions

### Template Management

**Organization**
- Use clear, descriptive template names
- Maintain consistent formatting across templates
- Document template purpose and use cases
- Archive outdated templates

**Testing**
- Test new templates with sample data
- Verify all placeholders work correctly
- Check conditional logic thoroughly
- Get feedback from other coaches

**Maintenance**
- Review templates quarterly
- Update based on client feedback
- Incorporate new best practices
- Keep content evidence-based and current

### Shop Management

**Product Quality**
- Use high-quality product photos
- Write detailed, accurate descriptions
- Price competitively
- Maintain adequate inventory

**Customer Experience**
- Process orders promptly (within 24 hours)
- Ship quickly (2-3 business days)
- Communicate proactively
- Handle issues gracefully

**Inventory Management**
- Monitor stock levels daily
- Restock popular items proactively
- Set low stock alerts
- Plan for seasonal demand

**Marketing**
- Feature new products on social media
- Create product bundles
- Run seasonal promotions
- Highlight donation allocation impact

### Gear Drive Management

**Donor Experience**
- Respond quickly to submissions
- Make process easy and convenient
- Communicate clearly
- Show appreciation

**Logistics**
- Schedule efficiently
- Be flexible with timing
- Coordinate pickups to minimize travel
- Provide clear instructions

**Impact Tracking**
- Record all items received
- Track use cases accurately
- Calculate environmental impact
- Share results with donors and community

**Community Engagement**
- Share gear drive success stories
- Highlight impact metrics
- Feature donors (with permission)
- Promote program regularly

### Analytics Usage

**Regular Review**
- Check analytics weekly
- Look for trends and patterns
- Compare to previous periods
- Share insights with team

**Data-Driven Decisions**
- Use analytics to guide improvements
- Test changes and measure impact
- Document what works and what doesn't
- Iterate based on results

**Continuous Improvement**
- Set goals for key metrics
- Track progress toward goals
- Celebrate improvements
- Address declining metrics promptly

### Security and Privacy

**Data Protection**
- Only access client data when necessary
- Don't share client information externally
- Use secure connections always
- Log out when finished

**Compliance**
- Follow HIPAA guidelines (if applicable)
- Respect client privacy preferences
- Maintain confidentiality
- Document access for audit purposes

**Best Practices**
- Use strong passwords
- Enable two-factor authentication
- Don't share admin credentials
- Report security concerns immediately

---

## Troubleshooting

### Common Issues

**Client Can't Complete Intake**
- Check if intake is active
- Verify client account status
- Test intake flow yourself
- Check for technical errors in logs

**Packet Won't Generate**
- Review client intake data for completeness
- Check template is active and valid
- Verify packet generation service is running
- Review error logs for details

**Template Not Working**
- Verify placeholder syntax
- Check conditional logic
- Test with sample data
- Review for missing required fields

**Analytics Not Updating**
- Check data collection is enabled
- Verify analytics service is running
- Refresh dashboard
- Check date range selection

### Getting Help

**Technical Support**
- Email: tech-support@afyaperformance.com
- Include: Error messages, screenshots, packet/client IDs
- Response time: 24-48 hours

**Training Resources**
- Video tutorials: Available in Admin Panel > Help
- Documentation: This guide and developer docs
- Team meetings: Weekly admin sync calls

---

## Appendix

### Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Search clients | Ctrl/Cmd + K |
| New template | Ctrl/Cmd + N |
| Save changes | Ctrl/Cmd + S |
| Preview | Ctrl/Cmd + P |
| Export data | Ctrl/Cmd + E |

### Quick Reference: Client Types

| Type | Intake Time | Packets | Key Focus |
|------|-------------|---------|-----------|
| Nutrition Only | 10-15 min | Nutrition | Diet, meals, macros |
| Workout Only | 10-15 min | Workout | Training, exercises |
| Full Program | 20-25 min | Both | Comprehensive |
| Athlete Performance | 25-30 min | Performance + Nutrition | Sport-specific, NSCA |
| Youth | 15-20 min | Youth | Age-appropriate, safety |
| General Wellness | 10-15 min | Wellness | Simple, sustainable |
| Movement Needs | 15-20 min | Recovery | Injury, modifications |

### Quick Reference: Packet Status

| Status | Meaning | Action Needed |
|--------|---------|---------------|
| Pending | Queued | Wait (1-2 min) |
| Generating | In progress | Wait |
| Ready | Complete | None |
| Failed | Error occurred | Review and retry |

### Quick Reference: Order Status

| Payment Status | Meaning |
|----------------|---------|
| Pending | Payment processing |
| Completed | Payment successful |
| Failed | Payment declined |
| Refunded | Refund issued |

| Fulfillment Status | Meaning |
|-------------------|---------|
| Pending | Awaiting processing |
| Processing | Being prepared |
| Shipped | In transit |
| Delivered | Received by customer |
| Cancelled | Order cancelled |

### Quick Reference: Gear Drive Status

| Status | Meaning | Action Needed |
|--------|---------|---------------|
| Pending | New submission | Review and confirm |
| Confirmed | Accepted | Schedule logistics |
| Scheduled | Date set | Complete pickup/dropoff |
| Completed | Items received | None (archived) |
| Cancelled | Declined/cancelled | None (archived) |

### Quick Reference: Product Categories

| Category | Examples | Typical Price Range |
|----------|----------|-------------------|
| Apparel | T-shirts, hoodies, shorts | $20-$60 |
| Accessories | Water bottles, bags, bands | $10-$40 |
| Drops | Limited edition items | $25-$75 |
| Collections | Bundles, starter packs | $40-$100 |

---

*Last Updated: November 2025*
