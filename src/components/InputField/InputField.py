from reactpy import html as element

# --- Component Documentation ---
"""
InputField Component

Props:
    type (str): 'text', 'password', 'email', 'number', or 'textarea'.
    value (str): The current controlled value.
    onChange (callable): Handler for value change.
    placeholder (str, optional): Placeholder text.
    variant (str, optional): 'default', 'chat-bar', or 'search-bar'. Default is 'default'.
    disabled (bool, optional): If the input is disabled.
"""
def InputField(type, value, onChange, placeholder="", variant="default", disabled=False):
    
    # ----------------------------------------------------
    # 1. CSS Class Composition
    # ----------------------------------------------------
    class_names = ["input-root"] 
    
    # Add variant class
    class_names.append(f"input-{variant}") 

    final_class = " ".join(class_names)

    # ----------------------------------------------------
    # 2. Tag Selection and HTML Element Return (KEY LOGIC)
    # ----------------------------------------------------
    
    if type == "textarea":
        # 💡 Case 1: Multi-line Input (<textarea>)
        return element.textarea(
            {
                "class": final_class,
                "value": value,
                "placeholder": placeholder,
                "onchange": onChange,  # In Python/JS frameworks, this is often 'onchange' or 'oninput'
                "disabled": disabled,
                "rows": 4, # default height (CSS controllable)
            }
        )
    else:
        # 💡 Case 2: Single-line Input (<input>)
        return element.input(
            {
                "class": final_class,
                "type": type,          # Renders as text, password, email, etc.
                "value": value,
                "placeholder": placeholder,
                "onchange": onChange,
                "disabled": disabled,
            }
        )