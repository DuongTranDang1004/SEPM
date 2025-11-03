from reactpy import html as element
from components.Button.Button import Button
from components.Icon.Icon import Icon 
from components.Badge.Badge import Badge 

"""
ProfileCard Component

Props:
    user_data (dict): The user profile data (age, gender, isSmoking, etc.).
    onSwipeLeft (callable): Handler for the Skip action.
    onSwipeRight (callable): Handler for the Like action.
    onReport (callable): Handler for the Report button click.
"""
def ProfileCard(user_data, onSwipeLeft, onSwipeRight, onReport):
    
    # ----------------------------------------------------
    # 1. Data Extraction and Formatting
    # ----------------------------------------------------
    
    # Extract compulsory data
    name = user_data.get('name', 'N/A')
    age = user_data.get('age', '??')
    gender = user_data.get('gender', 'N/A')
    is_smoking = user_data.get('isSmoking', False)
    is_cooking = user_data.get('isCooking', False)
    move_in_date = user_data.get('moveInDate', 'N/A')
    
    # Background images should be received with seperate inputs
    photo_url = user_data.get('photoUrl', 'placeholder.jpg') 
    
    # ----------------------------------------------------
    # 2. Sub-Element Assembly (Badge Components)
    # ----------------------------------------------------
    
    badges_content = element.div(
        {"class": "card-badges-container"},
        
        # Smoker badges: uses danger/success variant
        Badge(
            text="Smoker" if is_smoking else "Non-Smoker",
            variant="danger" if is_smoking else "success",
            icon_name="smoke" # placeholder for smoke icon
        ),
        
        # Cooker badges: uses success/info variant
        Badge(
            text="Is Cooking" if is_cooking else "Does not cook",
            variant="success" if is_cooking else "info",
            icon_name="fork_knife" # placeholder for 'fork_knife' icon
        ),
        
        # Moving in badge: info variant
        Badge(
            text=f"Move-in: {move_in_date}",
            variant="info",
            icon_name="calendar" # placeholder for 'calendar' icon
        )
    )

    # ----------------------------------------------------
    # 3. Main Structure Assembly (HTML Layout)
    # ----------------------------------------------------
    
    return element.div(
        {
            "class": "profile-card-root", 
            "style": {"background-image": f"url({photo_url})"} # Set background image(if required)
        },
        
        # 1. Card Header (Name, Age, Gender)
        element.div(
            {"class": "card-info-overlay"},
            element.h2(f"{name}, {age}", {"class": "card-name-age"}),
            element.p(f"Gender: {gender}", {"class": "card-gender"}),

            # 2. Badges
            badges_content,

            # 3. Report Button (small ghost button)
            element.div(
                {"class": "card-report-action"},
                Button(
                    text="Report", 
                    variant="ghost", 
                    size="small", 
                    icon_name="report", # Icon Component
                    onClick=onReport
                )
            )
        ),
        
        # 4. Swipe Action Bar (Ignore/Bookmark)
        element.div(
            {"class": "card-swipe-actions"},
            
            # Skip Button (Icon Only)
            Button(variant="tenant", icon_name="Ignore", is_icon_only=True, onClick=onSwipeLeft),
            
            # Like Button (Icon Only, Primary variant로 더 강조)
            Button(variant="tenant", icon_name="Bookmark", is_icon_only=True, onClick=onSwipeRight)
        )
    )