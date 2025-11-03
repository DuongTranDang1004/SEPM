from reactpy import html as element

"""
Avatar Component

Props:
    image_url (str): The URL of the profile image.
    size (str, optional): 'small', 'medium', or 'large' for sizing. Default is 'medium'.
    alt_text (str, optional): Fallback text (e.g., user's initial) if image fails to load.
"""
def Avatar(image_url, size="medium", alt_text="?"):
    
    # ----------------------------------------------------
    # 1. CSS Class Composition
    # ----------------------------------------------------
    
    root_class = f"avatar-root avatar-{size}"

    # ----------------------------------------------------
    # 2. Rendering Logic (Image vs. Fallback)
    # ----------------------------------------------------
    
    # Assumes url is legit and creates object
    # CSS handles if the image is nor loaded
    
    if image_url:
        # handles image as background for circular image
        content = element.div(
            {
                "class": "avatar-image",
                "style": {
                    "background-image": f"url('{image_url}')",
                }
            }
        )
    else:
        # Uses alternative texts if image does not load
        # Usually, the first letter in all caps
        fallback_text = alt_text[0].upper() if alt_text else "?"
        content = element.div(
            {"class": "avatar-fallback"},
            fallback_text
        )

    # ----------------------------------------------------
    # 3. Main Structure Assembly
    # ----------------------------------------------------
    return element.div(
        {"class": root_class},
        content
    )