from reactpy import html as element
from components.Avatar.Avatar import Avatar 

"""
ChatBubble Component

Props:
    message (str): The text content of the message.
    is_user_message (bool): True if sent by the current user (renders on the right).
    timestamp (str, optional): The time the message was sent (e.g., "10:30 AM").
    avatar_url (str, optional): The sender's profile image URL (if needed for context).
"""
def ChatBubble(message, is_user_message, timestamp=None, avatar_url=None):
    
    # ----------------------------------------------------
    # 1. CSS Class Composition Logic
    # ----------------------------------------------------
    
    root_class = "chat-bubble-root"
    if is_user_message:
        root_class += " user-message" # Right align for user messages
    else:
        root_class += " partner-message" # Left align for others messages

    # ----------------------------------------------------
    # 2. Content Assembly
    # ----------------------------------------------------
    
    avatar_component = Avatar(image_url=avatar_url, size="small") if avatar_url else element.div({})
    
    bubble_content = element.div(
        {"class": "bubble-content"},
        element.p({"class": "message-text"}, message),
        element.span({"class": "message-timestamp"}, timestamp if timestamp else "")
    )
    
    # ----------------------------------------------------
    # 3. Main Structure Assembly (Avatar + Bubble)
    # ----------------------------------------------------
    
    # 'user-message' shows only bubble
    # 'partner-message' shows avatar on right
    
    children = []
    
    if not is_user_message and avatar_url:
         children.append(avatar_component)
        
    children.append(bubble_content)
    
    return element.div(
        {"class": root_class},
        *children
    )