from reactpy import html as element

# --- 1. Icon Map (To be replaced with actual SVG/Icon Font logic) ---
# In a real app, this would map names to SVG component imports or CSS class names.
# For now, we'll map names to their Unicode representations or simple text for testing.

ICON_MAP = {
    "search": "🔍",  # Search icon (Tenant Dashboard, Rooms Search)
    "bookmark": "⭐", # Bookmark icon (Rooms Search, Listing Card)
    "close": "❌",   # Close/Dismiss icon (Modals)
    "chat": "💬",    # Chat icon (Navigation, Match Details)
    "report": "🚩",  # Report icon (Profile Card)
    "like": "❤️",     # Like icon (Profile Card actions)
    "skip": "➡️",     # Skip/Next icon (Profile Card actions)
}

# --- 2. Component Definition ---
"""
Icon Component

Props:
    name (str): The identifier for the icon to display (e.g., 'search', 'bookmark').
    size (str, optional): The size of the icon. ('small', 'medium', 'large'). Default is 'medium'.
    color (str, optional): The CSS color value for the icon.
    onClick (callable, optional): Function to run if the icon is clickable.
"""
def Icon(name, size="medium", color=None, onClick=None):
    
    # ----------------------------------------------------
    # Logic: Get the icon element and compose classes/styles
    # ----------------------------------------------------
    
    icon_content = ICON_MAP.get(name)
    if not icon_content:
        # Handle case where an invalid icon name is provided
        return element.span({"style": {"color": "red"}}, "❓") 

    # Combine base class with size class
    class_names = ["icon-root", f"icon-{size}"]
    final_class = " ".join(class_names)
    
    # Apply dynamic style (color)
    style_props = {"color": color if color else "inherit"} # Use the provided color or inherit from parent
    
    # ----------------------------------------------------
    # HTML Element Return
    # ----------------------------------------------------
    
    # Return a <span> container for the icon. This makes styling easier.
    return element.span(
        {
            "class": final_class,
            "style": style_props,
            "onclick": onClick, # Attach click handler if provided
        },
        icon_content # The actual icon visual (text/SVG/Component)
    )