import os

def rename_files_in_same_folder():
    # Get the folder path where the script is located
    folder_path = os.path.dirname(os.path.abspath(__file__))
    
    # List all files in the folder
    files = [f for f in os.listdir(folder_path) if os.path.isfile(os.path.join(folder_path, f))]
    
    # Sort the files to ensure renaming in a consistent order
    files.sort()

    # Rename the files
    for index, filename in enumerate(files, start=1):
        # Skip the Python script itself
        if filename.endswith(".py"):
            continue
        
        new_name = f"imageBrush{index}.HEIC"
        old_file = os.path.join(folder_path, filename)
        new_file = os.path.join(folder_path, new_name)
        
        try:
            os.rename(old_file, new_file)
            print(f'Renamed: "{filename}" -> "{new_name}"')
        except Exception as e:
            print(f'Error renaming file "{filename}": {e}')

# Call the function
rename_files_in_same_folder()
