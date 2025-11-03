from reactpy import html as element
from components.Icon.Icon import Icon 

# --- Component Documentation (Updated!) ---
"""
Button Component

Props:
    text (str, optional): The text displayed inside the button. Required unless is_icon_only is True.
    variant (str): Determines the visual style. Must be 'tenant', 'landlord', or 'ghost'.
    size (str, optional): Determines the size. Must be 'large' or 'small'. Default is 'large'.
    onClick (callable, optional): The Python function to execute when the button is clicked. Default is None.
    icon_name (str, optional): The name of the icon to display (e.g., 'search', 'like').
    is_icon_only (bool, optional): If True, renders only the icon. Default is False.
"""
def Button(variant, text="", size="large", onClick=None, icon_name=None, is_icon_only=False):
    
    # ----------------------------------------------------
    # 1. CSS Class Composition Logic
    # ----------------------------------------------------
    
    class_names = ["btn"] 
    
    # Add variant (style) class
    class_names.append(f"btn-{variant}" if variant in ["tenant", "landlord", "ghost"] else "btn-tenant") 

    # Add size class
    class_names.append(f"btn-{size}" if size in ["large", "small"] else "btn-large") 

    # Add icon-only class
    if is_icon_only:
        class_names.append("btn-icon-only")

    final_class = " ".join(class_names)

    # ----------------------------------------------------
    # 2. Content Assembly Logic (Icon, Text, and Spacing)
    # ----------------------------------------------------
    
    button_content = []
    
    # Determine the icon color based on the button variant
    icon_color = "black" if variant == "tenant" else "black"
    
    # Determine icon size based on button size
    icon_size = "small" if size == "small" else "medium" 

    if icon_name: # Check if an icon is requested
        # 1. Add the Icon Component
        button_content.append(Icon(name=icon_name, size=icon_size, color=icon_color))
        
        # 2. Add spacing if both Icon AND Text are present
        if not is_icon_only and text:
             # This element adds a small horizontal space between the icon and text.
             button_content.append(element.span({"style": {"margin-left": "8px"}}))
             
    if not is_icon_only:
        # 3. Add the Text (unless it's an icon-only button)
        button_content.append(text)
        
    # --- Guardrail: Ensure button has content ---
    if not button_content:
         button_content.append("Action") # Default label if neither text nor icon is provided


    # ----------------------------------------------------
    # 3. HTML Element Return
    # ----------------------------------------------------
    
    return element.button(
        {
            "class": final_class, 
            "onclick": onClick,
        },
        *button_content # Unpack the list of content elements
    )