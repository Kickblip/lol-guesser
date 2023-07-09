import requests
from bs4 import BeautifulSoup
import urllib.request
import os
import json

# Set the path constants
images_dir = "../public/images"
json_path = "../server/answers.json"

# Make sure the images directory exists
os.makedirs(images_dir, exist_ok=True)

# Initialize an empty dict to hold the JSON data
json_data = {}

# Read the text file
with open("names.txt", "r") as file:
    names = [line.strip() for line in file]

# Loop over the names
for name in names:
    # Navigate to the URL
    url = f"https://leagueoflegends.fandom.com/wiki/{name}/LoL/Cosmetics"
    response = requests.get(url)

    # Parse the HTML
    soup = BeautifulSoup(response.text, "html.parser")

    # Find the image with the specific alt property
    image = soup.find("img", alt=f"{name} OriginalSkin")

    # Check if image exists
    if image is not None:
        image_url = image['src']

        # Download the image
        filename = f"{name}.png"
        urllib.request.urlretrieve(image_url, os.path.join(images_dir, filename))

        # Store the filename and name in the JSON data
        json_data[filename] = name

# Save the JSON data
with open(json_path, "w") as file:
    json.dump(json_data, file, indent=4)
