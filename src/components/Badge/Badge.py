from reactpy import html as element
from components.Icon.Icon import Icon 

"""
Badge Component

Props:
    text (str): The label displayed on the badge.
    variant (str, optional): The style of the badge. 'success', 'danger', or 'info'. Default is 'info'.
    icon_name (str, optional): The name of an icon to display before the text.
"""
def Badge(text, variant="info", icon_name=None):
    
    # 1. CSS Class Composition
    class_names = ["badge"]
    class_names.append(f"badge-{variant}" if variant in ["success", "danger", "info"] else "badge-info") 
    final_class = " ".join(class_names)

    # 2. Content Assembly (Icon and Text)
    badge_content = []
    
    # Set icon color according to badge
    icon_color_map = {
        "success": "#155724", # Success text
        "danger": "#721c24",  # Danger text
        "info": "#495057"     # Info text
    }
    current_icon_color = icon_color_map.get(variant, "#495057")

    if icon_name:
        # Use Icon Component ('small' size)
        badge_content.append(Icon(name=icon_name, size="small", color=current_icon_color))
        
        # Padding between text and icons
        badge_content.append(element.span({"style": {"margin-right": "6px"}}))
             
    # Add text content
    badge_content.append(text)
    
    # 3. HTML Element Return
    return element.span(
        {
            "class": final_class,
        },
        *badge_content
    )