import os
from PIL import Image

def scale_down_image(image, max_size=(1080, 1920)):
    # Get the current size of the image
    width, height = image.size
    
    # Calculate the aspect ratio
    aspect_ratio = width / height
    
    # Scale the image to fit within the max size, maintaining the aspect ratio
    if width > height:
        new_width = max_size[0]
        new_height = int(new_width / aspect_ratio)
    else:
        new_height = max_size[1]
        new_width = int(new_height * aspect_ratio)
    
    # Resize the image
    return image.resize((new_width, new_height), Image.ANTIALIAS)

def scale_down_images_in_directory(directory, max_size=(1080, 720)):
    # Loop through all files in the directory
    for filename in os.listdir(directory):
        # Check if the file is an image (you can adjust the extensions as needed)
        if filename.lower().endswith(('.png', '.jpg', '.jpeg', '.gif')):
            input_image_path = os.path.join(directory, filename)
            output_image_path = os.path.join(directory, f"scaled_{filename}")

            try:
                # Open the image
                with Image.open(input_image_path) as img:
                    # Scale down the image
                    scaled_img = scale_down_image(img, max_size)
                    # Save the scaled image
                    scaled_img.save(output_image_path)
                    print(f"Scaled image saved as {output_image_path}")
            except Exception as e:
                print(f"Could not process {filename}: {e}")

# Example usage
current_directory = os.getcwd()  # Get current directory
scale_down_images_in_directory(current_directory)
