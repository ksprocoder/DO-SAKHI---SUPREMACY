## **Do Sakhi — Final Master Blueprint** 

## **Custom Luxury Boutique E-commerce Platform** 

## **Quiet Luxury UI/UX + Full Custom Backend Architecture** 

## **Executive Build Decision** 

Do Sakhi will be built as a **fully custom, decoupled luxury e-commerce platform** . 

No Shopify. No prebuilt marketplace theme. No noisy discount-led design. No generic catalogue interface. 

The platform must combine: 

## 1. **Global quiet-luxury editorial language** 

Inspired by KHAITE, LEMAIRE, Net-a-Porter and high-end fashion editorial layouts. 

## 2. **Premium Indian boutique service depth** 

Inspired by Pernia’s Pop-Up Shop, Aza Fashions and luxury Indian couture platforms: custom sizing, stylist support, curated drops, WhatsApp-led clienteling. 

## 3. **Custom technical architecture** 

Built using a modern frontend, PostgreSQL, custom APIs, stock-locking checkout logic, Razorpay, Stripe, WhatsApp Business API, CDN media delivery and background jobs. 

## **CHAPTER 1: THE VISUAL & EMOTIONAL IDENTITY** 

## **1.1 Brand Positioning** 

Do Sakhi is not a mass-market fashion store. It is a **boutique fashion house** for women who prefer elegance, comfort, grace and personal attention. 

The brand must feel: 

```
Minimal but not empty
Lavish but not loud
Artistic but not confusing
Premium but not intimidating
```

1 

```
Indian but globally refined
Functional but emotionally warm
```

The website should feel like: 

```
A private boutique catalogue
A slow fashion editorial magazine
A custom styling desk
A curated wardrobe destination
```

The website must not feel like: 

```
Myntra clone
Discount marketplace
WhatsApp catalogue dumped onto a website
Template-based Shopify store
Overcrowded product grid
Pop-up heavy sales funnel
```

Strictly avoid: 

```
Countdown timers
Spin wheels
Loud sale badges
Aggressive pop-ups
Red discount labels
Flashing banners
Heavy coupon bars
Auto-popup newsletter blocks
Too many CTAs in one section
```

## **1.2 Typography Matrix** 

Use a strict two-font system. 

## **Font Role 1: Editorial Serif** 

Use a refined high-contrast serif for storytelling, emotion and brand presence. 

Recommended serif options: 

```
Cormorant Garamond
Playfair Display
Libre Baskerville
```

2 

```
Fraunces
Canela-style premium serif if licensed
```

Use serif for: 

```
Hero headlines
Collection titles
Lookbook titles
PDP product titles
Atelier/craft storytelling headings
Brand statements
Editorial pull quotes
Luxury loyalty tier names
```

Never use serif for: 

```
Prices
Checkout forms
Size selectors
Navigation metadata
Error messages
Payment labels
Inventory labels
Filter controls
```

## **Font Role 2: Clean Sans Serif** 

Use a highly legible sans-serif for utility, trust and conversion clarity. 

Recommended sans-serif options: 

```
Inter
Manrope
Neue Haas Grotesk style
Satoshi
Avenir-style geometric sans
```

Use sans-serif for: 

```
Navigation
Buttons
Prices
Product metadata
Size labels
Colour labels
Filters
```

3 

```
Sort controls
Forms
Checkout
Order status
WhatsApp notification interface
Fabric/care details
Error messages
```

## **1.3 Typography Scale** 

## **Desktop** 

```
.hero-title{
font-family:var(--font-serif);
font-size:clamp(64px,7vw,120px);
line-height:0.9;
letter-spacing:-0.04em;
}
.section-title{
font-family:var(--font-serif);
font-size:clamp(42px,4.5vw,82px);
line-height:0.95;
letter-spacing:-0.025em;
}
.pdp-title{
font-family:var(--font-serif);
font-size:clamp(34px,3vw,54px);
line-height:1;
}
.body-copy{
font-family:var(--font-sans);
font-size:15px;
line-height:1.75;
}
.product-meta,
.form-label,
.nav-label{
font-family:var(--font-sans);
font-size:12px;
letter-spacing:0.08em;
text-transform:uppercase;
}
.price{
```

4 

```
font-family:var(--font-sans);
font-size:15px;
font-weight:500;
}
```

## **Mobile** 

```
.hero-title{
font-size:clamp(42px,13vw,64px);
line-height:0.94;
}
.section-title{
font-size:clamp(32px,10vw,48px);
}
.body-copy{
font-size:14.5px;
line-height:1.7;
}
```

## **1.4 Colour System** 

The palette should come from the existing Do Sakhi logo: botanical green, copper/rose-gold linework, soft ivory and natural calm. 

## **Core Palette** 

```
:root{
--ds-ivory:#F8F3EA;
--ds-warm-white:#FFFDF8;
--ds-emerald:#073F34;
--ds-deep-forest:#022B24;
--ds-soft-sage:#DDE7DC;
--ds-muted-sage:#B8C9BC;
--ds-copper:#A76F4D;
--ds-rose-gold:#B98976;
--ds-charcoal:#1D1D1B;
--ds-muted-text:#6E675F;
--ds-border:#E8DED2;
--ds-error:#8A2F24;
--ds-success:#315C48;
```

```
}
```

5 

## **Usage Rules** 

```
Warm white:
Primary website background.
Ivory:
Section background, product card surface, checkout surface.
Deep emerald:
Primary luxury accent, footer, dark editorial blocks, primary CTA.
Soft sage:
Secondary calm background for craftsmanship, size help and boutique promise
sections.
```

```
Copper / rose-gold:
Fine borders, botanical dividers, tiny accent lines only.
Charcoal:
Main body text.
Muted text:
Descriptions, metadata, filters and care instructions.
```

## **Forbidden Colour Behaviour** 

```
No bright red discount badges.
No neon green WhatsApp bubble.
No gold gradients.
No heavy black luxury cliché.
No multi-colour marketplace UI.
No high-saturation pink/purple CTA buttons.
```

## **1.5 Whitespace & Layout Ratios** 

Luxury is created by restraint. Use whitespace as a design material. 

## **Desktop Spacing** 

```
Global page max width:
1440px
Content max width:
1180px to 1280px
Editorial text max width:
```

6 

```
420px to 560px
Homepage section vertical padding:
112px to 160px
PLP top padding:
96px to 128px
PDP top padding:
110px header offset + 48px
Grid gap:
32px to 48px
Product card image-to-text gap:
12px to 16px
```

## **Mobile Spacing** 

```
Section vertical padding:
64px to 88px
Horizontal page padding:
18px to 22px
Product grid gap:
14px to 18px
PDP accordion padding:
18px to 22px
Mobile sticky CTA height:
64px to 72px
```

## **Crowding Prevention Rule** 

Every major screen section must satisfy at least one of these: 

```
35% empty/negative space
One dominant visual
One dominant headline
Maximum two CTAs
Maximum one promotional/support message
```

7 

## **1.6 Homepage Editorial Sequence** 

The homepage must behave like a premium magazine story, not a shopping grid. 

## **Homepage Order** 

`1. Fixed quiet luxury header` 

`2. Full-bleed hero film loop 3. Narrative collection entry blocks` 

`4. Newly curated product rail` 

`5. Material / craftsmanship atelier story` 

`6. Lookbook story module` 

`7. Bespoke / custom tailoring section` 

`8. Boutique promise / trust signals` 

`9. restrained Instagram or journal preview` 

`10. Footer with WhatsApp Stylist CTA` 

## **1.7 Header System** 

## **Desktop Header** 

```
Height:
84px
Position:
Fixed
Initial state:
Transparent over hero
Scrolled state:
Warm ivory background
1px bottom border
Logo scales down slightly
Left navigation:
New Arrivals
Collections
Lookbooks
Bespoke
Center:
Do Sakhi logo
Right navigation:
Search
Wishlist
```

8 

```
Account
Cart
```

## **Mobile Header** 

```
Height:
64px
Layout:
Menu icon | centered logo | cart icon
Drawer menu:
New Arrivals
Suit Sets
Co-ord Sets
Kurta Sets
Festive Edit
Lookbooks
Custom Tailoring
WhatsApp Stylist
Client Services
```

## **Header Motion** 

```
Transition:
260ms ease-out
On scroll past 80px:
Header background changes to ivory.
Logo scales from 1.0 to 0.88.
Border fades in.
```

## **1.8 Hero Film Loop** 

## **Layout** 

```
Height:
92vh desktop
78vh mobile
```

```
Media:
Silent 6–10 second video loop
Fallback poster image required
```

9 

```
Overlay:
Emerald/charcoal gradient at 16–24% opacity
```

## **Content Placement** 

Desktop: 

```
Left bottom aligned
Max width: 560px
Margin left: 7vw
Margin bottom: 12vh
```

Mobile: 

```
Bottom aligned
Padding: 22px
```

## **Hero Copy** 

```
Eyebrow:
THE QUIET LUXURY EDIT
Headline:
Grace, Tailored in Silence
Body:
```

```
Curated suit sets, co-ords and bespoke fits for women who prefer elegance
without noise.
```

```
CTA 1:
Explore the Collection
CTA 2:
Speak to a Stylist
```

## **Hero Rules** 

```
No price.
No discount.
No countdown.
No moving text ticker.
No heavy overlay.
No more than two buttons.
```

10 

## **1.9 Narrative Collection Blocks** 

## **Layout** 

Desktop: 

```
Asymmetric editorial grid:
Left large tile: 60%
Right stacked tiles: 40%
```

Mobile: 

```
One column
Full-width tiles
Image ratio: 4:5
```

## **Tiles** 

```
01 Suit Sets
Elegant everyday sets crafted for comfort, movement and refined presence.
02 Co-ords
Modern pairings with soft structure and understated detail.
03 Festive Grace
Occasion-ready silhouettes without excess.
```

## **Tile UI Rules** 

```
Collection number in sans-serif.
Collection name in serif.
Description in sans-serif.
CTA as underlined text, not heavy button.
```

## **1.10 Atelier / Craftsmanship Story Block** 

## **Purpose** 

This block justifies premium positioning by talking about fabric, fall, comfort and curation. 

11 

## **Layout** 

```
Split screen
Left:
Fabric or embroidery close-up image
Right:
Editorial text
Background:
Soft sage or warm ivory
Padding:
120px desktop
72px mobile
```

## **Copy Structure** 

```
THE FABRIC NOTE
```

```
Every Do Sakhi piece is selected for softness, fall, comfort and quiet
detail. From breathable summer blends to refined occasion silhouettes, each
piece is curated with a boutique eye before it reaches your wardrobe.
```

```
CTA:
Read the Atelier Note
```

## **1.11 Footer** 

## **Footer Structure** 

```
Background:
Deep emerald
Text:
Ivory
Accent:
Muted copper line
Columns:
Shop
Client Services
Do Sakhi
Stay Connected
```

12 

## **Footer Links** 

```
Shop:
New Arrivals
Suit Sets
Co-ords
Festive Edit
Client Services:
WhatsApp Stylist
Size Guide
Shipping
Returns & Exchange
Fabric Care
Do Sakhi:
Our Story
Lookbooks
Bespoke
Contact
Stay Connected:
Instagram
WhatsApp
Email signup
```

## **Footer CTA** 

```
Need help choosing your size or style?
Speak with a Do Sakhi stylist on WhatsApp.
```

## **CHAPTER 2: FRONTEND VIEWPORT ARCHITECTURE — PLP & PDP** 

## **2.1 Product Listing Page Objective** 

The PLP must preserve boutique calm while still allowing fast product discovery. 

It must not look like a marketplace grid. 

13 

## **2.2 PLP Desktop Layout** 

```
Top:
Collection editorial header
Below:
Filter sidebar + product grid
Left:
22% filter sidebar
Right:
78% grid area
```

## **Collection Header** 

```
Title:
Suit Sets
Description:
Elegant sets for everyday grace, soft occasions and refined comfort.
Optional note:
Limited boutique pieces. Select sizes may be available for custom fit.
```

Title uses serif. Description uses sans-serif. 

## **2.3 PLP Grid Rules** 

## **Standard Collection** 

```
Desktop:
3 columns
Tablet:
2 columns
Mobile:
2 columns for browsing
1 column for editorial collection pages
```

14 

## **Editorial Collection** 

```
Desktop:
2 columns
Image ratio:
4:5 or 3:4
Grid gap:
40px to 56px
```

## **Product Card Structure** 

```
Image area
One optional subtle badge
Product name
Fabric / set composition
Price
Available sizes
```

Example: 

```
READY TO SHIP
Ivory Leaf Print Summer Suit Set
Cotton Blend · Kurti + Pant + Dupatta
₹1,250
M L XL XXL
```

## **2.4 Product Badge Rule** 

Absolute maximum: **one badge per card** . 

Allowed badges: 

```
READY TO SHIP
CUSTOM FIT AVAILABLE
LIMITED PIECE
MADE TO ORDER
```

Forbidden badges: 

```
SALE
HOT DEAL
```

15 

```
BEST PRICE
HURRY
70% OFF
TRENDING NOW!!!
```

Badge CSS: 

```
.product-badge{
position:absolute;
left:12px;
top:12px;
padding:5px9px;
border:1pxsolidvar(--ds-border);
background:rgba(255,253,248,0.88);
color:var(--ds-muted-text);
font-family:var(--font-sans);
font-size:10px;
letter-spacing:0.08em;
text-transform:uppercase;
}
```

## **2.5 Product Card Hover** 

Desktop hover state: 

```
Primary image crossfades to secondary image.
Image scales to 1.025.
Wishlist icon fades in.
Quick View text appears only if implemented elegantly.
Text below image must not shift.
```

CSS rule: 

```
.product-cardimg.primary{
opacity:1;
transition:opacity260msease-out,transform420msease-out;
}
.product-cardimg.secondary{
opacity:0;
transition:opacity260msease-out,transform420msease-out;
}
.product-card:hoverimg.primary{
opacity:0;
transform:scale(1.025);
```

16 

```
}
.product-card:hoverimg.secondary{
opacity:1;
transform:scale(1.025);
}
```

## **2.6 PLP Filters** 

## **Filter Groups** 

```
Category
Size
Colour
Fabric
Occasion
Silhouette
Fit
Availability
Custom Tailoring
Price
```

## **Filter Values** 

```
Category:
Suit Sets
Co-ord Sets
Kurta Sets
Dupatta Sets
Size:
M / 38
L / 40
XL / 42
XXL / 44
Fabric:
Cotton Blend
Muslin
Rayon
Jute
Silk Blend
Chanderi
Linen Blend
Occasion:
Daily Wear
```

17 

```
Office Wear
Festive
Small Gathering
Wedding Guest
Silhouette:
Straight
Relaxed
A-line
Structured
Flowy
Availability:
Ready to Ship
Made to Order
Custom Fit Available
Price:
₹1000–₹1500
₹1500–₹2500
₹2500–₹4000
```

## **URL Query Format** 

```
/collections/suit-sets?size=M,L&fabric=cotton-
blend&occasion=office&availability=ready-to-ship&customTailoring=true
```

## **2.7 Lookbook Interludes Inside PLP** 

After every 8–12 products, insert one editorial interlude. 

## **Interlude Examples** 

```
The Fabric Note
Why breathable blends matter for everyday elegance.
Need Help Choosing?
Chat with a Do Sakhi stylist before you order.
The Lookbook Edit
See how this season’s pieces move, drape and style together.
```

## **Layout** 

```
Full-width across grid.
Image left, text right.
```

18 

```
No product price.
One CTA only.
```

## **2.8 PDP Objective** 

The PDP must remove buyer hesitation around: 

```
Fit
Fabric
Size
Length
Back design
Dupatta fall
Custom measurements
Delivery time
Return/exchange policy
Styling help
```

## **2.9 PDP Split-Screen Layout** 

## **Desktop** 

```
Left side:
62% width media gallery
Right side:
38% sticky product information panel
Sticky offset:
112px from top
Page background:
Warm white
```

## **Mobile** 

```
Media carousel
Product information
Variant picker
Add to cart
Custom tailoring drawer
Details accordions
Sticky bottom CTA
```

19 

## **2.10 PDP Media System** 

## **Required Media Order** 

`1. Front full look` 

`2. Side or angled look` 

`3. Back look` 

`4. Fabric close-up` 

`5. Embroidery/detail close-up` 

`6. Pocket/detail shot if applicable` 

`7. Short drape/movement video` 

`8. Lifestyle image` 

## **Video Rules** 

```
Duration:
5–8 seconds for PDP drape video
Behaviour:
Muted
Loop
Plays inline
Lazy loaded
Autoplay only when visible
Poster image required
File size:
2–5 MB target
Formats:
WebM first
MP4 fallback
```

## **Media Component** 

```
<video
muted
loop
playsInline
preload="none"
poster={posterUrl}
>
<sourcesrc={webmUrl}type="video/webm"/>
<sourcesrc={mp4Url}type="video/mp4"/>
</video>
```

20 

## **2.11 PDP Sticky Information Panel** 

## **Panel Structure** 

```
Badge line
Product title
Short description
Price
Colour selector
Size selector
Fit help
Primary CTA
Custom tailoring module
WhatsApp stylist CTA
Accordions
```

## **Example** 

```
READY TO SHIP · CUSTOM FIT AVAILABLE
Ivory Leaf Print Summer Suit Set
A breathable summer suit set with an elegant off-white leaf print, straight
pants and a printed dupatta.
₹1,250
Colour
Ivory Black
Size
M / 38   L / 40   XL / 42   XXL / 44
Not sure about your size?
Ask our stylist.
[Add to Cart]
[Request Custom Tailoring]
[WhatsApp Stylist]
```

## **2.12 Variant Picker Rules** 

Variant picker state: 

21 

```
typeSelectedVariantState={
productId:string;
colorName:string;
sizeLabel:string;
variantId:string|null;
availableQuantity:number;
isReadyToShip:boolean;
isMadeToOrder:boolean;
customTailoringAvailable:boolean;
};
```

Rules: 

```
Disable unavailable sizes.
Show “Only 1 left” if stock available is 1.
Show “Only 2 left” if stock available is 2.
Show “Made to Order” when ready stock is 0 but made-to-order is enabled.
Do not show inventory pressure if quantity is more than 2.
```

## **2.13 PDP Accordions** 

Use this order: 

```
Product Details
Fabric & Feel
Fit & Size
Care Instructions
Delivery Timeline
Returns & Exchange
Need Styling Help?
```

## **Product Details Example** 

```
- Kurti, pant and dupatta set
- Straight silhouette
- Printed dupatta
- Pocket detail near embroidery, if applicable
- Suitable for office, daily wear and small gatherings
```

## **Fabric & Feel Example** 

```
Soft breathable cotton blend with a comfortable fall. Designed for long wear
and graceful movement.
```

22 

## **Care Example** 

```
Gentle hand wash recommended.
Wash dark colours separately.
Do not bleach.
Dry in shade.
Iron on low heat.
```

## **CHAPTER 3: CUSTOM CUSTOMER SERVICE & RETENTION MECHANICS** 

## **3.1 WhatsApp Stylist Concierge** 

This is a core luxury feature, not an afterthought. 

## **Visual Treatment** 

Do not use a loud green WhatsApp bubble. 

Desktop: 

```
Bottom-right ivory/emerald capsule:
Need help choosing?
WhatsApp Stylist
```

Mobile: 

```
Sticky bottom mini CTA after 35% scroll:
Ask Stylist
```

Hide on: 

```
Checkout page
Payment page
Order success page if intrusive
```

## **PDP WhatsApp Link** 

```
constmessage=encodeURIComponent(
```

```
`Hi Do Sakhi, I need help choosing the right size/style for this product: $
{productUrl}`
);
```

23 

```
constwhatsappUrl=`https://wa.me/91XXXXXXXXXX?text=${message}`;
```

## **3.2 Custom Measurement Interface** 

The tailoring flow begins directly from the PDP. 

## **Entry Point** 

Button: 

```
Request Custom Tailoring
```

Button location: 

```
Below Add to Cart
Above WhatsApp Stylist CTA
```

## **UI Pattern** 

Use: 

```
Inline expander on desktop
Side drawer on desktop if form is long
Bottom sheet drawer on mobile
```

## **3.3 Tailoring Flow Steps** 

## **Step 1: Tailoring Type** 

```
Choose your tailoring preference
```

```
Options:
```

`1. Minor length adjustment` 

`2. Full custom measurements` 

`3. Stylist review required` 

## **Step 2: Measurements** 

Fields: 

24 

```
Bust
Waist
Hip
Shoulder
Sleeve Length
Kurti Length
Pant Waist
Pant Length
Height
```

Required minimum fields: 

```
Bust
Waist
Hip
Shoulder
Height
```

Optional: 

```
Sleeve Length
Kurti Length
Pant Waist
Pant Length
Reference image
Custom request note
```

## **Step 3: Custom Requests** 

Textarea placeholder: 

```
Example: Please keep the kurti length slightly longer, and confirm the fit
before processing.
```

## **Step 4: Confirmation** 

Message: 

```
Your measurements have been saved for this piece. Our boutique team will
confirm details on WhatsApp before tailoring begins.
```

25 

## **Validation Rules** 

```
constmeasurementRules={
bustInches:{min:24,max:60},
waistInches:{min:20,max:56},
hipInches:{min:26,max:64},
shoulderInches:{min:10,max:24},
sleeveLengthInches:{min:5,max:28},
kurtiLengthInches:{min:24,max:60},
pantWaistInches:{min:20,max:56},
pantLengthInches:{min:24,max:48},
heightInches:{min:48,max:78}
};
```

## **Important UX Rule** 

Do not force login before capturing measurements. 

Use: 

```
Logged-in user:
Save to measurement profile.
Guest user:
Save to guest session and cart line item.
```

## **3.4 Clienteling Notification Choreography** 

The backend should trigger service-style WhatsApp notifications. 

## **Event Sequence** 

`1. Order Placed` 

`2. Payment Confirmed` 

`3. Measurements Received` 

`4. Measurements Approved` 

`5. Tailoring Commenced` 

`6. Packed` 

`7. Dispatched with Tracking Link` 

`8. Delivered` 

`9. Care Note / Review Request` 

26 

## **3.5 WhatsApp Templates** 

## **Order Confirmed** 

Trigger: 

```
order.paid
```

Template: 

```
do_sakhi_order_confirmed
```

Variables: 

```
{
"customer_name":"Samita",
"order_number":"DS10021",
"amount":"₹1,250",
"dispatch_window":"2–5 working days"
}
```

Message: 

```
Hello {{customer_name}}, thank you for your Do Sakhi order {{order_number}}.
Your piece has been reserved and we are preparing it with care.
```

```
Order total: {{amount}}
Expected dispatch: {{dispatch_window}}
```

## **Measurements Received** 

Trigger: 

```
tailoring.measurements_received
```

Template: 

```
do_sakhi_measurements_received
```

Variables: 

27 

```
{
"customer_name":"Samita",
"product_name":"Ivory Leaf Print Summer Suit Set",
"order_number":"DS10021"
}
```

Message: 

```
Hello {{customer_name}}, we have received your custom measurement request for
{{product_name}}.
```

```
Our stylist will review the details before processing your order
{{order_number}}.
```

## **Tailoring Started** 

Trigger: 

```
tailoring.started
```

Template: 

```
do_sakhi_tailoring_started
```

Variables: 

```
{
"customer_name":"Samita",
"product_name":"Ivory Leaf Print Summer Suit Set",
"expected_completion":"3–4 working days"
}
```

## **Dispatched** 

Trigger: 

```
order.dispatched
```

Template: 

28 

```
do_sakhi_order_dispatched
```

Variables: 

```
{
"customer_name":"Samita",
"order_number":"DS10021",
"courier_name":"Delhivery",
"tracking_link":"https://tracking-link.com"
}
```

## **3.6 WhatsApp Notification Worker** 

```
asyncfunctionsendWhatsAppNotification(notificationId:string){
constnotification=awaitdb.whatsapp_notifications.findUnique({
where:{id:notificationId}
});
if(!notification||notification.status==="sent")return;
try{
constresponse=awaitwhatsappClient.sendTemplate({
to:notification.phone,
templateName:notification.template_name,
params:notification.template_params
});
awaitdb.whatsapp_notifications.update({
where:{id:notificationId},
data:{
status:"sent",
provider_message_id:response.messageId,
sent_at:newDate()
}
});
}catch(error){
awaitscheduleWhatsAppRetry(notificationId,error);
}
}
```

Retry schedule: 

```
Attempt 1:
Immediately
```

29 

```
Attempt 2:
1 minute later
Attempt 3:
5 minutes later
Attempt 4:
30 minutes later
Attempt 5:
2 hours later
After 5 failures:
Mark failed and alert admin.
```

## **3.7 Luxury Loyalty Framework** 

Do not build a generic points system. 

Do Sakhi should use a **concierge-tier loyalty model** . 

## **Tier 1: The Sakhi Circle** 

Eligibility: 

```
First purchase or account creation
```

Benefits: 

```
Saved measurements
WhatsApp styling support
Early preview of selected drops
Care reminders
```

## **Tier 2: The Atelier Client** 

Eligibility: 

```
₹10,000 lifetime spend
or 3 completed orders
```

Benefits: 

30 

```
Early access to new seasonal edits
Priority custom measurement review
Direct stylist booking slots
Private restock alerts
```

## **Tier 3: The Signature Client** 

Eligibility: 

```
₹30,000 lifetime spend
or 8 completed orders
```

Benefits: 

```
Private preview before public collection launch
Priority tailoring queue
Personalized styling recommendations
Occasion-based curation
Complimentary fit consultation
```

## **Tier 4: The Patron Circle** 

Eligibility: 

```
Invite-only
```

Benefits: 

```
One-to-one digital stylist appointment
First access to limited pieces
Custom capsule recommendations
Priority support
Exclusive festive previews
```

## **CHAPTER 4: THE DATA LAYER & BACKEND SCHEMA** 

## **4.1 Database Strategy** 

Database: 

31 

```
PostgreSQL
```

Schema design principles: 

```
Normalize products, variants, orders and tailoring details.
Store cart tailoring data temporarily.
Copy product title, SKU and price into order_items at purchase time.
Link custom tailoring details directly to order_items.
Use payment_events for webhook idempotency.
Use reserved_quantity for stock locking.
```

## **4.2 PostgreSQL Extensions and Enums** 

```
CREATEEXTENSIONIFNOTEXISTS"pgcrypto";
```

```
CREATETYPEproduct_statusASENUM(
'draft',
'active',
'archived'
);
CREATETYPEfulfillment_typeASENUM(
'ready_to_ship',
'made_to_order',
'custom_tailoring'
);
CREATETYPEorder_statusASENUM(
'pending',
'stock_locked',
'payment_initiated',
'paid',
'confirmed',
'tailoring_pending',
'tailoring_approved',
'tailoring_started',
'packed',
'dispatched',
'delivered',
'cancelled',
'refunded'
);
CREATETYPEpayment_statusASENUM(
'pending',
'authorized',
```

32 

```
'captured',
'failed',
'refunded'
);
CREATETYPEpayment_gatewayASENUM(
'razorpay',
'stripe',
'cod'
);
CREATETYPEtailoring_statusASENUM(
'not_required',
'pending_measurements',
'pending_approval',
'approved',
'in_progress',
'completed',
'rejected'
);
```

## **4.3 Products Table** 

```
CREATETABLEproducts(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
titleVARCHAR(255)NOTNULL,
slugVARCHAR(255)UNIQUENOTNULL,
short_descriptionTEXT,
descriptionTEXT,
product_typeVARCHAR(80)NOTNULL,
statusproduct_statusNOTNULLDEFAULT'draft',
```

```
fulfillment_typefulfillment_typeNOTNULLDEFAULT'ready_to_ship',
is_ready_to_shipBOOLEANNOTNULLDEFAULTTRUE,
is_made_to_orderBOOLEANNOTNULLDEFAULTFALSE,
custom_tailoring_availableBOOLEANNOTNULLDEFAULTFALSE,
```

```
fabric_typeVARCHAR(120),
fabric_compositionVARCHAR(255),
fabric_feelVARCHAR(255),
care_instructionsTEXT,
fit_noteTEXT,
```

```
silhouetteVARCHAR(120),
necklineVARCHAR(120),
sleeve_typeVARCHAR(120),
```

33 

```
kurti_lengthVARCHAR(80),
bottom_typeVARCHAR(80),
```

```
dupatta_includedBOOLEANDEFAULTFALSE,
pocket_availableBOOLEANDEFAULTFALSE,
embroidery_detailTEXT,
print_detailTEXT,
```

```
lead_time_min_daysINTNOTNULLDEFAULT2,
lead_time_max_daysINTNOTNULLDEFAULT7,
```

```
seo_titleVARCHAR(255),
seo_descriptionTEXT,
```

```
created_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
updated_atTIMESTAMPTZNOTNULLDEFAULTNOW()
);
```

```
CREATEINDEXidx_products_statusONproducts(status);
CREATEINDEXidx_products_slugONproducts(slug);
CREATEINDEXidx_products_typeONproducts(product_type);
CREATEINDEXidx_products_fabricONproducts(fabric_type);
CREATEINDEXidx_products_silhouetteONproducts(silhouette);
CREATEINDEXidx_products_fulfillment_typeONproducts(fulfillment_type);
```

## **4.4 Product Variants Table** 

```
CREATETABLEproduct_variants(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
product_idUUIDNOTNULLREFERENCESproducts(id)ONDELETECASCADE,
```

```
skuVARCHAR(100)UNIQUENOTNULL,
```

```
color_nameVARCHAR(100)NOTNULL,
color_hexVARCHAR(20),
```

```
size_labelVARCHAR(20)NOTNULL,
size_numericVARCHAR(20),
```

```
price_inrNUMERIC(10,2)NOTNULL,
compare_at_price_inrNUMERIC(10,2),
cost_price_inrNUMERIC(10,2),
```

```
stock_quantityINTNOTNULLDEFAULT0,
reserved_quantityINTNOTNULLDEFAULT0,
low_stock_thresholdINTNOTNULLDEFAULT2,
```

34 

```
weight_gramsINT,
is_activeBOOLEANNOTNULLDEFAULTTRUE,
created_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
updated_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
CONSTRAINTstock_non_negativeCHECK(stock_quantity>=0),
CONSTRAINTreserved_non_negativeCHECK(reserved_quantity>=0),
CONSTRAINTreserved_not_more_than_stockCHECK(reserved_quantity<=
stock_quantity)
);
```

```
CREATEINDEXidx_variants_productONproduct_variants(product_id);
CREATEINDEXidx_variants_skuONproduct_variants(sku);
CREATEINDEXidx_variants_sizeONproduct_variants(size_label);
CREATEINDEXidx_variants_colorONproduct_variants(color_name);
CREATEINDEXidx_variants_activeONproduct_variants(is_active);
```

Available stock calculation: 

```
-
stock_quantityreserved_quantity
```

## **4.5 Collections and Mapping** 

```
CREATETABLEcollections(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
titleVARCHAR(255)NOTNULL,
slugVARCHAR(255)UNIQUENOTNULL,
descriptionTEXT,
collection_typeVARCHAR(80)DEFAULT'manual',
hero_image_urlTEXT,
hero_video_urlTEXT,
sort_orderINTDEFAULT0,
is_activeBOOLEANNOTNULLDEFAULTTRUE,
seo_titleVARCHAR(255),
seo_descriptionTEXT,
created_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
updated_atTIMESTAMPTZNOTNULLDEFAULTNOW()
);
CREATETABLEproduct_collection_mapping(
product_idUUIDNOTNULLREFERENCESproducts(id)ONDELETECASCADE,
```

35 

```
collection_idUUIDNOTNULLREFERENCEScollections(id)ONDELETECASCADE,
positionINTDEFAULT0,
```

```
PRIMARYKEY(product_id,collection_id)
);
```

```
CREATEINDEXidx_collection_slugONcollections(slug);
CREATEINDEXidx_product_collection_collectionON
product_collection_mapping(collection_id);
CREATEINDEXidx_product_collection_productON
product_collection_mapping(product_id);
```

## **4.6 Product Tags** 

```
CREATETABLEproduct_tags(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
product_idUUIDNOTNULLREFERENCESproducts(id)ONDELETECASCADE,
```

```
tag_typeVARCHAR(50)NOTNULL,
tag_valueVARCHAR(100)NOTNULL
);
```

```
CREATEINDEXidx_product_tags_productONproduct_tags(product_id);
CREATEINDEXidx_product_tags_type_valueONproduct_tags(tag_type,
tag_value);
```

Example tag data: 

```
occasion: office
occasion: festive
occasion: daily_wear
style: quiet_luxury
fit: straight
mood: refined
```

## **4.7 Product Media** 

```
CREATETABLEproduct_media(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
product_idUUIDNOTNULLREFERENCESproducts(id)ONDELETECASCADE,
variant_idUUIDREFERENCESproduct_variants(id)ONDELETESETNULL,
```

36 

```
media_typeVARCHAR(20)NOTNULL,
media_roleVARCHAR(80)NOTNULL,
```

```
urlTEXTNOTNULL,
thumbnail_urlTEXT,
alt_textTEXT,
widthINT,
heightINT,
duration_secondsINT,
positionINTNOTNULLDEFAULT0,
is_primaryBOOLEANDEFAULTFALSE,
```

```
created_atTIMESTAMPTZNOTNULLDEFAULTNOW()
);
```

```
CREATEINDEXidx_product_media_productONproduct_media(product_id);
CREATEINDEXidx_product_media_variantONproduct_media(variant_id);
CREATEINDEXidx_product_media_roleONproduct_media(media_role);
```

Allowed `media_role` values: 

```
front
side
back
fabric_closeup
embroidery_detail
pocket_detail
drape_video
lifestyle
```

## **4.8 Users and Guest Sessions** 

```
CREATETABLEusers(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
emailVARCHAR(255)UNIQUE,
phoneVARCHAR(30)UNIQUE,
full_nameVARCHAR(255),
```

```
password_hashTEXT,
```

```
whatsapp_opt_inBOOLEANDEFAULTFALSE,
marketing_opt_inBOOLEANDEFAULTFALSE,
```

```
loyalty_tierVARCHAR(80)DEFAULT'sakhi_circle',
```

37 

```
lifetime_spend_inrNUMERIC(12,2)DEFAULT0,
completed_order_countINTDEFAULT0,
```

```
created_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
updated_atTIMESTAMPTZNOTNULLDEFAULTNOW()
);
```

```
CREATETABLEguest_sessions(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
session_tokenTEXTUNIQUENOTNULL,
```

```
emailVARCHAR(255),
phoneVARCHAR(30),
```

```
cart_snapshotJSONB,
measurement_snapshotJSONB,
expires_atTIMESTAMPTZNOTNULL,
created_atTIMESTAMPTZNOTNULLDEFAULTNOW()
);
```

```
CREATEINDEXidx_guest_session_tokenONguest_sessions(session_token);
CREATEINDEXidx_guest_session_expiresONguest_sessions(expires_at);
```

## **4.9 Addresses** 

```
CREATETABLEaddresses(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
user_idUUIDREFERENCESusers(id)ONDELETECASCADE,
guest_session_idUUIDREFERENCESguest_sessions(id)ONDELETECASCADE,
```

```
full_nameVARCHAR(255)NOTNULL,
phoneVARCHAR(30)NOTNULL,
```

```
address_line_1TEXTNOTNULL,
address_line_2TEXT,
```

```
cityVARCHAR(100)NOTNULL,
stateVARCHAR(100)NOTNULL,
postal_codeVARCHAR(20)NOTNULL,
countryVARCHAR(100)NOTNULLDEFAULT'India',
```

```
created_atTIMESTAMPTZNOTNULLDEFAULTNOW()
);
```

38 

```
CREATEINDEXidx_addresses_userONaddresses(user_id);
CREATEINDEXidx_addresses_guestONaddresses(guest_session_id);
```

## **4.10 Carts and Cart Items** 

```
CREATETABLEcarts(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
user_idUUIDREFERENCESusers(id)ONDELETECASCADE,
guest_session_idUUIDREFERENCESguest_sessions(id)ONDELETECASCADE,
```

```
currencyVARCHAR(10)NOTNULLDEFAULT'INR',
statusVARCHAR(30)NOTNULLDEFAULT'active',
```

```
created_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
updated_atTIMESTAMPTZNOTNULLDEFAULTNOW()
);
```

```
CREATETABLEcart_items(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
cart_idUUIDNOTNULLREFERENCEScarts(id)ONDELETECASCADE,
product_idUUIDNOTNULLREFERENCESproducts(id),
variant_idUUIDNOTNULLREFERENCESproduct_variants(id),
```

```
quantityINTNOTNULLDEFAULT1,
```

```
tailoring_requestedBOOLEANNOTNULLDEFAULTFALSE,
tailoring_payloadJSONB,
```

```
unit_price_inrNUMERIC(10,2)NOTNULL,
```

```
created_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
```

```
CONSTRAINTquantity_positiveCHECK(quantity>0)
);
```

```
CREATEINDEXidx_cart_items_cartONcart_items(cart_id);
CREATEINDEXidx_cart_items_variantONcart_items(variant_id);
```

## **4.11 Orders** 

```
CREATETABLEorders(
```

```
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

39 

```
order_numberVARCHAR(50)UNIQUENOTNULL,
```

```
user_idUUIDREFERENCESusers(id)ONDELETESETNULL,
guest_session_idUUIDREFERENCESguest_sessions(id)ONDELETESETNULL,
```

```
statusorder_statusNOTNULLDEFAULT'pending',
payment_statuspayment_statusNOTNULLDEFAULT'pending',
payment_gatewaypayment_gateway,
```

```
subtotal_inrNUMERIC(10,2)NOTNULLDEFAULT0,
shipping_inrNUMERIC(10,2)NOTNULLDEFAULT0,
discount_inrNUMERIC(10,2)NOTNULLDEFAULT0,
total_inrNUMERIC(10,2)NOTNULLDEFAULT0,
```

```
customer_emailVARCHAR(255),
customer_phoneVARCHAR(30),
```

```
shipping_addressJSONBNOTNULL,
billing_addressJSONB,
```

```
stock_lock_expires_atTIMESTAMPTZ,
```

```
payment_reference_idVARCHAR(255),
gateway_order_idVARCHAR(255),
gateway_payment_idVARCHAR(255),
```

```
whatsapp_opt_inBOOLEANDEFAULTFALSE,
```

```
tracking_providerVARCHAR(100),
tracking_numberVARCHAR(120),
tracking_urlTEXT,
```

```
created_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
updated_atTIMESTAMPTZNOTNULLDEFAULTNOW()
);
```

```
CREATEINDEXidx_orders_numberONorders(order_number);
CREATEINDEXidx_orders_statusONorders(status);
CREATEINDEXidx_orders_payment_statusONorders(payment_status);
CREATEINDEXidx_orders_gateway_orderONorders(gateway_order_id);
CREATEINDEXidx_orders_userONorders(user_id);
```

## **4.12 Order Items** 

```
CREATETABLEorder_items(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
order_idUUIDNOTNULLREFERENCESorders(id)ONDELETECASCADE,
```

40 

```
product_idUUIDNOTNULLREFERENCESproducts(id),
variant_idUUIDNOTNULLREFERENCESproduct_variants(id),
product_titleVARCHAR(255)NOTNULL,
variant_titleVARCHAR(255)NOTNULL,
skuVARCHAR(100)NOTNULL,
```

```
quantityINTNOTNULLDEFAULT1,
```

```
unit_price_inrNUMERIC(10,2)NOTNULL,
line_total_inrNUMERIC(10,2)NOTNULL,
```

```
fulfillment_typefulfillment_typeNOTNULL,
tailoring_statustailoring_statusNOTNULLDEFAULT'not_required',
created_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
CONSTRAINTorder_item_quantity_positiveCHECK(quantity>0)
);
```

```
CREATEINDEXidx_order_items_orderONorder_items(order_id);
CREATEINDEXidx_order_items_variantONorder_items(variant_id);
```

## **4.13 Custom Tailoring Details** 

This table links bespoke measurements directly to a specific order line item. 

```
CREATETABLEcustom_tailoring_details(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
order_item_idUUIDNOTNULLUNIQUEREFERENCESorder_items(id)ONDELETE
CASCADE,
```

```
tailoring_typeVARCHAR(80)NOTNULL,
```

```
bust_inchesNUMERIC(5,2),
waist_inchesNUMERIC(5,2),
hip_inchesNUMERIC(5,2),
shoulder_inchesNUMERIC(5,2),
armhole_inchesNUMERIC(5,2),
sleeve_length_inchesNUMERIC(5,2),
kurti_length_inchesNUMERIC(5,2),
pant_waist_inchesNUMERIC(5,2),
pant_length_inchesNUMERIC(5,2),
height_inchesNUMERIC(5,2),
```

```
custom_requestTEXT,
reference_image_urlTEXT,
```

41 

```
statustailoring_statusNOTNULLDEFAULT'pending_measurements',
```

```
stylist_notesTEXT,
```

```
customer_approved_atTIMESTAMPTZ,
tailoring_started_atTIMESTAMPTZ,
tailoring_completed_atTIMESTAMPTZ,
```

```
created_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
updated_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
```

```
CONSTRAINTmeasurement_bust_rangeCHECK(bust_inchesISNULLOR
bust_inchesBETWEEN24AND60),
```

```
CONSTRAINTmeasurement_waist_rangeCHECK(waist_inchesISNULLOR
waist_inchesBETWEEN20AND56),
```

```
CONSTRAINTmeasurement_hip_rangeCHECK(hip_inchesISNULLORhip_inches
BETWEEN26AND64),
```

```
CONSTRAINTmeasurement_shoulder_rangeCHECK(shoulder_inchesISNULLOR
shoulder_inchesBETWEEN10AND24),
```

```
CONSTRAINTmeasurement_height_rangeCHECK(height_inchesISNULLOR
height_inchesBETWEEN48AND78)
```

```
);
```

```
CREATEINDEXidx_tailoring_order_itemON
custom_tailoring_details(order_item_id);
CREATEINDEXidx_tailoring_statusONcustom_tailoring_details(status);
```

## **4.14 Payment Events** 

```
CREATETABLEpayment_events(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
gatewaypayment_gatewayNOTNULL,
event_idVARCHAR(255)NOTNULL,
event_typeVARCHAR(255)NOTNULL,
```

```
order_idUUIDREFERENCESorders(id)ONDELETESETNULL,
```

```
gateway_order_idVARCHAR(255),
gateway_payment_idVARCHAR(255),
```

```
raw_payloadJSONBNOTNULL,
```

```
processedBOOLEANNOTNULLDEFAULTFALSE,
processing_errorTEXT,
```

```
received_atTIMESTAMPTZNOTNULLDEFAULTNOW(),
```

42 

```
UNIQUE(gateway,event_id)
```

```
);
```

```
CREATEINDEXidx_payment_events_orderONpayment_events(order_id);
CREATEINDEXidx_payment_events_processedONpayment_events(processed);
CREATEINDEXidx_payment_events_gateway_orderON
payment_events(gateway_order_id);
```

## **4.15 WhatsApp Notifications** 

```
CREATETABLEwhatsapp_notifications(
idUUIDPRIMARYKEYDEFAULTgen_random_uuid(),
```

```
order_idUUIDREFERENCESorders(id)ONDELETECASCADE,
user_idUUIDREFERENCESusers(id)ONDELETESETNULL,
```

```
phoneVARCHAR(30)NOTNULL,
```

```
template_nameVARCHAR(120)NOTNULL,
template_paramsJSONB,
```

```
statusVARCHAR(50)NOTNULLDEFAULT'queued',
provider_message_idVARCHAR(255),
```

```
retry_countINTNOTNULLDEFAULT0,
next_retry_atTIMESTAMPTZ,
```

```
sent_atTIMESTAMPTZ,
failed_reasonTEXT,
```

```
created_atTIMESTAMPTZNOTNULLDEFAULTNOW()
);
```

```
CREATEINDEXidx_whatsapp_statusONwhatsapp_notifications(status);
CREATEINDEXidx_whatsapp_orderONwhatsapp_notifications(order_id);
CREATEINDEXidx_whatsapp_next_retryON
whatsapp_notifications(next_retry_at);
```

43 

## **CHAPTER 5: API & SYSTEM INTEGRATION BLUEPRINT** 

## **5.1 Recommended Application Stack** 

```
Frontend:
Next.js
React
TypeScript
Tailwind CSS
Framer Motion only for controlled micro-interactions
Backend:
Node.js with NestJS or Express
Alternative: Python FastAPI if AI-heavy backend is planned
Database:
PostgreSQL
ORM:
Prisma for Node.js
SQLAlchemy for FastAPI
Auth:
Custom JWT, Supabase Auth, or Clerk
Storage:
Cloudflare R2 or AWS S3
CDN:
Cloudflare CDN
Search:
MVP: PostgreSQL full-text search
Phase 2: Typesense or Meilisearch
Phase 3: AI-assisted semantic search
Payments:
Razorpay for India
Stripe for international
Messaging:
WhatsApp Business Cloud API or official BSP
Jobs:
BullMQ + Redis
or Celery + Redis
```

44 

```
Hosting:
Frontend on Vercel
Backend on AWS/Fly.io/Render
Database on Supabase/RDS/Neon
```

## **5.2 API Base** 

```
/api/v1
```

Security requirements: 

```
Use HTTPS only.
Use HttpOnly cookies or secure bearer tokens.
Use guest session tokens for guest carts.
Use idempotency keys for checkout.
Use webhook signature verification.
Use rate limiting on public APIs.
Use server-side stock validation.
Never trust frontend price or stock.
```

## **5.3 Catalog Fetching Endpoint** 

## **Endpoint** 

```
GET /api/v1/products
```

## **Query Example** 

```
/api/v1/products?collection=suit-sets&size=M,L&fabric=cotton-
```

## **Supported Filters** 

```
collection
size
color
fabric
occasion
silhouette
fit
availability
customTailoring
```

45 

```
minPrice
maxPrice
sort
page
limit
```

## **Response** 

```
{
"data":[
{
"id":"uuid",
"title":"Ivory Leaf Print Summer Suit Set",
"slug":"ivory-leaf-print-summer-suit-set",
"productType":"Suit Set",
"price":{
"amount":1250,
"currency":"INR"
},
"badge":"READY_TO_SHIP",
"fabricType":"Cotton Blend",
"silhouette":"Straight",
"availableSizes":["M","L","XL","XXL"],
"customTailoringAvailable":true,
"primaryImage":{
"url":"https://cdn.dosakhi.com/products/ivory-front.webp",
"alt":"Ivory Leaf Print Summer Suit Set front view"
},
"hoverImage":{
"url":"https://cdn.dosakhi.com/products/ivory-back.webp",
"alt":"Ivory Leaf Print Summer Suit Set back view"
}
}
],
"pagination":{
"page":1,
"limit":24,
"total":88,
"hasMore":true
},
"availableFilters":{
"sizes":["M","L","XL","XXL"],
"fabrics":["Cotton Blend","Jute","Muslin"],
"occasions":["office","daily_wear","festive"],
"silhouettes":["Straight","A-line","Relaxed"]
}
}
```

46 

## **5.4 Product Detail Endpoint** 

## **Endpoint** 

```
GET /api/v1/products/:slug
```

## **Response** 

```
{
"id":"uuid",
"title":"Ivory Leaf Print Summer Suit Set",
"slug":"ivory-leaf-print-summer-suit-set",
"shortDescription":
"A breathable summer suit set with an elegant off-white leaf print.",
"description":"Long editorial product description...",
"productType":"Suit Set",
"fabricType":"Cotton Blend",
"fabricFeel":"Soft, breathable and light",
"careInstructions":"Gentle hand wash. Dry in shade.",
"fitNote":"Straight relaxed fit.",
"silhouette":"Straight",
"customTailoringAvailable":true,
"leadTime":{
"minDays":2,
"maxDays":5
},
"media":[
{
"type":"image",
"role":"front",
"url":"https://cdn.dosakhi.com/front.webp",
"alt":"Front view"
},
{
"type":"video",
"role":"drape_video",
"url":"https://cdn.dosakhi.com/drape.webm",
"thumbnailUrl":"https://cdn.dosakhi.com/drape-poster.webp"
}
],
"variants":[
{
"id":"uuid",
"sku":"DS-SUIT-IVORY-M",
"colorName":"Ivory Black",
"colorHex":"#F8F3EA",
"sizeLabel":"M",
"sizeNumeric":"38",
"priceInr":1250,
```

47 

```
"stockAvailable":3,
"isActive":true
}
]
}
```

## **5.5 Cart Endpoint** 

## **Create Cart** 

```
POST /api/v1/cart
```

Request: 

```
{
"guestSessionToken":"optional",
"currency":"INR"
}
```

Response: 

```
{
"cartId":"uuid",
"guestSessionToken":"secure-token",
"items":[],
"subtotalInr":0
}
```

## **Add Item to Cart** 

```
POST /api/v1/cart/:cartId/items
```

Request: 

```
{
"productId":"uuid",
"variantId":"uuid",
"quantity":1
}
```

Backend validation: 

48 

```
Product must be active.
Variant must be active.
Available stock must be greater than or equal to requested quantity.
Price must be copied from database, not frontend.
```

Response: 

```
{
"cartId":"uuid",
"items":[
{
"cartItemId":"uuid",
"productTitle":"Ivory Leaf Print Summer Suit Set",
"variantTitle":"Ivory Black / M",
"quantity":1,
"unitPriceInr":1250,
"tailoringRequested":false
}
],
"subtotalInr":1250
}
```

## **5.6 Custom Tailoring Binding Endpoint** 

## **Endpoint** 

```
POST /api/v1/cart/:cartId/items/:cartItemId/tailoring
```

Request: 

```
{
"tailoringType":"full_measurement",
"measurements":{
"bustInches":38,
"waistInches":34,
"hipInches":40,
"shoulderInches":15,
"armholeInches":16,
"sleeveLengthInches":18,
"kurtiLengthInches":44,
"pantWaistInches":34,
"pantLengthInches":38,
"heightInches":64
},
"customRequest":"Please keep the kurti length close to the reference
```

49 

```
image.",
```

```
"referenceImageUrl":"https://cdn.dosakhi.com/reference/customer-
image.webp"
}
```

Backend validation: 

```
Cart belongs to user or guest session.
Cart item exists.
Product supports custom tailoring.
Measurement values are within valid ranges.
Payload is saved to cart_items.tailoring_payload.
cart_items.tailoring_requested is set to true.
```

Response: 

```
{
"success":true,
"cartItemId":"uuid",
"tailoringRequested":true,
"message":"Measurements saved. Our stylist will confirm before
processing."
}
```

## **5.7 Checkout Initialization Endpoint** 

## **Endpoint** 

```
POST /api/v1/checkout
```

Headers: 

```
Idempotency-Key: client-generated-uuid
```

Request: 

```
{
"cartId":"uuid",
"customer":{
"fullName":"Samita Saini",
"email":"samita@example.com",
"phone":"7701809991",
"whatsappOptIn":true
```

50 

```
},
"shippingAddress":{
"fullName":"Samita Saini",
"phone":"7701809991",
"addressLine1":"House No...",
"addressLine2":"Sector...",
"city":"Gurgaon",
"state":"Haryana",
"postalCode":"122001",
"country":"India"
},
"paymentGateway":"razorpay"
}
```

## **Backend Transaction Logic** 

```
BEGIN;
-- 1. Lock cart items
SELECT*FROMcart_items
WHEREcart_id=:cartId
FORUPDATE;
-- 2. Lock selected variants
SELECT*FROMproduct_variants
WHEREidIN(:variantIds)
FORUPDATE;
-- 3. Check stock
-- available = stock_quantity - reserved_quantity
-- 4. If stock insufficient, ROLLBACK.
-- 5. Create order with stock_lock_expires_at = NOW() + INTERVAL '15 minutes'
-- 6. Create order_items from cart_items
-- 7. Increase reserved_quantity on product_variants
-- 8. Create custom_tailoring_details for items where tailoring_requested =
true
COMMIT;
```

## **Response for Razorpay** 

```
{
"orderId":"uuid",
"orderNumber":"DS10021",
```

51 

```
"status":"payment_initiated",
"stockLockExpiresAt":"2026-06-02T15:15:00Z",
"payment":{
"gateway":"razorpay",
"gatewayOrderId":"order_xxxxx",
"amount":125000,
"currency":"INR",
"keyId":"rzp_live_xxxxx"
}
}
```

## **Response for Stripe** 

```
{
"orderId":"uuid",
"orderNumber":"DS10022",
"status":"payment_initiated",
"stockLockExpiresAt":"2026-06-02T15:15:00Z",
"payment":{
"gateway":"stripe",
"clientSecret":"pi_xxxxx_secret_xxxxx",
"amount":14900,
"currency":"USD"
}
}
```

## **5.8 Stock Locking Logic** 

Stock lock duration: 

```
15 minutes
```

When checkout begins: 

```
Increase reserved_quantity.
Create order with stock_lock_expires_at.
Set order status to payment_initiated.
```

When payment succeeds: 

```
Keep reserved quantity until fulfillment.
Set payment_status = captured.
Set order status = paid or tailoring_pending.
```

52 

When order is fulfilled: 

```
Decrease stock_quantity.
Decrease reserved_quantity.
```

When payment expires/fails: 

```
Decrease reserved_quantity.
Set order status = cancelled.
Set payment_status = failed.
```

Stock release job: 

```
Runs every 2 minutes.
Find payment_initiated orders where stock_lock_expires_at < NOW().
Release reserved stock.
Mark order cancelled.
```

## **5.9 Dual-Gateway Payment Architecture** 

Create a payment adapter interface. 

```
interfacePaymentGatewayAdapter{
createPaymentOrder(input:CreatePaymentInput):
Promise<CreatePaymentResult>;
verifyWebhookSignature(rawBody:Buffer,signature:string):boolean;
parseWebhookEvent(rawBody:Buffer):PaymentWebhookEvent;
refundPayment(input:RefundInput):Promise<RefundResult>;
}
```

Implement: 

```
RazorpayPaymentAdapter
StripePaymentAdapter
```

## **5.10 Razorpay Flow** 

Use Razorpay for: 

53 

```
UPI
Cards
Wallets
Net banking
Indian localized payment methods
```

Flow: 

`1. Backend locks stock.` 

`2. Backend creates local order.` 

`3. Backend creates Razorpay order.` 

`4. Frontend opens Razorpay Checkout.` 

`5. Customer pays.` 

`6. Razorpay sends webhook.` 

`7. Backend verifies webhook signature.` 

`8. Backend records payment event.` 

`9. Background worker processes event.` 

`10. Order moves to paid/confirmed/tailoring_pending.` 

Webhook endpoint: 

```
POST /api/v1/webhooks/razorpay
```

## Important events: 

```
payment.authorized
payment.captured
payment.failed
order.paid
refund.processed
```

## Pseudo-code: 

```
app.post("/api/v1/webhooks/razorpay",rawBodyMiddleware,async(req,res)=>
{
constsignature=req.headers["x-razorpay-signature"];
```

```
constvalid=razorpayAdapter.verifyWebhookSignature(req.rawBody,
signature);
```

```
if(!valid){
```

```
returnres.status(400).json({error:"Invalid signature"});
```

```
}
```

```
constevent=razorpayAdapter.parseWebhookEvent(req.rawBody);
```

54 

```
awaitdb.payment_events.upsert({
where:{
gateway_event_unique:{
gateway:"razorpay",
event_id:event.id
}
},
create:{
gateway:"razorpay",
event_id:event.id,
event_type:event.type,
gateway_order_id:event.gatewayOrderId,
gateway_payment_id:event.gatewayPaymentId,
raw_payload:event.rawPayload
},
update:{}
});
awaitqueue.add("process-payment-event",{
gateway:"razorpay",
eventId:event.id
});
returnres.status(200).json({received:true});
});
```

## **5.11 Stripe Flow** 

Use Stripe for: 

```
International credit cards
International debit cards
Supported foreign currency payments
```

Flow: 

`1. Backend creates order and locks stock.` 

`2. Backend creates Stripe PaymentIntent.` 

`3. Frontend confirms payment with Stripe.js.` 

`4. Stripe sends webhook.` 

`5. Backend verifies Stripe signature.` 

`6. Worker marks order paid or failed.` 

Webhook endpoint: 

55 

```
POST /api/v1/webhooks/stripe
```

## Important events: 

```
payment_intent.succeeded
payment_intent.payment_failed
charge.refunded
charge.dispute.created
```

## Pseudo-code: 

```
app.post("/api/v1/webhooks/stripe",rawBodyMiddleware,async(req,res)=>{
constsignature=req.headers["stripe-signature"];
```

```
letevent;
try{
event=stripe.webhooks.constructEvent(
req.rawBody,
signature,
process.env.STRIPE_WEBHOOK_SECRET
);
}catch(error){
returnres.status(400).send("Invalid signature");
}
awaitdb.payment_events.upsert({
where:{
gateway_event_unique:{
gateway:"stripe",
event_id:event.id
}
},
create:{
gateway:"stripe",
event_id:event.id,
event_type:event.type,
raw_payload:event
},
update:{}
});
awaitqueue.add("process-payment-event",{
gateway:"stripe",
eventId:event.id
});
```

56 

```
returnres.status(200).json({received:true});
});
```

## **5.12 Webhook Idempotency & Retry Logic** 

Database-level idempotency: 

```
UNIQUE(gateway,event_id)
```

Processing rules: 

```
Store raw webhook first.
Return 200 quickly after signature validation and persistence.
Process business logic asynchronously.
Ignore duplicate events using unique constraint.
Never mark an order paid twice.
Never reduce stock twice.
Never send duplicate WhatsApp notifications.
```

Worker retry schedule: 

```
Attempt 1:
Immediately
Attempt 2:
30 seconds
Attempt 3:
2 minutes
Attempt 4:
10 minutes
Attempt 5:
30 minutes
After 5 failures:
Store processing_error and alert admin.
```

## **5.13 Order State Transitions** 

```
constallowedTransitions={
pending:["stock_locked","payment_initiated","cancelled"],
```

57 

```
stock_locked:["payment_initiated","cancelled"],
payment_initiated:["paid","cancelled"],
paid:["confirmed","tailoring_pending","packed"],
confirmed:["packed","tailoring_pending"],
tailoring_pending:["tailoring_approved"],
tailoring_approved:["tailoring_started"],
tailoring_started:["packed"],
packed:["dispatched"],
dispatched:["delivered"],
delivered:[],
cancelled:[],
refunded:[]
};
```

## **5.14 Frontend State Management** 

Use a strict state separation model. 

```
Server state:
TanStack Query
Local UI state:
Zustand
Forms:
React Hook Form + Zod
Cart persistence:
Zustand persisted to localStorage and synced with backend
Checkout:
Backend-first. Never local-only.
Measurements:
Logged-in user: database profile
Guest: guest session + local encrypted temporary state
```

Cart state: 

```
typeCartState={
cartId:string|null;
guestSessionToken:string|null;
items:CartItem[];
subtotalInr:number;
isCartOpen:boolean;
addItem:(variantId:string,quantity:number)=>Promise<void>;
removeItem:(cartItemId:string)=>Promise<void>;
```

58 

```
syncCart:()=>Promise<void>;
};
```

Measurement state: 

```
typeMeasurementProfile={
bustInches?:number;
waistInches?:number;
hipInches?:number;
shoulderInches?:number;
sleeveLengthInches?:number;
kurtiLengthInches?:number;
pantWaistInches?:number;
pantLengthInches?:number;
heightInches?:number;
};
```

## **5.15 Frontend Component Architecture** 

```
/src
├── app
│   ├── page.tsx
│   ├── collections
│   │   └── [slug]
│   │       └── page.tsx
│   ├── products
│   │   └── [slug]
│   │       └── page.tsx
│   ├── bespoke
│   │   └── page.tsx
│   ├── checkout
│   │   └── page.tsx
│   └── account
├── components
│   ├── layout
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── WhatsAppConcierge.tsx
│   ├── home
│   │   ├── HeroEditorial.tsx
│   │   ├── NarrativeCollections.tsx
│   │   ├── CraftsmanshipBlock.tsx
│   │   ├── LookbookStrip.tsx
│   │   └── BoutiquePromise.tsx
│   ├── product
```

```
│   │   ├── ProductCard.tsx
```

59 

```
│   │   ├── ProductMediaGallery.tsx
│   │   ├── VariantSelector.tsx
│   │   ├── CustomTailoringExpander.tsx
│   │   └── ProductAccordions.tsx
│   ├── collection
│   │   ├── ProductGrid.tsx
│   │   ├── FilterSidebar.tsx
│   │   ├── MobileFilterDrawer.tsx
│   │   └── LookbookInterlude.tsx
│   ├── cart
│   │   ├── CartDrawer.tsx
│   │   └── CartItem.tsx
│   └── checkout
├── lib
│   ├── api.ts
│   ├── money.ts
│   ├── validators.ts
│   ├── whatsapp.ts
│   └── media.ts
├── store
│   ├── cartStore.ts
│   ├── uiStore.ts
│   └── measurementStore.ts
└── styles
    └── globals.css
```

## **5.16 Micro-Interaction Rules** 

Animations must feel graceful and never affect checkout speed. 

## **Motion Principles** 

```
Duration:
180ms to 450ms
Easing:
ease-out or cubic-bezier(0.22, 1, 0.36, 1)
No:
Bouncing
Spinning
Scroll hijacking
Over-animated product cards
Animation on checkout-critical actions
```

60 

## **Page Load** 

```
Hero media fades in.
Hero title rises 12px and fades in.
Total hero animation under 700ms.
```

## **Cart Drawer** 

```
Right-side drawer.
Slide duration: 320ms.
Overlay fade: 220ms.
```

## **Filter Drawer** 

```
Mobile bottom sheet.
Sticky Apply button.
Smooth group expand/collapse.
```

## **PDP Tailoring Drawer** 

```
Step transition:
Horizontal slide by 20px + fade.
Progress:
1 Fit Type → 2 Measurements → 3 Review → 4 Confirmation
```

## **5.17 Performance Constraints** 

## **Core Web Vitals Targets** 

```
Homepage LCP:
Under 2.5 seconds on good 4G
PLP first render:
Under 1.8 seconds
PDP first render:
Under 2.2 seconds
CLS:
Below 0.05
INP:
Below 200ms
```

61 

```
Initial JS bundle:
Under 180–220 KB gzipped for public pages
```

## **5.18 Image Optimization** 

## **Image Sizes** 

```
Product grid:
800–1200px wide
PDP main:
1600–2200px wide
Thumbnails:
200–400px wide
Hero desktop:
2400px max
Hero mobile:
1200px max
```

## **Formats** 

```
Primary:
AVIF
Fallback:
WebP
Last fallback:
JPEG
```

## **Image Component Rule** 

```
<Image
src={imageUrl}
alt={alt}
width={1200}
height={1500}
sizes="(max-width: 768px) 50vw, 33vw"
priority={isHero}
placeholder="blur"
/>
```

62 

## **5.19 Video Optimization** 

## **Hero Video** 

```
Length:
6–10 seconds
File size:
4–8 MB target
Format:
WebM + MP4 fallback
Required:
Muted
Loop
Plays inline
Poster image
Mobile-specific compressed version
```

## **PDP Video** 

```
Length:
5–8 seconds
File size:
2–5 MB target
Load:
Lazy loaded
Autoplay only when visible
```

Intersection observer rule: 

```
if(entry.isIntersecting){
video.play();
}else{
video.pause();
}
```

## **5.20 CDN Caching** 

Use Cloudflare CDN in front of media. 

63 

## **Cache Rules** 

```
Product images:
Cache-Control: public, max-age=31536000, immutable
Product videos:
Cache-Control: public, max-age=31536000, immutable
Product JSON:
Cache-Control: s-maxage=60, stale-while-revalidate=300
Collection pages:
ISR/revalidate every 60–300 seconds
Cart and checkout:
No CDN cache
Webhook endpoints:
No cache
```

## **5.21 Layout Shift Prevention** 

Rules: 

```
Always define image width and height.
Always use fixed aspect-ratio containers.
Reserve space for badges.
Reserve space for sticky mobile CTA.
Do not inject dynamic widgets above product title.
Do not lazy-load critical hero poster.
Use skeletons matching final dimensions.
```

CSS: 

```
.product-image-frame{
aspect-ratio:4/5;
overflow:hidden;
background:var(--ds-ivory);
}
.hero-media{
min-height:92vh;
}
.pdp-media-frame{
aspect-ratio:4/5;
```

64 

```
background:var(--ds-ivory);
}
```

## **FINAL BUILD ROADMAP** 

## **Phase 1: Luxury MVP** 

Build: 

```
Custom Next.js frontend
PostgreSQL schema
Product catalogue APIs
PLP/PDP
Cart
Guest checkout
Razorpay integration
WhatsApp stylist links
Custom tailoring drawer
Basic admin product upload flow
Cloudflare media delivery
```

Do not build yet: 

```
AI stylist
Advanced loyalty automation
International checkout
Complex returns portal
Full ERP
Deep personalization
```

## **Phase 2: Boutique Operations** 

Add: 

```
Order admin panel
Tailoring approval dashboard
WhatsApp automation worker
Saved measurement profiles
Email notifications
Stripe international checkout
Advanced product search
```

65 

```
Back-in-stock notifications
Lookbook CMS
```

## **Phase 3: Supreme Clienteling** 

Add: 

```
AI styling recommendations
Personalized collection feeds
Luxury loyalty dashboard
Digital stylist appointment booking
Private drop access
Customer segmentation
Advanced analytics
Semantic search
```

## **FINAL DECISION PRINCIPLE** 

This is the definitive Do Sakhi direction: 

```
Design like a luxury editorial house.
Sell like a boutique stylist.
Operate like a serious custom commerce platform.
```

The platform’s strongest differentiators are: 

`1. Quiet luxury homepage storytelling` 

`2. Curated PLP with editorial interludes` 

`3. Rich PDP with media, fabric, fit and care clarity` 

`4. Custom tailoring directly from PDP` 

`5. WhatsApp stylist concierge` 

`6. Stock-safe checkout` 

`7. Razorpay + Stripe dual payment architecture` 

`8. PostgreSQL-first normalized fashion data model` 

`9. CDN-optimized high-resolution media` 

`10. Concierge loyalty instead of generic points` 

Do Sakhi should not compete by looking cheaper. 

It should compete by feeling more personal, more graceful and more trustworthy. 

66 

