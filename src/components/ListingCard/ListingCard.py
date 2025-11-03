from reactpy import html as element
from components.Button.Button import Button
from components.Badge.Badge import Badge 

# --- Component Documentation ---
"""
ListingCard Component

Props:
    room_data (dict): Data including budgetPerMonth, preferredDistricts, needWindow, etc.
    is_bookmarked (bool): Current bookmark status for the user.
    onToggleBookmark (callable): Handler to switch the bookmark status.
    onClickCard (callable): Handler for viewing room details (opens modal).
"""
def ListingCard(room_data, is_bookmarked, onToggleBookmark, onClickCard):
    
    # 1. Data Extraction and Formatting
    budget = room_data.get('budgetPerMonth')
    preferred_districts = room_data.get('preferredDistricts', [])
    need_window = room_data.get('needWindow', False)
    might_share_bedroom = room_data.get('mightShareBedRoom', False)
    might_share_toilet = room_data.get('mightShareToilet', False)
    photo_url = room_data.get('photoUrl', 'default-room.jpg') 
    
    location_display = ", ".join(preferred_districts) if preferred_districts else "Various Districts"
    price_display = f"${budget:,.0f}/month" if isinstance(budget, (int, float)) else "Price N/A"

    # 2. Bookmark Button Setup
    bookmark_icon_name = "bookmark" 
    bookmark_button = Button(
        variant="ghost", 
        icon_name=bookmark_icon_name, 
        is_icon_only=True, 
        size="small",
        onClick=onToggleBookmark
    )
    
    # 3. Features to Badges
    feature_badges = []
    
    if need_window:
        feature_badges.append(Badge(text="Window Req.", variant="success", icon_name="window"))
    
    if might_share_bedroom:
        feature_badges.append(Badge(text="Share Room OK", variant="info", icon_name="users"))
    
    if might_share_toilet:
        feature_badges.append(Badge(text="Share Bath OK", variant="info", icon_name="toilet"))
        
    # 4. Main Structure Assembly
    return element.div(
        {
            "class": "listing-card-root", 
            "onclick": onClickCard, 
            "style": {"cursor": "pointer"}
        },
        
        # --- Photo Area with Bookmark Button ---
        element.div(
            {
                "class": "card-photo-area", 
                "style": {"background-image": f"url('{photo_url}')"} 
            },
            
            # Bookmark button wrapper
            element.div(
                {"class": "bookmark-button-wrapper"},
                bookmark_button
            )
        ),
        
        # --- Info Area ---
        element.div(
            {"class": "card-info-area"},
            
            # Price
            element.h3({"class": "card-price"}, price_display),
            # Location
            element.p({"class": "card-location"}, location_display),
            
            # Feature badges (Using the * unpack operator to render the list of badges)
            element.div({"class": "card-badges-container"}, *feature_badges)
        )
    )