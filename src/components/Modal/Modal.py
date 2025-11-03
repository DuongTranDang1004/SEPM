from reactpy import html as element
from components.Icon.Icon import Icon 
from components.Button.Button import Button 

"""
Modal Component

Props:
    is_open (bool): If True, the modal is visible. If False, it renders nothing.
    onClose (callable): Function to call when the modal needs to be closed (e.g., by clicking the close button or overlay).
    title (str): The title displayed at the top of the modal.
    children (element): The content elements to be rendered inside the modal body.
    size (str, optional): 'small', 'medium', or 'large' for content box sizing. Default is 'medium'.
"""
def Modal(is_open, onClose, title, children, size="medium"):
    
    # ----------------------------------------------------
    # 1. Conditional Rendering (core logic)
    # ----------------------------------------------------
    if not is_open:
        return element.div({}) # Does not render if modal is closed

    # ----------------------------------------------------
    # 2. Modal Header (Title and close button)
    # ----------------------------------------------------
    modal_header = element.div(
        {"class": "modal-header"},
        element.h3({"class": "modal-title"}, title),
        # reuses Icon-only Button
        Button(
            variant="ghost", 
            icon_name="close", # placeholder for close icon
            is_icon_only=True, 
            size="small",
            onClick=onClose 
        )
    )

    # ----------------------------------------------------
    # 3. Modal Structure Assembly
    # ----------------------------------------------------
    
    # Content Box class
    content_class = f"modal-content modal-{size}"
    
    # clicking overlay calls onClose method
    return element.div(
        {"class": "modal-overlay", "onclick": onClose}, 
        
        # actual content box (stopPropagation used to stop background click event)
        element.div(
            {
                "class": content_class,
            },
            modal_header,
            element.div(
                {"class": "modal-body"},
                children # renders external contents here
            )
        )
    )